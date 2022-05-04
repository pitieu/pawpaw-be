### Setup

create db folder for macOS catalyna 
`sudo mkdir -p /System/Volumes/Data/data/db`
`sudo chown -R 'id -un' /System/Volumes/Data/data/db`

### Configuration

run db
`sudo mongod --dbpath=/System/Volumes/Data/data/db`

### To run the app

run
`npm install`

and then 

run `npm run dev`

