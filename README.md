##Clone repository
1.` git clone --branch milestone_2 https://github.com/NJIT-CS490-SP21/project2-jp75 ``


## Requirements
1. `pip install Flask`
2. `npm install`
3. `Flask-Cors==3.0.10`
4. `Flask-SocketIO==5.0.1`
5. `Flask-SQLAlchemy==2.1`
6. `psycopg2`
7. `pip install -r requirements.txt` -this could be done to match all files that I have to ensure it will run

# Flask and create-react-app

## Setup
1. Run `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local` in the project directory

## Setup for heroku database and app
1. type heroku login -i to login to heroku
2. type heroku create (Create a new heroku app)
3. heroku addons:create heroku-postgresql:hobby-dev (add a DB)
4. heroku config (check your env vars)
5. Create a .env and put the info inside with the below string
6. DATABASE_URL='set the URL what we got from heroku config'

## Run Application
1. Run command in terminal (in your project directory): `python app.py`
2. Run command in another terminal, `cd` into the project directory, and run `npm run start`
3. Preview web page in browser '/'

## Deploy to Heroku ap (not necessary)
1. make sure heroku still has th other app
2. Add python buildpack `heroku buildpacks:add --index 1 heroku/python` or add it on herokus website
3. Add nodejs buildpack: `heroku buildpacks:add --index 1 heroku/nodejs` or add it on herokus website
4. Push to Heroku: `git push heroku {your_branch_name}:main` or `git push heroku main` if you want to put it in your main branch

## Two known problems
1. I had an issue with trying to get the user who logs in to display on the table. I couldn't figure out how to do it. If I had more time I would definitely try to accomplish that by maybe going through the list on the table and comparing names to logged in players and if the player happend to be a logged in player than I  could change something with the name in css, but the issue I as trying to solve was going through the list of mapped users and altering one person out of all the players in the database.
2. There seems to be something wrong when a players log in sometimes. When the game starts and a random person joins in mid game sometimes it brings them into their own game and says that no one is player x or player o. I'm not sure if this is an issue on my side or just a genral issue working with servers, but if I had more time I would definitely put work in that area to try and make the server able to always connect the jooining user to the current match thats going on. I'm not sure if this might be on the server side, or the client side but maybe proper steps would be to see if the server is emitting the list of players that are currently logged ion when a new player joins mid gam and then work off of that.

## Issues resolved
1. I had an issue trying to update the database whenever a player won or lost. I would get it to update the first time, but then it wouldn't update the second or third time. The fix ot this was that I was using models.user.query when I was suppsoed to be using DB.session.query. This seemed to fix the issue as it wasn't changing the values in the databse it was just chenging the name of the user, which wasn't doing anything to change the database.
2. Another issue I was having was when a new person would join in it would change everrything back to 100 on the leaderboard. The fix to this was kind of similar, but I wasn't updating the database after I made a change to the score. A temporary fix was to use .merge which worked when a new user joined to not change everything back to 100, but there seemed to be some issues with this because it wouldn't update on a restart. Later I found out that .merge wasn't a good solution for a continuos game. The real solution was sort of the same as the above solution in #1, but .merge was the solution at the first time I had the issue.
3. When I first started trying to create my database I kept having an issue where it was giving me an error with the models.py file saying Person does not exist. To fix this I followed the hw 11 assignment where I had to set up and test the database and see if it worked which it did. I later found out that my Database URL was wrong and I ended up spending hours trying to fix this. Once I got the corrected URL I put it in the .env an it seemed to work. 


