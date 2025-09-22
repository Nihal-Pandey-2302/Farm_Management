import React, { useState } from 'react'; // Import useState
import DashboardPage from './pages/DashBoardPage';
import AuditTrailPage from './pages/AuditTrailPage'; // Import the new page
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard'); // State to manage navigation

  return (
    <div className="App">
      <header className="App-header">
        <h1>Digital Farm Management Portal</h1>
        <nav className="App-nav">
          <button onClick={() => setCurrentPage('dashboard')}>Risk Monitor</button>
          <button onClick={() => setCurrentPage('audit')}>Blockchain Audit Trail</button>
        </nav>
      </header>
      <main>
        {currentPage === 'dashboard' ? <DashboardPage /> : <AuditTrailPage />}
      </main>
    </div>
  );
}

export default App;