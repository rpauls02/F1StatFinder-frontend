import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import '../assets/css/Header.css'
import logo from '../assets/img/logo.png';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <header>
            <nav className="navbar">
                <img
                    src={logo}
                    alt="logo"
                    onClick={() => navigate("/")}
                />
                <ul className="navbar-main">
                    <li
                        className={isActive("/seasons") ? "active" : ""}
                        onClick={() => navigate("/seasons")}
                    >
                        Seasons
                    </li>
                    <li
                        className={isActive("/tracks") ? "active" : ""}
                        onClick={() => navigate("/tracks")}
                    >
                        Tracks
                    </li>
                    <li
                        className={isActive("/constructors") ? "active" : ""}
                        onClick={() => navigate("/constructors")}
                    >
                        Constructors
                    </li>
                    <li
                        className={isActive("/drivers") ? "active" : ""}
                        onClick={() => navigate("/drivers")}
                    >
                        Drivers
                    </li>
                    {/*<li
                        className={isActive("/statsim") ? "active" : ""}
                        onClick={() => navigate("/statsim")}
                    >
                        StatSim
                    </li>*/}
                </ul>

                
            </nav>
        </header>
    );
};

export default Header;
