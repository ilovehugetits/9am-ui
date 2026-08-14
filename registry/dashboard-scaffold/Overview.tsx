import { useRef } from 'react';
import {
  Viewport,
  ViewportContent,
  ViewportHeader,
  ViewportTitle,
} from '@/components/ui/viewport';
import { SectionHeader } from '@/components/ui/section-header';
import { StatCard } from '@/components/ui/stat-card';
import { EmptyState } from '@/components/ui/empty-state';
import { LayoutGridIcon } from '@/components/ui/layout-grid';
import { UsersIcon } from '@/components/ui/users';
import { useT } from '@/i18n';

type IconHandle = { startAnimation: () => void; stopAnimation: () => void };

/**
 * Example subpage: section header, a row of stat cards, and an empty list.
 *
 * The Viewport is stripped back to transparent because the AppShell panel
 * already provides the surface — a second background here would read as a card
 * inside a card.
 */
export default function Overview() {
  const t = useT();
  const titleRef = useRef<IconHandle>(null);
  const peopleRef = useRef<IconHandle>(null);

  return (
    <div className="flex flex-col gap-4 h-full min-h-0 overflow-hidden">
      <Viewport className="h-full min-h-0 px-0! bg-transparent! border-none">
        <ViewportHeader>
          <ViewportTitle>
            <SectionHeader
              onMouseEnter={() => titleRef.current?.startAnimation()}
              onMouseLeave={() => titleRef.current?.stopAnimation()}
              icon={<LayoutGridIcon ref={titleRef} size={20} className="text-primary" />}
              title={t('ui.dashboard.overview.title')}
            />
          </ViewportTitle>
        </ViewportHeader>

        <ViewportContent className="flex flex-col gap-4 bg-transparent! p-0!">
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              onMouseEnter={() => peopleRef.current?.startAnimation()}
              onMouseLeave={() => peopleRef.current?.stopAnimation()}
              icon={<UsersIcon ref={peopleRef} size={20} className="text-primary" />}
              label={t('ui.dashboard.overview.people')}
              value={0}
            />
          </div>

          <EmptyState message={t('ui.common.noResults')} />
        </ViewportContent>
      </Viewport>
    </div>
  );
}
