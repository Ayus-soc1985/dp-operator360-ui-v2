import React, { useState } from 'react';
import { MapPin, Activity, Clock, AlertTriangle, Eye } from 'lucide-react';
import OperatorDetailView from './OperatorDetailView';

const OperatorsTab = ({ 
  filteredOperators, 
  selectedOperator, 
  setSelectedOperator, 
  filterRisk, 
  setFilterRisk,
  getSeverityColor,
  getSeverityIcon,
  getCategoryColor
}) => {
  const [detailedViewOperator, setDetailedViewOperator] = useState(null);

  // If detailed view is active, show only that page
  if (detailedViewOperator) {
    return (
      <OperatorDetailView
        operator={detailedViewOperator}
        onBack={() => setDetailedViewOperator(null)}
        getSeverityColor={getSeverityColor}
        getCategoryColor={getCategoryColor}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Operator Anomaly Details</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterRisk('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterRisk === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterRisk('high')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterRisk === 'high' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              High Risk
            </button>
            <button
              onClick={() => setFilterRisk('medium')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterRisk === 'medium' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Medium Risk
            </button>
            <button
              onClick={() => setFilterRisk('low')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterRisk === 'low' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Low Risk
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredOperators.map((operator) => (
            <div
              key={operator.opt_id}
              className="border rounded-lg p-5 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-lg font-bold text-gray-900">{operator.opt_name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      operator.risk_score >= 0.15 ? 'bg-red-100 text-red-700' :
                      operator.risk_score >= 0.1 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      Risk: {(operator.risk_score * 100).toFixed(1)}%
                    </span>
                    {operator.anomalyCount > 0 && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                        {operator.anomalyCount} Anomalies
                      </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      operator.anomalyScore > 50 ? 'bg-purple-100 text-purple-700' :
                      operator.anomalyScore > 25 ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      Score: {operator.anomalyScore}
                    </span>
                    <button
                      onClick={() => setDetailedViewOperator(operator)}
                      className="ml-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition flex items-center gap-2 shadow-md"
                    >
                      <Eye className="w-4 h-4" />
                      View Full Details
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{operator.opt_district}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      <span>{operator.pkt_create_daily_avg} pkts/day</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{operator.pkt_creation_duration_avg} min avg</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{operator.pkt_updt_rejection_rate || 0}% rejection</span>
                    </div>
                  </div>

                  {operator.anomalies.length > 0 && (
                    <div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOperator(selectedOperator?.opt_id === operator.opt_id ? null : operator);
                        }}
                        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium mb-2"
                      >
                        {selectedOperator?.opt_id === operator.opt_id ? '▼ Hide Anomalies' : '▶ Show Anomalies'} ({operator.anomalies.length})
                      </button>
                      
                      {selectedOperator?.opt_id === operator.opt_id && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {operator.anomalies.map((anomaly, idx) => (
                            <div
                              key={idx}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${getSeverityColor(anomaly.severity)}`}
                            >
                              {getSeverityIcon(anomaly.severity)}
                              <span className="font-medium">{anomaly.type}:</span>
                              <span>{anomaly.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OperatorsTab;
