import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import { CURRENCIES } from '../utils/constants';
import Button from '../components/ui/Button';

const STEPS = [
  { id: 'welcome',  title: 'Welcome to Finora' },
  { id: 'currency', title: 'Choose Currency' },
  { id: 'theme',    title: 'Select Theme' },
  { id: 'finish',   title: 'All Set!' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { updateUser } = useAuthStore();
  const { theme, setTheme, currency, setCurrency } = useUIStore();
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => setCurrentStep((p) => Math.min(p + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep((p) => Math.max(p - 1, 0));

  const handleFinish = () => {
    // In a real app we'd mark `hasOnboarded = true`
    navigate('/app/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4">
      <CardContainer>
        {/* Progress Bar */}
        <div className="w-full bg-[var(--bg-tertiary)] h-1.5 rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-primary-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-[300px] flex flex-col"
          >
            {/* Step 1: Welcome */}
            {currentStep === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shadow-violet mb-6">
                  <TrendingUp size={32} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Welcome to Finora!</h1>
                <p className="text-[var(--text-muted)] max-w-sm">
                  We're excited to help you take control of your finances. Let's get your account set up in just a few clicks.
                </p>
              </div>
            )}

            {/* Step 2: Currency */}
            {currentStep === 1 && (
              <div className="flex-1 flex flex-col">
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Select your currency</h2>
                <p className="text-sm text-[var(--text-muted)] mb-6">This is the default currency used across your dashboards and reports.</p>
                <div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-[240px] pr-2 custom-scrollbar">
                  {CURRENCIES.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => setCurrency(c.code)}
                      className={`flex flex-col items-start p-4 rounded-xl border-2 transition-all ${
                        currency === c.code
                          ? 'border-primary-500 bg-primary-500/10'
                          : 'border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-primary-500/50'
                      }`}
                    >
                      <span className="text-lg font-bold text-[var(--text-primary)] mb-1">{c.symbol}</span>
                      <span className="text-sm font-medium text-[var(--text-primary)]">{c.code}</span>
                      <span className="text-xs text-[var(--text-muted)]">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Theme */}
            {currentStep === 2 && (
              <div className="flex-1 flex flex-col">
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Choose a theme</h2>
                <p className="text-sm text-[var(--text-muted)] mb-6">You can always change this later in settings.</p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setTheme('light')}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
                      theme === 'light' ? 'border-primary-500 bg-primary-50' : 'border-[var(--border-color)] bg-[var(--bg-secondary)]'
                    }`}
                  >
                    <div className="w-full aspect-video rounded-lg shadow-sm bg-white border border-gray-200 flex flex-col gap-2 p-2">
                      <div className="w-full h-3 bg-gray-100 rounded-sm" />
                      <div className="w-2/3 h-3 bg-gray-100 rounded-sm" />
                    </div>
                    <span className="font-medium text-gray-900">Light Mode</span>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
                      theme === 'dark' ? 'border-primary-500 bg-primary-900/20' : 'border-[var(--border-color)] bg-[var(--bg-secondary)]'
                    }`}
                  >
                    <div className="w-full aspect-video rounded-lg shadow-sm bg-slate-900 border border-slate-800 flex flex-col gap-2 p-2">
                      <div className="w-full h-3 bg-slate-800 rounded-sm" />
                      <div className="w-2/3 h-3 bg-slate-800 rounded-sm" />
                    </div>
                    <span className="font-medium text-white">Dark Mode</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Finish */}
            {currentStep === 3 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-success-500/20 flex items-center justify-center mb-6">
                  <CheckCircle size={32} className="text-success-500" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">You're all set!</h2>
                <p className="text-[var(--text-muted)] max-w-sm">
                  Your Finora dashboard is ready. Start by adding your first transaction.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer Actions */}
        <div className="mt-8 pt-6 border-t border-[var(--border-color)] flex items-center justify-between">
          {currentStep > 0 ? (
            <Button variant="ghost" onClick={prevStep} icon={ArrowLeft}>Back</Button>
          ) : <div />}

          {currentStep < STEPS.length - 1 ? (
            <Button variant="primary" onClick={nextStep} iconRight={ArrowRight}>Continue</Button>
          ) : (
            <Button variant="primary" onClick={handleFinish}>Go to Dashboard</Button>
          )}
        </div>
      </CardContainer>
    </div>
  );
}

function CardContainer({ children }) {
  return (
    <div className="w-full max-w-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-10 shadow-2xl relative">
      {children}
    </div>
  );
}
