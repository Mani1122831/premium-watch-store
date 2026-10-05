import { useEffect } from 'react';
import { CheckCircle, XCircle, X, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type = 'success',
  onClose,
  duration = 3200,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const configs = {
    success: {
      icon: <CheckCircle className="w-5 h-5 text-gold-500 shrink-0" />,
      border: 'border-l-4 border-gold-500',
    },
    error: {
      icon: <XCircle className="w-5 h-5 text-red-500 shrink-0" />,
      border: 'border-l-4 border-red-500',
    },
    info: {
      icon: <Info className="w-5 h-5 text-charcoal-700 shrink-0" />,
      border: 'border-l-4 border-charcoal-700',
    },
  };

  const config = configs[type];

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3.5 px-5 py-4 bg-charcoal-950 text-white shadow-2xl animate-slide-up max-w-md ${config.border}`}
      role="alert"
    >
      {config.icon}
      <span className="text-sm font-medium tracking-wide text-charcoal-100 flex-1">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-charcoal-400 hover:text-white transition-colors p-1"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
