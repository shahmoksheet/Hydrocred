import React, { createContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { Credit, Transaction, User, ProductionData, CreditStatus, TransactionType, Role } from '../types';
import { db } from '../services/firebase';
import { 
    collection, 
    onSnapshot, 
    addDoc, 
    doc, 
    updateDoc,
    writeBatch,
    query,
    orderBy,
} from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';

interface BlockchainContextType {
  users: User[];
  credits: Credit[];
  transactions: Transaction[];
  issueCredit: (producerId: string, volume: number, price: number, productionData: ProductionData) => Promise<{ id: string }>;
  buyCredit: (creditId: string, buyerId: string) => Promise<void>;
  retireCredit: (creditId: string, consumerId: string, purpose: string) => Promise<void>;
  approveCredit: (creditId: string, certifierId: string) => Promise<void>;
  rejectCredit: (creditId: string, certifierId: string, reason: string) => Promise<void>;
  getAuditTrail: (creditId: string) => Transaction[];
  getUserById: (userId: string) => User | undefined;
  isLoading: boolean;
}

export const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

// A simple client-side hashing function to simulate signature generation
const simpleHash = async (data: string): Promise<string> => {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const BlockchainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, user: authUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [credits, setCredits] = useState<Credit[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to check for and update expired credits (simulates a cron job)
  const checkForExpiredCredits = useCallback(async (creditsToCheck: Credit[]) => {
    const now = Date.now();
    const expiredCredits = creditsToCheck.filter(
        c => c.status === CreditStatus.AVAILABLE && c.expiryTimestamp < now
    );

    if (expiredCredits.length > 0) {
        console.log(`Found ${expiredCredits.length} expired credits. Updating status...`);
        const batch = writeBatch(db);
        expiredCredits.forEach(credit => {
            const creditRef = doc(db, 'credits', credit.id);
            batch.update(creditRef, { status: CreditStatus.EXPIRED });

            const transactionRef = doc(collection(db, 'transactions'));
            const expireTransaction: Omit<Transaction, 'id'> = {
                creditId: credit.id,
                type: TransactionType.EXPIRE,
                fromId: credit.ownerId,
                toId: credit.ownerId,
                timestamp: now,
                notes: `Credit expired automatically on ${new Date(now).toLocaleDateString()}.`
            };
            batch.set(transactionRef, expireTransaction);
        });
        await batch.commit();
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
        setUsers([]);
        setCredits([]);
        setTransactions([]);
        setIsLoading(false);
        return;
    }

    setIsLoading(true);

    const qCredits = query(collection(db, 'credits'), orderBy('issueTimestamp', 'desc'));
    const unsubCredits = onSnapshot(qCredits, (snapshot) => {
        const creditsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Credit));
        setCredits(creditsData);
        checkForExpiredCredits(creditsData); // Run expiry check on new data
    }, (error) => {
        console.error("Error fetching credits:", error);
        setIsLoading(false);
    });

    const qTransactions = query(collection(db, 'transactions'), orderBy('timestamp', 'desc'));
    const unsubTransactions = onSnapshot(qTransactions, (snapshot) => {
        const transactionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
        setTransactions(transactionsData);
    }, (error) => console.error("Error fetching transactions:", error));

    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
        const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
        setUsers(usersData);
        // Set loading to false after users are loaded (they load first)
        setIsLoading(false);
    }, (error) => {
        console.error("Error fetching users:", error);
        setIsLoading(false);
    });

    return () => {
        unsubCredits();
        unsubTransactions();
        unsubUsers();
    };
  }, [isAuthenticated, checkForExpiredCredits]);

  const getUserById = useCallback((userId: string) => users.find(u => u.id === userId), [users]);

  const issueCredit = async (producerId: string, volume: number, price: number, productionData: ProductionData) => {
    const producer = getUserById(producerId);
    if (!producer || !producer.location) {
        throw new Error("Producer or producer location not found");
    }

    // --- Refactored Certifier Lookup Logic ---
    // Normalize producer location for robust matching (case-insensitive, trimmed whitespace).
    const normalizedProducerLocation = producer.location.trim().toLowerCase();

    // First, attempt to find a certifier for the producer's specific state.
    // This now also checks jurisdictionType for added robustness.
    let certifier = users.find(u =>
        u.role === Role.Certifier &&
        u.jurisdictionType === 'State' &&
        u.jurisdictionName &&
        u.jurisdictionName.trim().toLowerCase() === normalizedProducerLocation
    );

    // If no state-specific certifier is found, fall back to the national certifier.
    if (!certifier) {
        console.warn(`No state-specific certifier found for "${producer.location}". Falling back to national certifier.`);
        certifier = users.find(u =>
            u.role === Role.Certifier &&
            u.jurisdictionType === 'Country' &&
            u.jurisdictionName &&
            u.jurisdictionName.trim().toLowerCase() === 'india'
        );
    }

    // If still no certifier is found, throw a clear error.
    if (!certifier) {
        throw new Error(`No certifier could be found for the location "${producer.location}" or for the country (India). Please ensure certifier accounts are seeded correctly.`);
    }
    // --- End of Refactored Logic ---

    const signaturePayload = JSON.stringify({ ...productionData, producerId, timestamp: Date.now() });
    const producerSignature = await simpleHash(signaturePayload);
    const productionDataHash = await simpleHash(JSON.stringify(productionData));

    const batch = writeBatch(db);

    const creditRef = doc(collection(db, 'credits'));
    const issueTimestamp = Date.now();
    const twoYearsInMillis = 2 * 365 * 24 * 60 * 60 * 1000;

    const newCreditData: Omit<Credit, 'id'> = {
      producerId,
      ownerId: producerId,
      certifierId: certifier.id,
      productionDataHash,
      producerSignature,
      issueTimestamp,
      expiryTimestamp: issueTimestamp + twoYearsInMillis, // Set expiry date 2 years from now
      volume,
      price,
      status: CreditStatus.AWAITING_CERTIFICATION,
      location: productionData.location,
      energySource: productionData.energySource,
    };
    batch.set(creditRef, newCreditData);
    
    const transactionRef = doc(collection(db, 'transactions'));
    const newTransactionData = {
        creditId: creditRef.id,
        type: TransactionType.ISSUE,
        fromId: null,
        toId: producerId,
        timestamp: newCreditData.issueTimestamp,
        notes: `Issuance submitted for ${volume}kg. Auto-routed to ${certifier.name} for approval.`,
        signature: producerSignature,
    };
    batch.set(transactionRef, newTransactionData);

    await batch.commit();
    return { id: creditRef.id };
  };

  const buyCredit = async (creditId: string, buyerId: string) => {
    const credit = credits.find(c => c.id === creditId);
    if (!credit || credit.status !== CreditStatus.AVAILABLE) throw new Error("Credit not available for purchase.");
    
    const buyer = getUserById(buyerId);
    const seller = getUserById(credit.ownerId);
    if (!buyer || !seller) throw new Error("Invalid buyer or seller.");
    
    const batch = writeBatch(db);

    const creditRef = doc(db, 'credits', creditId);
    batch.update(creditRef, { ownerId: buyerId });

    const transactionRef = doc(collection(db, 'transactions'));
    const newTransactionData = {
      creditId,
      type: TransactionType.TRANSFER,
      fromId: seller.id,
      toId: buyerId,
      timestamp: Date.now(),
      notes: `Transfer from ${seller.name} to ${buyer.name}.`
    };
    batch.set(transactionRef, newTransactionData);

    await batch.commit();
  };

  const retireCredit = async (creditId: string, consumerId: string, purpose: string) => {
    const credit = credits.find(c => c.id === creditId && c.ownerId === consumerId);
    if (!credit || credit.status === CreditStatus.RETIRED || credit.status === CreditStatus.EXPIRED) {
      throw new Error("Credit cannot be retired.");
    }

    const consumer = getUserById(consumerId);
    if (!consumer) throw new Error("Invalid consumer.");

    const batch = writeBatch(db);

    const creditRef = doc(db, 'credits', creditId);
    batch.update(creditRef, { status: CreditStatus.RETIRED });

    const transactionRef = doc(collection(db, 'transactions'));
    const newTransactionData = {
        creditId,
        type: TransactionType.RETIRE,
        fromId: consumerId,
        toId: consumerId,
        timestamp: Date.now(),
        notes: `Retired by ${consumer.name} for purpose: ${purpose}.`
    };
    batch.set(transactionRef, newTransactionData);

    await batch.commit();
  };
  
  const approveCredit = async (creditId: string, certifierId: string) => {
    const credit = credits.find(c => c.id === creditId);
    if (!credit || credit.certifierId !== certifierId || credit.status !== CreditStatus.AWAITING_CERTIFICATION) {
        throw new Error("Credit cannot be approved.");
    }

    const certifier = getUserById(certifierId);
    if (!certifier) throw new Error("Invalid certifier.");

    const signaturePayload = JSON.stringify({ creditId, certifierId, action: 'APPROVE', timestamp: Date.now() });
    const certifierSignature = await simpleHash(signaturePayload);

    const batch = writeBatch(db);

    const creditRef = doc(db, 'credits', creditId);
    batch.update(creditRef, { status: CreditStatus.AVAILABLE });
    
    const transactionRef = doc(collection(db, 'transactions'));
    const newTransactionData = {
        creditId,
        type: TransactionType.CERTIFY,
        fromId: certifierId,
        toId: credit.producerId,
        timestamp: Date.now(),
        notes: `Credit approved by ${certifier.name}. Now available on the marketplace.`,
        signature: certifierSignature,
    };
    batch.set(transactionRef, newTransactionData);
    
    await batch.commit();
  };

  const rejectCredit = async (creditId: string, certifierId: string, reason: string) => {
    const credit = credits.find(c => c.id === creditId);
    if (!credit || credit.certifierId !== certifierId || credit.status !== CreditStatus.AWAITING_CERTIFICATION) {
        throw new Error("Credit cannot be rejected.");
    }
    
    const certifier = getUserById(certifierId);
    if (!certifier) throw new Error("Invalid certifier.");

    const signaturePayload = JSON.stringify({ creditId, certifierId, reason, action: 'REJECT', timestamp: Date.now() });
    const certifierSignature = await simpleHash(signaturePayload);

    const batch = writeBatch(db);
    
    const creditRef = doc(db, 'credits', creditId);
    batch.update(creditRef, { status: CreditStatus.REJECTED });

    const transactionRef = doc(collection(db, 'transactions'));
    const newTransactionData = {
        creditId,
        type: TransactionType.REJECT,
        fromId: certifierId,
        toId: credit.producerId,
        timestamp: Date.now(),
        notes: `Credit rejected by ${certifier.name}. Reason: ${reason}`,
        signature: certifierSignature,
    };
    batch.set(transactionRef, newTransactionData);

    await batch.commit();
  };
  
  const getAuditTrail = (creditId: string): Transaction[] => {
    return transactions.filter(t => t.creditId === creditId).sort((a, b) => a.timestamp - b.timestamp);
  };

  return (
    <BlockchainContext.Provider value={{ users, credits, transactions, issueCredit, buyCredit, retireCredit, approveCredit, rejectCredit, getAuditTrail, getUserById, isLoading }}>
      {children}
    </BlockchainContext.Provider>
  );
};
