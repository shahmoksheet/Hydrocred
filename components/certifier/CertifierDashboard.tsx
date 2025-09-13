
import React, { useState, useMemo } from 'react';
import { useBlockchain } from '../../hooks/useBlockchain';
import { useAuth } from '../../hooks/useAuth';
import { CreditStatus } from '../../types';
import GeminiReportGenerator from '../shared/GeminiReportGenerator';
import { generateCertifierReport } from '../../services/geminiService';
import Spinner from '../shared/Spinner';

const CertifierDashboard: React.FC = () => {
    const { user } = useAuth();
    const { credits, transactions, approveCredit, rejectCredit, getUserById } = useBlockchain();
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [error, setError] = useState('');

    const pendingCredits = useMemo(() => 
        credits.filter(c => c.status === CreditStatus.AWAITING_CERTIFICATION && c.certifierId === user?.id),
        [credits, user]
    );

    const handleGenerateReport = () => {
        if (!user) throw new Error("User not found");
        return generateCertifierReport(user, transactions, credits);
    };
    
    const handleApprove = async (creditId: string) => {
        if (!user) return;
        setIsLoading(creditId);
        setError('');
        try {
            await approveCredit(creditId, user.id);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Approval failed');
        } finally {
            setIsLoading(null);
        }
    };

    const handleReject = async (creditId: string) => {
        if (!user) return;
        const reason = prompt("Please enter the reason for rejecting this credit:");
        if (!reason) return; // User cancelled

        setIsLoading(creditId);
        setError('');
        try {
            await rejectCredit(creditId, user.id, reason);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Rejection failed');
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-slate-100">Certifier Dashboard</h2>
                <p className="text-slate-400 mt-1">Review pending credit applications and analyze your certification activity.</p>
            </div>

            {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}
            
            <GeminiReportGenerator
                title="AI Activity Summary"
                description="Get an AI-generated summary of your certification history, including approval rates and turnaround times."
                placeholder=""
                buttonText="Generate Activity Report"
                onGenerate={handleGenerateReport}
            />

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-slate-100">Pending Certification Requests ({pendingCredits.length})</h3>
                <div className="overflow-x-auto">
                    {pendingCredits.length > 0 ? (
                        <table className="min-w-full divide-y divide-slate-800">
                            <thead className="bg-slate-900/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Credit ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Producer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Volume (kg)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Location</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Issued</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-slate-900 divide-y divide-slate-800">
                                {pendingCredits.map(credit => (
                                    <tr key={credit.id} className="transition-colors hover:bg-slate-800/50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-cyan-400">{credit.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{getUserById(credit.producerId)?.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{credit.volume.toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{credit.location}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(credit.issueTimestamp).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                            {isLoading === credit.id ? (
                                                <div className="flex justify-start items-center">
                                                    <Spinner />
                                                </div>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(credit.id)}
                                                        disabled={!!isLoading}
                                                        className="text-green-400 hover:text-green-300 disabled:text-slate-600 transition-colors"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(credit.id)}
                                                        disabled={!!isLoading}
                                                        className="text-red-400 hover:text-red-300 disabled:text-slate-600 transition-colors"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                         <div className="text-center py-10">
                           <p className="text-slate-400">No pending certification requests assigned to you.</p>
                         </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CertifierDashboard;
