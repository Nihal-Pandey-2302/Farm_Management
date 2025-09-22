const db = require('../../config/db');

class DashboardController {
  // Add this new function inside the DashboardController class
  static async getTreatmentLogs(req, res) {
    try {
      // Query to get the latest 20 treatments with details from other tables
            const query = `
        SELECT 
          t.TreatmentID, 
          t.AnimalID,
          p.Diagnosis,
          d.DrugName,
          t.AdministeredAt,
          p.BlockchainTransactionHash -- FIX: Get the hash from the Prescriptions table (aliased as 'p')
        FROM Treatments t
        JOIN Prescriptions p ON t.PrescriptionID = p.PrescriptionID
        JOIN Drugs d ON p.DrugID = d.DrugID
        ORDER BY t.AdministeredAt DESC
        LIMIT 20;
      `;
      const { rows } = await db.query(query);
      res.status(200).json(rows);
    } catch (error)      {
      console.error('Error fetching treatment logs:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  static async getRiskMonitorData(req, res) {
    try {
      // In a real application, these would be sophisticated queries and calls to the AI/ML model APIs.
      // For now, we will use a mix of a simple SQL query and mock data.

      // 1. Fetch real AMU Trends data
        const trendsQuery = await db.query(`
        SELECT 
  (SELECT COUNT(*) FROM Treatments WHERE status = 'Approved') as total_treatments,
  (SELECT DrugName 
   FROM Prescriptions 
   JOIN Drugs ON Prescriptions.DrugID = Drugs.DrugID 
   GROUP BY DrugName 
   ORDER BY COUNT(*) DESC 
   LIMIT 1) as most_used_drug;
`);
      const trendsData = trendsQuery.rows[0];

      // 2. Mock AI-driven data (as the models are not yet integrated)
      const mockComplianceAlerts = [
        { farmId: "FARM-PUN-001", riskScore: 0.78, reason: "Higher than average use of Oxytetracycline" },
        { farmId: "FARM-PUN-XYZ", riskScore: 0.85, reason: "Treatment frequency 3x regional average" }
      ];

      const mockHotspots = {
        type: "FeatureCollection",
        features: [{
          type: "Feature",
          geometry: { "type": "Point", "coordinates": [75.8, 30.9] },
          properties: { "disease": "Mastitis", "riskLevel": "High" }
        }]
      };

      // 3. Assemble the final dashboard object
      const dashboardData = {
        jurisdiction: "Punjab", // This would be dynamic based on the logged-in officer
        activeComplianceAlerts: mockComplianceAlerts,
        diseaseOutbreakHotspots: mockHotspots,
        amuTrends: {
          period: "All Time",
          complianceRate: "97%", // This would be a calculated metric
          mostUsedDrug: trendsData.most_used_drug || 'N/A'
        }
      };

      res.status(200).json(dashboardData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = DashboardController;