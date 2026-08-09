import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
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

const PublicLayout = () => (
  <div className="flex flex-col min-h-screen bg-surface-50">
    <Navbar />
    <main className="flex-1 pt-16">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/disclaimer" element={<Disclaimer />} />

          {/* Previously Protected Routes, now Public */}
          <Route path="/analysis/new" element={<NewAnalysis />} />
          <Route path="/analysis/result/:id" element={<AnalysisResult />} />
          <Route path="/history" element={<AnalysisHistory />} />
          <Route path="/history/:id" element={<AnalysisDetails />} />
          <Route path="/compare" element={<Comparison />} />
          <Route path="/ask-skinova" element={<AskSkinova />} />
          <Route path="/find-dermatologist" element={<FindDermatologist />} />
          <Route path="/skin-conditions" element={<SkinConditions />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
