import { GoogleGenAI } from "@google/genai";
import { Transaction, User, Credit, Role } from '../types';

// Initialize GoogleGenAI with API key from environment variables
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
let model = 'gemini-2.5-flash';

// Only initialize if API key is available
if (apiKey && apiKey !== 'your_gemini_api_key_here' && apiKey.trim() !== '') {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (error) {
    console.warn('Failed to initialize Gemini AI:', error);
  }
}

const generateReport = async (systemInstruction: string, prompt: string): Promise<string> => {
    // Check if Gemini AI is properly initialized
    if (!ai) {
        return `⚠️ **Gemini AI Not Configured**
        
To use AI-powered reports, you need to:

1. **Get a Gemini API Key** from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. **Create a .env.local file** in your project root with:
   VITE_GEMINI_API_KEY=your_actual_api_key_here
3. **Restart the development server**

For now, here's a basic summary of your data:
- **System Status**: Operational
- **AI Features**: Temporarily disabled
- **Manual Review**: Please review the data manually`;
    }

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                systemInstruction
            }
        });
        
        if (!response.text) {
            throw new Error('No response text received from Gemini API');
        }
        
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        
        // Provide more specific error messages
        if (error instanceof Error) {
            if (error.message.includes('API_KEY')) {
                return '🔑 **API Key Error**: Please check your Gemini API key configuration.';
            } else if (error.message.includes('quota')) {
                return '📊 **API Quota Exceeded**: Please check your Gemini API usage limits.';
            } else if (error.message.includes('network')) {
                return '🌐 **Network Error**: Please check your internet connection and try again.';
            }
        }
        
        return `❌ **AI Report Generation Failed**
        
Error: ${error instanceof Error ? error.message : "Unknown error"}

**Troubleshooting:**
- Check your API key is correct
- Verify your internet connection
- Check the browser console for details
- Contact support if the issue persists`;
    }
}

export const generateComplianceReport = async (
  query: string, 
  transactions: Transaction[],
  credits: Credit[],
  users: User[]
): Promise<string> => {
  const systemInstruction = `You are a compliance audit assistant for a Green Hydrogen Credit System called Hydro-Cred.
Your task is to analyze the provided JSON data (transactions, credits, users) and answer the user's query in a clear, concise, and professional manner.
Provide answers in markdown format. When mentioning specific IDs (users, credits, transactions), always include their associated names or key details for readability.
Do not invent data. Base all your answers strictly on the JSON provided.
If the data is insufficient to answer the query, state that clearly.`;

  const prompt = `
    Here is the current state of the Hydro-Cred system:
    **Users:** ${JSON.stringify(users, null, 2)}
    **Credits:** ${JSON.stringify(credits, null, 2)}
    **Transactions:** ${JSON.stringify(transactions, null, 2)}
    ---
    **User's Query:** "${query}"
    Please analyze the data and provide a response.
  `;

  return generateReport(systemInstruction, prompt);
};


export const generateProducerReport = async (
  producer: User,
  allTransactions: Transaction[],
  allCredits: Credit[],
): Promise<string> => {
  if (producer.role !== Role.Producer) return "Error: User is not a Producer.";
  
  const systemInstruction = `You are an AI performance analyst for a green hydrogen producer on the Hydro-Cred platform.
Your task is to provide a concise, insightful summary of the producer's activity based on the provided JSON data.
Use markdown for formatting. Focus on key metrics like volume issued, sales status, and certification times.
Address the producer directly (e.g., "Your performance summary...").`;
  
  const producerCredits = allCredits.filter(c => c.producerId === producer.id);
  const creditIds = producerCredits.map(c => c.id);
  const producerTransactions = allTransactions.filter(t => creditIds.includes(t.creditId));

  const prompt = `
    **Producer:** ${JSON.stringify(producer, null, 2)}
    **Their Credits:** ${JSON.stringify(producerCredits, null, 2)}
    **Their Transactions:** ${JSON.stringify(producerTransactions, null, 2)}
    ---
    **Request:** "Please generate a brief performance report for me."
    Analyze the data and provide a summary of total volume, credit statuses (pending, available, sold, retired), and total value of available credits.
  `;

  return generateReport(systemInstruction, prompt);
};

export const generateConsumerReport = async (
  consumer: User,
  allTransactions: Transaction[],
  allCredits: Credit[],
): Promise<string> => {
  if (consumer.role !== Role.Consumer) return "Error: User is not a Consumer.";

  const systemInstruction = `You are an AI ESG reporting assistant for a company using the Hydro-Cred platform.
Your task is to generate a summary of the company's green hydrogen credit activity for their Environmental, Social, and Governance (ESG) reports.
Use professional, clear language and markdown formatting. Focus on quantifiable impact (credits purchased, retired) and total investment.
Address the consumer directly.`;

  const consumerCredits = allCredits.filter(c => c.ownerId === consumer.id);
  // Fix: Cleaned up unused variables.
  const consumerTransactions = allTransactions.filter(t => t.toId === consumer.id || t.fromId === consumer.id);

  const prompt = `
    **Consumer/Company:** ${JSON.stringify(consumer, null, 2)}
    **Their Owned/Retired Credits:** ${JSON.stringify(consumerCredits, null, 2)}
    **Their Transactions:** ${JSON.stringify(consumerTransactions, null, 2)}
    ---
    **Request:** "Please generate a summary of our green hydrogen credit portfolio for our ESG report."
    Analyze the data and summarize total credits purchased, total credits retired, and total USD spent. Provide a short narrative paragraph about their commitment.
  `;

  return generateReport(systemInstruction, prompt);
};


export const generateCertifierReport = async (
  certifier: User,
  allTransactions: Transaction[],
  allCredits: Credit[],
): Promise<string> => {
   if (certifier.role !== Role.Certifier) return "Error: User is not a Certifier.";

  const systemInstruction = `You are an AI audit assistant for a certifying authority on the Hydro-Cred platform.
Your task is to provide an efficiency and activity report based on the certifier's actions.
Use markdown for formatting. Focus on the number of credits reviewed, approval/rejection rates, and assigned producers.
Address the certifier directly.`;

  const assignedCredits = allCredits.filter(c => c.certifierId === certifier.id);
  const creditIds = assignedCredits.map(c => c.id);
  const relatedTransactions = allTransactions.filter(t => creditIds.includes(t.creditId) && (t.type === 'CERTIFY' || t.type === 'REJECT'));

  const prompt = `
    **Certifier:** ${JSON.stringify(certifier, null, 2)}
    **Credits Assigned to Them:** ${JSON.stringify(assignedCredits, null, 2)}
    **Their Certification Transactions:** ${JSON.stringify(relatedTransactions, null, 2)}
    ---
    **Request:** "Please generate a summary of my recent certification activity."
    Analyze the data and report on the total number of credits reviewed (approved + rejected), the approval rate, and list the producers they have certified for.
  `;
  
  return generateReport(systemInstruction, prompt);
};
