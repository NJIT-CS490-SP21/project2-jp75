##Clone repository
1.` git clone https://github.com/NJIT-CS490-SP21/project2-jp75 `


## Requirements
1. `pip install Flask`
2. `npm install`
3. `Flask-Cors==3.0.10`
4. `Flask-SocketIO==5.0.1`
5. `Flask-SQLAlchemy==2.1`
6. `psycopg2`
7. `yapf==0.30.0`
8. `pylint==2.4.4`
9. `npm install --save-dev --save-exact prettier`
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

## Testing app.py
1. navigate to Tests/unmocked and drag the file to the same level as app.py
2. run the unit_tests.py file to see that tests pass.(You could add some tests if further wanting to test)
3. put file back in unmocked and do the same with mocked.

# Test App.js
1. navigate to src folder and look for App.test.js
2. in order to test this open up a terminal and change into the directory of the project
3. type in `npm test App.test.js` and you will be able to see that all tests pass. (add more tests if you want)

## Check linting
1. Type in `pylint app.py` and see that all linting errors are fixed
2. Type in `npx eslint src/App.js` to see airbnb eslint satisfied
3. Type in `npx eslint src/board.js` to see that meets satisfied as well

## Deploy to Heroku app (not necessary)
1. Make sure you don't have any heroku files saved by typing `git remote -v`
2. If there is already a heroku app type `git remote rm heroku`
3. Create a new heroku app
4. Add python buildpack `heroku buildpacks:add --index 1 heroku/python` or add it on herokus website
5. Add nodejs buildpack: `heroku buildpacks:add --index 1 heroku/nodejs` or add it on herokus website
6. Push to Heroku: `git push heroku main` if you want to put it in your main branch

## format files
1. Files have been formatted already, but if you want to reformat them type `yapf -i app.py` to format the python file
2. To format .js files type in `npx prettier --write src/App.js`. Do this for all .js files (This gave me an issue trying to work with airbn eslint)

## Two known problems
1. I had an issue trying to run certain unmocked tests. If I had more time I would definitely put time into understanding the concepts. One that I was having issues mocking was filter_by(). I'm assuming if I were to do something like this with patch('models.Joined.query') as mocked_query: and usee another defined function to mock up the filter than I could get this done, but was having issues getting it to work.
2. I had some issues trying to make some test cases using jest. One issue that I couldn't resolve, but wish I had more time to figure out was tring to get my rest button to work by getByText. It kept giving me an error I think because my code wasn't in the format that get the text. I'm assuming my html code wasn't seperated in funtions, or I should've done that, but instead I made divs and put code inside not really keeping track of where I put everything. I learned that it's important to keep track of where your code is going. 

## Issues resolved
1. I had an issue trying to run unmock tests on my db in unittests.py. The issue I had with this was that it wouldn't see if the user was already in the database. I'm assuming I wasn't writing the right code to mock the filterBy(). The way I solved this was by moving that filterBy() outside of my mtehod and got it to work without the filterBy() in the function.
2. I had an issue trying to get airbnb to work. The way I wen't about it was to follow that github file explaining how to go about it and finally got it to work. I amde a .eslintrc file and put "extends": ["airbnb", "airbnb/hooks"] which seemed to get it to work. THis then gave me 200+ errors that I was confused over and wasn't sure if I was doing it right. I was hving trouble trying to get certain errors to go away, and ended up googling a lot to get things to work right. Some things that I had to change were changing ++ to += 1 insead all "" nedded to be changed to '',etc. This took me over 3 hours to figure it out, but I finally did and learned a lot.

