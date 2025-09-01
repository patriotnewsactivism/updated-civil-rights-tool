import { useEffect } from 'react';
export function Dialog({ open, onClose, children }) {
  useEffect(() => { function onKey(e){ if(e.key==='Escape') onClose(); } if(open) document.addEventListener('keydown', onKey); return () => document.removeEventListener('keydown', onKey); }, [open, onClose]);
  if (!open) return null;
  return (
    <div role="dialog" aria-modal className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-200">{children}</div>
    </div>
  );
}
