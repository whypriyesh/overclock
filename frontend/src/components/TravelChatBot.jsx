import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, MapPin, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { tripApi } from '../lib/api'

export function TravelChatBot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "⚡ I'm TripIt! Planning a trip? Details, budgets, itineraries - ask me!" }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async () => {
        if (!input.trim() || loading) return

        const userMsg = input
        setInput('')
        setMessages(prev => [...prev, { role: 'user', content: userMsg }])
        setLoading(true)

        try {
            // Use backend API instead of direct Groq call
            const data = await tripApi.chat(userMsg)
            setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
        } catch (error) {
            console.error('Chat error:', error)
            // Fallback response when backend is unavailable
            const fallbackResponses = [
                "I'd recommend exploring Goa for beaches, Manali for mountains, or Jaipur for heritage!",
                "For budget trips, check out Rishikesh - affordable with great adventure sports!",
                "Kerala's backwaters are perfect for relaxation. Best time: October to March!",
                "Try our AI Trip Planner for personalized recommendations!"
            ]
            const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
            setMessages(prev => [...prev, { role: 'assistant', content: randomResponse }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {/* Floating Toggle Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-white text-black shadow-2xl flex items-center gap-2 group"
                >
                    <MessageCircle className="w-6 h-6" />
                    <span className="font-bold pr-2 hidden group-hover:block whitespace-nowrap overflow-hidden transition-all">
                        Ask TripIt
                    </span>
                </motion.button>
            )}

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-6 right-6 z-50 w-[450px] h-[600px] bg-black border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center backdrop-blur-md">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-white" />
                                <span className="font-bold text-white tracking-wide">TripIt Assistant</span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-white text-black rounded-tr-sm font-medium'
                                            : 'bg-white/10 text-white rounded-tl-sm border border-white/5 [&_h3]:font-bold [&_h3]:text-lg [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:mb-2 [&_li]:mb-1 [&_table]:w-full [&_table]:border-collapse [&_table]:mb-2 [&_th]:border [&_th]:border-white/20 [&_th]:p-2 [&_th]:bg-white/10 [&_td]:border [&_td]:border-white/20 [&_td]:p-2'
                                            }`}
                                    >
                                        <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1">
                                        <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0s' }} />
                                        <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0.2s' }} />
                                        <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0.4s' }} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-white/10 bg-black/50 backdrop-blur-sm">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask about trips..."
                                    className="w-full bg-white/10 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 text-sm"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={loading || !input.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white disabled:opacity-50 transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
