import axios from 'axios';

// The base URL should point to your running backend server.
const API_URL = 'http://localhost:3000/api';

/**
 * Fetches the consolidated data for the Regulatory Officer's risk monitor dashboard.
 */
export const getRiskMonitorData = async () => {
  try {
    // This single endpoint provides all the data needed for the dashboard.
    const response = await axios.get(`${API_URL}/dashboard/risk-monitor`);
    return response.data;
  } catch (error) {
    console.error("Error fetching risk monitor data:", error);
    // In a real app, you'd handle this more gracefully.
    throw error;
  }
};

// Add this new function to the file
export const getTreatmentLogs = async () => {
  try {
    const response = await axios.get(`${API_URL}/dashboard/treatment-logs`);
    return response.data;
  } catch (error) {
    console.error("Error fetching treatment logs:", error);
    throw error;
  }
};