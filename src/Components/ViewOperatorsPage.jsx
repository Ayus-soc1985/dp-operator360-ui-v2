import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, XCircle, AlertCircle, CheckCircle, Activity } from 'lucide-react';
import OperatorsTab from './OperatorsTab';

const ViewOperatorsPage = () => {
  const navigate = useNavigate();
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [filterRisk, setFilterRisk] = useState('all');

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'positive': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return <XCircle className="w-4 h-4" />;
      case 'medium': return <AlertCircle className="w-4 h-4" />;
      case 'positive': return <CheckCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      fraud: 'bg-red-500',
      quality: 'bg-orange-500',
      velocity: 'bg-purple-500',
      geographic: 'bg-blue-500',
      technical: 'bg-gray-500',
      productivity: 'bg-yellow-500',
      pattern: 'bg-pink-500'
    };
    return colors[category] || 'bg-gray-500';
  };

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
              onClick={() => navigate('/anomalyindicators')}
              className="px-4 py-2 rounded-lg font-medium transition whitespace-nowrap bg-gray-100 text-gray-700 hover:bg-gray-200"
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
              className="px-4 py-2 rounded-lg font-medium transition whitespace-nowrap bg-blue-500 text-white"
            >
              View Operators
            </button>
          </div>
        </div>

        {/* Operators Content */}
        <OperatorsTab 
          filteredOperators={[]}
          selectedOperator={selectedOperator}
          setSelectedOperator={setSelectedOperator}
          filterRisk={filterRisk}
          setFilterRisk={setFilterRisk}
          getSeverityColor={getSeverityColor}
          getSeverityIcon={getSeverityIcon}
          getCategoryColor={getCategoryColor}
        />
      </div>
    </div>
  );
};

export default ViewOperatorsPage;