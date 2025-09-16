'use client';
import Background from '../_ui/Background';
import IntroGate from './IntroGate';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      {/* Three.js Stars Background */}
      <Background />

      {/* Intro Gate - appears once per session */}
      <IntroGate />

      <div style={{ position: 'relative', zIndex: 1000 }}>
        <a href="#main" className="skip-link">
          Skip to main content
        </a>

        <main id="main" style={{ position: 'relative', zIndex: 1000 }}>
          {children}
        </main>
      </div>
    </>
  );
}
