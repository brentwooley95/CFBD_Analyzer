import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';


const gradientBackgroundPlugin = {
  id: 'yBackgroundColor',
  beforeDatasetsDraw(chart) {
    const { ctx, chartArea, scales } = chart;
    const { top, bottom, left, right } = chartArea;
    const yScale = scales.y;
    const min = yScale.min;
    const max = yScale.max;

    const normalize = (val) => (val - min) / (max - min);

    const stop40 = normalize(30);
    const stop60 = normalize(70);

    const gradient = ctx.createLinearGradient(0, bottom, 0, top);

    gradient.addColorStop(0, 'rgba(128, 0, 0, 0.2)');            // red
    gradient.addColorStop(stop40, 'rgba(255, 50, 0, 0.2)');     // yellow-red
    gradient.addColorStop(stop60, 'rgba(50, 255, 0, 0.2)');       // yellow
    gradient.addColorStop(1, 'rgba(0, 128, 0, 0.2)');            // top green

    ctx.save();
    ctx.fillStyle = gradient;
    ctx.fillRect(left, top, right - left, bottom - top);
    ctx.restore();
  }
};


// Register necessary chart components
Chart.register(...registerables, gradientBackgroundPlugin);


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
            { label: 'Passing Score', data: passingScores, borderColor: 'blue', backgroundColor: 'blue', showLine: false, pointRadius:6, pointHoverRadius: 8 },
            { label: 'Rushing Score', data: rushingScores, borderColor: 'red', backgroundColor: 'red', showLine: false, pointRadius:6, pointHoverRadius: 8 },
            { label: 'Explosiveness', data: explosiveness, borderColor: 'orange', backgroundColor: 'orange', showLine: false, pointRadius:6, pointHoverRadius: 8 },

            { label: 'Average (50)', data: avgLine, borderColor: 'black', borderDash: [5, 5], fill: false }
        ]
    };

    // Chart Data for Defense Metrics
    const defenseData = {
        labels: seasons,
        datasets: [
            { label: 'Defensive Passing Score', data: defPassingScores, borderColor: 'blue', backgroundColor: 'blue', showLine: false, pointRadius:6, pointHoverRadius: 8},
            { label: 'Defensive Rushing Score', data: defRushingScores, borderColor: 'red', backgroundColor: 'red', showLine: false, pointRadius:6, pointHoverRadius: 8},
            { label: 'Containment', data: containment, borderColor: 'orange', backgroundColor: 'orange', showLine: false, pointRadius:6, pointHoverRadius: 8},
            { label: 'Average (50)', data: avgLine, borderColor: 'black', borderDash: [5, 5], fill: false }
        ]
    };

    // Chart options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            yBackgroundColor: {}, // activate the plugin
            legend: { display: true }
        },
        scales: {
            x: { title: { display: true, text: 'Season' } },
            y: {
                title: { display: true, text: 'Score' },
                min: 0,   // Set minimum Y value
                max: 100,   // Set maximum Y value
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
