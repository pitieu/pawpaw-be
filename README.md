### Status

This is a work in progress and it's far from finished.

### Platform features

## Completed Features

- Auth sign up/login
- Multi account - A user can have multiple accounts in one(like instagram allows to switch between accounts)
- Services - CRUD pet services to offer in the marketplace

## Todo

- Payment - Payment gateway is developed separately to allow the exact features required for this platform
- Order Mechanism - To be completed
- Refund Mechanism - To be completed
- Social Media - To be completed
-

### Setup

create db folder for macOS catalyna
`sudo mkdir -p /System/Volumes/Data/data/db`
`sudo chown -R 'id -un' /System/Volumes/Data/data/db`

### To run the app

run
`npm install`

and then

run `npm run dev`

### Run Mongodb

Mongodb can be run as replica depending on what we comment out in `startdb.sh`

To run db you can run with

`sudo mongod --dbpath=/System/Volumes/Data/data/db`

Or

`./startdb.sh`

When DB is empty and we run the nodejs api, the populate data will fail so it needs to rerun again. (only happens once)

### Stop Mongodb in docker

`docker stop mongo1`

### Setup mongodb replica docker

https://blog.tericcabrel.com/mongodb-replica-set-docker-compose/

### MIDTRANS payment simulation

https://simulator.sandbox.midtrans.com/qris/index

### Install and setup Ngrok for testing

https://gist.github.com/wosephjeber/aa174fb851dfe87e644e

### Folder structure

- config - for now ssl but can contain other configurations later
- controller -
- data - mostly json data that requires as initialization data for mongodb
- initialization - scripts that will run when the app starts
- middleware - ExpressJs middlewares
- model - Mongoose DB models
- mongodb - mongoose initialization and configuration
- routes - API routes
- tests - unit tests
- uploads - uploaded files will go here for now later they will be moved to AWS S3 or something similar
- utils - utility functions used throughout the whole api
- validation - Data validation mostly used in routes to validate and prevent malicious user input

### Todo

- Unit tests
