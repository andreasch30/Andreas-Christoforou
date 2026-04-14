import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Inbox from './components/Inbox';
import Settings from './components/Settings';
import HelpCenter from './components/HelpCenter';
import About from './components/About';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}
