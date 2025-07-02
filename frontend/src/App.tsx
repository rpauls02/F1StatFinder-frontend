import React from 'react';
import { BrowserRouter as Router } from 'react-router';
import AppRoutes from './AppRoutes.tsx';
import './assets/css/App.css';

const App: React.FC = () => {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
};

export default App;