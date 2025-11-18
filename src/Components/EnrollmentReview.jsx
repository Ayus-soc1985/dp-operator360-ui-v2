import React, { useState, Fragment } from 'react';
import { FileText, CheckCircle, XCircle, Timer, Hash, Calendar, Building, AlertTriangle } from 'lucide-react';

const EnrollmentReview = ({ operator }) => {
  // Mock enrollment review data
  const generateEnrollmentReviews = () => {
    const enrollmentTypes = ['New Enrollment', 'Update', 'Correction'];
    const updateTypes = ['MOU', 'Demo', 'Biometric'];
    
    return Array.from({ length: 8 }, (_, i) => ({
      id: `EID-${operator.opt_id}-${1000 + i}`,
      eidNumber: `${Math.floor(1000000000000 + Math.random() * 9000000000000)}`,
      enrollmentType: enrollmentTypes[Math.floor(Math.random() * enrollmentTypes.length)],
      dateCreated: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      stationMachineCode: `SMC-${String(100 + i).padStart(4, '0')}`,
      updateType: updateTypes[Math.floor(Math.random() * updateTypes.length)],
      stationNo: `ST-${String(Math.floor(Math.random() * 500) + 1).padStart(3, '0')}`,
      packetSource: 'ecmp',
      status: Math.random() > 0.6 ? 'pending' : Math.random() > 0.5 ? 'approved' : 'pending'
    }));
  };

  const [enrollmentReviews, setEnrollmentReviews] = useState(generateEnrollmentReviews());
  const [anomalousReviews, setAnomalousReviews] = useState({});

  const handleMarkAnomalous = (eidId) => {
    setAnomalousReviews(prev => ({
      ...prev,
      [eidId]: {
        isAnomalous: !prev[eidId]?.isAnomalous,
        review: prev[eidId]?.review || ''
      }
    }));
  };

  const handleReviewChange = (eidId, review) => {
    setAnomalousReviews(prev => ({
      ...prev,
      [eidId]: {
        ...prev[eidId],
        review
      }
    }));
  };

  const handleSubmitReview = (eidId) => {
    console.log(`Anomaly review submitted for ${eidId}:`, anomalousReviews[eidId]?.review);
    alert('Anomaly review submitted successfully!');
    // Close the review box by unmarking as anomalous
    setAnomalousReviews(prev => ({
      ...prev,
      [eidId]: {
        isAnomalous: false,
        review: prev[eidId]?.review || ''
      }
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-[#d2c5e7] via-[#e8dff2] to-[#f5f2f8] rounded-2xl shadow-2xl p-8 text-gray-800 border-2 border-[#d2c5e7]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold mb-2 flex items-center gap-3 text-[#7a5f93]">
              <FileText className="w-10 h-10" />
              Packet Review Dashboard
            </h2>
            <p className="text-[#9b7bb5] text-lg">Review and manage operator records</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-[#9b7bb5] mb-1 font-semibold">Total Enrollments</div>
            <div className="text-5xl font-bold text-[#7a5f93]">{enrollmentReviews.length}</div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border-2 border-red-200 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-red-600 uppercase tracking-wide mb-1">Anomalous EIDs</div>
              <div className="text-4xl font-bold text-red-700">
                {Object.values(anomalousReviews).filter(r => r.isAnomalous).length}
              </div>
            </div>
            <div className="p-4 bg-red-500 rounded-full">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment Review Table */}
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-[#d2c5e7] to-[#e8dff2] px-8 py-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-md">
              <FileText className="w-6 h-6 text-[#9b7bb5]" />
            </div>
            Packet Records
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Enrollment EID
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Enrollment Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Date Created
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Station Machine Code
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                 Update Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Station No.
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Packet Source
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {enrollmentReviews.map((review, index) => (
                <Fragment key={review.id}>
                  <tr 
                    className={`hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-bold text-gray-900 font-mono">{review.id}</div>
                        <div className="text-xs text-gray-500 font-mono">{review.eidNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      review.enrollmentType === 'New Enrollment' ? 'bg-blue-100 text-blue-700' :
                      review.enrollmentType === 'Update' ? 'bg-green-100 text-green-700' :
                      review.enrollmentType === 'Correction' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {review.enrollmentType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900 font-medium">{review.dateCreated}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono font-semibold text-gray-900">{review.stationMachineCode}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${
                      review.updateType === 'MOU' ? 'bg-green-100 text-green-700 border-2 border-green-300' :
                      review.updateType === 'Demo' ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' :
                      'bg-purple-100 text-purple-700 border-2 border-purple-300'
                    }`}>
                      {review.updateType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-900">{review.stationNo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-300">
                      {review.packetSource.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => handleMarkAnomalous(review.id)}
                        className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all duration-300 flex items-center gap-1.5 ${
                          anomalousReviews[review.id]?.isAnomalous
                            ? 'bg-red-500 text-white shadow-lg'
                            : 'bg-orange-100 text-orange-700 hover:bg-orange-500 hover:text-white hover:scale-105 hover:shadow-lg border border-orange-300'
                        }`}
                      >
                        <AlertTriangle className="w-4 h-4" />
                        {anomalousReviews[review.id]?.isAnomalous ? 'Marked Anomalous' : 'Mark as Anomalous'}
                      </button>
                    </div>
                  </td>
                </tr>
                {anomalousReviews[review.id]?.isAnomalous && (
                  <tr className="bg-red-50 border-l-4 border-red-500">
                    <td colSpan="8" className="px-6 py-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-red-700 font-semibold">
                          <AlertTriangle className="w-5 h-5" />
                          <span>Anomaly Review for {review.id}</span>
                        </div>
                        <textarea
                          value={anomalousReviews[review.id]?.review || ''}
                          onChange={(e) => handleReviewChange(review.id, e.target.value)}
                          placeholder="Please provide detailed remarks about why this EID is marked as anomalous..."
                          rows={4}
                          className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-sm"
                        />
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">{anomalousReviews[review.id]?.review?.length || 0} characters</span>
                          <button
                            onClick={() => handleSubmitReview(review.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold text-xs hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
                          >
                            Submit Review
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="font-semibold">Showing {enrollmentReviews.length} enrollment records</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Approved: {enrollmentReviews.filter(r => r.status === 'approved').length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Rejected: {enrollmentReviews.filter(r => r.status === 'rejected').length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>On Hold: {enrollmentReviews.filter(r => r.status === 'hold').length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Legend */}
      {/* <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-l-4 border-blue-500 shadow-md">
        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-blue-600" />
          Action Guide
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start gap-3 bg-white rounded-lg p-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-bold text-gray-900">Approve</div>
              <div className="text-gray-600 text-xs">Mark enrollment as verified and approved for processing</div>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white rounded-lg p-3">
            <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-bold text-gray-900">Reject</div>
              <div className="text-gray-600 text-xs">Reject enrollment due to issues, errors, or invalid data</div>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white rounded-lg p-3">
            <Timer className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-bold text-gray-900">Hold</div>
              <div className="text-gray-600 text-xs">Put enrollment on hold for additional review or clarification</div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default EnrollmentReview;
