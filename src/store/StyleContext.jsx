// Visual style switch: "showroom" (dark, glossy), "classic" (light) or "playful" (bright, chunky).
// The choice sets <html data-style="..."> and the matching stylesheet restyles the whole app.
import { createContext, useContext, useEffect, useState } from 'react';
import { Moon, Sparkles, Sun } from 'lucide-react';
import { cn } from '../utils/format';

const KEY = 'drivana-style';
export const STYLES = [
  { value: 'classic', label: 'Classic', icon: Sun },
  { value: 'showroom', label: 'Midnight Showroom', icon: Moon },
  { value: 'playful', label: 'Bright & Playful', icon: Sparkles },
];
const Ctx = createContext({ style: 'showroom', setStyle: () => {} });

function initial() {
  try {
    const s = localStorage.getItem(KEY);
    if (STYLES.some((x) => x.value === s)) return s;
  } catch {
    /* storage unavailable */
  }
  return 'showroom';
}

export function StyleProvider({ children }) {
  const [style, setStyle] = useState(initial);
  useEffect(() => {
    document.documentElement.dataset.style = style;
    try {
      localStorage.setItem(KEY, style);
    } catch {
      /* ignore */
    }
  }, [style]);
  return <Ctx.Provider value={{ style, setStyle }}>{children}</Ctx.Provider>;
}

export const useStyle = () => useContext(Ctx);

/** Three-way segmented switch used in the navbar, dashboard header and auth pages. */
export function StyleToggle({ className, onDark }) {
  const { style, setStyle } = useStyle();
  return (
    <div role="radiogroup" aria-label="Visual style" className={cn('style-toggle inline-flex h-9 items-center gap-0.5 rounded-full p-1', onDark ? 'bg-white/10 text-ink-200' : 'bg-mist-100 text-mist-600', className)}>
      {STYLES.map((s) => {
        const on = style === s.value;
        return (
          <button
            key={s.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => setStyle(s.value)}
            title={s.label}
            aria-label={s.label}
            className={cn('flex h-7 w-7 items-center justify-center rounded-full transition-all', on ? 'style-toggle-on bg-accent-600 text-white shadow-card' : 'hover:text-ink-900')}
          >
            <s.icon className="h-3.5 w-3.5" />
          </button>
        );
      })}
    </div>
  );
}
