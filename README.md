### Todo

Clone
https://github.com/iamvucms/react-native-instagram-clone
or
https://github.com/ozcanzaferayan/react-native-instagram
or
https://github.com/Doha26/Instagram-clone
or
https://github.com/nisarmalhi/react-native-instagram-clone
or
https://github.com/1hbb/react-native-instagram-clone

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

### Run Mongodb

`./startdb.sh`

When DB is empty and we run the nodejs api, the populate data will fail so it needs to rerun again. (only happens once)

### Stop Mongodb

`docker stop mongo1`

### Setup mongodb replica docker

https://blog.tericcabrel.com/mongodb-replica-set-docker-compose/

### MIDTRANS payment simulation

https://simulator.sandbox.midtrans.com/qris/index

### Install and setup Ngrok for testing

https://gist.github.com/wosephjeber/aa174fb851dfe87e644e
