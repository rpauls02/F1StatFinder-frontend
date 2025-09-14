import React, { useEffect, useState } from 'react';
import '../assets/css/Seasons.css'
import Header from '../components/Header';
import Footer from '../components/Footer';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
    fetchSeasons,
    Season,
    fetchDriverPoints,
    DriverPoints,
    fetchConstructorPoints,
    ConstructorPoints,
    Race,
    fetchRaceCalendar

} from '../assets/ts/seasons';


const Seasons: React.FC = () => {

    const currentYear = new Date().getFullYear();

    const [error, setError] = useState<string | null>(null);
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [selectedSeason, setSelectedSeason] = useState<number>(currentYear);
    const [driverPoints, setDriverPoints] = useState<DriverPoints[]>([]);
    const [constructorPoints, setConstructorPoints] = useState<ConstructorPoints[]>([]);
    const [raceCalendar, setRaceCalendar] = useState<Race[]>([]);


    useEffect(() => {
        fetchSeasons()
            .then(setSeasons)
            .catch(err => {
                console.error(err);
                setError(`Failed to load seasons: ${err.message}`);
            });
    }, []);

    useEffect(() => {
        fetchRaceCalendar(selectedSeason)
            .then(setRaceCalendar)
            .catch(err => {
                console.error(err);
                setError(`Failed to load race calendar: ${err.message}`);
            });
    }, [selectedSeason]);

    useEffect(() => {
        if (selectedSeason !== null) {
            fetchDriverPoints(selectedSeason)
                .then(setDriverPoints)
                .catch(err => {
                    console.error(err);
                    setError(`Failed to load driver points: ${err.message}`);
                });
        }
    }, [selectedSeason]);

    useEffect(() => {
        if (selectedSeason !== null) {
            fetchConstructorPoints(selectedSeason)
                .then(setConstructorPoints)
                .catch(err => {
                    console.error(err);
                    setError(`Failed to load constructor points: ${err.message}`);
                });
        }
    }, [selectedSeason]);


    return (
        <>
            <Header />
            <main className='content'>
                <div id="season-select-container">
                    <button
                        onClick={() => {
                            if (selectedSeason !== null) {
                                const currentIndex = seasons.findIndex(s => s.year === selectedSeason);
                                if (currentIndex < seasons.length - 1) {
                                    setSelectedSeason(seasons[currentIndex + 1].year);
                                }
                            }
                        }}
                        disabled={!selectedSeason || seasons.findIndex(s => s.year === selectedSeason) >= seasons.length - 1}
                    >
                        <KeyboardArrowLeftIcon style={{ fontSize: 30, color: 'white' }} />
                    </button>

                    <select
                        name="year"
                        id="season-select"
                        value={selectedSeason ?? ""}
                        onChange={(e) => setSelectedSeason(parseInt(e.target.value))}
                    >
                        <option value="" disabled >Select year</option>
                        {seasons.map((s) => (
                            <option key={s.year} value={s.year}>
                                {s.year}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={() => {
                            if (selectedSeason !== null) {
                                const currentIndex = seasons.findIndex(s => s.year === selectedSeason);
                                if (currentIndex > 0) {
                                    setSelectedSeason(seasons[currentIndex - 1].year);
                                }
                            }
                        }}
                        disabled={!selectedSeason || seasons.findIndex(s => s.year === selectedSeason) <= 0}
                    >
                        <KeyboardArrowRightIcon style={{ fontSize: 30, color: 'white' }} />
                    </button>
                </div>

                <div id="season-overview-container">
                    <div className="title-container">
                        <div className="title">
                            <h1>Season Overview</h1>
                        </div>
                    </div>

                    <div id="season-summary">
                        <p>🏆️ WDC:</p>
                        <p>🏎️ WCC:</p>
                        <p>🥇 Most wins:</p>
                        <p>🎯 Most poles:</p>
                        <p>🏅 Most podiums:</p>
                        <p>⏱️ Fastest lap:</p>
                    </div>
                </div>


                <div id="driver-standings-container">
                    <div className="title-container">
                        <div className="title">
                            <h1>Driver Standings</h1>
                        </div>
                    </div>

                    {driverPoints.length === 0 ? (
                        <p>Loading driver standings...</p>
                    ) : (
                        (() => {
                            // 1. Get full list of races from the first driver (or an empty array)
                            const allRaces = driverPoints[0]?.races.map(r => r.name) || [];

                            return (
                                <table className="standings-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Driver</th>
                                            {allRaces.map(raceName => {
                                                const race = driverPoints[0].races.find(r => r.name === raceName);
                                                return <th key={raceName}>{race?.country || raceName}</th>;
                                            })}
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {driverPoints.map((driver, idx) => (
                                            <tr key={driver.driverId} className={idx % 2 === 0 ? "even-row" : "odd-row"}>
                                                <td className="position">{driver.position}</td>
                                                <td className="driver-name">{driver.name}</td>
                                                {allRaces.map(raceName => {
                                                    const race = driver.races.find(r => r.name === raceName);
                                                    let points = race?.points ?? 0;
                                                    let position = race?.position ?? 0;

                                                    let pointsClass = "";
                                                    if (position === 1) pointsClass = "gold"; // 1st place
                                                    else if (position === 2) pointsClass = "silver"; // 2nd place
                                                    else if (position === 3) pointsClass = "bronze"; // 3rd place

                                                    return (
                                                        <td key={raceName} className={`points ${pointsClass}`}>
                                                            {points > 0 ? points : "-"}
                                                        </td>
                                                    );
                                                })}
                                                <td className="total-points">{driver.total}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            );
                        })()
                    )}

                </div>

                <div id="constructor-standings-container">
                    <div className="title-container">
                        <div className="title">
                            <h1>Constructor Standings</h1>
                        </div>
                    </div>

                    {constructorPoints.length === 0 ? (
                        <p>Loading constructor standings...</p>
                    ) : (
                        (() => {
                            const allRaces = constructorPoints[0]?.races.map(r => r.name) || [];

                            return (
                                <table className="standings-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Constructor</th>
                                            {allRaces.map(raceName => {
                                                const race = constructorPoints[0].races.find(r => r.name === raceName);
                                                return <th key={raceName}>{race?.country || raceName}</th>;
                                            })}
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {constructorPoints.map((constructor, idx) => (
                                            <tr key={constructor.constructorId} className={idx % 2 === 0 ? "even-row" : "odd-row"}>
                                                <td className="position">{constructor.position}</td>
                                                <td className="constructor-name">{constructor.constructor}</td>
                                                {allRaces.map(raceName => {
                                                    const race = constructor.races.find(r => r.name === raceName);
                                                    let points = race?.points ?? 0;
                                                    let position = race?.position ?? 0;

                                                    let pointsClass = "";
                                                    if (position === 1) pointsClass = "gold"; // 1st place
                                                    else if (position === 2) pointsClass = "silver"; // 2nd place
                                                    else if (position === 3) pointsClass = "bronze"; // 3rd place

                                                    return (
                                                        <td key={raceName} className={`points ${pointsClass}`}>
                                                            {points > 0 ? points : "-"}
                                                        </td>
                                                    );
                                                })}
                                                <td className="total-points">{constructor.total}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            );
                        })()
                    )}
                </div>
            </main >
            <Footer />
        </>);
}

export default Seasons;