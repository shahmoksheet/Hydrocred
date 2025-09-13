import React from 'react';
import { useBlockchain } from '../../hooks/useBlockchain';
import { useAuth } from '../../hooks/useAuth';
import StatCard from '../shared/StatCard';
import IssueCreditForm from './IssueCreditForm';
import { CreditStatus } from '../../types';
import GeminiReportGenerator from '../shared/GeminiReportGenerator';
import { generateProducerReport } from '../../services/geminiService';

const ProducerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { credits, transactions } = useBlockchain();
  
  const producerCredits = credits.filter(c => c.producerId === user?.id);
  const totalVolumeIssued = producerCredits.reduce((sum, c) => sum + c.volume, 0);
  const availableCredits = producerCredits.filter(c => c.status === CreditStatus.AVAILABLE).length;
  const pendingCredits = producerCredits.filter(c => c.status === CreditStatus.AWAITING_CERTIFICATION).length;
  const expiredCredits = producerCredits.filter(c => c.status === CreditStatus.EXPIRED).length;

  const handleGenerateReport = () => {
    if (!user) throw new Error("User not found");
    return generateProducerReport(user, transactions, credits);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-100">Producer Dashboard</h2>
        <p className="text-slate-400 mt-1">Welcome, {user?.name}. Issue new credits and analyze your performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total H₂ Volume Issued" value={`${totalVolumeIssued.toLocaleString()} kg`} icon={<div className="text-white text-lg font-bold">KG</div>} color="bg-cyan-500" />
        <StatCard title="Awaiting Certification" value={pendingCredits} icon={<div className="text-white text-lg font-bold">?</div>} color="bg-yellow-500" />
        <StatCard title="Available on Market" value={availableCredits} icon={<div className="text-white text-lg font-bold">✓</div>} color="bg-teal-500" />
        <StatCard title="Expired Credits" value={expiredCredits} icon={<div className="text-white text-lg font-bold">X</div>} color="bg-red-500" />
      </div>

      <GeminiReportGenerator
        title="AI Performance Summary"
        description="Get an AI-generated summary of your production and sales activity."
        placeholder=""
        buttonText="Generate My Summary"
        onGenerate={handleGenerateReport}
      />

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-slate-100">Create New Hydrogen Credit</h3>
        <IssueCreditForm />
      </div>

    </div>
  );
};

export default ProducerDashboard;