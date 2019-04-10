# DogDashboard-MongoDb

For this assignment, we were instructed to build an animal dashboard and I chose to made a dashboard about dogs! The main purpose was to practice CRUD

GET '/' Displays all of the dogs.
GET '/dog/:id' Displays information about one dog.
GET '/dog/new' Displays a form for making a new dog.
POST '/dog' Should be the action attribute for the form in the above route (GET '/dog/new').
GET '/dog/edit/:id' Should show a form to edit an existing dog.
POST '/dog/:id' Should be the action attribute for the form in the above route (GET '/dog/edit/:id').
POST '/dog/destroy/:id' Should delete the dog from the database by ID.
