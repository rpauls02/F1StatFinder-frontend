import React from 'react';
import '../assets/css/Footer.css'
import discord_logo from '../assets/img/discord-white.png';
import x_logo from '../assets/img/x-white.png';

const Footer: React.FC = () => {
    return (
        <footer>
            <div id="contacts">
                <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
                    <img src={x_logo} alt="X-logo" style={{  }} />
                </a>
                <a href="https://discord.com/" target="_blank" rel="noopener noreferrer">
                    <img src={discord_logo} alt="discord-logo" style={{  }} />
                </a>
            </div>

            <div id="disclaimer">
                <p>Copyright © 2025 Robert Pauls. All rights reserved</p>
                <p>
                    This website is unofficial and is not associated in any way with the Formula 1 companies.
                    <br/>
                    F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX and related marks are
                    trademarks of Formula One Licensing B.V.
                </p>
            </div>


        </footer>
    );
};

export default Footer;
