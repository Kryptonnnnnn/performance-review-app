🚀 Performance Review System

A simple full-stack performance review application built using React (Frontend) and FastAPI (Backend).

This project allows an administrator to manage employees and performance reviews, and allows employees to log in and submit feedback for assigned reviews.

📌 Features
👨‍💼 Admin

Login with JWT authentication

Add new employees

Delete employees

Create performance reviews

Assign one employee to review another

View all reviews

👩‍💻 Employee

Login using registered email

View assigned reviews

Submit feedback for assigned reviews

🛠 Tech Stack
Frontend

React

React Router

Axios

React Toastify

Backend

FastAPI

SQLAlchemy

SQLite

JWT Authentication

Pydantic

📂 Project Structure
performance-review-app/
│
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   ├── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── package.json
│
└── README.md

🔐 Demo Credentials
Admin Login
Email: admin@gmail.com
Password: admin123

Employee Login

Use the email of any employee created from the Admin panel.

🚦 How to Run the Project
1️⃣ Backend Setup

Go to backend folder:

cd backend


Install dependencies:

pip install -r requirements.txt


Run the server:

uvicorn main:app --reload


Backend will run at:

http://localhost:8000

2️⃣ Frontend Setup

Open a new terminal and go to frontend folder:

cd frontend


Install dependencies:

npm install


Start React app:

npm start


Frontend will run at:

http://localhost:3000

🗄 Database

SQLite database is automatically created on first run.

Tables are generated automatically using SQLAlchemy.

📝 Notes

Admin credentials are hardcoded for demonstration purposes.

SQLite is used for simplicity and local development.

This is an MVP implementation focusing on core functionality and clean API structure.

🔮 Possible Improvements

Role-based route protection in frontend

Separate Feedback table instead of storing feedback inside Review

Better form validation

Pagination for large datasets

Production-ready authentication flow

👨‍💻 Developer Focus

The main focus of this project was:

Clean API design

Clear separation between Admin and Employee roles

Proper error handling

Simple and understandable UI

Easy local setup
