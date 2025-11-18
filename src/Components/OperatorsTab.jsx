import React, { useState, useEffect, useMemo } from 'react';
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
  const [apiOperators, setApiOperators] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalOperators, setTotalOperators] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch operators data from API with pagination
  const fetchOperators = async (page = 1, size = 20) => {
    try {
      setLoading(true);
      const response = await fetch(`http://10.8.18.150:8080/api/v1/operator?page=${page}&pageSize=${size}`);
      if (!response.ok) {
        throw new Error('Failed to fetch operators data');
      }
      const data = await response.json();
      setApiOperators(data.records);
      setTotalOperators(data.total);
      setTotalPages(Math.ceil(data.total / size));
      setCurrentPage(data.page);
      setPageSize(data.pageSize);
      setError(null);
    } catch (err) {
      console.error('Error fetching operators data:', err);
      setError(err.message);
      setApiOperators(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperators(currentPage, pageSize);
  }, []);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchOperators(newPage, pageSize);
    }
  };

  // Handle page size change
  const handlePageSizeChange = (newSize) => {
    const newPageSize = parseInt(newSize);
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page
    fetchOperators(1, newPageSize);
  };

  // Process and merge API data with mock data
  const processedOperators = useMemo(() => {
    if (!apiOperators) return filteredOperators;

    return apiOperators.map((apiOp, index) => {
      // Find corresponding mock data or use defaults
      const mockOp = filteredOperators.find(op => op.opt_id === apiOp.opt_id) || filteredOperators[index % filteredOperators.length] || {};
      
      // Generate mock anomalies for demonstration
      const anomalies = [];
      if (apiOp.qc_error > 0) {
        anomalies.push({
          type: 'QC Errors',
          value: apiOp.qc_error,
          severity: apiOp.qc_error > 5 ? 'high' : 'medium',
          description: 'Quality control errors detected',
          category: 'quality'
        });
      }
      if (apiOp.pkt_rejection_rate > 5) {
        anomalies.push({
          type: 'High Rejection Rate',
          value: `${apiOp.pkt_rejection_rate}%`,
          severity: 'high',
          description: 'Packet rejection rate exceeds threshold',
          category: 'quality'
        });
      }
      if (apiOp.document_anomaly_score > 0.1) {
        anomalies.push({
          type: 'Document Anomaly',
          value: (apiOp.document_anomaly_score * 100).toFixed(1) + '%',
          severity: apiOp.document_anomaly_score > 0.2 ? 'high' : 'medium',
          description: 'Document processing anomaly detected',
          category: 'pattern'
        });
      }
      if (apiOp.biometric_anomaly_score > 0.1) {
        anomalies.push({
          type: 'Biometric Anomaly',
          value: (apiOp.biometric_anomaly_score * 100).toFixed(1) + '%',
          severity: apiOp.biometric_anomaly_score > 0.2 ? 'high' : 'medium',
          description: 'Biometric processing anomaly detected',
          category: 'pattern'
        });
      }
      if (apiOp.work_anomaly_score > 0.1) {
        anomalies.push({
          type: 'Work Pattern Anomaly',
          value: (apiOp.work_anomaly_score * 100).toFixed(1) + '%',
          severity: apiOp.work_anomaly_score > 0.2 ? 'high' : 'medium',
          description: 'Work pattern anomaly detected',
          category: 'pattern'
        });
      }
      if (apiOp.pkt_per_day === 0 && apiOp.is_active) {
        anomalies.push({
          type: 'Inactive Operator',
          value: '0 packets/day',
          severity: 'medium',
          description: 'No packet creation activity',
          category: 'productivity'
        });
      }
      // Check machine sync time if available
      if (apiOp.machine_sync_time) {
        const lastSync = new Date(apiOp.machine_sync_time);
        const daysSinceSync = Math.floor((new Date() - lastSync) / (1000 * 60 * 60 * 24));
        if (daysSinceSync > 7) {
          anomalies.push({
            type: 'Stale Machine Sync',
            value: `${daysSinceSync} days ago`,
            severity: daysSinceSync > 30 ? 'high' : 'medium',
            description: 'Machine has not synced recently',
            category: 'technical'
          });
        }
      }

      return {
        opt_id: apiOp.opt_id,
        opt_name: apiOp.name,
        opt_email: apiOp.email,
        opt_ea: apiOp.ea_name,
        opt_reg: apiOp.registar_name,
        opt_district: mockOp.opt_district || 'Unknown District',
        opt_state: mockOp.opt_state || 'Unknown State',
        risk_score: apiOp.risk_score,
        is_active: apiOp.is_active,
        pkt_create_daily_avg: apiOp.pkt_per_day,
        pkt_creation_duration_avg: mockOp.pkt_creation_duration_avg || 5,
        pkt_updt_rejection_rate: apiOp.pkt_rejection_rate,
        qc_error_rate_current_month: apiOp.qc_error,
        machine_count: apiOp.machine_count,
        anomalies: anomalies,
        anomalyCount: anomalies.length,
        anomalyScore: Math.min(
          (apiOp.document_anomaly_score * 100) +
          (apiOp.packet_anomaly_score * 100) +
          (apiOp.biometric_anomaly_score * 100) +
          ((apiOp.work_anomaly_score || 0) * 100) +
          ((apiOp.pkt_rejection_rate || 0) * 2),
          100
        ),
        severity: apiOp.risk_score >= 0.15 ? 'high' : apiOp.risk_score >= 0.1 ? 'medium' : 'low'
      };
    });
  }, [apiOperators, filteredOperators]);

  // Filter operators based on risk level
  const displayOperators = useMemo(() => {
    if (filterRisk === 'all') return processedOperators;
    if (filterRisk === 'high') return processedOperators.filter(op => op.risk_score >= 0.15);
    if (filterRisk === 'medium') return processedOperators.filter(op => op.risk_score >= 0.1 && op.risk_score < 0.15);
    return processedOperators.filter(op => op.risk_score < 0.1);
  }, [processedOperators, filterRisk]);

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
          <div>
            <h2 className="text-xl font-bold text-gray-900">Operator Anomaly Details</h2>
            {apiOperators && (
              <div className="text-sm text-gray-600 mt-1">
                <p>Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalOperators)} of {totalOperators.toLocaleString()} operators</p>
                <p>Page {currentPage} of {totalPages.toLocaleString()}</p>
              </div>
            )}
          </div>
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

        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading operators data...</p>
          </div>
        )}

        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-800">⚠️ Using fallback data. API connection issue: {error}</p>
          </div>
        )}

        <div className="space-y-4">
          {displayOperators.map((operator) => (
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
                      <span>{operator.opt_district || 'Unknown District'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      <span>{operator.pkt_create_daily_avg || 0} pkts/day</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{operator.pkt_creation_duration_avg || 0} min avg</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{operator.pkt_updt_rejection_rate || 0}% rejection</span>
                    </div>
                  </div>

                  {/* Additional API-specific info */}
                  {apiOperators && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-500 mb-3 p-2 bg-gray-50 rounded">
                      <div className="truncate">EA: {operator.opt_ea || 'N/A'}</div>
                      <div className="truncate">Registrar: {operator.opt_reg || 'N/A'}</div>
                      <div>Machines: {operator.machine_count || 0}</div>
                      {operator.mobile && <div>Mobile: {operator.mobile}</div>}
                    </div>
                  )}

                  {operator.anomalies && operator.anomalies.length > 0 && (
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

        {/* Pagination Controls */}
        {apiOperators && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Show:</span>
              <select 
                value={pageSize} 
                onChange={(e) => handlePageSizeChange(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-700">per page</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                First
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {/* Show page numbers around current page */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 text-sm border rounded ${
                        currentPage === pageNum 
                          ? 'bg-blue-500 text-white border-blue-500' 
                          : 'border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Next
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Last
              </button>
            </div>
            
            <div className="text-sm text-gray-700">
              Total: {totalOperators.toLocaleString()} operators
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OperatorsTab;
