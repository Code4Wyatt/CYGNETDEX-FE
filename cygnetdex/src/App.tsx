import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './pages/Home/index';
import CrossChain from './pages/CrossChain';
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/cross-chain' element={<CrossChain />} />
      </Routes>
    </Router>
  );
}

export default App;
