import toast from 'react-hot-toast';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

const baseStyle = {
  borderRadius: '12px',
  fontFamily: 'Inter, sans-serif',
  fontSize: '14px',
  fontWeight: '500',
  padding: '12px 16px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

export const showSuccess = (message) =>
  toast.success(message, {
    style: { ...baseStyle, background: '#064e3b', color: '#6ee7b7', border: '1px solid #065f46' },
    icon: <CheckCircle size={18} className="text-emerald-400 flex-shrink-0" />,
  });

export const showError = (message) =>
  toast.error(message, {
    style: { ...baseStyle, background: '#4c0519', color: '#fda4af', border: '1px solid #881337' },
    icon: <XCircle size={18} className="text-rose-400 flex-shrink-0" />,
  });

export const showWarning = (message) =>
  toast(message, {
    style: { ...baseStyle, background: '#451a03', color: '#fcd34d', border: '1px solid #78350f' },
    icon: <AlertTriangle size={18} className="text-amber-400 flex-shrink-0" />,
  });

export const showInfo = (message) =>
  toast(message, {
    style: { ...baseStyle, background: '#0c1a2e', color: '#7dd3fc', border: '1px solid #0369a1' },
    icon: <Info size={18} className="text-cyan-400 flex-shrink-0" />,
  });

export const showLoading = (message) =>
  toast.loading(message, { style: baseStyle });

export const dismissToast = (id) => toast.dismiss(id);

export default { showSuccess, showError, showWarning, showInfo, showLoading, dismissToast };
