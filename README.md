     Task Manager API

A RESTful API built with Node.js, Express, and MySQL to manage tasks.

 Project Structure
- `app.js`: Main Express server
- `config/db.js`: Database configuration and connection pool
- `controllers/tasksController.js`: Request logic
- `models/taskModel.js`: Database queries
- `routes/tasks.js`: API routes
- `middleware/auth.js`: Authentication middleware (optional)

 Setup
1. Clone the repository
2. Run `npm install`
3. Configure your `.env` file with your MySQL credentials
4. Run `node setupDB.js` to initialize the database
5. Run `npm run dev` to start the server

 API Endpoints
- `POST /tasks` - Create a task
- `GET /tasks` - Get all tasks
- `GET /tasks/:id` - Get a task by ID
- `PATCH /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task
