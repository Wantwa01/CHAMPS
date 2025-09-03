import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon';

interface CustomerSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  translations: any;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'receptionist' | 'bot';
  timestamp: Date;
  isTyping?: boolean;
}

interface FacebookPageData {
  id: string;
  name: string;
  posts: Array<{
    id: string;
    message: string;
    created_time: string;
  }>;
  events: Array<{
    id: string;
    name: string;
    start_time: string;
    description: string;
  }>;
}

const CustomerSupportModal: React.FC<CustomerSupportModalProps> = ({ isOpen, onClose, translations }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isReceptionistOnline, setIsReceptionistOnline] = useState(false);
  const [facebookData, setFacebookData] = useState<FacebookPageData | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if it's business hours (8 AM - 6 PM, Monday-Friday)
  const isBusinessHours = () => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const hour = now.getHours();
    
    // Monday to Friday (1-5), 8 AM to 6 PM
    return day >= 1 && day <= 5 && hour >= 8 && hour < 18;
  };

  // Mock Facebook page data
  const mockFacebookData: FacebookPageData = {
    id: 'wezi-medical-centre',
    name: 'Wezi Medical Centre',
    posts: [
      {
        id: '1',
        message: 'We are now offering telemedicine consultations. Book your appointment online!',
        created_time: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        message: 'Free health screening this Saturday from 9 AM to 1 PM. All are welcome!',
        created_time: '2024-01-14T14:30:00Z'
      },
      {
        id: '3',
        message: 'Our new cardiology department is now open. Dr. Sarah Johnson is accepting new patients.',
        created_time: '2024-01-13T09:15:00Z'
      }
    ],
    events: [
      {
        id: '1',
        name: 'Free Health Screening',
        start_time: '2024-01-20T09:00:00Z',
        description: 'Free health screening for blood pressure, diabetes, and general health checkup.'
      },
      {
        id: '2',
        name: 'Maternal Health Workshop',
        start_time: '2024-01-25T14:00:00Z',
        description: 'Educational workshop for expecting mothers and new parents.'
      }
    ]
  };

  useEffect(() => {
    if (isOpen) {
      setIsReceptionistOnline(isBusinessHours());
      setFacebookData(mockFacebookData);
      
      // Add welcome message
      const welcomeMessage: Message = {
        id: '1',
        text: isBusinessHours() 
          ? 'Hello! I\'m a receptionist at Wezi Medical Centre. I can help you find your way around and direct you to the right staff members. What department or service are you looking for?'
          : 'Hello! I\'m the Wezi Medical Centre AI navigation assistant. I can help you find directions to different departments and guide you to the right staff members. What can I help you locate?',
        sender: isBusinessHours() ? 'receptionist' : 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Navigation and directions focused responses
    if (message.includes('emergency') || message.includes('urgent') || message.includes('accident')) {
      return '🚨 EMERGENCY DEPARTMENT: Go straight to the Emergency Department on the ground floor, entrance A. Look for the red "EMERGENCY" sign. Staff will assist you immediately.';
    }
    
    if (message.includes('reception') || message.includes('front desk') || message.includes('check in')) {
      return '🏥 MAIN RECEPTION: The main reception desk is located at the entrance on the ground floor. Staff there can help you check in, get directions, and answer general questions.';
    }
    
    if (message.includes('cardiology') || message.includes('heart') || message.includes('chest pain')) {
      return '❤️ CARDIOLOGY DEPARTMENT: Located on the 2nd floor, take the main elevator or stairs. Look for the blue "CARDIOLOGY" sign. Dr. Sarah Johnson is the head cardiologist.';
    }
    
    if (message.includes('pediatrics') || message.includes('children') || message.includes('baby') || message.includes('child')) {
      return '👶 PEDIATRICS DEPARTMENT: Located on the 1st floor, take the main elevator or stairs. Look for the green "PEDIATRICS" sign with child-friendly decorations. Dr. Michael Brown is the head pediatrician.';
    }
    
    if (message.includes('gynecology') || message.includes('obstetrics') || message.includes('pregnancy') || message.includes('women')) {
      return '👩‍⚕️ GYNECOLOGY & OBSTETRICS: Located on the 2nd floor, take the main elevator or stairs. Look for the pink "GYNECOLOGY" sign. Dr. Emily Davis is the head gynecologist.';
    }
    
    if (message.includes('general medicine') || message.includes('family doctor') || message.includes('consultation')) {
      return '🏥 GENERAL MEDICINE: Located on the 1st floor, take the main elevator or stairs. Look for the white "GENERAL MEDICINE" sign. Multiple doctors available for consultations.';
    }
    
    if (message.includes('pharmacy') || message.includes('medicine') || message.includes('prescription')) {
      return '💊 PHARMACY: Located on the ground floor, next to the main reception. Look for the green "PHARMACY" sign. Our pharmacists can help with medication questions.';
    }
    
    if (message.includes('laboratory') || message.includes('lab') || message.includes('blood test') || message.includes('urine test')) {
      return '🔬 LABORATORY: Located on the ground floor, follow the yellow "LABORATORY" signs. Blood tests, urine tests, and other diagnostic services available.';
    }
    
    if (message.includes('radiology') || message.includes('x-ray') || message.includes('scan') || message.includes('imaging')) {
      return '📷 RADIOLOGY & IMAGING: Located in the basement, take the elevator marked "RADIOLOGY" or use the stairs. X-rays, CT scans, and MRI services available.';
    }
    
    if (message.includes('theater') || message.includes('surgery') || message.includes('operation')) {
      return '⚕️ OPERATING THEATER: Located on the 3rd floor, take the main elevator. Look for the red "OPERATING THEATER" sign. Only accessible to patients with scheduled procedures.';
    }
    
    if (message.includes('waiting area') || message.includes('waiting room') || message.includes('sit')) {
      return '🪑 WAITING AREAS: Comfortable waiting areas are located near each department. The main waiting area is on the ground floor with refreshments and TV.';
    }
    
    if (message.includes('bathroom') || message.includes('toilet') || message.includes('restroom')) {
      return '🚻 RESTROOMS: Located on each floor. Ground floor: near reception. 1st floor: near general medicine. 2nd floor: near cardiology and gynecology.';
    }
    
    if (message.includes('parking') || message.includes('car') || message.includes('vehicle')) {
      return '🚗 PARKING: Free parking available in front of the building. Disabled parking spaces are marked near the main entrance. Security guards can assist with parking.';
    }
    
    if (message.includes('elevator') || message.includes('stairs') || message.includes('lift')) {
      return '🛗 ACCESS: Main elevator and stairs are located in the center of the building. Elevator goes to all floors. Stairs are available for those who prefer walking.';
    }
    
    if (message.includes('staff') || message.includes('doctor') || message.includes('nurse')) {
      return '👨‍⚕️ STAFF DIRECTORY: All medical staff wear identification badges. Reception staff can help you locate specific doctors or nurses. Emergency staff wear red uniforms.';
    }
    
    if (message.includes('lost') || message.includes('confused') || message.includes('where') || message.includes('direction')) {
      return '🤔 LOST? Don\'t worry! Our reception staff at the main desk (ground floor entrance) are here to help. They can provide maps, directions, and escort you to the right department.';
    }
    
    // Default navigation response
    return 'I\'m here to help you navigate Wezi Medical Centre! I can direct you to specific departments, help you find staff members, or guide you to services. What department or service are you looking for?';
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate response delay
    setTimeout(() => {
      let responseText: string;
      let sender: 'receptionist' | 'bot';

      if (isReceptionistOnline) {
        // Receptionist responses (more personalized)
        responseText = `Thank you for your message. ${getBotResponse(newMessage)} If you need further assistance, please don't hesitate to ask.`;
        sender = 'receptionist';
      } else {
        // Bot responses
        responseText = getBotResponse(newMessage);
        sender = 'bot';
      }

      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, responseMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col relative">
        {/* Close button in top-right corner */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
        >
          <Icon name="XIcon" className="h-5 w-5" />
        </button>
        
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 pr-12">
              Navigation Assistant
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {isReceptionistOnline ? 'Receptionist is online to help with directions' : 'AI assistant available 24/7 for navigation help'}
            </p>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : message.sender === 'receptionist'
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-900 dark:text-green-100 rounded-bl-none'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-bl-none'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg rounded-bl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700">
          <div className="flex space-x-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isTyping}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Icon name="PaperAirplaneIcon" className="h-5 w-5" />
            </button>
          </div>
          
          {/* Quick Actions */}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => setNewMessage('Where is the emergency department?')}
              className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Emergency
            </button>
            <button
              onClick={() => setNewMessage('Where is the reception desk?')}
              className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Reception
            </button>
            <button
              onClick={() => setNewMessage('Where is the cardiology department?')}
              className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Cardiology
            </button>
            <button
              onClick={() => setNewMessage('Where is the pharmacy?')}
              className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Pharmacy
            </button>
            <button
              onClick={() => setNewMessage('I am lost, where should I go?')}
              className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              I'm Lost
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupportModal;
