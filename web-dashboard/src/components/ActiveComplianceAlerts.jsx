import React from 'react';
import './Widget.css';

function ActiveComplianceAlerts({ data }) {
  return (
    <div className="widget-card card-alert">
      <h3>Active Compliance Alerts</h3>
      <div className="alert-list">
        {data.length > 0 ? (
          data.map((alert, index) => (
            <div key={index} className="alert-item">
              <span className="farm-id">{alert.farmId}</span>
              <span className="reason">{alert.reason}</span>
              <span className="risk-score">{(alert.riskScore * 100).toFixed(0)}</span>
            </div>
          ))
        ) : (
          <p>No active alerts.</p>
        )}
      </div>
    </div>
  );
}

export default ActiveComplianceAlerts;