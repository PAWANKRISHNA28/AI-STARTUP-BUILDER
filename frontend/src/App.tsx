import React from 'react';
import { AnimatePresence, m, LazyMotion, domAnimation } from 'framer-motion';
import { useUIStore } from './store/useUIStore';
import { useAuthStore } from './store/useAuthStore';
const Navbar = React.lazy(() => import('./components/Navbar').then(module => ({ default: module.Navbar })));
const Sidebar = React.lazy(() => import('./components/Sidebar').then(module => ({ default: module.Sidebar })));
const ToastContainer = React.lazy(() => import('./components/ToastContainer').then(module => ({ default: module.ToastContainer })));
const CommandPalette = React.lazy(() => import('./components/CommandPalette').then(module => ({ default: module.CommandPalette })));
const FlowMenu = React.lazy(() => import('./components/FlowMenu').then(module => ({ default: module.FlowMenu })));
import { LandingPage } from './pages/LandingPage';

const ThreeBackground = React.lazy(() => import('./components/ThreeBackground').then(module => ({ default: module.ThreeBackground })));


const SplashScreen = React.lazy(() => import('./pages/SplashScreen').then(module => ({ default: module.SplashScreen })));
const LoginPage = React.lazy(() => import('./pages/LoginPage').then(module => ({ default: module.LoginPage })));
const EmailLogin = React.lazy(() => import('./pages/auth/EmailLogin').then(module => ({ default: module.EmailLogin })));
const PhoneLogin = React.lazy(() => import('./pages/auth/PhoneLogin').then(module => ({ default: module.PhoneLogin })));
const Register = React.lazy(() => import('./pages/auth/Register').then(module => ({ default: module.Register })));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage').then(module => ({ default: module.DashboardPage })));
const CreateProjectPage = React.lazy(() => import('./pages/CreateProjectPage').then(module => ({ default: module.CreateProjectPage })));
const GenerationProgressPage = React.lazy(() => import('./pages/GenerationProgressPage').then(module => ({ default: module.GenerationProgressPage })));
const ProjectViewPage = React.lazy(() => import('./pages/ProjectViewPage').then(module => ({ default: module.ProjectViewPage })));
const ProjectsPage = React.lazy(() => import('./pages/ProjectsPage').then(module => ({ default: module.ProjectsPage })));
const AgentsPage = React.lazy(() => import('./pages/AgentsPage').then(module => ({ default: module.AgentsPage })));
const AnalyticsPage = React.lazy(() => import('./pages/AnalyticsPage').then(module => ({ default: module.AnalyticsPage })));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage').then(module => ({ default: module.SettingsPage })));
const ReportsPage = React.lazy(() => import('./pages/ReportsPage').then(module => ({ default: module.ReportsPage })));
const DocumentsPage = React.lazy(() => import('./pages/DocumentsPage').then(module => ({ default: module.DocumentsPage })));

const TemplatesPage = React.lazy(() => import('./pages/TemplatesPage').then(module => ({ default: module.TemplatesPage })));
const WorkspacePage = React.lazy(() => import('./pages/WorkspacePage').then(module => ({ default: module.WorkspacePage })));
const NotificationsPage = React.lazy(() => import('./pages/NotificationsPage').then(module => ({ default: module.NotificationsPage })));
const OnboardingFlow = React.lazy(() => import('./pages/Onboarding/OnboardingFlow').then(module => ({ default: module.OnboardingFlow })));
const LocationIntelligencePage = React.lazy(() => import('./pages/LocationIntelligencePage').then(module => ({ default: module.LocationIntelligencePage })));
const LocationSearchPage = React.lazy(() => import('./pages/LocationSearchPage').then(module => ({ default: module.LocationSearchPage })));
const LocationMapPage = React.lazy(() => import('./pages/LocationMapPage').then(module => ({ default: module.LocationMapPage })));
const LocationComparePage = React.lazy(() => import('./pages/LocationComparePage').then(module => ({ default: module.LocationComparePage })));
const BusinessVisualizationPage = React.lazy(() => import('./pages/BusinessVisualizationPage').then(module => ({ default: module.BusinessVisualizationPage })));
const BusinessSimulator = React.lazy(() => import('./pages/BusinessSimulator').then(module => ({ default: module.BusinessSimulator })));
const AIChatPage = React.lazy(() => import('./pages/AIChatPage').then(module => ({ default: module.AIChatPage })));
const IntegrationsPage = React.lazy(() => import('./pages/IntegrationsPage').then(module => ({ default: module.IntegrationsPage })));

