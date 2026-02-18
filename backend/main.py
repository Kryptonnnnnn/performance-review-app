import os
from typing import List
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from jose import jwt
from passlib.context import CryptContext

import models
import schemas
from database import engine, SessionLocal

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "c7b74e1d90468e24676103e9c71c4c9e42e47e174092b70f0340331006a8e83b")
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

models.Base.metadata.create_all(bind=engine)
app = FastAPI(title="Company Review System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/admin/login")
def admin_login(data: schemas.LoginRequest):
    if data.email == "admin@gmail.com" and data.password == "admin123":
        payload = {"sub": data.email, "role": "admin"}
        return {"access_token": jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM), "role": "admin"}
    raise HTTPException(status_code=401, detail="Auth failed")

@app.post("/employee/login")
def employee_login(data: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.Employee).filter(models.Employee.email == data.email).first()
    if not user or not pwd_context.verify(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    payload = {"sub": user.email, "role": "employee", "id": user.id}
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "role": "employee", "employee_id": user.id}

@app.get("/employees", response_model=List[schemas.Employee])
def list_employees(db: Session = Depends(get_db)):
    return db.query(models.Employee).all()

@app.post("/employees", response_model=schemas.Employee)
def add_employee(user: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    pwd = pwd_context.hash(user.password or "password123")
    entry = models.Employee(name=user.name, email=user.email, hashed_password=pwd)
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

@app.put("/employees/{emp_id}", response_model=schemas.Employee)
def edit_employee(emp_id: int, data: schemas.EmployeeUpdate, db: Session = Depends(get_db)):
    user = db.query(models.Employee).filter(models.Employee.id == emp_id).first()
    if not user:
        raise HTTPException(status_code=404)
    if data.name: user.name = data.name
    if data.email: user.email = data.email
    db.commit()
    db.refresh(user)
    return user

@app.delete("/employees/{emp_id}")
def remove_employee(emp_id: int, db: Session = Depends(get_db)):
    user = db.query(models.Employee).filter(models.Employee.id == emp_id).first()
    if not user:
        raise HTTPException(status_code=404)
    
    db.query(models.Review).filter(
        (models.Review.reviewed_employee_id == emp_id) | 
        (models.Review.assigned_employee_id == emp_id)
    ).delete()
    
    db.delete(user)
    db.commit()
    return {"status": "purged"}

@app.get("/reviews", response_model=List[schemas.Review])
def list_all_reviews(db: Session = Depends(get_db)):
    return db.query(models.Review).all()

@app.post("/reviews", response_model=schemas.Review)
def create_assignment(data: schemas.ReviewCreate, db: Session = Depends(get_db)):
    entry = models.Review(**data.dict())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

@app.put("/reviews/{review_id}", response_model=schemas.Review)
def edit_assignment(review_id: int, data: schemas.ReviewUpdate, db: Session = Depends(get_db)):
    rev = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not rev:
        raise HTTPException(status_code=404)
    if data.title: rev.title = data.title
    if data.description: rev.description = data.description
    db.commit()
    db.refresh(rev)
    return rev

@app.delete("/reviews/{review_id}")
def remove_assignment(review_id: int, db: Session = Depends(get_db)):
    rev = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not rev:
        raise HTTPException(status_code=404)
    db.delete(rev)
    db.commit()
    return {"status": "removed"}

@app.get("/employee/{emp_id}/reviews", response_model=List[schemas.Review])
def fetch_user_assignments(emp_id: int, db: Session = Depends(get_db)):
    return db.query(models.Review).filter(models.Review.assigned_employee_id == emp_id).all()

@app.put("/reviews/{review_id}/feedback")
def post_feedback(review_id: int, data: schemas.FeedbackCreate, db: Session = Depends(get_db)):
    rev = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not rev:
        raise HTTPException(status_code=404)
    rev.feedback = data.feedback_text
    db.commit()
    return {"status": "updated"}