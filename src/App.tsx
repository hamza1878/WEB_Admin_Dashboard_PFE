import { useState } from 'react';
import AdminDashboard from './Dashboard/AdminDashboard';
import LoginAdmin from './auth/login';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  const [view, setView] = useState('login'); 

  return (
    <div>
      
        <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginAdmin />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;

