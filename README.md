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
1. I seem to have an issue on my server side with people who join the game. Sometimes I'll Join in and a second player will join, but for some reason it will say that the second player is the first player and the first player has no one in the room. Im not sure if there really is a fix to this as I think it's on the server side, but for the next milestone I think making a player disconnect out of the connected array could fix this. I will neeed to find which player disconnected via a logout button and then it will take them out of the array.
2. If I had more time I would definitely put more time into working with the winning function. When I try to revceive the winning player and emit it to the server I keep getting a null value. In order for me to actually get it I pass a props.name call to get the latest name that pressed a button. In order for me to get this to work correctly I need to find a way to get my button to update as soon as I click it. I will work on getting it to pass in my onclick so I could pass who won to the server so I could pass it to my leaderboard.

## Issues resolved
1. I had a problem getting each player logged in to be on one screen. This was quite a simple fix, but it took me 2 days to figure it out. After getting the username and determining if it wasn't null I pushed it into an array and passed it out of the function. After that I passed it to a <div> to make the browser know that this is your username.
2. Another issue that I had was making it so that each person couldn't click unless it was there turn. To solve this issue I made an if statement at the beginning of my onclick button to see if this player is the player thats turn is next. This took me some time to figure out, but once I solved the issue before with getting each player to have their own know username than it made it easier to access them as individual players.I also had to make a function to get the two players and determine whose turn it is which was pretty simple using a counter that if it's an even or odd number to swap player turns. The other players I put into an arrayy and called them spectators which made it so those players can't click at all.


