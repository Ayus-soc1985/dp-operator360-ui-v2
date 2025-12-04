import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './Components/LandingPage';
import Callback from './Components/Callback';
import ProtectedRoute from './Components/ProtectedRoute';
import OperatorAnomalyDashboard from './Components/OperatorAnomalyDashboard';
import AnomalyIndicatorsPage from './Components/AnomalyIndicatorsPage';
import RegionEvaluationPage from './Components/RegionEvaluationPage';
import ViewOperatorsPage from './Components/ViewOperatorsPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            {/* <Route path="/callback" element={<Callback />} /> */}
            <Route path="/dashboard" element={<OperatorAnomalyDashboard />} />
            <Route path="/anomalyindicators" element={<AnomalyIndicatorsPage />} />
            <Route path="/regionevaluation" element={<RegionEvaluationPage />} />
            <Route path="/viewoperators" element={<ViewOperatorsPage />} />
            
            {/* Protected Routes */}
            {/* <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <OperatorAnomalyDashboard />
                </ProtectedRoute>
              } 
            /> */}
            
            {/* Redirect unknown routes to landing page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
