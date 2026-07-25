import React from 'react';
import ReactDOM from 'react-dom/client';
import { VisibilityProvider } from './providers/VisibilityProvider';
import App from './components/App';
import { fetchNui } from './utils/fetchNui';
import { installSmoothScroll } from './lib/smooth-scroll';
import { initI18n } from './i18n';
import './index.css';

// Pull the locale dictionary from Lua before anything is on screen. The dev
// loader is only used by `bun run start` (plain browser, no Lua to ask) and is
// dead-code-eliminated from production builds along with the en.json chunk.
initI18n(__DEV_SEED__ ? () => import('../../locales/en.json') : undefined);

// Repairs wheel scroll in FiveM CEF and gives every scroller smooth easing.
installSmoothScroll();

// Top-level error boundary: a render crash must never leave the NUI frame
// open with focus held, so release the frame and render nothing.
class AppErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, errorInfo: React.ErrorInfo) {
    console.error('Unhandled UI error:', error, errorInfo);
    fetchNui('hideFrame');
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AppErrorBoundary>
    <VisibilityProvider>
      <App />
    </VisibilityProvider>
  </AppErrorBoundary>,
);
