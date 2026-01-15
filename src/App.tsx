import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home';
import Temples from './pages/Temple/Temples';
import TempleDetailsPage from './pages/Temple/TempleDetailsPage';
import Store from './pages/Store';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/temples" element={<Temples />} />
          <Route path="/temples/:id" element={<TempleDetailsPage />} />
          <Route path="/store" element={<Store />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
