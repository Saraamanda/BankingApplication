Banking Application

This is an exam project created in Distributing Systems and will be used as part of the oral test examn in 2020.

With the purpose of running the entire program a one-click-run solution has been implemented. 
Thereby is this solution responsible for starting all servers in this program as well as the load balancer. 

To achieve this you must simply use the command run.bat in one terminal, then in another terminal write npm run start
This way the command executes the file that starts the whole program.


To start the project manually you can also run the following in separate terminals:

seaport listen 9090

nodemon index.js 

To run the test write:

npm test

the test runs but we couldn't make the program pass it.