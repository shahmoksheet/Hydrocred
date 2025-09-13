
import React from 'react';

const HelpPage: React.FC = () => {
  const faqs = [
    {
      q: 'What is the role of a Producer?',
      a: 'Producers are entities that generate green hydrogen. On this platform, they can register their production data (volume, energy source, etc.) to issue new Hydrogen Credits. These credits are then submitted to a Certifier for approval before they can be sold on the marketplace.'
    },
    {
      q: 'What is the role of a Consumer?',
      a: 'Consumers (or Buyers) purchase Green Hydrogen Credits from the marketplace to meet regulatory requirements or voluntary ESG goals. Once a credit is purchased, the Consumer owns it and has the exclusive right to "retire" it, which permanently removes it from circulation and generates a verifiable claim of environmental benefit.'
    },
    {
      q: 'What is the role of a Certifier?',
      a: 'Certifying Authorities are independent, trusted third parties. Their role is to review the production data submitted by Producers and verify its authenticity. Only after a Certifier approves a credit does it become "Available" for sale on the marketplace. This ensures the integrity of every credit.'
    },
    {
      q: 'What is the role of a Regulator?',
      a: 'Regulators are governmental or oversight bodies. They have read-only access to the entire transaction ledger. This allows them to audit the lifecycle of any credit, ensure compliance with environmental regulations, and prevent market fraud without being able to interfere with transactions.'
    },
    {
       q: 'What does it mean to "retire" a credit?',
       a: 'Retiring a credit is the final step in its lifecycle. It means the environmental benefit of that specific batch of green hydrogen has been claimed by the owner. This action is irreversible and prevents the credit from ever being sold or used again, which is the key mechanism to prevent double-counting.'
    }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 p-8 rounded-lg">
      <h2 className="text-3xl font-bold text-slate-100 mb-6">Help & FAQ</h2>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-slate-800 pb-4 last:border-b-0 last:pb-0">
            <h3 className="text-lg font-semibold text-slate-200">{faq.q}</h3>
            <p className="mt-2 text-slate-400">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpPage;