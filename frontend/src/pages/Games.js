import React, { useState, useEffect } from "react";
import GameDrop from "../components/GameDrop";
import GamePerformances from "../components/GamePerformances";
import { fetchTeams, fetchSeasons, fetchGamePerformance } from "../services/sbQueries";

const Games = () => {
    const [teams, setTeams] = useState([]);
    const [seasons, setSeasons] = useState([]);
    const [gameData, setGameData] = useState([]);
    const [formData, setFormData] = useState({ season: "", team: "" });

    useEffect(() => {
        const loadData = async () => {
            setTeams(await fetchTeams());
            setSeasons(await fetchSeasons());
        };
        loadData();
    }, []);

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (formData.team && formData.season) {
            const data = await fetchGamePerformance(formData.team, formData.season);
            setGameData(data);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center">Game Performances</h2>

            {/* Dropdown Form */}
            <div className="card p-3 mb-4">
                <form onSubmit={handleSubmit} className="d-flex flex-column align-items-center">
                    <GameDrop teams={teams} seasons={seasons} formData={formData} handleChange={handleChange} />
                    <button type="submit" className="btn btn-primary mt-3">Get Game Data</button>
                </form>
            </div>

            {/* Game Performances Table */}
            <GamePerformances gameData={gameData} />
        </div>
    );
};

export default Games;