export const App: React.FC = () => {
  const user = useAuthStore(state => state.user);
  const token = useAuthStore(state => state.token);
  const currentPage = useUIStore(state => state.currentPage);
  const setCurrentPage = useUIStore(state => state.setCurrentPage);
  const setUser = useAuthStore(state => state.setUser);
  const logout = useAuthStore(state => state.logout);
  const isMobileSidebarOpen = useUIStore(state => state.isMobileSidebarOpen);
  const setMobileSidebarOpen = useUIStore(state => state.setMobileSidebarOpen);
  const [isPaletteOpen, setIsPaletteOpen] = React.useState(false);
  const [isHydrating, setIsHydrating] = React.useState(!!token);
  const [show3D, setShow3D] = React.useState(false);

  React.useEffect(() => {
    // Delay initialization to prioritize main UI
    const timer = setTimeout(() => {
      if (window.innerWidth > 768) {
        setShow3D(true);
      }
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    // Remove the static app shell once React is mounted and ready
    const appShell = document.getElementById('app-shell');
    if (appShell) {
      appShell.style.opacity = '0';
      appShell.style.transition = 'opacity 0.5s ease';
      setTimeout(() => appShell.remove(), 500);
    }
  }, []);

  React.useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      // Toggle palette on Ctrl + K or Cmd + K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  React.useEffect(() => {
    // Disable smooth scrolling on touch devices for better performance
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (isTouchDevice) return;

    let lenis: any;
    let rafId: number;

    import('lenis').then(({ default: Lenis }) => {
      lenis = new Lenis({
        duration: 0.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
      });

      function raf(time: number) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }

      rafId = requestAnimationFrame(raf);
    });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) lenis.destroy();
    };
  }, []);

  React.useEffect(() => {
    if (token) {
      setIsHydrating(true);
      import('./services/api').then(({ api }) => {
        api.getMe()
          .then((userData) => {
            setUser(userData);
            setIsHydrating(false);
          })
          .catch((err) => {
            if (err?.status === 401 || err?.status === 403) {
              useUIStore.getState().addToast('error', 'Your session has expired. Please log in again.');
            }
            // Clear token and user on failed verification (e.g. 401/403)
            logout();
            setIsHydrating(false);
          });
      });
    } else {
      setIsHydrating(false);
    }
  }, []); // Run only on mount to check initial session

  React.useEffect(() => {
    const publicPages = ['landing', 'splash', 'login', 'login/email', 'login/phone', 'register'];
    if (!isHydrating && !user && !publicPages.includes(currentPage)) {
      setCurrentPage('login');
    }
  }, [isHydrating, user, currentPage, setCurrentPage]);

  React.useEffect(() => {
    /* Temporarily disabled to debug Dashboard rendering
    if (user && !user.onboardingCompleted && currentPage !== 'onboarding') {
      setCurrentPage('onboarding');
    }
    */
  }, [user, currentPage, setCurrentPage]);

  const renderPage = () => {
    if (isHydrating) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    switch (currentPage) {
      case 'landing':
        return <LandingPage />;
      case 'splash':
        return <SplashScreen />;
      case 'login':
        return <LoginPage />;
      case 'login/email':
        return <EmailLogin />;
      case 'login/phone':
        return <PhoneLogin />;
      case 'register':
        return <Register />;
      case 'onboarding':
        return <OnboardingFlow />;
      case 'dashboard':
        return <DashboardPage />;
      case 'create-project':
        return <CreateProjectPage />;
      case 'generation-progress':
        return <GenerationProgressPage />;
      case 'project-view':
        return <ProjectViewPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'market-research':
      case 'location-intelligence':
        return <LocationIntelligencePage />;
      case 'location-search':
        return <LocationSearchPage />;
      case 'location-map':
        return <LocationMapPage />;
      case 'location-compare':
        return <LocationComparePage />;
      case 'visualizations':
      case 'business-visualization':
        return <BusinessVisualizationPage />;
      case 'financials':
      case 'business-simulator':
        return <BusinessSimulator />;
      case 'agents':
        return <AgentsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'business-plans':
      case 'documents':
        return <DocumentsPage />;
      case 'templates':
        return <TemplatesPage />;
      case 'team':
        return <WorkspacePage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'integrations':
        return <IntegrationsPage />;
      case 'settings':
      case 'profile':
        return <SettingsPage />;
      case 'chat':
        return <AIChatPage />;
      default:
        return user ? <AIChatPage /> : <LandingPage />;
    }
  };

  const isFullWidthPage = 
    currentPage === 'landing' || 
    currentPage === 'splash' || 
    currentPage === 'login' || 
    currentPage === 'login/email' || 
    currentPage === 'login/phone' || 
    currentPage === 'register' ||
    currentPage === 'onboarding';

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-background flex flex-col font-sans relative overflow-hidden text-foreground">
        
        {/* 3D Cinematic Background - Render only on landing and auth pages, delayed to avoid blocking LCP */}
      {['landing', 'splash', 'login', 'login/email', 'login/phone', 'register'].includes(currentPage) && show3D && (
        <React.Suspense fallback={null}>
          <ThreeBackground />
        </React.Suspense>
      )}

      {!isFullWidthPage && (
        <React.Suspense fallback={null}>
          <Navbar onSearchClick={() => setIsPaletteOpen(true)} />
        </React.Suspense>
      )}
      
      <div className="flex-1 flex mt-20">
        {user && !isFullWidthPage && (
          <>
            <React.Suspense fallback={null}>
              <Sidebar />
            </React.Suspense>
            {isMobileSidebarOpen && (
              <div 
                className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
                onClick={() => setMobileSidebarOpen(false)}
              />
            )}
          </>
        )}

        <main className={`flex-1 p-4 sm:p-6 lg:p-8 ${isFullWidthPage ? 'w-full' : 'max-w-7xl mx-auto'} relative`}>
            <div
              key={currentPage}
              className="w-full h-full animate-in fade-in duration-300"
            >
              <React.Suspense fallback={
                <div className="flex items-center justify-center h-full w-full min-h-[50vh]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              }>
                {renderPage()}
              </React.Suspense>
            </div>
        </main>
      </div>

      <React.Suspense fallback={null}>
        <ToastContainer />
      </React.Suspense>
      {user && (
        <React.Suspense fallback={null}>
          <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
        </React.Suspense>
      )}
      {user && !isFullWidthPage && (
        <React.Suspense fallback={null}>
          <FlowMenu />
        </React.Suspense>
      )}
      </div>
    </LazyMotion>
  );
};

