import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Team from './pages/Team';
import TeamComparison from './pages/TeamComparison';
import Games from './pages/Games';
import './styles/custom.scss';



const App = () => {
  return (
    <Router>
      {/* Navigation Bar */}
      <nav className='navbar navbar-expand-lg navbar-dark bg-primary'>
        <div className='container-fluid'>
          <Link className='navbar-brand' to='/'>CFB Matchup Tool</Link>

          {/* toggle button */}
          <button
            className='navbar-toggler'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#navbarNav'
            aria-controls='navbarNav'
            aria-expanded='false'
            aria-label='Toggle navigation'
            >
            <span className='navbar-toggler-icon'></span>
          </button>

          <div className='collapse navbar-collapse' id='navbarNav'>
            <div className='navbar-nav ms-auto'>
              <Link className='nav-link text-white' to='/'>Home</Link>
              <Link className='nav-link text-white' to='/about/'>About</Link>
              <Link className='nav-link text-white' to='/team/'>Team View</Link>
              <Link className='nav-link text-white' to='/team-comparison/'>Compare Team Seasons</Link>
              <Link className='nav-link text-white' to='/games/'>Game View</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className='container mt-4'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about/' element={<About />} />
          <Route path='/team/' element={<Team />} />
          <Route path='/team-comparison/' element={<TeamComparison />} />
          <Route path='/games/' element={<Games />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
