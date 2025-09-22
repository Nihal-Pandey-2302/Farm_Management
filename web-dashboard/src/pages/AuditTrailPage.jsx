import React, { useState, useEffect } from 'react';
import { getTreatmentLogs } from '../services/apiService';
import './AuditTrailPage.css';

function AuditTrailPage() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getTreatmentLogs();
        setLogs(data);
      } catch (error) {
        // Handle error state
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (isLoading) {
    return <div className="loading">Loading Treatment Logs...</div>;
  }

  return (
    <div className="audit-trail-container">
      <h2>Blockchain Audit Trail</h2>
      <p>This log shows the latest treatments recorded in the system. Each entry is backed by an immutable transaction on the blockchain.</p>
      <table className="log-table">
        <thead>
          <tr>
            <th>Animal ID</th>
            <th>Diagnosis</th>
            <th>Drug Used</th>
            <th>Timestamp</th>
            <th>Blockchain Transaction Hash</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.treatmentid}>
              <td>{log.animalid}</td>
              <td>{log.diagnosis}</td>
              <td>{log.drugname}</td>
              <td>{new Date(log.administeredat).toLocaleString()}</td>
              <td className="hash-cell">
                {/* In a real app, this would link to a block explorer */}
                <a href="#" title={log.blockchaintransactionhash}>
                  {log.blockchaintransactionhash ? `${log.blockchaintransactionhash.substring(0, 10)}...${log.blockchaintransactionhash.substring(log.blockchaintransactionhash.length - 10)}` : 'N/A'}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AuditTrailPage;