import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register necessary chart components
Chart.register(...registerables);


/* Table converted to graph using chart.js for Team view page, showing progression of metrics */
const TeamGameStats = ({ gameStats }) => {
    if (!gameStats.length) {
        return <p className="text-center">No game stats available</p>;
    }

    // Extract seasons and metrics for the graph
    const seasons = gameStats.map(stat => stat.season);

    // Offense Metrics
    const passingScores = gameStats.map(stat => stat.total_passing_offense_score);
    const rushingScores = gameStats.map(stat => stat.total_rushing_offense_score);
    const explosiveness = gameStats.map(stat => stat.avg_explosiveness);

    // Defense Metrics
    const defPassingScores = gameStats.map(stat => stat.total_passing_defense_score);
    const defRushingScores = gameStats.map(stat => stat.total_rushing_defense_score);
    const containment = gameStats.map(stat => stat.avg_allowed_explosiveness);

    // Static "Average" Line Data
    const avgLine = new Array(seasons.length).fill(50);

    // Chart Data for Offense Metrics
    const offenseData = {
        labels: seasons,
        datasets: [
            { label: 'Passing Score', data: passingScores, borderColor: 'blue', fill: false, showLine: false },
            { label: 'Rushing Score', data: rushingScores, borderColor: 'red', fill: false, showLine: false },
            { label: 'Explosiveness', data: explosiveness, borderColor: 'orange', fill: false, showLine: false },
            { label: 'Average (50)', data: avgLine, borderColor: 'black', borderDash: [5, 5], fill: false, showLine: false }
        ]
    };

    // Chart Data for Defense Metrics
    const defenseData = {
        labels: seasons,
        datasets: [
            { label: 'Defensive Passing Score', data: defPassingScores, borderColor: 'blue', fill: false },
            { label: 'Defensive Rushing Score', data: defRushingScores, borderColor: 'red', fill: false },
            { label: 'Containment', data: containment, borderColor: 'orange', fill: false },
            { label: 'Average (50)', data: avgLine, borderColor: 'black', borderDash: [5, 5], fill: false }
        ]
    };

    // Chart options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { title: { display: true, text: 'Season' } },
            y: {
                title: { display: true, text: 'Score' },
                min: -10,   // Set minimum Y value
                max: 115,   // Set maximum Y value
                ticks: {
                    stepSize: 10 // expand
                }
            }
        }
    };

    return (
        <div>
            {/* Offense Metrics Graph */}
            <div className="card p-3 mb-4">
                <h4 className="text-center">Offensive Metrics Over Time</h4>
                <div style={{ height: "300px" }}>
                    <Line data={offenseData} options={options} />
                </div>
            </div>

            {/* Defense Metrics Graph */}
            <div className="card p-3 mb-4">
                <h4 className="text-center">Defensive Metrics Over Time</h4>
                <div style={{ height: "300px" }}>
                    <Line data={defenseData} options={options} />
                </div>
            </div>
        </div>
    );
};

export default TeamGameStats;
