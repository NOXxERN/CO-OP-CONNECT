from database import SessionLocal, engine, Base
import models

Base.metadata.create_all(bind=engine)

def seed_database():
    db = SessionLocal()
    try:
        if db.query(models.Worker).count() > 0:
            print("Workers already exist. Skipping seed.")
            return

        workers = [
            models.Worker(name="Rajesh Kumar", service="Electrical", rating=4.8, lat=22.5726, lon=88.3639, exp_years=5, available=True),
            models.Worker(name="Amit Sharma", service="Plumbing", rating=4.5, lat=22.5800, lon=88.3700, exp_years=3, available=True),
            models.Worker(name="Suresh Das", service="Electrical", rating=4.9, lat=22.5650, lon=88.3550, exp_years=8, available=True),
            models.Worker(name="Priya Sengupta", service="Carpentry", rating=4.6, lat=22.5900, lon=88.3800, exp_years=4, available=True),
        ]

        db.add_all(workers)
        db.commit()
        print("Database seeded successfully.")
    except Exception as error:
        db.rollback()
        print(f"Seed error: {error}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
