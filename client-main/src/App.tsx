import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Transfer from './components/Transfer';
import Asset from './components/Asset';
import Home from './components/Home';
import AddBalance from './components/AddBalance';
import Withdraw from './components/Withdraw';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/asset" element={<Asset />} />
        <Route path="/addbalance/:address" element={<AddBalance />} />
        <Route path="/withdraw/:address" element={<Withdraw />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
