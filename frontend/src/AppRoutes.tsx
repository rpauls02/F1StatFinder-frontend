import React from 'react';
import { Route, Routes } from 'react-router';
import Home from './components/Home.tsx';
import Constructors from './components/Constructors.tsx';
import Drivers from './components/Drivers.tsx';
import Seasons from './components/Seasons.tsx';
import Tracks from './components/Tracks.tsx';
import NotFound from './components/NotFound.tsx';

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/constructors" element={<Constructors />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/seasons" element={<Seasons />} />
            <Route path="/tracks" element={<Tracks />} />
            <Route path="/404" element={<NotFound />} />
        </Routes>
    );
}

export default AppRoutes;
