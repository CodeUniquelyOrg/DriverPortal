//
// Root Component
//
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

// Helper for the routes
import { renderRoutes } from 'react-router-config';

// Add Google Analytics
import Analytics from 'components/Analytics';

// Import the client routes from config file
import routes from './routes';

// Base stylesheets
import './global.css';
import './main.css';

const AppRouter = () => (
  <Router>
    <div>
      <Analytics />
      {renderRoutes(routes)}
    </div>
  </Router>
);

export default AppRouter;
