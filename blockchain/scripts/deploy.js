const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const TreatmentAuditTrailContract = await hre.ethers.getContractFactory("TreatmentAuditTrailContract");

  // Deploy the contract
  const contract = await TreatmentAuditTrailContract.deploy();
  await contract.waitForDeployment(); // Wait for the deployment to be mined

  const contractAddress = await contract.getAddress();
  console.log("TreatmentAuditTrailContract deployed to:", contractAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});