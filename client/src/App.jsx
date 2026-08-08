import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

// Public pages
import Landing from './pages/Landing.jsx';
import About from './pages/About.jsx';
import HowItWorks from './pages/HowItWorks.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Disclaimer from './pages/MedicalDisclaimer.jsx';

// Authenticated pages
import Dashboard from './pages/Dashboard.jsx';
import NewAnalysis from './pages/NewAnalysis.jsx';
import AnalysisResult from './pages/AnalysisResult.jsx';
import AnalysisHistory from './pages/AnalysisHistory.jsx';
import AnalysisDetails from './pages/AnalysisDetails.jsx';
import FindDermatologist from './pages/FindDermatologist.jsx';
import Profile from './pages/Profile.jsx';
import Settings from './pages/Settings.jsx';

const PublicLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1 pt-16">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const AuthLayout = () => (
  <div className="min-h-screen bg-surface-950">
    <Navbar />
    <main className="pt-16 min-h-screen">
      <Outlet />
    </main>
  </div>
);

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes with footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
          </Route>

          {/* Auth routes (no footer) */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected authenticated routes */}
          <Route element={<ProtectedRoute><AuthLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analysis/new" element={<NewAnalysis />} />
            <Route path="/analysis/result/:id" element={<AnalysisResult />} />
            <Route path="/history" element={<AnalysisHistory />} />
            <Route path="/history/:id" element={<AnalysisDetails />} />
            <Route path="/find-dermatologist" element={<FindDermatologist />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
