import React, { useState, useEffect } from "react";
import {
    fetchPassLeaders,
    fetchRushLeaders,
    fetchExplosiveLeaders,
    fetchPassDefenseLeaders,
    fetchRushDefenseLeaders,
    fetchContainmentLeaders
} from "../services/sbQueries";

/* Leaderboard components (6 total) shown on Home page */
const HomeLeaders = () => {
    const [passLeaders, setPassLeaders] = useState([]);
    const [rushLeaders, setRushLeaders] = useState([]);
    const [explosiveLeaders, setExplosiveLeaders] = useState([]);
    const [passDefenseLeaders, setPassDefenseLeaders] = useState([]);
    const [rushDefenseLeaders, setRushDefenseLeaders] = useState([]);
    const [containmentLeaders, setContainmentLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

useEffect(() => {
    const loadLeaders = async () => {
    try {
        console.log("Fetching Passing Leaders...");
        const pass = await fetchPassLeaders();
        console.log("Fetched Passing Leaders:", pass);

        console.log("Fetching Rushing Leaders...");
        const rush = await fetchRushLeaders();
        console.log("Fetched Rushing Leaders:", rush);

        console.log("Fetching Explosiveness Leaders...");
        const explosive = await fetchExplosiveLeaders();
        console.log("Fetched Explosiveness Leaders:", explosive);

        console.log("Fetching Pass Defense Leaders...");
        const passDef = await fetchPassDefenseLeaders();
        console.log("Fetched Pass Defense Leaders:", passDef);

        console.log("Fetching Rush Defense Leaders...");
        const rushDef = await fetchRushDefenseLeaders();
        console.log("Fetched Rush Defense Leaders:", rushDef);

        console.log("Fetching Containment Leaders...");
        const containment = await fetchContainmentLeaders();
        console.log("Fetched Containment Leaders:", containment);

        setPassLeaders(pass);
        setRushLeaders(rush);
        setExplosiveLeaders(explosive);
        setPassDefenseLeaders(passDef);
        setRushDefenseLeaders(rushDef);
        setContainmentLeaders(containment);
    } catch (err) {
        console.error("Error fetching leaderboards:", err);
        setError("Failed to load leaderboards.");
    } finally {
        setLoading(false);
    }
};


    loadLeaders();
}, []);


    if (loading) {
        return <p className="text-center">Loading leaderboards...</p>;
    }

    if (error) {
        return <p className="text-center text-danger">{error}</p>;
    }

    return (
        <div className="container mt-4">
            <h2 className="text-center">Metric Leaderboards</h2>
            <div className="row">
                {[
                    { title: "Offensive Passing Score", data: passLeaders, field: "total_passing_offense_score" },
                    { title: "Offensive Rushing Score", data: rushLeaders, field: "total_rushing_offense_score" },
                    { title: "Offense Explosiveness", data: explosiveLeaders, field: "avg_explosiveness" },
                    { title: "Pass Defense Score", data: passDefenseLeaders, field: "total_passing_defense_score" },
                    { title: "Rush Defense Score", data: rushDefenseLeaders, field: "total_rushing_defense_score" },
                    { title: "Defense Containment", data: containmentLeaders, field: "avg_allowed_explosiveness" }
                ].map((category, index) => (
                    <div className="col-md-4 mb-4" key={index}>
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title text-center">{category.title}</h5>
                                <table className="table table-bordered text-center">
                                    <thead>
                                        <tr>
                                            <th>Team</th>
                                            <th>Season</th>
                                            <th>Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                      {category.data.map((team) => {
                                        console.log(`Checking ${category.title}:`, team[category.field], typeof team[category.field]);
                                        return (
                                          <tr key={team.team_id}>
                                            <td>{team.team_name}</td>
                                            <td>{team.season}</td>
                                            <td>{Number(team[category.field]).toFixed(2)}</td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomeLeaders;
