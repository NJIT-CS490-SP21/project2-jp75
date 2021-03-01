##Clone repository
1.` git clone --branch milestone1 https://github.com/NJIT-CS490-SP21/project2-jp75 ``

# Flask and create-react-app

## Requirements
1. `pip install Flask`
2. `npm install`
3. `Flask-Cors==3.0.10`
4. `Flask-SocketIO==5.0.1`

# Flask and create-react-app

## Requirements
1. `npm install`
2. `pip install -r requirements.txt`

## Setup
1. Run `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local` in the project directory

## Run Application
1. Run command in terminal (in your project directory): `python app.py`
2. Run command in another terminal, `cd` into the project directory, and run `npm run start`
3. Preview web page in browser '/'

## Deploy to Heroku (not necessary)
1. Create a Heroku app: `heroku create --buildpack heroku/python`
2. Add nodejs buildpack: `heroku buildpacks:add --index 1 heroku/nodejs`
3. Push to Heroku: `git push heroku main`

## Two known problems
1. Whenever I click a button a second time it overwrites the current letter with the new one and I don't know how to fix that. I beleive the effective steps I could take is when a button is click to figure out what part of the array has been filled and make it so no one can click that button at that spot anymore.
2. I seem to have an issue on my server side with people who join the game. Sometimes I'll Join in and a second player will join, but for some reason it will say that the second player is the first player and the first player has no one in the room. Im not sure if there really is a fix to this as I think it's on the server side, but for the next milestone I think making a player disconnect out of the connected array could fix this. I will neeed to find which player disconnected via a logout button and then it will take them out of the array.

## Issues resolved
1. I had a problem getting each player logged in to be on one screen. This was quite a simple fix, but it took me 2 days to figure it out. After getting the username and determining if it wasn't null I pushed it into an array and passed it out of the function. After that I passed it to a <div> to make the browser know that this is your username.
2. Another issue that I had was making it so that each person couldn't click unless it was there turn. To solve this issue I made an if statement at the beginning of my onclick button to see if this player is the player thats turn is next. This took me some time to figure out, but once I solved the issue before with getting each player to have their own know username than it made it easier to access them as individual players.I also had to make a function to get the two players and determine whose turn it is which was pretty simple using a counter that if it's an even or odd number to swap player turns. The other players I put into an arrayy and called them spectators which made it so those players can't click at all.


