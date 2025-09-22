'use client';
import Background from '../_ui/Background';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      {/* Three.js Stars Background */}
      <Background />

      {/* Main content - IntroGate temporarily removed */}
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
