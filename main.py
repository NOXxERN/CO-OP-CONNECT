from contextlib import asynccontextmanager
from datetime import datetime
import math
from typing import List, Optional

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
from pydantic import BaseModel
from sqlalchemy.orm import Session

import database
from database import SessionLocal, engine, get_db
import models

# Initialize database tables
models.Base.metadata.create_all(bind=engine)

# --- LIFESPAN CONTEXT MANAGER ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    db = SessionLocal()
    try:
        if db.query(models.Worker).count() == 0:
            initial_workers = [
                models.Worker(name="Rahul Kumar", service="Plumbing", rating=4.8, lat=22.5726, lon=88.3639, exp_years=5, available=True),
                models.Worker(name="Amit Das", service="Plumbing", rating=4.6, lat=22.5800, lon=88.3700, exp_years=3, available=True),
                models.Worker(name="Suresh Verma", service="Electrical", rating=4.9, lat=22.5650, lon=88.3600, exp_years=8, available=True),
                models.Worker(name="Priya Sharma", service="Cleaner", rating=4.7, lat=22.5700, lon=88.3650, exp_years=4, available=True)
            ]
            db.add_all(initial_workers)
            db.commit()
            print("✅ Initial worker seed completed")
    finally:
        db.close()
    yield

# Initialize FastAPI app with lifespan
app = FastAPI(title="CO-OP CONNECT API", lifespan=lifespan)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Machine Learning Model safely
try:
    ml_model = joblib.load("worker_platform_model.joblib")
    print("✅ ML Model loaded successfully")
except Exception as e:
    ml_model = None
    print(f"⚠️ Could not load ML model: {e}")

# --- PYDANTIC SCHEMAS ---
class UserRegister(BaseModel):
    name: str
    email: str
    role: str

class AdminLogin(BaseModel):
    email: str
    password: str

class MatchRequest(BaseModel):
    service: str
    customer_lat: float
    customer_lon: float

class BookingRequest(BaseModel):
    customer_id: Optional[int] = 1
    worker_id: Optional[int] = 1
    service: Optional[str] = "Electrical"
    service_category: Optional[str] = None
    location: Optional[str] = "North District"
    urgency: Optional[str] = "Medium"
    details: Optional[str] = ""

class StatusUpdate(BaseModel):
    status: str

class PredictionRequest(BaseModel):
    service: Optional[str] = "Electrical"
    service_type: Optional[str] = "Electrical"
    region: Optional[str] = "north"
    days_ahead: int = 1

class DynamicPriceRequest(BaseModel):
    base_price: float = 500.0
    service_type: Optional[str] = "Electrical"
    lat: Optional[float] = 22.57
    lon: Optional[float] = 88.36

class TaskTimeRequest(BaseModel):
    worker_id: int = 1
    task_type: str = "Electrical"
    hour_of_day: Optional[int] = None
    day_of_week: Optional[int] = None
    is_weekend: Optional[int] = None

# --- HELPER FUNCTIONS ---
def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

# --- API ROUTES ---
@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "Welcome to CO-OP CONNECT API",
        "docs": "/docs"
    }

@app.get("/api/workers")
def list_all_workers(service: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Worker)
    if service:
        query = query.filter(models.Worker.service.ilike(service))
    workers = query.all()
    return [
        {
            "worker_id": w.id,
            "name": w.name,
            "service": w.service,
            "rating": w.rating,
            "exp_years": w.exp_years,
            "lat": w.lat,
            "lon": w.lon,
            "is_available": w.available
        }
        for w in workers
    ]

