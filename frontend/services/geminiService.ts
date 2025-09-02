import { GoogleGenAI, Chat } from "@google/genai";
import { Role, User } from '../types';

// --- MOCK USER DATABASE ---
const mockUsers: User[] = [
  { id: '1', name: 'Augustine Kasolota', email: 'patient@wezi.com', role: Role.PATIENT },
  { id: '2', name: 'Dr. Aureen Harazie', email: 'doctor@wezi.com', role: Role.DOCTOR },
  { id: '3', name: 'Emmanuel Sogolera', email: 'admin@wezi.com', role: Role.ADMIN },
  { id: '4', name: 'George Tembo', email: 'ambulance@wezi.com', role: Role.AMBULANCE },
];

// --- AUTHENTICATION SERVICE ---
export const authService = {
  login: (email: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (user) {
          resolve(user);
        } else {
          reject(new Error("Invalid credentials. Please try again."));
        }
      }, 500);
    });
  },
};


// --- GEMINI AI SERVICE ---
let chat: Chat | null = null;

const initializeChat = () => {
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set for AI Chat.");
    return;
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are a friendly and helpful AI assistant for Wezi Medical Centre. Your purpose is to answer patient questions about services, departments, and appointment booking. You should be empathetic and clear in your responses. Wezi Medical Centre has the following departments: Outpatient Department (OPD), In-Patient Department (Admissions), Emergency, Antenatal, Theatre, and a Pharmacy. We also offer ambulance services. Be concise and helpful.`,
    },
  });
};

export const sendMessageToAI = async (message: string): Promise<string> => {
  try {
    if (!chat) {
      initializeChat();
    }
    if (chat) {
        const response = await chat.sendMessage({ message });
        return response.text;
    }
    return "Chat service is not available right now. Please ensure the API key is configured.";
  } catch (error) {
    console.error("Error sending message to AI:", error);
    return "Sorry, I'm having trouble connecting right now. Please try again later.";
  }
};