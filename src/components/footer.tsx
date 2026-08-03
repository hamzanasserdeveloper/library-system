'use client';

import {useTranslations} from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');
  const year = 2026;

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 text-sm text-muted-foreground sm:px-6">
        <p>{t('rights')}</p>
        <p className="font-mono text-xs">© {year}</p>
      </div>
    </footer>
  );
}
