import React, { useEffect, useState } from 'react';
import { Link } from "react-router";
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../assets/css/Home.css';
import {
    fetchDriverStandings,
    fetchConstructorStandings,
    fetchNextEventCountdown,
    fetchDrivers,
    fetchNextEvent,
    fetchDriverStats,
    fetchConstructorStats,
    ConstructorStats,
    DriverStanding,
    DriverStats,
    TeamDrivers,
    ConstructorStanding,
    NextEventCountdown,
    NextEvent
} from '../assets/ts/home';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const Home: React.FC = () => {
    const [driverStandings, setDriverStandings] = useState<DriverStanding[]>([]);
    const [driverStats, setDriverStats] = useState<DriverStats[]>([]);
    const [constructorStandings, setConstructorStandings] = useState<ConstructorStanding[]>([]);
    const [constructorStats, setConstructorStats] = useState<ConstructorStats[]>([]);
    const [nextEvent, setnextEvent] = useState<NextEvent | null>(null);
    const [nextEventCountdown, setnextEventCountdown] = useState<NextEventCountdown | null>(null);
    const [teamDrivers, setTeamDrivers] = useState<TeamDrivers[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [expandedDriver, setExpandedDriver] = useState<number | null>(null);
    const [expandedConstructor, setExpandedConstructor] = useState<number | null>(null);

    useEffect(() => {
        fetchDriverStandings()
            .then(setDriverStandings)
            .catch(err => {
                console.error(err);
                setError(`Failed to load driver standings: ${err.message}`);
            });
    }, []);

    useEffect(() => {
        fetchConstructorStandings()
            .then(setConstructorStandings)
            .catch(err => {
                console.error(err);
                setError(`Failed to load constructor standings: ${err.message}`);
            });
    }, []);

    useEffect(() => {
        fetchNextEvent()
            .then(setnextEvent)
            .catch(err => {
                console.error(err);
                setError(`Failed to load next race: ${err.message}`);
            });
    }, []);


    useEffect(() => {
        fetchDrivers()
            .then(setTeamDrivers)
            .catch(err => {
                console.error(err);
                setError(`Failed to load drivers: ${err.message}`);
            });
    }, []);

    useEffect(() => {
        fetchDriverStats()
            .then(setDriverStats)
            .catch(err => {
                console.error(err);
                setError(`Failed to load driver stats: ${err.message}`);
            });
    }, []);

    useEffect(() => {
        fetchConstructorStats()
            .then(setConstructorStats)
            .catch(err => {
                console.error(err);
                setError(`Failed to load constructor stats: ${err.message}`);
            });
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        fetchNextEventCountdown()
            .then(data => {
                setnextEventCountdown(data);

                // Calculate target race time based on the initial countdown
                const now = new Date();
                const targetTime = new Date(now.getTime() +
                    (data.days * 24 * 60 * 60 * 1000) +
                    (data.hours * 60 * 60 * 1000) +
                    (data.minutes * 60 * 1000) +
                    (data.seconds * 1000)
                );

                // Update countdown every second
                interval = setInterval(() => {
                    const currentTime = new Date();
                    const diff = targetTime.getTime() - currentTime.getTime();

                    if (diff <= 0) {
                        setnextEventCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                        if (interval) clearInterval(interval);
                        return;
                    }

                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                    setnextEventCountdown({ days, hours, minutes, seconds });
                }, 1000);
            })
            .catch(err => {
                console.error(err);
                setError(`Failed to load next race countdown: ${err.message}`);
            });

        // Cleanup interval on unmount or when fetchnextEventCountdown changes
        return () => {
            if (interval) clearInterval(interval);
        };
    }, []);

    return (
        <>
            <Header />

            <main className='content'>

                <div id="next-race-container">
                    <div className="title-container">
                        <div className="title">
                            <h1>Next Race</h1>
                        </div>
                        {nextEvent && (
                            <div className="country-info">
                                <img
                                    className="flag-rect"
                                    src={`https://flagcdn.com/w320/${nextEvent.countryCode}.png`}
                                    alt={`${nextEvent.country} flag`}
                                />
                                <p>{nextEvent.country}</p>
                            </div>
                        )}
                    </div>

                    <div id="next-race-card">
                        {nextEvent ? (
                            <>
                                <div id="next-race-info">
                                    <p>{nextEvent.location}</p>
                                    <p>{nextEvent.raceDate} {nextEvent.raceTime}</p>
                                    <p>{nextEvent.eventType}</p>
                                </div>


                                <div id="next-race-countdown-container">
                                    {nextEventCountdown && (
                                        <>
                                            <div className="countdown-column">
                                                <span className="countdown-number">{nextEventCountdown.days}</span>
                                                <span className="countdown-label">days</span>
                                            </div>
                                            <div className="countdown-column">
                                                <span className="countdown-number">{nextEventCountdown.hours}</span>
                                                <span className="countdown-label">hours</span>
                                            </div>
                                            <div className="countdown-column">
                                                <span className="countdown-number">{nextEventCountdown.minutes}</span>
                                                <span className="countdown-label">minutes</span>
                                            </div>
                                            <div className="countdown-column">
                                                <span className="countdown-number">{nextEventCountdown.seconds}</span>
                                                <span className="countdown-label">seconds</span>
                                            </div>
                                        </>
                                    )}
                                </div>

                            </>
                        ) : (
                            <p>Loading next race...</p>
                        )}
                    </div>
                </div>

                <div className="grid">
                    <div id="driver-standings">
                        <div className="title-container">
                            <div className="title">
                                <p>2025 Driver Standings</p>
                            </div>
                        </div>

                        <ul id="standings-table">
                            {driverStandings.length > 0 ? (
                                driverStandings.slice(0, 3).map((driver) => {
                                    const isExpanded = expandedDriver === driver.position;
                                    return (
                                        <li key={driver.position} id="driver-row">
                                            <div id="driver-summary">
                                                <div id="driver-info">
                                                    <strong className="position">{driver.position}</strong>
                                                    <img
                                                        className="flag"
                                                        src={`https://flagcdn.com/w320/${driver.nationality}.png`}
                                                        alt={`${driver.nationality} flag`}
                                                    />
                                                    <div>
                                                        {driver.name}
                                                        <small>{driver.constructor}</small>
                                                    </div>
                                                </div>
                                                <span className="points">{driver.points} pts</span>
                                            </div>

                                            <hr />

                                            <div id="driver-footer">
                                                <span className="more-info"><small>More stats</small></span>
                                                <div
                                                    className="driver-arrow"
                                                    onClick={() =>
                                                        setExpandedDriver(
                                                            expandedDriver === driver.position ? null : driver.position
                                                        )
                                                    }
                                                >
                                                    {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                </div>
                                            </div>

                                            {isExpanded && driverStats && (
                                                <div id="driver-details"
                                                    className={isExpanded ? "expanded" : "collapsed"}>
                                                    {(() => {
                                                        const stats = driverStats.find(ds => ds.id === driver.id);
                                                        if (!stats) return null;
                                                        return (
                                                            <>
                                                                <div id="driver-details-col">
                                                                    <span className="number">{stats.poles}</span>
                                                                    <span className="label">Poles</span>
                                                                </div>
                                                                <div id="driver-details-col">
                                                                    <span className="number">{stats.podiums}</span>
                                                                    <span className="label">Podiums</span>
                                                                </div>
                                                                <div id="driver-details-col">
                                                                    <span className="number">{stats.wins}</span>
                                                                    <span className="label">Wins</span>
                                                                </div>
                                                                <div id="driver-details-col">
                                                                    <span className="number">{stats.dnfs}</span>
                                                                    <span className="label">DNFs</span>
                                                                </div>
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            )}
                                        </li>
                                    );
                                })
                            ) : (
                                <li>No standings available.</li>
                            )}
                        </ul>

                        {driverStandings.length > 3 && (
                            <Link to="/seasons">See more</Link>
                        )}
                    </div>

                    <div id="constructor-standings">
                        <div className="title-container">
                            <div className="title">
                                <p>2025 Constructor Standings</p>
                            </div>
                        </div>
                        
                        <ul id="standings-table">
                            {constructorStandings.length > 0 ? (
                                constructorStandings.slice(0, 3).map((constructor) => {
                                    const isExpanded = expandedConstructor === constructor.position;
                                    return (
                                        <li key={constructor.position} id="constructor-row">
                                            <div id="constructor-summary">
                                                <div id="constructor-info">
                                                    <strong className="position">{constructor.position}</strong>
                                                    <img
                                                        className="flag"
                                                        src={`https://flagcdn.com/w320/${constructor.nationality}.png`}
                                                        alt={`${constructor.nationality} flag`}
                                                    />
                                                    <div>
                                                        {constructor.name}
                                                        <small>
                                                            {error ? (
                                                                "Error loading drivers"
                                                            ) : teamDrivers.length > 0 ? (
                                                                (() => {
                                                                    const drivers = teamDrivers.find(t => t.id === constructor.id)?.drivers || [];
                                                                    if (drivers.length >= 2) {
                                                                        return `${drivers[0]} | ${drivers[1]}`;
                                                                    } else if (drivers.length === 1) {
                                                                        return `${drivers[0]} | Driver 2 TBD`;
                                                                    }
                                                                    return `No drivers found for ${constructor.name}`;
                                                                })()
                                                            ) : (
                                                                "Loading drivers..."
                                                            )}
                                                        </small>
                                                    </div>
                                                </div>
                                                <span className="points">{constructor.points} pts</span>
                                            </div>

                                            <hr />

                                            <div id="constructor-footer">
                                                <span className="more-info"><small>More stats</small></span>
                                                <div
                                                    className="constructor-arrow"
                                                    onClick={() =>
                                                        setExpandedConstructor(
                                                            expandedConstructor === constructor.position ? null : constructor.position
                                                        )
                                                    }
                                                >
                                                    {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                </div>
                                            </div>

                                            {isExpanded && constructorStats && (
                                                <div id="constructor-details">
                                                    {(() => {
                                                        const stats = constructorStats.find(cs => cs.id === constructor.id);
                                                        if (!stats) return null;
                                                        return (
                                                            <>
                                                                <div id="constructor-details-col">
                                                                    <span className="number">{stats.poles}</span>
                                                                    <span className="label">Poles</span>
                                                                </div>
                                                                <div id="constructor-details-col">
                                                                    <span className="number">{stats.podiums}</span>
                                                                    <span className="label">Podiums</span>
                                                                </div>
                                                                <div id="constructor-details-col">
                                                                    <span className="number">{stats.wins}</span>
                                                                    <span className="label">Wins</span>
                                                                </div>
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            )}
                                        </li>
                                    );
                                })
                            ) : (
                                <li>No standings available.</li>
                            )}

                        </ul>
                        {constructorStandings.length > 3 && (
                            <Link to="/seasons">See more</Link>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
};
export default Home;
