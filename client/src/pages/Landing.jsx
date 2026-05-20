import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Shield, Zap, BarChart3, PieChart, Target,
  ChevronDown, ChevronRight, Star, Check, ArrowRight,
  Sparkles, Globe, Lock, Bell, Download, Wallet,
  Menu, X
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

// ─── Animation Variants ──────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};
const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: BarChart3, title: 'Smart Analytics', desc: 'Interactive charts showing your spending patterns, income trends, and monthly breakdowns at a glance.', color: 'text-violet-500', bg: 'bg-violet-500/10' },
  { icon: Target, title: 'Savings Goals', desc: 'Set financial goals and track your progress visually. Stay motivated with milestone celebrations.', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { icon: Bell, title: 'Budget Alerts', desc: 'Get notified when you approach your budget limits. Never overspend again with smart threshold alerts.', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { icon: Sparkles, title: 'AI Insights', desc: 'Rule-based spending insights highlight unusual patterns and celebrate your financial wins automatically.', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  { icon: Download, title: 'CSV Export', desc: 'Export all your transactions to CSV anytime. Your data is yours — always portable and accessible.', color: 'text-rose-500', bg: 'bg-rose-500/10' },
  { icon: Globe, title: 'Multi-Currency', desc: 'Support for 8+ currencies. Switch seamlessly between USD, EUR, GBP, PKR, INR, and more.', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { icon: Shield, title: 'Secure & Private', desc: 'JWT authentication, bcrypt hashing, and rate limiting. Your financial data stays private and protected.', color: 'text-teal-500', bg: 'bg-teal-500/10' },
  { icon: Zap, title: 'Lightning Fast', desc: 'Built with Vite and optimized with code splitting. Instant page loads and buttery smooth animations.', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
];

const TESTIMONIALS = [
  { name: 'Sarah Chen', role: 'Freelance Designer', avatar: 'SC', text: 'Finora completely changed how I manage my freelance income. The category insights showed me I was overspending on subscriptions — saved $200/month!', rating: 5 },
  { name: 'Marcus Williams', role: 'Software Engineer', avatar: 'MW', text: 'I tried Mint, YNAB, and Personal Capital. Finora is the only one that feels modern and actually enjoyable to use. The dark mode alone is worth it.', rating: 5 },
  { name: 'Priya Sharma', role: 'Grad Student', avatar: 'PS', text: 'As a student on a tight budget, the budget alerts have been a lifesaver. Now I always know when I\'m close to my monthly limits.', rating: 5 },
  { name: 'James O\'Brien', role: 'Young Professional', avatar: 'JO', text: 'The savings goals feature keeps me motivated. Watching the progress bar fill up towards my Japan trip is genuinely exciting!', rating: 5 },
];

const PRICING = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'Perfect for getting started',
    features: ['Up to 100 transactions/month', 'Basic analytics', '3 savings goals', 'CSV export', 'Dark mode'],
    cta: 'Get Started Free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: 'per month',
    desc: 'For serious money managers',
    features: ['Unlimited transactions', 'Advanced analytics', 'Unlimited goals', 'AI insights', 'Multi-currency', 'Priority support', 'Budget alerts', 'Recurring transactions'],
    cta: 'Start Pro Trial',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Teams',
    price: '$19',
    period: 'per month',
    desc: 'For households & small teams',
    features: ['Everything in Pro', 'Up to 5 members', 'Shared budgets', 'Team analytics', 'Admin controls', 'Custom categories'],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

const FAQS = [
  { q: 'Is my financial data safe?', a: 'Absolutely. Finora uses JWT authentication, bcrypt password hashing, and never stores sensitive banking credentials. Your data is encrypted and private.' },
  { q: 'Can I use Finora without creating an account?', a: 'Yes! Finora offers a full Demo Mode that loads realistic sample data. You can explore every feature without signing up.' },
  { q: 'Does Finora connect to my bank?', a: 'Currently Finora is a manual tracker — you add transactions yourself. This gives you full control without sharing banking credentials.' },
  { q: 'How does the AI insights feature work?', a: 'Our insights engine analyzes your transaction patterns using rule-based logic. It detects spending changes, budget overruns, and savings milestones — no external AI APIs needed.' },
  { q: 'Can I export my data?', a: 'Yes, you can export all transactions to CSV at any time from the Reports page. Your data is always portable and belongs to you.' },
  { q: 'Is there a mobile app?', a: 'Finora is a Progressive Web App (PWA), which means you can install it on your phone from the browser. It works offline and feels native.' },
];

// ─── Components ───────────────────────────────────────────────────────────────

function Navbar({ onDemoClick }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-slate-950/90 backdrop-blur-xl border-b border-white/5 shadow-lg' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center">
              <TrendingUp size={16} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl">Finora</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Pricing', 'Testimonials', 'FAQ'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onDemoClick}
              className="text-slate-300 hover:text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/5 transition-all"
            >
              Live Demo
            </button>
            <button
              onClick={() => navigate('/login')}
              className="text-slate-300 hover:text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/5 transition-all"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all shadow-lg shadow-violet-500/25"
            >
              Get Started Free
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-slate-400 hover:text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-950/95 backdrop-blur-xl border-t border-white/5 px-4 py-4 space-y-2"
          >
            {['Features', 'Pricing', 'Testimonials', 'FAQ'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMobileOpen(false)}
                className="block text-slate-300 hover:text-white py-2 text-sm font-medium"
              >
                {item}
              </a>
            ))}
            <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
              <button onClick={onDemoClick} className="w-full text-center text-slate-300 hover:text-white py-2 text-sm font-medium border border-white/10 rounded-lg">
                Live Demo
              </button>
              <button onClick={() => navigate('/register')} className="w-full text-center bg-violet-600 hover:bg-violet-500 text-white py-2 text-sm font-semibold rounded-lg transition-all">
                Get Started Free
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function HeroSection({ onDemoClick }) {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400], [0, -80]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0.3]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-rose-600/10 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 mb-8"
        >
          <Sparkles size={14} className="text-violet-400" />
          <span className="text-violet-300 text-sm font-medium">AI-Powered Financial Insights</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
        >
          Take Control of Your
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Financial Future
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10"
        >
          Finora helps students, freelancers, and young professionals track income, manage budgets, and hit savings goals — beautifully.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <button
            onClick={() => navigate('/register')}
            className="group flex items-center gap-2 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 text-white font-semibold px-8 py-4 rounded-xl text-lg shadow-2xl shadow-violet-500/30 transition-all hover:shadow-violet-500/40 hover:scale-105"
          >
            Start for Free
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={onDemoClick}
            className="flex items-center gap-2 text-slate-300 hover:text-white border border-white/10 hover:border-white/20 font-medium px-8 py-4 rounded-xl text-lg transition-all hover:bg-white/5"
          >
            <Zap size={18} className="text-violet-400" />
            Try Demo — No Signup
          </button>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 text-slate-500 text-sm"
        >
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-amber-400 fill-amber-400" />)}
            <span className="ml-2 text-slate-400">4.9/5 from 2,000+ users</span>
          </div>
          <span className="hidden sm:block text-slate-700">•</span>
          <span>No credit card required</span>
          <span className="hidden sm:block text-slate-700">•</span>
          <span>Free forever plan</span>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="mt-20 relative mx-auto max-w-5xl"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 pointer-events-none" />
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/60">
            {/* Fake Browser Bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-slate-900/50">
              <div className="w-3 h-3 rounded-full bg-rose-500/70" />
              <div className="w-3 h-3 rounded-full bg-amber-500/70" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
              <div className="flex-1 mx-4 bg-white/5 rounded-md h-6 flex items-center px-3">
                <span className="text-slate-500 text-xs">app.finora.app/dashboard</span>
              </div>
            </div>
            {/* Mini Dashboard Preview */}
            <div className="p-6 grid grid-cols-4 gap-4">
              {[
                { label: 'Total Balance', value: '$12,450', change: '+4.2%', color: 'text-violet-400' },
                { label: 'Monthly Income', value: '$6,200', change: '+12%', color: 'text-emerald-400' },
                { label: 'Monthly Expenses', value: '$3,840', change: '-2.1%', color: 'text-rose-400' },
                { label: 'Savings Rate', value: '38%', change: '+5%', color: 'text-cyan-400' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-slate-500 text-xs mb-1">{stat.label}</p>
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-slate-500 text-xs mt-1">{stat.change} this month</p>
                </div>
              ))}
              <div className="col-span-2 bg-white/5 rounded-xl p-4 border border-white/5">
                <p className="text-slate-400 text-xs mb-3 font-medium">Spending by Category</p>
                <div className="flex items-end gap-2 h-16">
                  {[60, 85, 40, 70, 55, 90, 45].map((h, i) => (
                    <div key={i} className="flex-1 bg-violet-500/40 rounded-sm" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
              <div className="col-span-2 bg-white/5 rounded-xl p-4 border border-white/5">
                <p className="text-slate-400 text-xs mb-3 font-medium">Recent Transactions</p>
                {[
                  { name: 'Netflix', amt: '-$15', cat: '🎬' },
                  { name: 'Salary', amt: '+$4,500', cat: '💼' },
                  { name: 'Groceries', amt: '-$87', cat: '🛒' },
                ].map((t) => (
                  <div key={t.name} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <span>{t.cat}</span>
                      <span className="text-slate-400 text-xs">{t.name}</span>
                    </div>
                    <span className={`text-xs font-medium ${t.amt.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>{t.amt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 mb-6">
            <Zap size={14} className="text-violet-400" />
            <span className="text-violet-300 text-sm font-medium">Everything you need</span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Built for real financial
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"> goals</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-400 text-lg max-w-2xl mx-auto">
            Every feature is designed to give you clarity and control over your money — without the overwhelm.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              className="group p-6 rounded-2xl bg-white/3 border border-white/5 hover:border-violet-500/30 hover:bg-white/5 transition-all duration-300 cursor-default"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon size={22} className={feature.color} />
              </div>
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function PricingSection({ onDemoClick }) {
  const navigate = useNavigate();
  return (
    <section id="pricing" className="py-24 bg-slate-950 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Simple, transparent pricing
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-400 text-lg">
            Start free. Upgrade when you're ready.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {PRICING.map((plan) => (
            <motion.div
              key={plan.name}
              variants={fadeUp}
              className={`relative p-8 rounded-2xl border transition-all ${
                plan.highlighted
                  ? 'bg-gradient-to-b from-violet-900/40 to-violet-950/40 border-violet-500/40 shadow-2xl shadow-violet-500/20 scale-105'
                  : 'bg-white/3 border-white/10 hover:border-white/20'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-violet-700 text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                  {plan.badge}
                </div>
              )}
              <h3 className="text-white font-bold text-xl mb-1">{plan.name}</h3>
              <p className="text-slate-500 text-sm mb-6">{plan.desc}</p>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-slate-500 mb-1">/{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-slate-400 text-sm">
                    <Check size={16} className="text-emerald-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={plan.name === 'Free' ? () => navigate('/register') : plan.name === 'Pro' ? onDemoClick : undefined}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                  plan.highlighted
                    ? 'bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 text-white shadow-lg shadow-violet-500/30'
                    : 'border border-white/10 hover:border-white/20 text-white hover:bg-white/5'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Loved by thousands
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-400 text-lg">
            Real stories from real users managing their finances with Finora.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {TESTIMONIALS.map((t) => (
            <motion.div
              key={t.name}
              variants={fadeUp}
              className="p-6 rounded-2xl bg-white/3 border border-white/5 hover:border-white/10 transition-all"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} className="text-amber-400 fill-amber-400" />)}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center text-white text-xs font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{t.name}</p>
                  <p className="text-slate-500 text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <section id="faq" className="py-24 bg-slate-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Frequently asked questions
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="space-y-3"
        >
          {FAQS.map((faq, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              className="border border-white/5 rounded-xl overflow-hidden bg-white/3"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/3 transition-colors"
              >
                <span className="text-white font-medium text-sm">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-slate-500 flex-shrink-0 transition-transform ${openIdx === idx ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {openIdx === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CTASection({ onDemoClick }) {
  const navigate = useNavigate();
  return (
    <section className="py-24 bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="relative p-12 rounded-3xl bg-gradient-to-br from-violet-900/50 to-violet-950/50 border border-violet-500/20 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Ready to take control?
              </h2>
              <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of users who've transformed their financial habits with Finora. Free forever.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => navigate('/register')}
                  className="group flex items-center gap-2 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 text-white font-semibold px-8 py-4 rounded-xl text-lg shadow-2xl shadow-violet-500/30 transition-all hover:scale-105"
                >
                  Get Started Free
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={onDemoClick}
                  className="text-slate-300 hover:text-white border border-white/10 hover:border-white/20 font-medium px-8 py-4 rounded-xl text-lg transition-all hover:bg-white/5"
                >
                  Try Demo First
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center">
                <TrendingUp size={16} className="text-white" />
              </div>
              <span className="text-white font-bold text-xl">Finora</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Smart personal finance for the next generation. Track, plan, and grow.
            </p>
          </div>
          {[
            { title: 'Product', links: ['Features', 'Pricing', 'Demo', 'Changelog'] },
            { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
            { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-semibold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-sm">© 2025 Finora. All rights reserved.</p>
          <p className="text-slate-600 text-sm flex items-center gap-1">
            Built with <span className="text-rose-500">♥</span> for your financial freedom
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate();
  const { setDemoMode } = useAuthStore();

  const handleDemoClick = () => {
    setDemoMode(true);
    navigate('/app/dashboard');
  };

  return (
    <div className="bg-slate-950 min-h-screen">
      <Navbar onDemoClick={handleDemoClick} />
      <HeroSection onDemoClick={handleDemoClick} />
      <FeaturesSection />
      <PricingSection onDemoClick={handleDemoClick} />
      <TestimonialsSection />
      <FAQSection />
      <CTASection onDemoClick={handleDemoClick} />
      <Footer />
    </div>
  );
}
