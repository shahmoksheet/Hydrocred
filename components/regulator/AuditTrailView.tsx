import React from 'react';
import { useBlockchain } from '../../hooks/useBlockchain';

interface AuditTrailViewProps {
  creditId: string;
}

const AuditTrailView: React.FC<AuditTrailViewProps> = ({ creditId }) => {
  const { getAuditTrail, getUserById, credits } = useBlockchain();
  const auditTrail = getAuditTrail(creditId);
  const credit = credits.find(c => c.id === creditId);

  return (
    <div className="space-y-4">
        {credit && (
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <h4 className="font-semibold text-slate-200">Credit Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm mt-2 text-slate-400">
                    <p><strong>Status:</strong> {credit.status}</p>
                    <p><strong>Volume:</strong> {credit.volume} kg</p>
                    <p><strong>Producer:</strong> {getUserById(credit.producerId)?.name}</p>
                    <p><strong>Current Owner:</strong> {getUserById(credit.ownerId)?.name}</p>
                    <p className="col-span-2"><strong>Data Hash:</strong> <code className="text-xs text-slate-500">{credit.productionDataHash}</code></p>
                    <p className="col-span-2"><strong>Producer Signature:</strong> <code className="text-xs text-slate-500">{credit.producerSignature}</code></p>
                </div>
            </div>
        )}
        <div>
            <h4 className="font-semibold mb-2 text-slate-200">Transaction History</h4>
            <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {auditTrail.map((tx) => (
                    <li key={tx.id} className="p-3 bg-slate-800 border border-slate-700 rounded-md">
                        <p className="font-bold text-cyan-400">{tx.type}</p>
                        <p className="text-xs text-slate-500">{new Date(tx.timestamp).toLocaleString()}</p>
                        <p className="text-sm mt-1 text-slate-300">{tx.notes}</p>
                        {tx.signature && (
                            <div className="mt-2 pt-2 border-t border-slate-700/50">
                                <p className="text-xs text-slate-400">
                                    <strong>Signature:</strong>
                                    <code className="block text-slate-500 text-[10px] break-all">{tx.signature}</code>
                                </p>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    </div>
  );
};

export default AuditTrailView;