import React from 'react';
import { Credit, CreditStatus } from '../../types';
import { useBlockchain } from '../../hooks/useBlockchain';
import { FactoryIcon, LocationMarkerIcon, CalendarIcon } from '../shared/icons/Icons';
import Spinner from '../shared/Spinner';

interface CreditCardProps {
  credit: Credit;
  onAction: (creditId: string) => void;
  actionLabel: string;
  isLoading: boolean;
}

const getExpiryInfo = (expiryTimestamp: number): { text: string; color: string } => {
    const now = new Date();
    const expiryDate = new Date(expiryTimestamp);
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
        return { text: 'Expired', color: 'text-red-400' };
    } else if (diffDays <= 30) {
        return { text: `Expires in ${diffDays} days`, color: 'text-red-400' };
    } else if (diffDays <= 180) {
        return { text: `Expires in ~${Math.round(diffDays / 30)} months`, color: 'text-yellow-400' };
    } else {
        return { text: `Expires ${expiryDate.toLocaleDateString()}`, color: 'text-slate-400' };
    }
};

const CreditCard: React.FC<CreditCardProps> = ({ credit, onAction, actionLabel, isLoading }) => {
  const { getUserById } = useBlockchain();
  const producer = getUserById(credit.producerId);
  const statusColor = credit.status === CreditStatus.AVAILABLE ? 'bg-green-900/50 text-green-300 border-green-500/30' : 'bg-yellow-900/50 text-yellow-300 border-yellow-500/30';
  const expiryInfo = getExpiryInfo(credit.expiryTimestamp);

  return (
    <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/10 hover:border-slate-700 flex flex-col">
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-cyan-400">{credit.id.substring(0, 8)}...</h3>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${statusColor}`}>
                {credit.status}
            </span>
        </div>
        <div className="mt-2 space-y-2 text-sm text-slate-400">
            <p className="flex items-center">
                <FactoryIcon className="w-4 h-4 mr-2 flex-shrink-0 text-slate-500" />
                {producer ? producer.name : 'Unknown Producer'}
            </p>
            <p className="flex items-center">
                <LocationMarkerIcon className="w-4 h-4 mr-2 flex-shrink-0 text-slate-500" />
                {credit.location}
            </p>
            <p className={`flex items-center font-medium ${expiryInfo.color}`}>
                <CalendarIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                {expiryInfo.text}
            </p>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-end">
          <div>
            <p className="text-slate-400 text-sm">Volume</p>
            <p className="text-2xl font-bold text-slate-100">{credit.volume.toLocaleString()} <span className="text-base font-normal text-slate-400">kg</span></p>
          </div>
          <div>
            <p className="text-slate-400 text-sm text-right">Price</p>
            <p className="text-2xl font-bold text-teal-400">${credit.price.toLocaleString()}</p>
          </div>
        </div>
      </div>
      <div className="px-5 py-3 bg-slate-900/50 border-t border-slate-800">
        <button 
          onClick={() => onAction(credit.id)}
          disabled={isLoading}
          className="w-full flex justify-center items-center bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:from-cyan-600 hover:to-teal-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
        >
          {isLoading ? <><Spinner className="mr-2" /> Processing...</> : actionLabel}
        </button>
      </div>
    </div>
  );
};

export default CreditCard;
