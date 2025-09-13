
import React, { useState } from 'react';
import { useBlockchain } from '../../hooks/useBlockchain';
import { useAuth } from '../../hooks/useAuth';
import { CreditStatus } from '../../types';
import CreditCard from './CreditCard';
import GeminiReportGenerator from '../shared/GeminiReportGenerator';
import { generateConsumerReport } from '../../services/geminiService';

const MarketplaceDashboard: React.FC = () => {
    const { user } = useAuth();
    const { credits, transactions, buyCredit, retireCredit } = useBlockchain();
    const [isLoading, setIsLoading] = useState<string | null>(null); // Store ID of credit being processed
    const [error, setError] = useState('');

    const availableCredits = credits.filter(c => c.status === CreditStatus.AVAILABLE && c.ownerId !== user?.id);
    const myCredits = credits.filter(c => c.ownerId === user?.id && c.status !== CreditStatus.RETIRED);
    
    const handleGenerateReport = () => {
        if (!user) throw new Error("User not found");
        return generateConsumerReport(user, transactions, credits);
    };

    const handleBuy = async (creditId: string) => {
        if (!user) return;
        setIsLoading(creditId);
        setError('');
        try {
            await buyCredit(creditId, user.id);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Purchase failed');
        } finally {
            setIsLoading(null);
        }
    };
    
    const handleRetire = async (creditId: string) => {
        if (!user) return;
        setIsLoading(creditId);
        setError('');
        try {
            const purpose = prompt("Please enter the purpose for retiring this credit (e.g., 'Q3 ESG Reporting'):");
            if (purpose) {
                await retireCredit(creditId, user.id, purpose);
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Retirement failed');
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <div className="space-y-10">
            <div>
                <h2 className="text-3xl font-bold text-slate-100 mb-4">Credit Marketplace</h2>
                {error && <p className="text-red-400 bg-red-900/50 border border-red-500/50 p-3 rounded-md mb-4">{error}</p>}
                {availableCredits.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {availableCredits.map(credit => (
                            <CreditCard 
                                key={credit.id} 
                                credit={credit} 
                                onAction={handleBuy} 
                                actionLabel="Buy Credit"
                                isLoading={isLoading === credit.id} 
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-slate-900 rounded-lg border border-slate-800">
                      <p className="text-slate-400">No credits currently available for purchase.</p>
                    </div>
                )}
            </div>

            <div className="space-y-8">
                 <h2 className="text-3xl font-bold text-slate-100 mb-0">My Portfolio</h2>
                 
                 <GeminiReportGenerator
                    title="AI Impact Report"
                    description="Generate an AI-powered summary of your credit portfolio for ESG reporting and impact analysis."
                    placeholder=""
                    buttonText="Generate Impact Summary"
                    onGenerate={handleGenerateReport}
                 />

                {myCredits.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {myCredits.map(credit => (
                            <CreditCard 
                                key={credit.id} 
                                credit={credit}
                                onAction={handleRetire}
                                actionLabel="Retire Credit"
                                isLoading={isLoading === credit.id}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-slate-900 rounded-lg border border-slate-800">
                      <p className="text-slate-400">You do not own any active credits.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarketplaceDashboard;
