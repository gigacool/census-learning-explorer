# Census income web application explorer

This small project aims at providing a full stack REST API - SPA (Single Page
Application) to investigate census-income database.

# contact
Having questions or meeting trouble on the application, send me a message. I'll
answer ASAP.

# Getting started
This project uses nodejs technology. First step involves installing [nodejs](https://nodejs.org/en/download/).
You need to have a copy of the database (compatible with sqlite3)
Once installed, in a command line, positioned in project folder, run the following commands:

The first command (only need to be run once)

1. *npm install* this will install the database system
1. *npm cleanup {pathToDatabase}* only need to be run once, will remove null rows in database table
1. *npm start {pathToDatabase}* the server will start then open your favorite browser to the application

# Technical information
* The back-end uses nodejs server with *express* framework to create a REST API.
* The database system uses *sqlite3* (Please note that the database server is embedded in the application, you need to provide the database file)
* I use *open* framework to automate the opening of the browser on server start. This is a development and test facility, not a production feature.

Front side of the application will undergo some unit tests to validate data manipulation and some user interactions. Tests can be run by opening the test page *tests/runTests.html* page in any browser.
In this case, we keep it simple and do not use karma test runner to validate on multiple browsers vs. versions. The short notice for development makes me focus on webkit browsers (chrome/safari).

# some links
Original database description https://kdd.ics.uci.edu/databases/e/census-income.names
