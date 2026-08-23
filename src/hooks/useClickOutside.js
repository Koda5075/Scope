import { useEffect } from 'react';

// Closes an open dropdown/panel on a click outside `ref`, or on Escape. Only listens
// while `active` is true, so idle panels don't pay for a global listener.
export function useClickOutside(ref, active, onClose) {
  useEffect(() => {
    if (!active) return;

    function handlePointerDown(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKey);
    };
  }, [active, ref, onClose]);
}
