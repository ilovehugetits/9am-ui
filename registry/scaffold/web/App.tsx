import { Button } from '@/components/ui/button';
import {
  Viewport,
  ViewportHeader,
  ViewportTitle,
  ViewportDescription,
  ViewportAction,
  ViewportContent,
} from '@/components/ui/viewport';
import { XIcon } from '@/components/ui/x';
import { ThemeToggleIcon } from '@/components/ui/theme-toggle';
import { useTheme } from '@/hooks/useTheme';
import { fetchNui } from '@/utils/fetchNui';
import { useT } from '@/i18n';

/**
 * Starting point for a 9AM script UI. Delete freely — it exists to show the
 * house style in one screen: a Viewport scroller with a pinning header, the
 * translucent control fill, and the exit affordance every 9AM NUI has.
 */
export default function App() {
  const { theme, toggleTheme } = useTheme();
  const t = useT();

  return (
    <div className="h-full w-full flex items-center justify-center p-8">
      <Viewport className="w-[900px] max-h-[80vh]" fadeColor="var(--card)">
        <ViewportHeader className="px-4">
          <ViewportTitle className="!font-[phudu] text-2xl">
            {t('ui.app.title')}
          </ViewportTitle>
          <ViewportDescription>{t('ui.app.subtitle')}</ViewportDescription>
          <ViewportAction className="flex items-center gap-2.5">
            <Button variant="default2" className="h-9 px-3" onClick={toggleTheme}>
              <ThemeToggleIcon theme={theme} size={16} />
            </Button>
            <Button variant="default2" className="h-9 px-3 gap-2.5" onClick={() => fetchNui('hideFrame')}>
              <div className="bg-foreground rounded-[4px] flex items-center justify-center w-4 h-4">
                <XIcon size={18} className="text-background" />
              </div>
              <span>{t('ui.common.close')}</span>
            </Button>
          </ViewportAction>
        </ViewportHeader>

        <ViewportContent className="px-4 pt-2">
          <div className="rounded-xl bg-black/[0.05] dark:bg-white/10 border p-6">
            <p className="text-muted-foreground text-sm">{t('ui.app.placeholder')}</p>
          </div>
        </ViewportContent>
      </Viewport>
    </div>
  );
}
