# README

## Running frontend code

docker run -d -p 80:80 --name ipsa --platform linux/amd64 -v ./html:/var/www/html dbrademan/ipsa

docker exec -it ipsa bash

mysql -u root < /var/www/html/Docker/IPSA_Database_Structure.sql

## Logging

To see logs in the backend code, run
docker exec -it ipsa /bin/bash

and then
cd /var/log/apache2

Stream the log file: tail -f error.log
