import React, { useEffect, useState } from 'react';
import Header from '../components/Header.tsx';
import Footer from '../components/Footer.tsx';
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
} from '../assets/ts/f1.ts';
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
                                    <div>
                                        {nextEvent.eventName} @ {nextEvent.location}
                                        {nextEvent.sessions
                                            .filter((session) => session.name.toLowerCase() === "race")
                                            .map((raceSession, index) => (
                                                <p key={index}>
                                                    {raceSession.date} {raceSession.time}
                                                </p>
                                            ))
                                        }
                                        {nextEvent.sessions.some(
                                            (session) => session.name.toLowerCase() === "sprint"
                                        ) ? (
                                            <p>Sprint Weekend</p>
                                        ) : (
                                            <p>Standard Weekend</p>
                                        )}
                                    </div>
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

                <div className="columns">
                    <div id="left-col">
                        <div id="driver-standings">
                            <div className="title-container">
                                <div className="title">
                                    <p>2025 Driver Standings</p>
                                </div>
                            </div>
                            <ul>
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
                                                                        <span className="number">{stats.dnf}</span>
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
                        </div>
                    </div>

                    <div id="right-col">
                        <div id="constructor-standings">
                            <div className="title-container">
                                <div className="title">
                                    <p>2025 Constructor Standings</p>
                                </div>
                            </div>
                            <ul>
                                {constructorStandings.length > 0 ? (
                                    constructorStandings.slice(0, 3).map((constructor) =>{
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
                        </div>
                    </div>


                    {/*<div id='stats'>
                        <h1>Explore Formula One statistics</h1>
                        <hr />
                        <div className='welcome-message'>
                            <p>Dive into a vast range of statistics from any era of Formula One.</p>
                        </div>



                        <div id='features-grid'>
                            <div id='seasons'>
                                <h2>Seasons</h2>
                                <hr />
                                <div className='grid-content'>
                                    <p>Explore different seasons </p>
                                    {champions.length > 0 && (
                                        <table className="standings-table">
                                            <thead>
                                                <tr>
                                                    <th className="left-align">Year</th>
                                                    <th className="left-align">WCC Winner</th>
                                                    <th className="left-align">WDC Champion</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {champions.map((c) => (
                                                    <tr key={c.year}>
                                                        <td className="left-align">{c.year}</td>
                                                        <td className="left-align">{c.wcc}</td>
                                                        <td className="left-align">{c.wdc}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>

                            <div id='tracks'>
                                <h2>Tracks</h2>
                                <hr />
                                <div className='grid-content'>
                                    <p>Discover new tracks</p>
                                </div>
                            </div>

                            <div id='constructors'>
                                <h2>Constructors</h2>
                                <hr />
                                <div className='grid-content'>
                                    <p>Discover the history of new and never heard teams</p>
                                    <p>Compare the development of constructors</p>
                                    <p>Feature 3</p>
                                    <table className="standings-table">
                                        <thead>
                                            <tr>
                                                <td colSpan={4} className="table-disclaimer" style={{ textAlign: 'center' }}>
                                                    <small>{new Date().getFullYear()} standings</small>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="left-align">#</th>
                                                <th className="left-align">Constructor</th>
                                                <th className="right-align">Points</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {constructorStandings.length > 0 ? (
                                                constructorStandings.slice(0, 3).map((constructor) => (
                                                    <tr key={constructor.position}>
                                                        <td className="left-align">{constructor.position}</td>
                                                        <td >{constructor.name}</td>
                                                        <td className="right-align">{constructor.points}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={4} style={{ textAlign: 'center' }}>
                                                        No standings available
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div id='drivers'>
                                <h2>Drivers</h2>
                                <hr />
                                <div className='grid-content'>
                                    <p>Pit your favourite drivers against each other</p>
                                    <p>Feature 2</p>
                                    <p>Feature 3</p>
                                    <table className="standings-table">
                                        <thead>
                                            <tr>
                                                <td colSpan={4} className="table-disclaimer" style={{ textAlign: 'center' }}>
                                                    <small>{new Date().getFullYear()} standings</small>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="left-align">#</th>
                                                <th className="left-align">Driver</th>
                                                <th className="left-align">Constructor</th>
                                                <th className="right-align">Points</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {driverStandings.length > 0 ? (
                                                driverStandings.slice(0, 3).map((driver) => (
                                                    <tr key={driver.position}>
                                                        <td className="left-align">{driver.position}</td>
                                                        <td className="left-align">{driver.driver}</td>
                                                        <td>{driver.constructor}</td>
                                                        <td className="right-align">{driver.points}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={4} style={{ textAlign: 'center' }}>
                                                        Standings not available
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>*/}
                </div>

                {/*<div id="insights">
                        <h1>Create unique insights</h1>
                        <hr />
                        <div className='welcome-message'>
                            <p>Create and visualise your own unique insights with StatSim.</p>
                        </div>
                    </div>
                </div>*/}
            </main>

            <Footer />
        </>
    );
};
export default Home;
