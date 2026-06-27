// import { useState } from 'react';
// import { X, Send, MessageCircle, Bot } from 'lucide-react';
// import { toast } from 'sonner';
// import Button from '../../ui/Button';
// import Input from '../../ui/Input';

// const initialMessages = [
//   {
//     id: 1,
//     sender: 'bot' as const,
//     text: 'Hello! I\'m the ServEase assistant. How can I help you today?',
//     time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//   },
// ];

// const quickReplies = [
//   'How do I book a service?',
//   'What services are available?',
//   'How do I contact a provider?',
//   'What are your service fees?',
// ];

// export default function ChatbotDrawer() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState(initialMessages);
//   const [inputMessage, setInputMessage] = useState('');

//   const handleSendMessage = (text?: string) => {
//     const messageText = text || inputMessage;
//     if (!messageText.trim()) return;

//     const userMessage = {
//       id: messages.length + 1,
//       sender: 'user' as const,
//       text: messageText,
//       time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//     };

//     setMessages([...messages, userMessage]);
//     setInputMessage('');

//     setTimeout(() => {
//       const botMessage = {
//         id: messages.length + 2,
//         sender: 'bot' as const,
//         text: getBotResponse(messageText),
//         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//       };
//       setMessages((prev) => [...prev, botMessage]);
//     }, 1000);
//   };

//   const getBotResponse = (userMessage: string): string => {
//     const lowerMessage = userMessage.toLowerCase();

//     if (lowerMessage.includes('book') || lowerMessage.includes('service')) {
//       return 'To book a service, go to the Services page, browse providers, and click "Request Service" on any provider\'s card. You can then fill in your requirements and submit!';
//     }
//     if (lowerMessage.includes('available') || lowerMessage.includes('what')) {
//       return 'We offer various home services including: Electrician, Plumber, Carpenter, Painter, Cleaning, AC Technician, Mechanic, and Internet Technician services.';
//     }
//     if (lowerMessage.includes('contact') || lowerMessage.includes('provider')) {
//       return 'You can contact providers through the platform after your service request is accepted. Provider contact information will be available in your request details.';
//     }
//     if (lowerMessage.includes('fee') || lowerMessage.includes('cost') || lowerMessage.includes('price')) {
//       return 'Service fees vary by provider and service type. Each provider sets their own rates. You\'ll receive a price quote when a provider accepts your request.';
//     }

//     return 'Thank you for your question! For more specific help, please contact our support team at support@servease.com or call us at +1 (555) 123-4567.';
//   };

//   const handleQuickReply = (reply: string) => {
//     handleSendMessage(reply);
//   };

//   return (
//     <>
//       <button
//         onClick={() => setIsOpen(true)}
//         className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform z-40"
//       >
//         <MessageCircle className="w-6 h-6" />
//       </button>

//       {isOpen && (
//         <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col transition-transform">
//           <div className="bg-gradient-to-r from-primary to-accent text-white p-4 flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
//                 <Bot className="w-6 h-6" />
//               </div>
//               <div>
//                 <h3 className="font-semibold">ServEase Assistant</h3>
//                 <p className="text-sm text-white/80">Online</p>
//               </div>
//             </div>
//             <button
//               onClick={() => setIsOpen(false)}
//               className="p-2 hover:bg-white/10 rounded-lg transition-colors"
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>

//           <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
//             {messages.map((message) => (
//               <div
//                 key={message.id}
//                 className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//               >
//                 <div
//                   className={`max-w-[80%] rounded-2xl px-4 py-3 ${
//                     message.sender === 'user'
//                       ? 'bg-primary text-white'
//                       : 'bg-white border border-border'
//                   }`}
//                 >
//                   <p className="text-sm">{message.text}</p>
//                   <p
//                     className={`text-xs mt-1 ${
//                       message.sender === 'user' ? 'text-white/70' : 'text-muted-foreground'
//                     }`}
//                   >
//                     {message.time}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {messages.length === 1 && (
//             <div className="p-4 border-t border-border">
//               <p className="text-sm text-muted-foreground mb-3">Quick questions:</p>
//               <div className="flex flex-wrap gap-2">
//                 {quickReplies.map((reply, index) => (
//                   <button
//                     key={index}
//                     onClick={() => handleQuickReply(reply)}
//                     className="px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 rounded-full transition-colors"
//                   >
//                     {reply}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           <div className="p-4 border-t border-border bg-white">
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleSendMessage();
//               }}
//               className="flex gap-2"
//             >
//               <input
//                 type="text"
//                 value={inputMessage}
//                 onChange={(e) => setInputMessage(e.target.value)}
//                 placeholder="Type your message..."
//                 className="flex-1 px-4 py-3 rounded-xl border-2 border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring transition-all"
//               />
//               <Button type="submit" size="sm" className="px-4">
//                 <Send className="w-5 h-5" />
//               </Button>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }


