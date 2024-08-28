import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Game1 from './Games/Game1';
import Game2 from './Games/Game2';
import Game3 from './Games/Game3';
import Game4 from './Games/Game4';
import Game5 from './Games/Game5';
import Game6 from './Games/Game6';
import Game7 from './Games/Game7';

function App() {
  return (
    
    <Router>
      <div>
        <Routes>
          <Route path="/game1" element={<Game1 />} />
          <Route path="/game2" element={<Game2 />} />
          <Route path="/game3" element={<Game3 />} />
          <Route path="/game4" element={<Game4 />} />
          <Route path="/game5" element={<Game5 />} />
          <Route path="/game6" element={<Game6 />} />
          <Route path="/game7" element={<Game7 />} />

        </Routes>
        <br />
        <br />
      </div>
    </Router>
  );
}

export default App;