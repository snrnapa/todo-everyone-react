import './App.css';
import Header from './components/Header';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AuthenticatedContent from './AuthenticatedContent';

const App = () => {
  return (
      <div className="h-screen">
        <Header />
        <div className="h-20"></div>
        <div className="flex flex-col">
            <AuthenticatedContent />
        </div>
      </div>
  );
};

export default App;
