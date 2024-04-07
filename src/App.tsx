import './App.css';
import Header from './components/Header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthenticatedContent from './AuthenticatedContent';
import Contact from './pages/Contact';

const App = () => {
  return (
    <div className="h-screen">
      <BrowserRouter>
        <Header />
        <div className="h-20"></div>
        <Routes>
          <Route path={`/`} element={<AuthenticatedContent />} />
          <Route path={`/contact`} element={<Contact />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
