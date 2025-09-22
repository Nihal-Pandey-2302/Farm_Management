import React, { useState, useEffect } from 'react';
import { getRiskMonitorData } from '../services/apiService';
import ActiveComplianceAlerts from '../components/ActiveComplianceAlerts';
import DiseaseHotspotMap from '../components/DiseaseHotspotMap';
import AMUTrends from '../components/AMUTrends';
import './DashBoardPage.css';

function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data when the component mounts
    const fetchData = async () => {
      try {
        // For demonstration, we'll use a mock response.
        // To connect to your real backend, comment out the mock data and uncomment the api call.
        
        // --- MOCK DATA ---
        // const mockData = {
        //   jurisdiction: "Punjab",
        //   activeComplianceAlerts: [
        //     { farmId: "FARM-PUN-045", riskScore: 0.92, reason: "Anomalous use of Colistin Sulfate" },
        //     { farmId: "FARM-PUN-112", riskScore: 0.85, reason: "Treatment frequency 3x regional average" }
        //   ],
        //   diseaseOutbreakHotspots: { features: [ { properties: { disease: "Mastitis", riskLevel: "High" } }] },
        //   amuTrends: { period: "Last 30 Days", complianceRate: "96%", mostUsedDrug: "Oxytetracycline 5%" }
        // };
        // await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        // setDashboardData(mockData);
        // --- END MOCK DATA ---

        // --- REAL API CALL (use this once backend is ready and populated) ---
        const data = await getRiskMonitorData();
        setDashboardData(data);

      } catch (err) {
        setError("Failed to fetch dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div className="loading">Loading Dashboard Data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <h2>Jurisdiction Risk Monitor: {dashboardData.jurisdiction}</h2>
      <div className="dashboard-grid">
        <ActiveComplianceAlerts data={dashboardData.activeComplianceAlerts} />
        <DiseaseHotspotMap data={dashboardData.diseaseOutbreakHotspots} />
        <AMUTrends data={dashboardData.amuTrends} />
      </div>
    </div>
  );
}

export default DashboardPage;