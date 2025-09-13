
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 p-8 rounded-lg">
      <h2 className="text-3xl font-bold text-slate-100 mb-4">About Hydro-Cred</h2>
      <div className="space-y-4 text-slate-400">
        <p>
          Hydro-Cred is a proof-of-concept platform designed to demonstrate a transparent, auditable, and immutable system for issuing, tracking, and retiring Green Hydrogen Credits. Our mission is to build trust and accelerate the adoption of green hydrogen by providing a reliable framework for environmental asset management.
        </p>
        <p>
          The system simulates a permissioned blockchain environment (like Hyperledger Fabric) to ensure privacy, high throughput, and controlled access for all stakeholders: Producers, Certifiers, Consumers, and Regulators. Each credit is treated like a unique digital asset (an NFT), preventing fraud and double-counting.
        </p>
        <h3 className="text-xl font-semibold text-slate-200 pt-4">Core Principles</h3>
        <ul className="list-disc list-inside space-y-2 marker:text-cyan-400">
            <li><strong>Transparency:</strong> All transactions are recorded on an immutable ledger, accessible to authorized parties.</li>
            <li><strong>Auditability:</strong> Regulators have read-only access to the entire system, allowing for seamless compliance checks and reporting.</li>
            <li><strong>Integrity:</strong> A multi-step verification process involving producers and independent certifiers ensures that every credit is backed by verified green hydrogen production.</li>
            <li><strong>Security:</strong> By simulating a blockchain, we eliminate single points of failure and protect against unauthorized data tampering.</li>
        </ul>
        <p>
          This application was built to showcase the future of environmental, social, and governance (ESG) compliance and the power of decentralized technology in the green energy sector.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;