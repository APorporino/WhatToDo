# WhatToDo
WhatToDo is a task manager web application for software projects. It was designed as a personal project. 
It uses the MERN Stack: MongoDB, Express.js, React.js and Node.js

This repo contains both the frontend and backend.

To run the backend run:
npm install
npm start

Note that the .env file contains all the process environemtn variables. Since this applicaiton is not currently being hosted, it requires you to run your own MongoDB database. Input the database url in that file.
You can easily set up a MongoDB database using the community version of the app or the online version called Atlas. No setup required just the url in the .env file.


To run the frontent run:
cd frontend
npm install
npm start

- In frontend/setupProxy.js make sure the proxy url corresponds to the PORT you have in the .env file
