import React from 'react';

const About = () => {
  return (
    <div>
      <h2>CFB Matchup Tool</h2>
      <p>
        This project focuses on aggregating and visualizing data and aims to be a resource for football and statistic fans alike.
        <br /><br />
        This tool is a web application designed to allow users to explore a database of college football game data over the past 10 years. Users can view and compare individual teams across several metrics and apply filters to view game results and metrics for a particular season or aggregates of a season or seasons. The dataset is sourced from <a href="https://collegefootballdata.com" target="_blank" rel="noopener noreferrer">collegefootballdata.com</a> and is dynamically updated to include the latest game data each week.
      </p>
      <p>For reference on definitions of some of the metrics described below, please see <a href="https://collegefootballdata.com/glossary" target="_blank" rel="noopener noreferrer">their glossary</a>.</p>

      

      <h3>Data Constraints</h3>
      <p>
        This dataset covers games from <strong>2014 to the present</strong> and has some constraints to maintain consistency and accuracy:
      </p>
      <ul>
        <li><strong>Excludes garbage time plays.</strong> Thanks to an option provided by the data source, ensuring metrics reflect meaningful game situations.</li>
        <li><strong>Only includes FBS vs. FBS games:</strong> Prevents skew from matchups against typically less competitive FCS teams.</li>
      </ul>

      <h3>Key Metric Definitions</h3>
       <p>
        Passing and rushing scores are calculated based on the total predicted points added (PPA or EPA) metric for valid plays (see constraints) in each game. Total PPA in a given game is weighted against the tier of the opponent, so more PPA against tougher/higher-tiered opponents results in a higher overall score and vice-versa.
       </p>
      <h4>Offensive Metrics</h4>
      <ul>
        <li><strong>Offensive Passing Score:</strong> A value between 0 and 100 indicating the relative performance of a team's ability to pass the ball effectively.</li>
        <li><strong>Offensive Rushing Score:</strong> Similar to the passing score but based on total PPA for rushing plays.</li>
        <li><strong>Offensive Success Rate:</strong> The rate of a play being "successful" based on down and distance. See official definitions.</li>
        <li><strong>Offensive Explosiveness:</strong> Measures how "big" successful plays are on average.</li>
      </ul>

      <h4>Defensive Metrics</h4>
      <ul>
        <li><strong>Defensive Passing & Rushing Scores:</strong> A value between 0 and 100 indicating the relative ability to prevent PPA against either passing or rushing plays.</li>
        <li><strong>Defensive Success Rate:</strong> The inverse of offensive success rate—measuring how well the defense prevents successful plays.</li>
        <li><strong>Defensive Containment:</strong> Measures how well a team prevents explosive plays from the opposing offense.</li>
      </ul>

      <h3>Opponent Tier Breakdown</h3>
      <p>
        Opponent tiers are used to adjust aggregated metrics by factoring in the quality of competition faced. Teams are categorized into six tiers based on their pre-game Elo rating:
      </p>
      <ul>
        <li><strong>Tier 1:</strong> Elo rating **Over 1850** Powerhouse teams. These teams are usually in the mix for a national championship and have an average winning percentage of around 80%.</li>
        <li><strong>Tier 2:</strong> Elo rating **1700 - 1849** Ranked or near-ranked teams. Playoff contenders or high-profile bowl teams. They have a winning percentage of around 70% on average.</li>
        <li><strong>Tier 3:</strong> Elo rating **1550 - 1699** Probable bowl-contenders. Above average teams who win about 60% of their games.</li>
        <li><strong>Tier 4:</strong> Elo rating **1400 - 1549** Competitive teams but overall a bit below average. Win just less than 50% of games.</li>
        <li><strong>Tier 5:</strong> Elo rating **1200 - 1399** Mediocre teams. These teams are either under-performing or still developing as a program. Win less than 40% of games.</li>
        <li><strong>Tier 6:</strong> Elo rating ** less than 1200** Underdogs. Severely under-performing teams or very green programs. Only win about 20% of games.</li>
      </ul>
      <p>
        Weighted metrics use these tiers to apply adjustments—**performing well against Tier 1 teams increases scores**, while **dominant performances against Tier 6 teams contribute less**.
      </p>
    </div>
  );
};

export default About;
