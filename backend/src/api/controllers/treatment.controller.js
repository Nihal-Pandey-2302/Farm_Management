const db = require('../../config/db');
const BlockchainService = require('../../services/blockchain.service');
const NotificationService = require('../../services/notification.service');

class TreatmentController {
  /**
   * Step 1: Veterinarian creates a digital prescription.
   */
  static async createPrescription(req, res) {
  const { veterinarianId, farmId, animalId, drugId, diagnosis, dosageInstructions } = req.body;
  try {
    // 1. Fetch the Drug Name from the database using the drugId
    const drugQuery = await db.query('SELECT DrugName FROM Drugs WHERE DrugID = $1', [drugId]);
    if (drugQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Drug with the specified drugId not found.' });
    }
    const drugName = drugQuery.rows[0].drugname;

    // 2. Log prescription to the blockchain
    const blockchainRes = await BlockchainService.issuePrescription({
      veterinarianId,
      animalId,
      drugName
    });

    if (!blockchainRes || !blockchainRes.txHash) {
      console.error("[Controller] Did not receive a valid transaction hash from Blockchain Service.");
      // optional: return res.status(500).json({ error: 'Blockchain transaction failed.' });
    }

    // 3. Save prescription to PostgreSQL
    const psqlQuery = `
      INSERT INTO Prescriptions (
        VeterinarianID, 
        FarmID, 
        AnimalID, 
        DrugID, 
        Diagnosis, 
        DosageInstructions, 
        Status, 
        BlockchainTransactionHash
      )
      VALUES ($1, $2, $3, $4, $5, $6, 'Prescribed', $7)
      RETURNING PrescriptionID;
    `;

    const { rows } = await db.query(psqlQuery, [
      veterinarianId,
      farmId,
      animalId,
      drugId,
      diagnosis,
      dosageInstructions,
      blockchainRes ? blockchainRes.txHash : null
    ]);

    const newPrescriptionId = rows[0].prescriptionid;

    res.status(201).json({
      message: 'Prescription created successfully.',
      prescriptionId: newPrescriptionId,
      blockchainTxHash: blockchainRes ? blockchainRes.txHash : null
    });

  } catch (error) {
    console.error('Error creating prescription:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


  /**
   * Step 2: Farmer confirms administration, triggering the withdrawal period.
   */
  static async confirmTreatment(req, res) {
    const { prescriptionId, farmerUserId } = req.body;
    
    try {
        // 1. Get Prescription and Drug details from the database
        const detailsQuery = `
            SELECT p.AnimalID, d.DrugName, d.MilkWithdrawalDays, d.MeatWithdrawalDays
            FROM Prescriptions p
            JOIN Drugs d ON p.DrugID = d.DrugID
            WHERE p.PrescriptionID = $1;
        `;
        const { rows } = await db.query(detailsQuery, [prescriptionId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Prescription not found.' });
        }
        const details = rows[0];

        // 2. Calculate withdrawal end dates
        const administeredAt = new Date();

        // Ensure the withdrawal days are numbers
        const meatDays = Number(details.meatwithdrawaldays || 0);
        const milkDays = Number(details.milkwithdrawaldays || 0); // fixed typo here

        const meatWithdrawalEndDate = new Date(administeredAt);
        meatWithdrawalEndDate.setDate(administeredAt.getDate() + meatDays);

        const milkWithdrawalEndDate = new Date(administeredAt);
        milkWithdrawalEndDate.setDate(administeredAt.getDate() + milkDays);

        console.log('Milk withdrawal days:', milkDays, 'Meat withdrawal days:', meatDays);

        // 3. Log confirmation to the blockchain
        await BlockchainService.confirmTreatment(prescriptionId, farmerUserId);


        // 4. Create the official treatment record in the database
      const treatmentQuery = `
    INSERT INTO Treatments (
        PrescriptionID, 
        FarmerUserID, 
        ConfirmedAt, 
        MilkWithdrawalEndDate, 
        MeatWithdrawalEndDate, 
        WithdrawalStatus
    )
    VALUES ($1, $2, $3, $4, $5, 'Under Withdrawal')
    RETURNING TreatmentID;
`;

const treatmentResult = await db.query(treatmentQuery, [
    prescriptionId,
    farmerUserId,          // maps to FarmerUserID
    administeredAt,        // maps to ConfirmedAt
    milkWithdrawalEndDate,
    meatWithdrawalEndDate
]);
  
      const newTreatmentId = treatmentResult.rows[0].treatmentid;

        // 5. Update the animal's status to 'Under Withdrawal'
        const animalUpdateQuery = `
            UPDATE Animals SET WithdrawalStatus = 'Under Withdrawal', CurrentWithdrawalEndDate = $1 WHERE AnimalID = $2;
        `;
        await db.query(animalUpdateQuery, [meatWithdrawalEndDate, details.animalid]);

        // 6. Schedule notifications
        const scheduledAlerts = NotificationService.scheduleWithdrawalAlerts({
            animalId: details.animalid,
            milkWithdrawalEndDate: milkWithdrawalEndDate.toISOString().split('T')[0],
            meatWithdrawalEndDate: meatWithdrawalEndDate.toISOString().split('T')[0]
        });

        console.log(`[Treatment Controller] Treatment ${newTreatmentId} confirmed for Animal ${details.animalid}.`);
        
        res.status(200).json({
            message: 'Treatment confirmed. Withdrawal period has started.',
            treatmentId: newTreatmentId,
            animalId: details.animalid,
            withdrawalStatus: 'Under Withdrawal',
            milkWithdrawalEndDate: milkWithdrawalEndDate.toISOString().split('T')[0],
            meatWithdrawalEndDate: meatWithdrawalEndDate.toISOString().split('T')[0],
            scheduledAlerts
        });

    } catch (error) {
        console.error('Error confirming treatment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = TreatmentController;