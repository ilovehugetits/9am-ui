import { useState } from 'react';
import { AppShell } from '@/components/ui/app-shell';
import { DashboardHeader, type DashboardTab } from '@/components/ui/dashboard-header';
import { PageTransition } from '@/components/ui/page-transition';
import { Button } from '@/components/ui/button';
import { LayoutGridIcon } from '@/components/ui/layout-grid';
import { UsersIcon } from '@/components/ui/users';
import { SettingsIcon } from '@/components/ui/settings';
import { XIcon } from '@/components/ui/x';
import { ThemeToggleIcon } from '@/components/ui/theme-toggle';
import { useTheme } from '@/hooks/useTheme';
import { fetchNui } from '@/utils/fetchNui';
import { useT } from '@/i18n';
import Overview from '@/components/pages/Overview';

/**
 * Starting point for a 9AM dashboard. Delete freely — it exists to show the
 * house layout in one screen: the fixed panel, the header with animated tabs,
 * and a page that cross-fades when the tab changes.
 *
 * Add a page by adding an entry to TABS and a branch in the switch.
 */
const TABS: DashboardTab[] = [
  { value: 'overview', label: 'ui.dashboard.tabs.overview', icon: LayoutGridIcon },
  { value: 'people', label: 'ui.dashboard.tabs.people', icon: UsersIcon },
];

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const t = useT();

  const [tab, setTab] = useState('overview');

  // Translated inline, not memoised: useT returns a stable function reference,
  // so a memo keyed on `t` would never invalidate and the labels would stay
  // frozen at the raw keys they resolve to before Lua's dictionary arrives.
  const tabs = TABS.map((entry) => ({ ...entry, label: t(String(entry.label)) }));

  return (
    <AppShell>
      <DashboardHeader
        tabs={tabs}
        value={tab}
        onValueChange={setTab}
        greeting={t('ui.dashboard.header.welcome')}
        name="9AM Studios."
        actions={
          <>
            <Button variant="default2" className="gap-2.5 h-9 px-3" onClick={toggleTheme}>
              <ThemeToggleIcon theme={theme} size={16} />
            </Button>
            <Button variant="default2" className="gap-2.5 h-9 px-3" onClick={() => fetchNui('hideFrame')}>
              <div className="bg-foreground rounded-[4px] flex items-center justify-center w-4 h-4">
                <XIcon size={18} className="text-background" />
              </div>
              <span>{t('ui.common.close')}</span>
            </Button>
          </>
        }
      />

      <PageTransition pageKey={tab}>
        {tab === 'overview' && <Overview />}
        {tab === 'people' && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <SettingsIcon size={16} className="mr-2" />
            {t('ui.dashboard.placeholder')}
          </div>
        )}
      </PageTransition>
    </AppShell>
  );
}
