# My Dashboard
This is a web app that will show statistics of users who signs up & login access timestamps.

* Click [here](https://dashboard.nandprojects.com) to go to the live URL.

## Prerequisites
* [Node.js](https://nodejs.org/en/download) (version 14 or higher)
* [PostgreSQL](https://www.postgresql.org/download/) (version 12 or higher)
## Getting Started
Clone the repository:
```bash
git clone https://github.com/ferdinandosp/my-dashboard.git
```
## Navigate to the project directory
```bash
cd my-dashboard
```
## Install dependencies
```bash
npm i
```
## Create a new PostgreSQL database for the project
## Update the .env file with your database details
```makefile
DB_CONNECTION=pg
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=your-username
DB_PASSWORD=your-password
DB_DATABASE=your-database-name
```
## Run database migrations
```
node ace migration:run
```
## Start the server
```
node ace serve --watch
```
Open a web browser and go to `http://localhost:3333` to see the application running.
Open `http://localhost:3333/docs` to open the swagger documentation.

## Contributing
If you'd like to contribute to the project, please follow these steps:

## Fork the repository
- Create a new branch (git checkout -b new-feature)
- Make your changes and commit them (git commit -am 'Add new feature')
- Push to the branch (git push origin new-feature)
- Create a new Pull Request
