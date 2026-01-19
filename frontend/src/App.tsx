import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";

// Layouts & Pages
import LoadingScreen from "./components/ui/LoadingScreen";
import Navbar from "./layouts/Navbar";
import Footer from "./layouts/Footer";
import LandingPage from "./pages/LandingPage";
import DocsPage from "./pages/Document";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";

/**
 * Helper: ScrollToTop
 * Ensures the window scrolls to top on every route change.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

/**
 * Main App Component
 */
export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading (or replace with actual auth checks)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 seconds feels snappy but deliberate

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <BrowserRouter>
      <ScrollToTop />
      
      {/* Standard Flexbox wrapper to push footer to bottom.
          min-h-screen ensures the page is at least the height of the viewport.
      */}
      <div className="flex flex-col min-h-screen bg-[#121212] selection:bg-white selection:text-black">
        
        <Navbar />

        {/* Main Content Area */}
        <main id="main-content" className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* 404 Handler - Optional but recommended */}
            <Route 
              path="*" 
              element={
                <div className="flex items-center justify-center h-[60vh] text-white">
                  <h1 className="text-2xl font-bold tracking-tighter">404 | Protocol Not Found</h1>
                </div>
              } 
            />
          </Routes>
        </main>

        <Footer />
        
        {/* Global UI Components */}
        <Toaster 
          position="top-right" 
          richColors 
          theme="dark" 
          closeButton
          toastOptions={{
            style: { background: '#181818', border: '1px solid rgba(255,255,255,0.1)', color: '#E0E0E0' },
          }}
        />
      </div>
    </BrowserRouter>
  );
}