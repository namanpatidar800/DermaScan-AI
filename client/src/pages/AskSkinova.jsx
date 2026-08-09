import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AskSkinova = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', text: "Hello. I am SKINOVA's AI guide. I cannot diagnose skin conditions, but I can help you understand how SKINOVA works, explain basic dermatological concepts, or guide you through your tracking journey. What's on your mind?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const hasInitialized = useRef(false);
    const location = useLocation();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (location.state?.initialMsg && messages.length === 1 && !hasInitialized.current) {
            hasInitialized.current = true;
            const initial = location.state.initialMsg;
            setMessages(prev => [...prev, { role: 'user', text: initial }]);
            setIsLoading(true);

            fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: initial, conversationHistory: [] })
            })
                .then(r => r.json())
                .then(data => {
                    if (data.error) {
                        setMessages(prev => [...prev, { role: 'assistant', text: `API Request Failed: ${data.error}` }]);
                    } else {
                        setMessages(prev => [...prev, { role: 'assistant', text: data.response }]);
                    }
                })
                .catch(() => {
                    setMessages(prev => [...prev, { role: 'assistant', text: 'I am experiencing technical difficulties.' }]);
                })
                .finally(() => {
                    setIsLoading(false);
                    window.history.replaceState({}, document.title)
                });
        }
    }, [location.state]);

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

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || 'Chat API failed');
            }

            const data = await res.json();
            setMessages(prev => [...prev, { role: 'assistant', text: data.response }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', text: err.message || 'I am currently experiencing technical difficulties. Please try again later.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-skinova-white border text-center border-skinova-olive/20 rounded-3xl p-6 mb-6 shadow-sm">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-skinova-bg text-skinova-coral mb-3 border border-skinova-olive/20">
                    <Sparkles className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-light text-skinova-dark tracking-tight mb-2">Ask SKINOVA</h1>
                <p className="text-skinova-olive text-sm max-w-xl mx-auto">
                    Your secure, private guide to understanding skin health and navigating the SKINOVA platform.
                </p>
                <div className="flex flex-wrap justify-center gap-3 mt-4 text-xs font-semibold">
                    <span className="bg-skinova-bg text-skinova-dark px-3 py-1 rounded-full border border-skinova-olive/10 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-skinova-coral" /> No Medical Diagnosis</span>
                    <span className="bg-skinova-bg text-skinova-dark px-3 py-1 rounded-full border border-skinova-olive/10 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-skinova-coral" /> Educational Only</span>
                </div>
            </div>

            <div className="bg-skinova-white rounded-3xl shadow-xl border border-skinova-olive/20 overflow-hidden flex flex-col h-[600px] mb-6">
                {/* Chat area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-skinova-bg">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'assistant' && (
                                <div className="w-8 h-8 rounded-full bg-skinova-dark flex items-center justify-center flex-shrink-0 border border-skinova-olive/20 shadow-sm mt-1">
                                    <Bot className="w-4 h-4 text-skinova-white" />
                                </div>
                            )}
                            <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 shadow-sm text-[15px] leading-relaxed ${msg.role === 'user'
                                ? 'bg-skinova-coral text-white rounded-tr-sm font-medium'
                                : 'bg-skinova-white border border-skinova-olive/20 text-skinova-dark rounded-tl-sm'
                                }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-3 justify-start">
                            <div className="w-8 h-8 rounded-full bg-skinova-dark flex items-center justify-center flex-shrink-0 border border-skinova-olive/20 shadow-sm">
                                <Bot className="w-4 h-4 text-skinova-white" />
                            </div>
                            <div className="bg-skinova-white border border-skinova-olive/20 rounded-2xl px-5 py-3.5 rounded-tl-sm shadow-sm flex items-center gap-2">
                                <Loader2 className="w-4 h-4 text-skinova-coral animate-spin" />
                                <span className="text-sm font-medium text-skinova-olive">Checking parameters...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input area */}
                <div className="bg-skinova-white p-4 border-t border-skinova-olive/20">
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
                            className="w-full bg-skinova-bg border border-skinova-olive/20 rounded-2xl pl-5 pr-14 py-4 text-skinova-dark focus:outline-none focus:ring-1 focus:ring-skinova-coral focus:border-skinova-coral resize-none min-h-[56px] max-h-32 transition-all"
                            rows={1}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 bottom-2 w-10 h-10 bg-skinova-dark hover:bg-skinova-olive disabled:bg-skinova-olive/30 text-white rounded-xl flex items-center justify-center transition-colors shadow-sm"
                        >
                            <Send className="w-4 h-4 translate-x-[-1px] translate-y-[1px]" />
                        </button>
                    </form>
                    <p className="text-center text-[10px] text-skinova-olive font-medium mt-3 uppercase tracking-wider">
                        SKINOVA Assistant can make mistakes. Always verify medical information.
                    </p>
                </div>
            </div>

            <div className="text-center">
                <Link to="/analysis/new" className="inline-block bg-skinova-olive text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-skinova-dark transition-colors uppercase tracking-wide text-xs">
                    Take a Visual Scan Instead
                </Link>
            </div>
        </div>
    );
};

export default AskSkinova;
