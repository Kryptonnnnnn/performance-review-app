from sqlalchemy import Column, Integer, String
from database import Base

class Employee(Base):
    __tablename__ = "employees"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    reviewed_employee_id = Column(Integer)
    assigned_employee_id = Column(Integer)
    feedback = Column(String, nullable=True)