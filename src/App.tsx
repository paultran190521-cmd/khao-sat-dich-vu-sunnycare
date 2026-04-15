import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Survey from './pages/Survey';
import Success from './pages/Success';
import Admin from './pages/Admin';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Survey />} />
        <Route path="/success" element={<Success />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}
