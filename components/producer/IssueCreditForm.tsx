import React, { useState } from 'react';
import { useBlockchain } from '../../hooks/useBlockchain';
import { useAuth } from '../../hooks/useAuth';
import { ProductionData, EnergySource } from '../../types';
import Spinner from '../shared/Spinner';

const energySources: EnergySource[] = ['Solar', 'Wind', 'Hydro', 'Geothermal', 'Biomass', 'Nuclear'];

const IssueCreditForm: React.FC = () => {
  const { issueCredit } = useBlockchain();
  const { user } = useAuth();
  const [volume, setVolume] = useState('');
  const [price, setPrice] = useState('');
  const [energySource, setEnergySource] = useState<EnergySource>('Solar');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user) {
        setError("You must be logged in to issue a credit.");
        return;
    }
    if (!user.location) {
        setError("Your producer profile is missing a location. Please contact support.");
        return;
    }

    const numVolume = parseFloat(volume);
    const numPrice = parseFloat(price);

    if (isNaN(numVolume) || numVolume <= 0) {
      setError('Volume must be a positive number.');
      return;
    }
    
    if (isNaN(numPrice) || numPrice <= 0) {
      setError('Price must be a positive number.');
      return;
    }

    if (numVolume > 1000000) {
      setError('Volume cannot exceed 1,000,000 kg. Please contact support for larger volumes.');
      return;
    }

    if (numPrice > 1000000) {
      setError('Price cannot exceed $1,000,000. Please contact support for larger amounts.');
      return;
    }
    
    setIsLoading(true);
    const productionData: ProductionData = {
        volume: numVolume,
        timestamp: Date.now(),
        energySource,
        location: user.location, // Use producer's registered location
    };

    try {
      await issueCredit(user.id, numVolume, numPrice, productionData);
      setSuccess(`Successfully submitted credit for certification! It has been routed to the certifier for ${user.location}.`);
      // Reset form
      setVolume('');
      setPrice('');
      setEnergySource('Solar');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyles = "mt-1 block w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md shadow-sm placeholder-slate-500 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-slate-200 transition-colors";
  
  return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="volume" className="block text-sm font-medium text-slate-400">Volume (kg)</label>
                <input
                    type="number"
                    id="volume"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className={inputStyles}
                    placeholder="e.g., 1000"
                    required
                />
            </div>
            <div>
                <label htmlFor="price" className="block text-sm font-medium text-slate-400">Total Price (USD)</label>
                <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className={inputStyles}
                    placeholder="e.g., 5000"
                    required
                />
            </div>
            <div className="md:col-span-2">
                <label htmlFor="energySource" className="block text-sm font-medium text-slate-400">Energy Source</label>
                <select 
                    id="energySource" 
                    value={energySource} 
                    onChange={(e) => setEnergySource(e.target.value as EnergySource)}
                    className={inputStyles}
                >
                    {energySources.map(source => (
                        <option key={source} value={source}>{source}</option>
                    ))}
                </select>
            </div>
        </div>
        
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-green-400 text-sm">{success}</p>}

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={isLoading} className="flex justify-center items-center bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold py-2 px-6 rounded-lg hover:from-cyan-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105">
            {isLoading ? <><Spinner className="mr-2" /> Submitting...</> : 'Submit for Certification'}
          </button>
        </div>
      </form>
  );
};

export default IssueCreditForm;
