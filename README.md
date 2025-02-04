# CS406_Project
College Football FBS Teams Data Pipeline

Quick Overview
This project uses a basic ETL (Extract, Transform, Load) pattern to create a pipeline for loading team data into a targeted database
It automates:
- **Extracting** JSON data from 7 API endpoints (all from collegefootballdata.com)
- **Transforming** JSON data into cleaned, structured CSV files
- **Loading** Transformed data into a database

Features
**Flexible ETL Workflow**: Run extraction, transformation, or both    
**Data Normalization**: Cleans and formats string and numerical data to fit into a normalized relational database
 
Stucture
CFdatapipeline/
│── data/                   # Raw & transformed data storage
│   ├── Extract_bulk/       # Raw JSON files
│   ├── Transformed_bulk/   # Processed CSV files
│
│── src/                    # Core scripts
│   ├── extract.py          # Handles data extraction
│   ├── transform.py        # Handles data transformation
│   ├── load.py             # (Under construction) Handles data loading
│   ├── utils/              # Utility functions
│   │   ├── __init__.py     # Contains common functions (load_config, clean_string, clean_float, etc.)
│
│── config.yaml             # Configuration file for API key, file paths & processing settings
│── main.py                 # CLI interface for running ETL tasks

Usage
1. Clone repo
2. Create venv
3. install dependencies
4. Conifiguration
Modify config.yaml to define file paths and processing settings
paths:
  fbs_teams_raw: "data/Extract_bulk/teams_raw.json"
  fbs_teams_tran: "data/Transformed_bulk/teams.csv"
  recruit_rankings_raw: "data/Extract_bulk/recruit_rankings.json"
  recruit_rankings_tran: "data/Transformed_bulk/recruit_rankings.csv"

settings:
  start_year: 2010
  end_year: 2024

5. Run main.py

   CLI argument parser: python main.py run [task] [extract, transform, or both] --years[start_year]-[end_year]
   
   To extract all endpoints and transform each:
     python main.py run all -e -t --years 2014-2024

   Task list:
     all      # all endpoints
     teams    # current FBS teams
     recruits # recruiting rankings and points by year
     ret_ppa  # returning production metirc -> how much offensive production is being returned form the previous year?
     ratings  # SP ratings by year, includes offensive, defensive and special teams
     games    # Scores, home and away teams and other basic team level attributes by game
     ags      # advanced game stats, adanvced team metrics from the perspective of one team by game
     coaches  # coach SP ratings, wins/losses and high level SP ratings  by year

     
  

