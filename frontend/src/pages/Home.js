import React from "react";
import HomeLeaders from "../components/HomeLeaders";

const Home = () => {
    return (
        <div>
            <h2 className="text-center mt-4">Welcome to the CFB Matchup Tool</h2>
            <p className="text-center">Explore historical and current season performances of FBS college football teams since 2014.</p>
            <HomeLeaders />
        </div>
    );
};

export default Home;

