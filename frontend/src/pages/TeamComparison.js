import React, { useState, useEffect } from 'react';
import TeamComparisonDrop from '../components/TeamComparisonDrop';
import GameStats from '../components/GameStats';
import RecordBreakdown from '../components/RecordBreakdown';
import PostseasonResults from '../components/PostseasonResults';
import RecruitRankings from "../components/RecruitRankings";
import {
    fetchTeams,
    fetchSeasons,
    fetchGameStats,
    fetchRecordBreakdown,
    fetchPostseasonResults,
    fetchRecruitingRankings } from '../services/api';

const TeamComparison = () => {
    const [teams, setTeams] = useState([]);
    const [seasons, setSeasons] = useState([]);
    const [gameStats, setGameStats] = useState([]);
    const [recordBreakdown, setRecordBreakdown] = useState([]);
    const [postseasonResults, setPostseasonResults] = useState([]);
    const [recruitingData, setRecruitingData] = useState([]);
    const [formData, setFormData] = useState({
        season1: '',
        team1: '',
        season2: '',
        team2: ''
    });

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
        setGameStats(await fetchGameStats(formData.season1, formData.team1, formData.season2, formData.team2));
        setRecordBreakdown(await fetchRecordBreakdown(formData.season1, formData.team1, formData.season2, formData.team2));
        setPostseasonResults(await fetchPostseasonResults(formData.season1, formData.team1, formData.season2, formData.team2));
        setRecruitingData(await fetchRecruitingRankings(formData.season1, formData.team1, formData.season2, formData.team2));
    };

    return (
    <div className="container mt-4">
        <h2 className="text-center">Compare Team's Season Performance</h2>

        <div className="card p-3 mb-4">
            <form onSubmit={handleSubmit} className="d-flex flex-column align-items-center">
                <TeamComparisonDrop seasons={seasons} teams={teams} formData={formData} handleChange={handleChange} />
                <button type="submit" className="btn btn-primary mt-3">Compare</button>
            </form>
        </div>

        <div className="row">
            <div className="col-md-6">
                <GameStats gameStats={gameStats} formData={formData} />
            </div>
            <div className="col-md-6">
                <RecordBreakdown recordBreakdown={recordBreakdown} formData={formData} />
            </div>
        </div>

        <div className="row">
            <div className="col-md-6">
                <PostseasonResults postseasonResults={postseasonResults} formData={formData} />
            </div>
            <div className="col-md-6">
                <RecruitRankings recruitingData={recruitingData} formData={formData} />
            </div>
        </div>
    </div>

    );
};

export default TeamComparison;
