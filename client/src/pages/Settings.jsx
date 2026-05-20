import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Palette, Globe, Shield, CreditCard } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import { CURRENCIES } from '../utils/constants';
import { getInitials } from '../utils/formatters';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user, updateUser, isDemoMode } = useAuthStore();
  const { theme, setTheme, currency, setCurrency } = useUIStore();
  const [activeTab, setActiveTab] = useState('profile');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (isDemoMode) {
      toast.error('Cannot update profile in demo mode');
      return;
    }
    updateUser({ name: formData.name });
    toast.success('Profile updated successfully');
  };

  const tabs = [
    { id: 'profile',     label: 'Profile',         icon: User },
    { id: 'preferences', label: 'Preferences',     icon: Palette },
    { id: 'security',    label: 'Security',        icon: Shield },
    { id: 'billing',     label: 'Subscription',    icon: CreditCard },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      <div>
        <h1 className="section-title">Settings</h1>
        <p className="section-subtitle">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-64 flex-shrink-0">
          <Card padding="sm" className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                      : 'text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'profile' && (
              <Card>
                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Profile Settings</h2>
                
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white text-2xl font-bold shadow-violet">
                    {getInitials(user?.name || 'User')}
                  </div>
                  <div>
                    <Button variant="secondary" size="sm">Change Avatar</Button>
                    <p className="text-xs text-[var(--text-muted)] mt-2">JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                </div>

                <form onSubmit={handleProfileSave} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Full Name</label>
                    <input
                      type="text"
                      className="input-base"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Email Address</label>
                    <input
                      type="email"
                      className="input-base opacity-60 cursor-not-allowed"
                      value={formData.email}
                      disabled
                    />
                    <p className="text-xs text-[var(--text-muted)] mt-1">Contact support to change your email address.</p>
                  </div>
                  <div className="pt-4">
                    <Button variant="primary" type="submit">Save Changes</Button>
                  </div>
                </form>
              </Card>
            )}

            {activeTab === 'preferences' && (
              <Card>
                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">App Preferences</h2>
                
                <div className="space-y-6 max-w-md">
                  {/* Theme */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">Appearance</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setTheme('light')}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                          theme === 'light' ? 'border-primary-500 bg-primary-50' : 'border-[var(--border-color)] bg-[var(--bg-secondary)]'
                        }`}
                      >
                        <div className="w-16 h-10 rounded shadow-sm bg-white border border-gray-200" />
                        <span className="text-sm font-medium">Light</span>
                      </button>
                      <button
                        onClick={() => setTheme('dark')}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                          theme === 'dark' ? 'border-primary-500 bg-primary-900/20' : 'border-[var(--border-color)] bg-[var(--bg-secondary)]'
                        }`}
                      >
                        <div className="w-16 h-10 rounded shadow-sm bg-slate-900 border border-slate-800" />
                        <span className="text-sm font-medium">Dark</span>
                      </button>
                    </div>
                  </div>

                  {/* Currency */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Default Currency</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="input-base"
                    >
                      {CURRENCIES.map(c => (
                        <option key={c.code} value={c.code}>{c.code} ({c.symbol}) - {c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </Card>
            )}

            {(activeTab === 'security' || activeTab === 'billing') && (
              <Card className="flex flex-col items-center justify-center py-16 text-center">
                <Shield size={48} className="text-[var(--border-color)] mb-4" />
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Coming Soon</h3>
                <p className="text-[var(--text-muted)] max-w-sm">
                  This section is under active development and will be available in the next release.
                </p>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
