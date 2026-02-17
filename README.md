# Performance Review System

A simple full-stack performance review application built using React (Frontend) and FastAPI (Backend).

This project allows an admin to manage employees, create reviews, assign reviews, and allow employees to submit feedback.

---

## 🚀 Features

### Admin
- Secure login using JWT
- Add and delete employees
- Create performance reviews
- Assign reviews to employees
- View all reviews

### Employee
- Login using email
- View assigned reviews
- Submit feedback for reviews

---

## 🛠 Tech Stack

### Frontend
- React
- React Router
- Axios
- React Toastify

### Backend
- FastAPI
- SQLAlchemy
- SQLite
- JWT Authentication
- Pydantic

---

## 📂 Project Structure
performance-review-app/
│
├── backend/
│ ├── main.py
│ ├── models.py
│ ├── schemas.py
│ ├── database.py
│
├── frontend/
│ ├── src/
│ ├── package.json
│
└── README.md
