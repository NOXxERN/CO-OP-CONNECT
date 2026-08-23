from sqlalchemy import Column, Integer, String, Float, Boolean
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True)
    role = Column(String)

class Worker(Base):
    __tablename__ = "workers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    service = Column(String)
    rating = Column(Float, default=5.0)
    lat = Column(Float)
    lon = Column(Float)
    exp_years = Column(Integer)
    available = Column(Boolean, default=True)

class Booking(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer)
    worker_id = Column(Integer)
    service = Column(String)
    status = Column(String, default="pending")
    