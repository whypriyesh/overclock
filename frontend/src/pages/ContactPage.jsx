import { motion } from 'framer-motion'
import { useState } from 'react'
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, CheckCircle } from 'lucide-react'

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
}

const stagger = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.1 }
    }
}

const contactInfo = [
    {
        icon: Mail,
        title: 'Email',
        value: 'hello@tripit.ai',
        link: 'mailto:hello@tripit.ai'
    },
    {
        icon: Phone,
        title: 'Phone',
        value: '+1 (555) 123-4567',
        link: 'tel:+15551234567'
    },
    {
        icon: MapPin,
        title: 'Office',
        value: 'San Francisco, CA',
        link: null
    },
    {
        icon: Clock,
        title: 'Hours',
        value: '24/7 AI Support',
        link: null
    }
]

const faqs = [
    {
        question: 'How does the AI trip planner work?',
        answer: 'Our AI analyzes your preferences, budget, and travel dates to create personalized itineraries. It considers weather, local events, and user reviews to recommend the best experiences.'
    },
    {
        question: 'Is my payment information secure?',
        answer: 'Yes! We use industry-standard encryption and never store your full payment details. All transactions are processed through secure, PCI-compliant payment partners.'
    },
    {
        question: 'Can I modify my itinerary after creation?',
        answer: 'Absolutely! Our AI-generated itineraries are fully customizable. Add, remove, or swap activities as you wish before booking.'
    }
]

export function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500))

        setIsSubmitting(false)
        setIsSubmitted(true)
        setFormData({ name: '', email: '', subject: '', message: '' })
    }

    return (
        <div className="min-h-screen bg-black pt-20">
            {/* Hero Section */}
            <motion.section
                className="px-8 py-20 text-center"
                initial="hidden"
                animate="visible"
                variants={stagger}
            >
                <motion.h1
                    className="text-5xl md:text-7xl font-black text-white tracking-wider mb-6"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    variants={fadeUp}
                >
                    Get in Touch
                </motion.h1>

                <motion.p
                    className="text-white/60 text-lg max-w-2xl mx-auto"
                    variants={fadeUp}
                >
                    Have questions or feedback? We'd love to hear from you.
                    Our team typically responds within 24 hours.
                </motion.p>
            </motion.section>

            {/* Contact Content */}
            <motion.section
                className="px-8 pb-20"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
            >
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16">
                    {/* Contact Form */}
                    <motion.div variants={fadeUp}>
                        <h2 className="text-2xl font-bold text-white mb-8">Send us a Message</h2>

                        {isSubmitted ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-8 rounded-2xl bg-green-500/10 border border-green-500/30 text-center"
                            >
                                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                                <p className="text-white/60">Thank you for reaching out. We'll get back to you soon.</p>
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="mt-6 text-green-400 hover:text-green-300 underline text-sm"
                                >
                                    Send another message
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-white/60 text-sm mb-2">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-white/30 focus:border-white focus:outline-none transition-colors"
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white/60 text-sm mb-2">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-white/30 focus:border-white focus:outline-none transition-colors"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-white/60 text-sm mb-2">Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-white/30 focus:border-white focus:outline-none transition-colors"
                                        placeholder="How can we help?"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white/60 text-sm mb-2">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-white/30 focus:border-white focus:outline-none transition-colors resize-none"
                                        placeholder="Tell us more..."
                                    />
                                </div>

                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="btn btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <span className="animate-pulse">Sending...</span>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            <span>Send Message</span>
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        )}
                    </motion.div>

                    {/* Contact Info & FAQ */}
                    <motion.div variants={fadeUp} className="space-y-12">
                        {/* Contact Info Cards */}
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {contactInfo.map((info, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ scale: 1.02 }}
                                        className="p-4 rounded-xl bg-zinc-900/80 border border-white/10"
                                    >
                                        <info.icon className="w-5 h-5 text-white mb-2" />
                                        <div className="text-white/60 text-xs mb-1">{info.title}</div>
                                        {info.link ? (
                                            <a href={info.link} className="text-white text-sm hover:text-white/70 transition-colors">
                                                {info.value}
                                            </a>
                                        ) : (
                                            <div className="text-white text-sm">{info.value}</div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* FAQ Section */}
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <MessageCircle className="w-5 h-5 text-white" />
                                <h2 className="text-2xl font-bold text-white">FAQ</h2>
                            </div>
                            <div className="space-y-4">
                                {faqs.map((faq, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="p-4 rounded-xl bg-zinc-900/50 border border-white/5"
                                    >
                                        <h4 className="font-medium text-white mb-2">{faq.question}</h4>
                                        <p className="text-white/60 text-sm">{faq.answer}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.section>
        </div>
    )
}

export default ContactPage
