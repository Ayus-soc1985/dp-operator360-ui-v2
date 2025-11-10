import React from 'react';
import OperatorAnomalyDashboard from "./Components/OperatorAnomalyDashboard.jsx"

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <OperatorAnomalyDashboard />
      </main>
    </div>
  );
}

export default App;
