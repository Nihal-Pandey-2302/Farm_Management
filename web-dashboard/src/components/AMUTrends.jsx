import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './Widget.css';

// Mock data for the chart visualization
const chartData = [
  { name: 'Oxytetracycline', usage: 450 },
  { name: 'Amoxicillin', usage: 375 },
  { name: 'Enrofloxacin', usage: 250 },
  { name: 'Other', usage: 175 },
];


function AMUTrends({ data }) {
  return (
    <div className="widget-card card-trends">
      <h3>AMU Trends ({data.period})</h3>
      <div className="metrics-grid">
        <div className="metric-item">
          <span>Compliance Rate</span>
          <strong>{data.complianceRate}</strong>
        </div>
        <div className="metric-item">
          <span>Most Used Drug</span>
          <strong>{data.mostUsedDrug}</strong>
        </div>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 50, bottom: 5 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" width={100} tick={{fontSize: 12}} />
            <Tooltip cursor={{fill: '#f5f5f5'}}/>
            <Bar dataKey="usage" fill="#8884d8" barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AMUTrends;