import React from 'react';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Toast: React.FC = () => {
  const { toast } = useStore();

  if (!toast) return null;

  return (
    <div
      role="status"
      className="fixed bottom-6 right-6 z-50 bg-ink text-canvas px-5 py-3.5 border border-neutral-700 flex items-center gap-3 max-w-sm"
    >
      {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
      {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-terracotta shrink-0" />}
      {toast.type === 'info' && <Info className="w-4 h-4 text-neutral-300 shrink-0" />}
      <span className="text-[13px] font-medium leading-snug">{toast.message}</span>
    </div>
  );
};
