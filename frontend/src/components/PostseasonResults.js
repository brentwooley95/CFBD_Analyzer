import React from 'react';


/* Dual table component showing two team's postseason results on Team Comparison page */
const PostseasonResults = ({ postseasonResults, formData }) => {
    console.log("Postseason Results in Component:", postseasonResults);
    console.log("Form Data in Component:", formData);

    const team1Postseason = postseasonResults.find(
        team => team.team_name === formData.team1 && team.season === Number(formData.season1)
    );

    const team2Postseason = postseasonResults.find(
        team => team.team_name === formData.team2 && team.season === Number(formData.season2)
    );

    if (!team1Postseason || !team2Postseason) {
        return <p></p>;
    }

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <h2 className="card-title text-center">Postseason Results</h2>

                <table className="table table-bordered table-striped text-center">
                    <colgroup>
                        <col style={{ width: "200px" }} />
                        <col style={{ width: "250px" }} />
                        <col style={{ width: "200px" }} />
                    </colgroup>

                    <thead className="thead-dark">
                        <tr>
                            <th>{team1Postseason?.team_name} {team1Postseason?.season}</th>
                            <th></th>
                            <th>{team2Postseason?.team_name} {team2Postseason?.season}</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>{team1Postseason?.postseason_name || "No Data"}</td>
                            <td className="fw-bold">Final Postseason Game</td>
                            <td>{team2Postseason?.postseason_name || "No Data"}</td>
                        </tr>

                        {/* Display Opponent Names */}
                        {(team1Postseason?.postseason_name !== "No Postseason" || team2Postseason?.postseason_name !== "No Postseason") && (
                            <tr>
                                <td>{team1Postseason?.postseason_name !== "No Postseason" ? `vs. ${team1Postseason.opponent_name}` : ""}</td>
                                <td className="fw-bold">Opponent</td>
                                <td>{team2Postseason?.postseason_name !== "No Postseason" ? `vs. ${team2Postseason.opponent_name}` : ""}</td>
                            </tr>
                        )}

                        {/* Display Game Results */}
                        {(team1Postseason?.postseason_name !== "No Postseason" || team2Postseason?.postseason_name !== "No Postseason") && (
                            <tr>
                                <td>{team1Postseason?.postseason_name !== "No Postseason" ? `${team1Postseason.result} (${team1Postseason.team_score}-${team1Postseason.opponent_score})` : ""}</td>
                                <td className="fw-bold">Result</td>
                                <td>{team2Postseason?.postseason_name !== "No Postseason" ? `${team2Postseason.result} (${team2Postseason.team_score}-${team2Postseason.opponent_score})` : ""}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PostseasonResults;
