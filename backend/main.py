from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from jose import jwt
from passlib.context import CryptContext
from typing import List
import models, schemas
from database import engine, SessionLocal

SECRET_KEY = "secretkey123"
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

models.Base.metadata.create_all(bind=engine)
app = FastAPI()

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
        token = jwt.encode({"sub": data.email, "role": "admin"}, SECRET_KEY, algorithm=ALGORITHM)
        return {"access_token": token, "role": "admin"}
    raise HTTPException(status_code=401, detail="Invalid admin credentials")

@app.post("/employee/login")
def employee_login(data: schemas.LoginRequest, db: Session = Depends(get_db)):
    emp = db.query(models.Employee).filter(models.Employee.email == data.email).first()
    if not emp or not pwd_context.verify(data.password, emp.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = jwt.encode({"sub": emp.email, "role": "employee", "id": emp.id}, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "role": "employee", "employee_id": emp.id}

@app.get("/employees", response_model=List[schemas.Employee])
def get_employees(db: Session = Depends(get_db)):
    return db.query(models.Employee).all()

@app.post("/employees", response_model=schemas.Employee)
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    hashed_pwd = pwd_context.hash(employee.password or "password123")
    new_emp = models.Employee(name=employee.name, email=employee.email, hashed_password=hashed_pwd)
    db.add(new_emp)
    db.commit()
    db.refresh(new_emp)
    return new_emp

@app.put("/employees/{emp_id}", response_model=schemas.Employee)
def update_employee(emp_id: int, data: schemas.EmployeeUpdate, db: Session = Depends(get_db)):
    emp = db.query(models.Employee).filter(models.Employee.id == emp_id).first()
    if not emp: raise HTTPException(status_code=404)
    if data.name: emp.name = data.name
    if data.email: emp.email = data.email
    db.commit()
    db.refresh(emp)
    return emp

@app.delete("/employees/{emp_id}")
def delete_employee(emp_id: int, db: Session = Depends(get_db)):
    emp = db.query(models.Employee).filter(models.Employee.id == emp_id).first()
    if not emp: raise HTTPException(status_code=404)
    db.delete(emp)
    db.commit()
    return {"msg": "Deleted"}

@app.get("/reviews", response_model=List[schemas.Review])
def get_all_reviews(db: Session = Depends(get_db)):
    return db.query(models.Review).all()

@app.post("/reviews", response_model=schemas.Review)
def create_review(review: schemas.ReviewCreate, db: Session = Depends(get_db)):
    new_rev = models.Review(**review.dict())
    db.add(new_rev)
    db.commit()
    db.refresh(new_rev)
    return new_rev

@app.put("/reviews/{review_id}", response_model=schemas.Review)
def update_review(review_id: int, data: schemas.ReviewUpdate, db: Session = Depends(get_db)):
    rev = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not rev: raise HTTPException(status_code=404)
    if data.title: rev.title = data.title
    if data.description: rev.description = data.description
    db.commit()
    db.refresh(rev)
    return rev

@app.delete("/reviews/{review_id}")
def delete_review(review_id: int, db: Session = Depends(get_db)):
    rev = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not rev: raise HTTPException(status_code=404)
    db.delete(rev)
    db.commit()
    return {"msg": "Deleted"}

@app.get("/employee/{emp_id}/reviews", response_model=List[schemas.Review])
def get_emp_reviews(emp_id: int, db: Session = Depends(get_db)):
    return db.query(models.Review).filter(models.Review.assigned_employee_id == emp_id).all()

@app.put("/reviews/{review_id}/feedback")
def update_feedback(review_id: int, data: schemas.FeedbackCreate, db: Session = Depends(get_db)):
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review: raise HTTPException(status_code=404)
    review.feedback = data.feedback_text
    db.commit()
    return {"message": "Success"}