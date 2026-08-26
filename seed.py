from database import SessionLocal, engine
import models

# Recreate tables schema
models.Base.metadata.create_all(bind=engine)

def seed_database():
    db = SessionLocal()
    try:
        # Clear existing tables to prevent duplicate email/unique constraint crashes
        db.query(models.Worker).delete()
        db.query(models.User).delete()
        db.commit()

        # Add Workers matching your exact Worker model fields
        workers = [
            models.Worker(name="Rahul Sharma", service="Electrical", rating=4.8, lat=22.5726, lon=88.3639, exp_years=5, available=True),
            models.Worker(name="Amit Das", service="Electrical", rating=4.6, lat=22.5350, lon=88.3420, exp_years=3, available=False),
            models.Worker(name="Subhash Roy", service="Plumbing", rating=4.9, lat=22.5800, lon=88.3700, exp_years=7, available=True),
            models.Worker(name="Vikram Singh", service="Carpentry", rating=4.5, lat=22.5100, lon=88.3900, exp_years=4, available=True),
            models.Worker(name="Sayan Naskar", service="Construction", rating=4.7, lat=22.5600, lon=88.3500, exp_years=6, available=False),
            models.Worker(name="Pritam Ghosh", service="Electrical", rating=4.4, lat=22.5200, lon=88.3300, exp_years=2, available=True),
        ]
        db.add_all(workers)

        # Add sample User accounts
        users = [
            models.User(name="Demo Client", email="client@example.com", role="citizen"),
            models.User(name="Admin User", email="admin@coop.org", role="admin"),
        ]
        db.add_all(users)

        db.commit()
        print("✅ Database successfully seeded!")
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
    