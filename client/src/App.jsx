import { BrowserRouter as Router, Routes, Route, Outlet, useLocation, Link, Navigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

import Landing from './pages/Landing.jsx';
import About from './pages/About.jsx';
import HowItWorks from './pages/HowItWorks.jsx';
import Disclaimer from './pages/MedicalDisclaimer.jsx';
import NewAnalysis from './pages/NewAnalysis.jsx';
import AnalysisResult from './pages/AnalysisResult.jsx';
import AnalysisHistory from './pages/AnalysisHistory.jsx';
import AnalysisDetails from './pages/AnalysisDetails.jsx';
import FindDermatologist from './pages/FindDermatologist.jsx';
import SkinConditions from './pages/SkinConditions.jsx';
import Comparison from './pages/Comparison.jsx';
import AskSkinova from './pages/AskSkinova.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

const PublicLayout = () => {
  const location = useLocation();
  const isChatPage = location.pathname === '/ask-skinova';

  return (
    <div className="flex flex-col min-h-screen bg-surface-50 relative">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />

      {/* Global AI Assistant Floating Button */}
      {!isChatPage && (
        <Link
          to="/ask-skinova"
          className="fixed bottom-6 right-6 z-50 bg-skinova-dark hover:bg-skinova-olive text-white p-4 rounded-full shadow-2xl shadow-skinova-dark/20 hover:scale-105 transition-all flex items-center justify-center border-[3px] border-white/40 group"
          title="Ask SKINOVA ✨"
        >
          <Sparkles className="w-6 h-6 group-hover:text-skinova-coral transition-colors" />
        </Link>
      )}
    </div>
  );
};

// Middleware wrapper for protected routes
const ProtectedRouteWrapper = () => {
  const isLoggedIn = !!localStorage.getItem('skinova_token');
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/ask-skinova" element={<AskSkinova />} />
          <Route path="/find-dermatologist" element={<FindDermatologist />} />
          <Route path="/skin-conditions" element={<SkinConditions />} />

          {/* Publicly Shareable Report */}
          <Route path="/analysis/result/:id" element={<AnalysisResult />} />

          {/* Protected Routes: Require Login */}
          <Route element={<ProtectedRouteWrapper />}>
            <Route path="/analysis/new" element={<NewAnalysis />} />
            <Route path="/history" element={<AnalysisHistory />} />
            <Route path="/history/:id" element={<AnalysisDetails />} />
            <Route path="/compare" element={<Comparison />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
