import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Traveli from './pages/Traveli';
function App() {
  return (
    <BrowserRouter>
        <Routes>
			<Route path="/" element={<Traveli />} />
			<Route path="/Traveli" element={<Traveli />} />
        </Routes>
    </BrowserRouter>
  );
}
export default App;