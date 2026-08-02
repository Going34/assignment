First, open pgAdmin to start your PostgreSQL database.

Then, go into the frontend folder (the main project folder) and run the "npm i" command to install dependencies.

Next, go into the backend folder and run "npm i" to install the backend dependencies. After that, in both the frontend and backend folders, run the npm run dev command to start the project.

Change this backend env; it needs to change 
DB_HOST=localhost
DB_PORT=5432
DB_USER=ralph
DB_PASSWORD=ralph_secret
DB_NAME=event_manager

When the backend starts, it will automatically create the database in PostgreSQL.

Now open the frontend in your browser, and you will land on the login page. We have created two demo users so you can try it:

"role": "Admin",
"email": "admin@eventmanager.com",
"password": "admin123",

"role": "User",
"email": "user@eventmanager.com",
"password": "user123",
