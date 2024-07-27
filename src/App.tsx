import './App.css';
import Header from './components/Header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthenticatedContent from './AuthenticatedContent';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import TodoInfo from './pages/TodoInfo';
import { motion } from 'framer-motion';

const App = () => {
  return (
    <div className="h-screen">
      <BrowserRouter>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
          className="h-screen flex flex-col"
        >
          <Header />
          <div className="h-20"></div>
          <Routes>
            <Route path={`/`} element={<AuthenticatedContent />} />
            <Route path={`/contact`} element={<Contact />} />
            <Route path={`/privacy`} element={<Privacy />} />
            <Route path={`/todo/:id`} element={<TodoInfo />} />
          </Routes>
        </motion.div>
      </BrowserRouter>
    </div>
  );
};

export default App;
