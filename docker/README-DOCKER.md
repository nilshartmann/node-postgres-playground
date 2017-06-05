## Create database image

`docker build -t todoapp_db .`

## Start DB Container

`docker run --name TODOAPP_DB -p 9999:5432 -d todoapp_db`

