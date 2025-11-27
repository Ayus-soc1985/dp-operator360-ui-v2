import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, Activity, Clock, AlertTriangle, Eye } from 'lucide-react';
import OperatorDetailView from './OperatorDetailView';
import highRiskOperators from '../resources/opt_data/high_risk_opt.json';
import medRiskOperators from '../resources/opt_data/med_risk_opt.json';
import lowRiskOperators from '../resources/opt_data/low_risk_opt.json';

const OperatorsTab = ({ 
  filteredOperators, 
  selectedOperator, 
  setSelectedOperator, 
  getSeverityColor,
  getSeverityIcon,
  getCategoryColor
}) => {
  const [detailedViewOperator, setDetailedViewOperator] = useState(null);
  const [apiOperators, setApiOperators] = useState(null);
  const [loading, setLoading] = useState(false); // Set loading to false by default
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalOperators, setTotalOperators] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filterRisk, setFilterRisk] = useState('high');
  const [filterState, setFilterState] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterRegistrar, setFilterRegistrar] = useState('');
  const [filterEa, setFilterEa] = useState('');
  const [searchOperatorId, setSearchOperatorId] = useState('');
  const [sortBy, setSortBy] = useState('risk');

  const riskDataSources = {
    high: highRiskOperators,
    medium: medRiskOperators,
    low: lowRiskOperators
  };

  // Process and merge API data with mock data
  const processedOperators = useMemo(() => {
    const source = riskDataSources[filterRisk] || highRiskOperators;
    // Convert object structure to array for processing
    const operatorArray = Object.values(source);
    return operatorArray.map(op => ({
      ...op, // Include all original fields for OperatorDetailView
      opt_id: op.opt_id,
      opt_name: op.opt_name,
      risk_score: parseFloat(op.optRiskScore),
      last_sync_time: op.last_sync_time,
      pkt_per_day: op.pkt_per_day,
      district: op.district,
      state: op.state,
      active_status: op.active_status,
      registrar_name: op.optReg,
      ea_name: op.optEa
    }));
  }, [filterRisk]);

  const pageSizeOptions = [10, 20, 50, 100];

  const paginatedOperators = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    return processedOperators.slice(startIdx, endIdx);
  }, [processedOperators, currentPage, pageSize]);

  // Update totalPages state whenever processedOperators or pageSize changes
  useEffect(() => {
    setTotalPages(Math.ceil(processedOperators.length / pageSize));
  }, [processedOperators, pageSize]);

  // Handle selectedOperator from parent component (e.g., from OverviewTab)
  useEffect(() => {
    if (selectedOperator) {
      setDetailedViewOperator(selectedOperator);
      // Clear the selectedOperator in parent to avoid conflicts
      setSelectedOperator(null);
    }
  }, [selectedOperator, setSelectedOperator]);

  const uniqueStates = useMemo(() => [...new Set(processedOperators.map(op => op.state).filter(Boolean))].sort(), [processedOperators]);
  const uniqueDistricts = useMemo(() => [...new Set(processedOperators.map(op => op.district).filter(Boolean))].sort(), [processedOperators]);
  const uniqueRegistrars = useMemo(() => [...new Set(processedOperators.map(op => op.registrar_name).filter(Boolean))].sort(), [processedOperators]);
  const uniqueEas = useMemo(() => [...new Set(processedOperators.map(op => op.ea_name).filter(Boolean))].sort(), [processedOperators]);

  // Rename local filteredOperators to filteredOperatorRows to avoid conflict with prop
  const filteredOperatorRows = useMemo(() => {
    return paginatedOperators.filter(op =>
      (!filterState || op.state === filterState) &&
      (!filterDistrict || op.district === filterDistrict) &&
      (!filterRegistrar || op.registrar_name === filterRegistrar) &&
      (!filterEa || op.ea_name === filterEa) &&
      (!searchOperatorId || op.opt_id.toLowerCase().includes(searchOperatorId.toLowerCase()))
    );
  }, [paginatedOperators, filterState, filterDistrict, filterRegistrar, filterEa, searchOperatorId]);

  const sortedOperators = useMemo(() => {
    let ops = [...filteredOperatorRows];
    if (sortBy === 'sync') {
      ops.sort((a, b) => new Date(b.last_sync_time) - new Date(a.last_sync_time));
    } else if (sortBy === 'risk') {
      ops.sort((a, b) => b.risk_score - a.risk_score);
    } else if (sortBy === 'pkts') {
      ops.sort((a, b) => (parseInt(b.pkt_per_day) || 0) - (parseInt(a.pkt_per_day) || 0));
    }
    return ops;
  }, [filteredOperatorRows, sortBy]);

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
            <div className="text-sm text-gray-600 mt-1">
              <p>Showing {processedOperators.length} operators</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterRisk('high')}
              className={`px-4 py-2 rounded-lg font-medium transition ${filterRisk === 'high' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              High Risk
            </button>
            <button
              onClick={() => setFilterRisk('medium')}
              className={`px-4 py-2 rounded-lg font-medium transition ${filterRisk === 'medium' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Medium Risk
            </button>
            <button
              onClick={() => setFilterRisk('low')}
              className={`px-4 py-2 rounded-lg font-medium transition ${filterRisk === 'low' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Low Risk
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-800">⚠️ Using fallback data. API connection issue: {error}</p>
          </div>
        )}

        {/* Enhanced Filters and Search Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"></path>
              </svg>
              Filters & Search
            </h3>
            <button
              onClick={() => {
                setSearchOperatorId('');
                setFilterState('');
                setFilterDistrict('');
                setFilterRegistrar('');
                setFilterEa('');
                setSortBy('risk');
              }}
              className="px-3 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Clear All
            </button>
          </div>
          
          {/* Search Section */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchOperatorId}
                onChange={e => setSearchOperatorId(e.target.value)}
                placeholder="Search by Operator ID..."
                className="w-full max-w-md pl-10 pr-4 py-3 text-sm bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">State</label>
              <select 
                value={filterState} 
                onChange={e => { setFilterState(e.target.value); setFilterDistrict(''); }} 
                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All States</option>
                {uniqueStates.map(state => <option key={state} value={state}>{state}</option>)}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">District</label>
              <select 
                value={filterDistrict} 
                onChange={e => setFilterDistrict(e.target.value)} 
                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                disabled={!filterState}
              >
                <option value="">All Districts</option>
                {uniqueDistricts.filter(d => !filterState || processedOperators.find(op => op.state === filterState && op.district === d)).map(district => <option key={district} value={district}>{district}</option>)}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Registrar</label>
              <select 
                value={filterRegistrar} 
                onChange={e => setFilterRegistrar(e.target.value)} 
                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Registrars</option>
                {uniqueRegistrars.map(reg => <option key={reg} value={reg}>{reg}</option>)}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">EA Name</label>
              <select 
                value={filterEa} 
                onChange={e => setFilterEa(e.target.value)} 
                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All EA Names</option>
                {uniqueEas.map(ea => <option key={ea} value={ea}>{ea}</option>)}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Sort By</label>
              <select 
                value={sortBy} 
                onChange={e => setSortBy(e.target.value)} 
                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="risk">Risk Score</option>
                <option value="sync">Sync Time</option>
                <option value="pkts">Packets/Day</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchOperatorId || filterState || filterDistrict || filterRegistrar || filterEa) && (
            <div className="mt-4 pt-4 border-t border-blue-200">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-600">Active filters:</span>
                {searchOperatorId && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    Search: {searchOperatorId}
                    <button onClick={() => setSearchOperatorId('')} className="ml-1 hover:text-blue-900">×</button>
                  </span>
                )}
                {filterState && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    State: {filterState}
                    <button onClick={() => setFilterState('')} className="ml-1 hover:text-green-900">×</button>
                  </span>
                )}
                {filterDistrict && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                    District: {filterDistrict}
                    <button onClick={() => setFilterDistrict('')} className="ml-1 hover:text-purple-900">×</button>
                  </span>
                )}
                {filterRegistrar && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                    Registrar: {filterRegistrar}
                    <button onClick={() => setFilterRegistrar('')} className="ml-1 hover:text-yellow-900">×</button>
                  </span>
                )}
                {filterEa && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-pink-100 text-pink-700 text-xs font-medium rounded-full">
                    EA: {filterEa}
                    <button onClick={() => setFilterEa('')} className="ml-1 hover:text-pink-900">×</button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {sortedOperators.map((operator) => (
            <div
              key={operator.opt_id}
              className="border rounded-xl p-6 bg-gradient-to-br from-white via-blue-50 to-blue-100 shadow-lg hover:shadow-xl transition duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3 flex-wrap">
                    <h3 className="text-2xl font-bold text-blue-900">{operator.opt_name}</h3>
                    <span className="px-4 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700 border border-red-200 shadow">
                      Risk: {(operator.risk_score * 100).toFixed(1)}%
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${operator.active_status === '1' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>Status: {operator.active_status === '1' ? 'Active' : 'Inactive'}</span>
                    <button
                      onClick={() => {
                        // Find the operator data from all risk categories based on opt_id
                        const findOperatorById = (optId) => {
                          // Check high risk first
                          if (highRiskOperators[optId]) return highRiskOperators[optId];
                          // Check medium risk
                          if (medRiskOperators[optId]) return medRiskOperators[optId];
                          // Check low risk
                          if (lowRiskOperators[optId]) return lowRiskOperators[optId];
                          // Fallback to current operator if not found
                          return operator;
                        };
                        
                        const fullOperatorData = findOperatorById(operator.opt_id);
                        console.log('Selected Operator Data:', fullOperatorData);
                        setDetailedViewOperator(fullOperatorData);
                      }}
                      className="ml-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition flex items-center gap-2 shadow-md"
                    >
                      <Eye className="w-4 h-4" />
                      View Full Details
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-base text-gray-700 mb-4">
                    <div className="flex items-center gap-2"><MapPin className="w-5 h-5 text-blue-400" /><span className="font-semibold">District:</span> <span>{operator.district}</span></div>
                    <div className="flex items-center gap-2"><MapPin className="w-5 h-5 text-purple-400" /><span className="font-semibold">State:</span> <span>{operator.state}</span></div>
                    <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-indigo-400" /><span className="font-semibold">Last Sync:</span> <span>{operator.last_sync_time}</span></div>
                    <div className="flex items-center gap-2"><Activity className="w-5 h-5 text-pink-400" /><span className="font-semibold">Packets/Day:</span> <span>{operator.pkt_per_day}</span></div>
                    <div className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-yellow-400" /><span className="font-semibold">Registrar:</span> <span>{operator.registrar_name}</span></div>
                    <div className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-green-400" /><span className="font-semibold">EA Name:</span> <span>{operator.ea_name}</span></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="mt-6 flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Show:</span>
            <select 
              value={pageSize} 
              onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <span className="text-sm text-gray-700">per page</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100">First</button>
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100">Previous</button>
            <span className="text-sm">Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100">Next</button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100">Last</button>
          </div>
          <div className="text-sm text-gray-700">Total: {processedOperators.length} operators</div>
        </div>
      </div>
    </div>
  );
};

export default OperatorsTab;
