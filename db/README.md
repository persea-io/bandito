### How to install mySql on local machine

- Install Docker Desktop: https://www.docker.com/products/docker-desktop/


- Open a new terminal and run:

  `docker run -d --name mysql -v mysql:/var/lib/mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=secret -d mysql:8.0.39`


- Install MySQL Workbench: https://dev.mysql.com/downloads/workbench/
  
  (If the download page asks you to login, look for the 'No Thanks, just start my download' link)


- Start MySQL Workbench and create a new connection with the ⊕ icon.
  - Connection Name: local
  - Password: secret
  - Test Connection and then OK if test works


- Choose 'Open SQL Script' from the toolbar and select the file in this directory `init.sql`


- Run the script by pressing the lightning bolt icon


- Refresh the SCHEMAS list on the left


- The `bandito` schema should be there, and it should have some tables

