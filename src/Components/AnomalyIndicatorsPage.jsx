import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import PatternAnalysisTab from './PatternAnalysisTab';

const AnomalyIndicatorsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-[1920px] mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Shield className="w-8 h-8 text-red-500" />
                Operator 360
              </h1>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Last Updated</div>
              <div className="text-lg font-semibold">Nov 13, 2025</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-md p-2">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 rounded-lg font-medium transition whitespace-nowrap bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Overview
            </button>
            <button
              className="px-4 py-2 rounded-lg font-medium transition whitespace-nowrap bg-blue-500 text-white"
            >
              Anomaly Indicators
            </button>
            <button
              onClick={() => navigate('/regionevaluation')}
              className="px-4 py-2 rounded-lg font-medium transition whitespace-nowrap bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Region Evaluation
            </button>
            <button
              onClick={() => navigate('/viewoperators')}
              className="px-4 py-2 rounded-lg font-medium transition whitespace-nowrap bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              View Operators
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 rounded-lg font-medium transition whitespace-nowrap bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              View Operators
            </button>
          </div>
        </div>

        {/* Pattern Analysis Content */}
        <PatternAnalysisTab />
      </div>
    </div>
  );
};

export default AnomalyIndicatorsPage;