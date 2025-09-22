# Digital Farm Management Portal (SIH 2025)

**Problem Statement ID:** 25007  
**Theme:** Agriculture, FoodTech & Rural Development  
**Title:** Development of a Digital Farm Management Portal for Monitoring Maximum Residue Limits (MRL) and Antimicrobial Usage (AMU) in Livestock

---

## 1. Project Overview

This project is a comprehensive, full-stack digital ecosystem designed to tackle the critical challenges of Antimicrobial Resistance (AMR) and food safety in the livestock industry. By connecting farmers, veterinarians, and regulatory bodies on a single, data-driven platform, we aim to promote responsible antimicrobial stewardship, ensure compliance with Maximum Residue Limits (MRL), and enhance public trust in livestock products.

The system features a **vet-led workflow** where every treatment is initiated by a digital prescription. This data is logged immutably on a **permissioned blockchain**, creating a tamper-proof audit trail for regulatory oversight.

## 2. Key Features

- **Immutable Audit Trail:** Utilizes a Solidity smart contract on a Hardhat-powered local blockchain to log every prescription and treatment confirmation, ensuring data integrity.
- **Role-Specific Interfaces:**
  - **Mobile App (Flutter):** An offline-first application for farmers and veterinarians to manage prescriptions and confirm treatments directly from the field.
  - **Web Dashboard (React):** A powerful analytics and auditing tool for Regulatory Officers to monitor AMU trends and verify treatment records via a Blockchain Explorer.
- **Vet-Led Digital Prescriptions:** Enforces best practices by ensuring every antimicrobial treatment is initiated and documented by a qualified veterinarian.
- **Automated MRL Compliance:** The system automatically calculates and tracks drug withdrawal periods, sending critical alerts to farmers to prevent contaminated products from entering the food supply.
- **AI-Ready Architecture:** Designed to integrate with AI/ML models for anomaly detection in drug usage and predictive forecasting of disease outbreaks.

## 3. System Architecture

The application is built on a modern, distributed architecture:

- **Backend:** A central Node.js server with a RESTful API handles all business logic, data processing, and communication between components.
- **Database:** PostgreSQL is used for storing all relational data like user profiles, farm details, and treatment records.
- **Blockchain:** A local Hardhat network runs a Solidity smart contract to provide an immutable log of all critical treatment events.
- **Clients:** A Flutter-based mobile app for field users and a React-based web dashboard for administrative users.

![Flowchart of the System Architecture](placeholder_for_flowchart_image.png)
*(**Note:** You should add the flowchart diagram you created for the PPT here and name it `flowchart.png` or similar.)*

---

## 4. Technology Stack

| Component         | Technology                               |
| ----------------- | ---------------------------------------- |
| **Backend**       | Node.js, Express.js, Ethers.js v5        |
| **Web Dashboard** | React.js, Vite, Axios, Recharts          |
| **Mobile App**    | Flutter, Dart                            |
| **Database**      | PostgreSQL                               |
| **Blockchain**    | Solidity, Hardhat, Ethers.js             |

---

## 5. Local Development Setup

To run this project locally, you will need to run the four main components in separate terminals.

**Prerequisites:**

- Node.js (v18+)
- PostgreSQL
- Flutter SDK
- An Android Emulator (configured via Android Studio)

### Terminal 1: Start the Blockchain Node

Navigate to the `blockchain` directory and start the local Hardhat node. This node must be running for the backend to connect.

```bash
cd blockchain
npx hardhat node
```

### Terminal 2: Deploy the Smart Contract

Once the node is running, open a second terminal in the `blockchain` directory to deploy the contract.

```bash
cd blockchain
npx hardhat run scripts/deploy.js --network localhost
```

**Note:** After deploying, you must copy the deployed contract address and paste it into the `CONTRACT_ADDRESS` variable in `backend/src/services/blockchain.service.js`.

### Terminal 3: Start the Backend Server

Navigate to the `backend` directory, install dependencies, and start the server.

```bash
cd backend
npm install
# Create a .env file from .env.example and configure your PostgreSQL connection
npm run dev
```

### Terminal 4: Start the Web Dashboard

Navigate to the `web-dashboard` directory, install dependencies, and start the development server.

```bash
cd web-dashboard
npm install
npm run dev
```

The dashboard will be available at `http://localhost:5173`.

### Terminal 5: Run the Mobile App

1. Launch an Android Emulator from Android Studio.
2. Navigate to the `mobile-app` directory, install dependencies, and run the app.

```bash
cd mobile-app
flutter pub get
flutter run
```

---

## 6. Team Information

- **Team Name:** Invincibles

