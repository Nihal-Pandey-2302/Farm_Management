const { ethers } = require("ethers");

// --- CONFIGURATION ---
// 1. The address of your deployed contract (from the 'npx hardhat run' command)
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // <-- PASTE YOUR DEPLOYED ADDRESS HERE

// 2. The ABI of your contract (from the artifacts folder)
const CONTRACT_ABI = require("../../../blockchain/artifacts/contracts/TreatmentAuditTrailContract.sol/TreatmentAuditTrailContract.json").abi; // <-- This path should be correct

// 3. The URL of the local Hardhat node
const PROVIDER_URL = "http://127.0.0.1:8545/";

class BlockchainService {
        static provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL);
    // Use the first account provided by the Hardhat node as the signer (the "owner")
    static signer = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", this.provider);
    static contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);

    /**
     * Executes the 'issuePrescription' transaction on the smart contract.
     */
    static async issuePrescription(prescriptionDetails) {
        try {
            console.log(`[Blockchain Service] Issuing prescription for Animal ID: ${prescriptionDetails.animalId}...`);
            const tx = await this.contract.issuePrescription(
                prescriptionDetails.veterinarianId,
                prescriptionDetails.animalId,
                prescriptionDetails.drugName
            );

            // Wait for the transaction to be mined
            const receipt = await tx.wait();

            // --- FIX STARTS HERE ---
            // Add a check to ensure the receipt and hash are valid before returning
            const txHash = receipt ? (receipt.transactionHash || receipt.hash) : 'hash_not_found';
            console.log(`[Blockchain Service] Transaction successful. Hash: ${txHash}`);
            
            return { txHash: txHash };
            // --- FIX ENDS HERE ---

        } catch (error) {
            console.error("[Blockchain Service] Error issuing prescription:", error);
            throw new Error("Blockchain transaction failed.");
        }
    }

    /**
     * Executes the 'confirmTreatment' transaction on the smart contract.
     */
        static async confirmTreatment(blockchainPrescriptionId, farmerId) {
        try {
            console.log(`[Blockchain Service] Confirming treatment for Prescription ID: ${blockchainPrescriptionId}...`);
            const tx = await this.contract.confirmTreatment(blockchainPrescriptionId, farmerId);

            // Wait for the transaction to be mined
            const receipt = await tx.wait();

            // --- APPLY THE SAME FIX HERE ---
            const txHash = receipt ? (receipt.transactionHash || receipt.hash) : 'hash_not_found';
            console.log(`[Blockchain Service] Transaction successful. Hash: ${txHash}`);
            
            return { txHash: txHash };
            // --- END FIX ---

        } catch (error) {
            console.error("[Blockchain Service] Error confirming treatment:", error);
            throw new Error("Blockchain transaction failed.");
        }
    }
}

module.exports = BlockchainService;