@app.post("/api/register")
def register_user(user: UserRegister, db: Session = Depends(get_db)):
    db_user = models.User(name=user.name, email=user.email, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message": "User registered successfully", "user_id": db_user.id}

@app.post("/api/admin/login")
def admin_login(credentials: AdminLogin):
    if credentials.email == "admin@coopconnect.com" and credentials.password == "admin123":
        return {
            "status": "success",
            "token": "admin-demo-token-12345",
            "admin": {"email": credentials.email, "role": "admin"}
        }
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid admin credentials")

@app.post("/api/match")
def match_workers(request: MatchRequest, db: Session = Depends(get_db)):
    workers = db.query(models.Worker).filter(
        models.Worker.service.ilike(request.service),
        models.Worker.available == True
    ).all()
    
    results = []
    for w in workers:
        dist = calculate_distance(request.customer_lat, request.customer_lon, w.lat, w.lon)
        dist_score = max(0, 100 - (dist * 10))
        rating_score = (w.rating / 5.0) * 100
        exp_score = min(100, w.exp_years * 10)
        
        match_percentage = round((dist_score * 0.4) + (rating_score * 0.4) + (exp_score * 0.2), 1)
        results.append({
            "worker_id": w.id,
            "name": w.name,
            "distance_km": round(dist, 2),
            "rating": w.rating,
            "match_score": match_percentage
        })
    
    results.sort(key=lambda x: x["match_score"], reverse=True)
    return {"matches": results}

@app.get("/api/bookings")
def get_all_bookings(db: Session = Depends(get_db)):
    bookings = db.query(models.Booking).all()
    return [
        {
            "id": b.id,
            "customer_id": b.customer_id,
            "worker_id": b.worker_id,
            "service": b.service,
            "status": b.status
        }
        for b in bookings
    ]

@app.post("/api/bookings")
def create_booking(booking: BookingRequest, db: Session = Depends(get_db)):
    # Support both explicit 'service' and form-based 'service_category'
    service_value = booking.service if booking.service else (booking.service_category or "Electrical")
    
    new_booking = models.Booking(
        customer_id=booking.customer_id if booking.customer_id else 1,
        worker_id=booking.worker_id if booking.worker_id else 1,
        service=service_value,
        status="pending"
    )
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return {"message": "Booking created", "booking_id": new_booking.id, "status": new_booking.status}

@app.put("/api/bookings/{booking_id}/status")
def update_booking_status(booking_id: int, update: StatusUpdate, db: Session = Depends(get_db)):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
    booking.status = update.status
    db.commit()
    return {"message": "Status updated successfully", "booking_id": booking.id, "status": booking.status}

@app.get("/api/customers")
def get_customers(db: Session = Depends(get_db)):
    return db.query(models.User).filter(models.User.role == "customer").all()

@app.get("/api/admin/stats")
def get_admin_stats(db: Session = Depends(get_db)):
    return {
        "total_workers": db.query(models.Worker).count(),
        "total_customers": db.query(models.User).filter(models.User.role == "customer").count(),
        "total_bookings": db.query(models.Booking).count(),
        "active_jobs": db.query(models.Booking).filter(models.Booking.status.in_(["pending", "accepted"])).count(),
        "completed_jobs": db.query(models.Booking).filter(models.Booking.status == "completed").count()
    }

@app.post("/api/admin/predict-demand")
def predict_demand(request: PredictionRequest):
    selected_service = request.service_type or request.service or "Electrical"
    base_demand = {"plumbing": 45, "electrical": 30, "cleaning": 20, "cleaner": 20}
    current_demand = base_demand.get(selected_service.lower(), 25)
    forecasted_demand = int(current_demand * (1 + (0.15 * request.days_ahead)))
    
    return {
        "service": selected_service.capitalize(),
        "region": request.region,
        "forecast_days": request.days_ahead,
        "predicted_requests": forecasted_demand,
        "demand_level": "HIGH DEMAND" if forecasted_demand > 35 else "MODERATE DEMAND",
        "action_recommended": f"Deploy {math.ceil(forecasted_demand * 0.2)} additional workers."
    }

@app.post("/api/dynamic_price")
def calculate_dynamic_price(request: DynamicPriceRequest):
    multiplier = 1.2
    return {
        "base_price": request.base_price,
        "service_type": request.service_type,
        "surge_multiplier": multiplier,
        "recommended_price": round(request.base_price * multiplier, 2),
        "currency": "INR"
    }

@app.post("/api/predict_completion_time")
def predict_completion_time(request: TaskTimeRequest):
    now = datetime.now()
    hour = request.hour_of_day if request.hour_of_day is not None else now.hour
    day = request.day_of_week if request.day_of_week is not None else now.weekday()
    is_weekend = 1 if day >= 5 else 0

    est_minutes = 45.0
    if ml_model is not None:
        try:
            input_df = pd.DataFrame({
                "worker_id": [request.worker_id],
                "task_type": [request.task_type],
                "hour_of_day": [hour],
                "day_of_week": [day],
                "is_weekend": [is_weekend]
            })
            est_minutes = round(float(ml_model.predict(input_df)[0]), 1)
        except Exception:
            pass

    return {
        "worker_id": request.worker_id,
        "task_type": request.task_type,
        "estimated_completion_time_minutes": est_minutes
    }
