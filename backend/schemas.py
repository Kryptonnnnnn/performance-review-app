from pydantic import BaseModel, EmailStr
from typing import Optional, List

class LoginRequest(BaseModel):
    email: str
    password: str

class EmployeeBase(BaseModel):
    name: str
    email: EmailStr

class EmployeeCreate(EmployeeBase):
    password: Optional[str] = "password123" 

class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None

class Employee(EmployeeBase):
    id: int
    class Config:
        from_attributes = True

class ReviewBase(BaseModel):
    title: str
    description: str
    reviewed_employee_id: int
    assigned_employee_id: int

class ReviewCreate(ReviewBase):
    pass

class ReviewUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None

class Review(ReviewBase):
    id: int
    feedback: Optional[str] = None
    class Config:
        from_attributes = True

class FeedbackCreate(BaseModel):
    feedback_text: str