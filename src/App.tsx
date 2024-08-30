import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import MainApp from './components/MainApp';
import PopoutPreview from './components/PopoutPreview';
import Home from './app/page';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/popout" element={<PopoutPreview />} />
      </Routes>
    </Router>
  );
}

export default App;