#!/bin/bash

docker-compose up -d

sleep 10

docker exec mongo1 /scripts/rs-init.sh

# docker run --rm -d -p 27017:27017 -h $(hostname) --name mongo1 mongo:4.4 --replSet=dbrs 

# sleep 10

# docker exec mongo1 mongo --eval "rs.initiate();"

