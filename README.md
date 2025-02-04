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
![image](https://github.com/user-attachments/assets/8b498cd8-4c7f-464e-8e6d-f556b62a2d93)

Usage
1. Clone repo
2. Create venv
3. install dependencies
4. Conifiguration: Modify config.yaml to define file paths and processing settings
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

     
  

