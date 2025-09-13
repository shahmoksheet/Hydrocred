
import { useContext } from 'react';
import { BlockchainContext } from '../context/BlockchainContext';

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (context === undefined) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};
