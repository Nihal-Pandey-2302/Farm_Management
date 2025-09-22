// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TreatmentAuditTrailContract
 * @dev Logs the lifecycle of a prescription from issuance to confirmation.
 * It's owned by a single address (our backend server) that has permission to write.
 */
contract TreatmentAuditTrailContract {

    address public owner;
    uint public prescriptionCounter;

    // Struct to hold details of the initial prescription
    struct Prescription {
        uint prescriptionId;
        string veterinarianId;
        string animalId;
        string drugName;
        uint256 issueTimestamp;
    }

    // Mapping from prescription ID to the prescription details
    mapping(uint => Prescription) public prescriptions;
    // Mapping to track confirmation status
    mapping(uint => bool) public isConfirmed;

    event PrescriptionIssued(
        uint indexed prescriptionId,
        string indexed veterinarianId,
        string indexed animalId,
        string drugName,
        uint256 issueTimestamp
    );

    event TreatmentConfirmed(
        uint indexed prescriptionId,
        string indexed farmerId,
        uint256 confirmationTimestamp
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function.");
        _;
    }

    constructor() {
        owner = msg.sender;
        prescriptionCounter = 0;
    }

    /**
     * @dev Step 1: A veterinarian issues a prescription. Called by the backend.
     */
    function issuePrescription(
        string memory _veterinarianId,
        string memory _animalId,
        string memory _drugName
    ) public onlyOwner returns (uint) {
        prescriptionCounter++;
        uint newId = prescriptionCounter;

        prescriptions[newId] = Prescription({
            prescriptionId: newId,
            veterinarianId: _veterinarianId,
            animalId: _animalId,
            drugName: _drugName,
            issueTimestamp: block.timestamp
        });

        emit PrescriptionIssued(newId, _veterinarianId, _animalId, _drugName, block.timestamp);
        return newId;
    }

    /**
     * @dev Step 2: A farmer confirms the drug administration. Called by the backend.
     */
    function confirmTreatment(uint _prescriptionId, string memory _farmerId) public onlyOwner {
        require(prescriptions[_prescriptionId].prescriptionId != 0, "Prescription does not exist.");
        require(!isConfirmed[_prescriptionId], "Treatment has already been confirmed.");

        isConfirmed[_prescriptionId] = true;

        emit TreatmentConfirmed(_prescriptionId, _farmerId, block.timestamp);
    }
}