import { useEffect, useRef, useState } from 'react';
import { X, Send, MessageCircle, Bot, Wrench } from 'lucide-react';
import { useChat } from './useChat';
import { disconnectChatSocket } from './chatSocket';
// ─── Quick replies per role ───────────────────────────────────────────────────

const CUSTOMER_QUICK_REPLIES = [
  'How do I book a service?',
  'How do I cancel a booking?',
  'How do I contact my provider?',
  'What are the service fees?',
];

const PROVIDER_QUICK_REPLIES = [
  'How do I accept a job request?',
  'How do I update my availability?',
  'When do I get paid?',
  'How do I update my profile?',
];

// ─── Greeting per role ────────────────────────────────────────────────────────

const CUSTOMER_GREETING = "Hi! I'm the ServEase assistant. How can I help you with your bookings today?";
const PROVIDER_GREETING = "Hi! I'm the ServEase assistant. How can I help you manage your jobs and account?";

// ─── Props ────────────────────────────────────────────────────────────────────

interface ChatbotDrawerProps {
  token: string;
  role: 'customer' | 'provider';
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ChatbotDrawer({ token, role }: ChatbotDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, loading, error } = useChat(token);

  const isProvider = role === 'provider';
  const quickReplies = isProvider ? PROVIDER_QUICK_REPLIES : CUSTOMER_QUICK_REPLIES;
  const greeting = isProvider ? PROVIDER_GREETING : CUSTOMER_GREETING;
  const accentColor = isProvider ? 'from-purple-600 to-indigo-600' : 'from-primary to-accent';
  const bubbleColor = isProvider ? 'bg-purple-600' : 'bg-primary';
  const FloatIcon = isProvider ? Wrench : MessageCircle;

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Disconnect socket on unmount / logout
  useEffect(() => {
    return () => {
      if (!isOpen) disconnectChatSocket();
    };
  }, []);

  const handleSend = (text?: string) => {
    const msg = text ?? input;
    if (!msg.trim()) return;
    sendMessage(msg);
    setInput('');
  };

  const showQuickReplies = messages.length === 0 && !loading;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open chat assistant"
        className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br ${accentColor} rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform z-40`}
      >
        <FloatIcon className="w-6 h-6" />
      </button>

      {/* Drawer */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col">

          {/* Header */}
          <div className={`bg-gradient-to-r ${accentColor} text-white p-4 flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">ServEase Assistant</h3>
                <p className="text-sm text-white/80">
                  {isProvider ? 'Provider support' : 'Customer support'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
            {/* Greeting bubble */}
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-white border border-border">
                <p className="text-sm">{greeting}</p>
              </div>
            </div>

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    m.role === 'user'
                      ? `${bubbleColor} text-white`
                      : 'bg-white border border-border'
                  }`}
                >
                  <p className="text-sm">{m.text}</p>
                  {m.timestamp && (
                    <p className={`text-xs mt-1 ${m.role === 'user' ? 'text-white/70' : 'text-muted-foreground'}`}>
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-border rounded-2xl px-4 py-3">
                  <span className="text-muted-foreground text-sm">…</span>
                </div>
              </div>
            )}

            {/* Error banner */}
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">
                {error}
                <button
                  className="ml-2 underline text-xs"
                  onClick={() => handleSend(messages[messages.length - 1]?.text)}
                >
                  Retry
                </button>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          {showQuickReplies && (
            <div className="p-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(reply)}
                    className="px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 rounded-full transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-border bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                maxLength={2000}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 rounded-xl border-2 border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring transition-all text-sm"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className={`px-4 py-3 ${bubbleColor} text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-opacity`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      )}
    </>
  );
}