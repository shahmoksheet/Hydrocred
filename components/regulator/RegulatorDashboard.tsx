import React, { useState, useMemo } from 'react';
import { useBlockchain } from '../../hooks/useBlockchain';
import { Transaction, TransactionType } from '../../types';
import Modal from '../shared/Modal';
import AuditTrailView from './AuditTrailView';
import GeminiReportGenerator from '../shared/GeminiReportGenerator';
import { generateComplianceReport } from '../../services/geminiService';

const RegulatorDashboard: React.FC = () => {
  const { transactions, credits, users, getUserById } = useBlockchain();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCreditId, setSelectedCreditId] = useState<string | null>(null);

  const handleGenerateReport = (query: string) => {
    return generateComplianceReport(query, transactions, credits, users);
  };

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(tx => {
        const lowerSearch = searchTerm.toLowerCase();
        const fromUser = tx.fromId ? getUserById(tx.fromId)?.name.toLowerCase() : '';
        const toUser = getUserById(tx.toId)?.name.toLowerCase();
        
        return (
          tx.id.toLowerCase().includes(lowerSearch) ||
          tx.creditId.toLowerCase().includes(lowerSearch) ||
          tx.type.toLowerCase().includes(lowerSearch) ||
          (fromUser && fromUser.includes(lowerSearch)) ||
          (toUser && toUser.includes(lowerSearch))
        );
      })
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [transactions, searchTerm, getUserById]);

  const getStatusBadge = (type: TransactionType) => {
      switch (type) {
          case TransactionType.ISSUE:
              return "bg-blue-900/50 text-blue-300 border-blue-500/30";
          case TransactionType.TRANSFER:
              return "bg-yellow-900/50 text-yellow-300 border-yellow-500/30";
          case TransactionType.RETIRE:
              return "bg-purple-900/50 text-purple-300 border-purple-500/30";
          case TransactionType.CERTIFY:
              return "bg-green-900/50 text-green-300 border-green-500/30";
          case TransactionType.REJECT:
              return "bg-orange-900/50 text-orange-300 border-orange-500/30";
          case TransactionType.EXPIRE:
              return "bg-red-900/50 text-red-300 border-red-500/30";
          default:
              return "bg-slate-700 text-slate-300";
      }
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-slate-100">Regulator Portal</h2>
      
      <GeminiReportGenerator
        title="AI Compliance Assistant"
        description="Ask a natural language question about the entire ledger to generate a compliance report."
        placeholder="e.g., 'Which credits were retired this month?' or 'Show me the lifecycle of credit HC-002.'"
        buttonText="Generate Report"
        onGenerate={handleGenerateReport}
      />

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Transaction Audit Log</h3>
        <input
          type="text"
          placeholder="Search by ID, user, or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 mb-4 bg-slate-800 border border-slate-700 rounded-lg placeholder-slate-500 focus:ring-cyan-500 focus:border-cyan-500"
        />
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">TXN ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Credit ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">From</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody className="bg-slate-900 divide-y divide-slate-800">
              {filteredTransactions.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-800/50 cursor-pointer transition-colors" onClick={() => setSelectedCreditId(tx.creditId)}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-300">{tx.id.substring(0,8)}...</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-400 font-semibold">{tx.creditId.substring(0,8)}...</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadge(tx.type)}`}>
                        {tx.type}
                      </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{tx.fromId ? getUserById(tx.fromId)?.name : 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{getUserById(tx.toId)?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(tx.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {selectedCreditId && (
        <Modal isOpen={!!selectedCreditId} onClose={() => setSelectedCreditId(null)} title={`Audit Trail for Credit: ${selectedCreditId}`}>
          <AuditTrailView creditId={selectedCreditId} />
        </Modal>
      )}
    </div>
  );
};

export default RegulatorDashboard;