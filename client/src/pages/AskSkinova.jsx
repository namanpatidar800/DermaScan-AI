import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AskSkinova = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', text: "Hello. I am SKINOVA's AI guide. I cannot diagnose skin conditions, but I can help you understand how SKINOVA works, explain basic dermatological concepts, or guide you through your tracking journey. What's on your mind?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsLoading(true);

        try {
            const history = messages.map(m => ({ role: m.role, text: m.text }));
            const res = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg, conversationHistory: history.slice(-5) }) // Send last 5 for context
            });

            if (!res.ok) throw new Error('Chat API failed');

            const data = await res.json();
            setMessages(prev => [...prev, { role: 'assistant', text: data.response }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', text: 'I am currently experiencing technical difficulties. Please try again later.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white border text-center border-surface-200 rounded-3xl p-6 mb-6 shadow-sm">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-50 text-primary-600 mb-3 border border-primary-100">
                    <Sparkles className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold text-surface-900 mb-2">Ask SKINOVA</h1>
                <p className="text-surface-600 text-sm max-w-xl mx-auto">
                    Your secure, private guide to understanding skin health and navigating the SKINOVA platform.
                </p>
                <div className="flex flex-wrap justify-center gap-3 mt-4 text-xs font-medium">
                    <span className="bg-surface-100 text-surface-700 px-3 py-1 rounded-full border border-surface-200 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-primary-500" /> No Medical Diagnosis</span>
                    <span className="bg-surface-100 text-surface-700 px-3 py-1 rounded-full border border-surface-200 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-primary-500" /> Educational Only</span>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-surface-200 overflow-hidden flex flex-col h-[600px] mb-6">
                {/* Chat area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-surface-50">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'assistant' && (
                                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 border border-primary-200 shadow-sm mt-1">
                                    <Bot className="w-4 h-4 text-primary-700" />
                                </div>
                            )}
                            <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 shadow-sm text-[15px] leading-relaxed ${msg.role === 'user'
                                    ? 'bg-secondary-500 text-white rounded-tr-sm'
                                    : 'bg-white border border-surface-200 text-surface-800 rounded-tl-sm'
                                }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-3 justify-start">
                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 border border-primary-200 shadow-sm">
                                <Bot className="w-4 h-4 text-primary-700" />
                            </div>
                            <div className="bg-white border border-surface-200 rounded-2xl px-5 py-3.5 rounded-tl-sm shadow-sm flex items-center gap-2">
                                <Loader2 className="w-4 h-4 text-primary-500 animate-spin" />
                                <span className="text-sm font-medium text-surface-500">Checking parameters...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input area */}
                <div className="bg-white p-4 border-t border-surface-200">
                    <form onSubmit={handleSubmit} className="relative flex items-end">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                            placeholder="Type a question about skin conditions or SKINOVA..."
                            className="w-full bg-surface-50 border border-surface-200 rounded-2xl pl-5 pr-14 py-4 text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400 resize-none min-h-[56px] max-h-32 transition-all"
                            rows={1}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 bottom-2 w-10 h-10 bg-primary-500 hover:bg-primary-600 disabled:bg-surface-300 text-white rounded-xl flex items-center justify-center transition-colors shadow-sm"
                        >
                            <Send className="w-4 h-4 translate-x-[-1px] translate-y-[1px]" />
                        </button>
                    </form>
                    <p className="text-center text-[10px] text-surface-500 font-medium mt-3 uppercase tracking-wider">
                        SKINOVA Assistant can make mistakes. Always verify medical information.
                    </p>
                </div>
            </div>

            <div className="text-center">
                <Link to="/analysis/new" className="inline-block bg-surface-900 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-surface-800 transition-colors">
                    Take a Visual Scan Instead
                </Link>
            </div>
        </div>
    );
};

export default AskSkinova;
