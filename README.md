College Football Matchup tool.

This project focuses on aggregating and visualizing data
and aims to be a resource for football and statistic fans alike.

This tool is a web application designed to allow users to explore
a database of college football game data over the past 10 years. Users can view and compare
individual teams across several metrics and apply filters to view a particular season or
level of competition. The dataset is sourced from collegefootballdata.com and is dynamically
updated to include the latest game data each week. 



HOME PAGE:

Top 5 teams all-season in each defined metric.
- Offensive & Defensive Passing Scores
- Offensive & Defensive Rushing Scores
- Offensive & Defensive Epxlosive/Containment Scores
- Overall Record


TEAM PAGE:

To be determined... Likely an all-season aggregate page with graphs detailing change across...
- Offensive & Defensive Passing Scores
- Offensive & Defensive Rushing Scores
- Offensive & Defensive Epxlosive/Containment Scores
- Sucess Rates
- Coaching Records/Changes
- Recruiting Ranks
- Season Results/Record by Opponent Tier

TEAM COMPARISON PAGE:

Single-season aggregates.
- Offensive & Defensive Passing Scores
- Offensive & Defensive Rushing Scores
- Offensive & Defensive Epxlosive/Containment Scores
- Sucess Rates
- Coaching Records/Changes
- Recruiting Ranks
- Season Results/Record by Opponent Tier


Advanced Metric Definitions:

All metrics are borrowed or based on data found at https://collegefootballdata.com

For reference on definitions of some of the metrics described below please see https://collegefootballdata.com/glossary

**Ofensive Passing Score:** A value between 0 and 100 indicating the relative performance of a team's ability to pass the ball effectively in a given season.
This score is calculated based on the total predicted points added (PPA or EPA) metric for passing plays in each game. Total PPA in a given game is weighted against the tier of the opponent, so more PPA against tougher/higher-tiered opponents results in a higher overall score and vice-versa.

**Ofensive Rushing Score:** A value between 0 and 100 indicating the relative performance of a team's ability to rush the ball effectively in a given season.
This score works the same as the passing score but is instead based on total PPA for rushing plays in each game.

**Offensive Success Rate:** The rate of any of the following happening on any given play:
-the offense scored
-1st downs which gain at least 50% of the yards to go
-2nd downs which gain at least 70% of the yards to go
-3rd and 4th downs which gain at least 100% of the yards to go


**Offensive Explosiveness:** A value between 0 and 100 indicating a team's relative tendency to make big plays. This score is based on the PPA of plays deemed "successful" (See 'Success Rate' metric for what makes a play "sucessful"). Basically, when a team makes a "good" play on offense - how "good" is it?

**Defensive Passing Score:** A value between 0 and 100 indicating the relative performance of a team's ability to prevent opponents from passing effectively.
This score is calculated based on the total predicted points added (PPA or EPA) metric for opponent's passing plays in each game. Similar to offense but in reverse, total PPA in a given game is weighted against the tier of the opponent.

**Defensive Rushing Score:** A value between 0 and 100 indicating the relative performance of a team's ability to prevent opponents from rushing the ball effectively.
This score works the same as the defensive passing score but is instead based on total PPA for opponent's rushing plays in each game.

**Defensive Success Rate:** The same as Offensvie Sucess Rate but from the perspective of the defense.

**Defensive Containment:** A value between 0 and 100 indicating a team's relative tendency to minmize big plays from opponents. Essentially this is explosiveness but from the perspective of defense.











