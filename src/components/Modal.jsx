import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ onClose, children, closeLabel = 'Close' }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    closeButtonRef.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4" onClick={onClose}>
      <div
        className="bg-[#0F0F0F] border border-neutral-800 max-w-lg w-full max-h-[85vh] overflow-y-auto p-5 relative"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-3 right-3 text-neutral-500 hover:text-accent transition-colors"
          aria-label={closeLabel}
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}
