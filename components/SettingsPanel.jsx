'use client';

import { useEffect } from 'react';
import { useSettings } from './SettingsProvider';

export default function SettingsPanel() {
  const {
    isPanelOpen,
    closePanel,
    theme,
    setTheme,
    language,
    setLanguage,
    fontScale,
    setFontScale,
    currency,
    setCurrency,
    t,
  } = useSettings();

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && isPanelOpen && closePanel();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isPanelOpen, closePanel]);

  return (
    <div aria-hidden={!isPanelOpen}>
      {/* Backdrop */}
      <div
        className={[
          'fixed inset-0 z-[70] bg-black/30 backdrop-blur-sm transition-opacity',
          isPanelOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
        onClick={closePanel}
      />

      {/* Panel */}
      <aside
        aria-label="Settings"
        className={[
          'fixed right-0 top-0 z-[80] h-full w-80 max-w-[90vw] shadow-xl',
          'bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100',
          'border-l border-neutral-200 dark:border-neutral-800',
          'transition-transform duration-300 ease-out',
          isPanelOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-base font-semibold">{t('settings')}</h2>
          <button
            onClick={closePanel}
            className="rounded-md p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label={t('close')}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-6">

          <section>
            <label className="block text-xs mb-1">{t('language')}</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>
          </section>

          <section>
            <label className="block text-xs mb-1">{t('fontSize')}</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { v: 'sm', l: t('small') },
                { v: 'md', l: t('medium') },
                { v: 'lg', l: t('large') },
                { v: 'xl', l: t('xlarge') },
              ].map((opt) => (
                <button
                  key={opt.v}
                  onClick={() => setFontScale(opt.v)}
                  className={[
                    'rounded-md border px-2 py-2 text-xs',
                    fontScale === opt.v
                      ? 'border-green-600 text-green-700 bg-green-50'
                      : 'border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800',
                  ].join(' ')}
                >
                  {opt.l}
                </button>
              ))}
            </div>
          </section>

          <section>
            <label className="block text-xs mb-1">{t('currency')}</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm"
            >
              <option value="INR">INR ₹</option>
              <option value="USD">USD $</option>
              <option value="EUR">EUR €</option>
            </select>
          </section>
        </div>
      </aside>
    </div>
  );
}



