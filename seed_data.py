from database import SessionLocal, engine, Base
import models  # Import your SQLAlchemy models file

def seed_database():
    # Create tables if they don't exist yet
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if workers already exist
        existing_workers = db.query(models.Worker).count()
        if existing_workers > 0:
            print(f"Database already contains {existing_workers} workers. Skipping seed.")
            return

        # Sample Workers Data
        sample_workers = [
            models.Worker(
                name="Rajesh Kumar",
                service="electrician",
                rating=4.8,
                latitude=22.5726,
                longitude=88.3639,
                hourly_rate=350.0,
                is_available=True
            ),
            models.Worker(
                name="Amit Sharma",
                service="plumber",
                rating=4.5,
                latitude=22.5800,
                longitude=88.3700,
                hourly_rate=300.0,
                is_available=True
            ),
            models.Worker(
                name="Suresh Das",
                service="electrician",
                rating=4.9,
                latitude=22.5650,
                longitude=88.3550,
                hourly_rate=400.0,
                is_available=True
            ),
            models.Worker(
                name="Priya Sengupta",
                service="carpenter",
                rating=4.6,
                latitude=22.5900,
                longitude=88.3800,
                hourly_rate=450.0,
                is_available=True
            ),
        ]

        db.add_all(sample_workers)
        db.commit()
        print("Successfully seeded database with initial worker records!")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
    