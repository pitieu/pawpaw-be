#!/bin/bash

# docker-compose up -d

# sleep 5

# docker exec mongo1 /scripts/rs-init.sh
docker run --rm -d -p 27017:27017 -h $(hostname) --name mongo1 mongo:4.4.3 --replSet=dbrs 

sleep 5 

docker exec mongo mongo --eval "rs.initiate();

