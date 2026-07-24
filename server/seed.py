"""Seed the database with realistic demo data.

Run with: python seed.py
"""
import random
from datetime import date, timedelta

from app.database.base import Base
from app.database.session import engine, SessionLocal
from app.models.user import User
from app.models.equipment import Equipment
from app.models.booking import Booking
from app.models.enums import UserRole, EquipmentCategory, BookingStatus
from app.auth.security import hash_password

random.seed(42)

LOCATIONS = ["Nashik", "Pune", "Ludhiana", "Indore", "Coimbatore", "Nagpur", "Guntur", "Bhopal"]

EQUIPMENT_BY_CATEGORY = {
    EquipmentCategory.TRACTOR: ["Mahindra 575 DI Tractor", "John Deere 5310 Tractor", "Sonalika DI 750 Tractor"],
    EquipmentCategory.HARVESTER: ["New Holland Combine Harvester", "Kartar 4000 Harvester"],
    EquipmentCategory.ROTAVATOR: ["Shaktiman Rotavator", "Fieldking Rotavator"],
    EquipmentCategory.SEEDER: ["Precision Seed Drill", "Multi-Crop Seeder"],
    EquipmentCategory.POWER_TILLER: ["VST Shakti Power Tiller", "Kubota Power Tiller"],
    EquipmentCategory.CULTIVATOR: ["Spring Loaded Cultivator", "Heavy Duty Cultivator"],
    EquipmentCategory.SPRAYER: ["Boom Sprayer", "Battery Backpack Sprayer"],
}

CATEGORY_IMAGES = {
    "tractor": "/equipment/tractor.png",
    "harvester": "/equipment/harvester.png",
    "rotavator": "/equipment/rotavator.png",
    "seeder": "/equipment/seeder.png",
    "power_tiller": "/equipment/power_tiller.png",
    "cultivator": "/equipment/cultivator.png",
    "sprayer": "/equipment/sprayer.png",
}


def seed():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        owners = []
        for i in range(1, 6):
            owner = User(
                name=f"Owner {i}",
                email=f"owner{i}@example.com",
                password=hash_password("password123"),
                role=UserRole.OWNER,
            )
            db.add(owner)
            owners.append(owner)

        farmers = []
        for i in range(1, 11):
            farmer = User(
                name=f"Farmer {i}",
                email=f"farmer{i}@example.com",
                password=hash_password("password123"),
                role=UserRole.FARMER,
            )
            db.add(farmer)
            farmers.append(farmer)

        db.commit()

        equipment_list = []
        categories = list(EQUIPMENT_BY_CATEGORY.keys())
        for i in range(20):
            category = categories[i % len(categories)]
            title = random.choice(EQUIPMENT_BY_CATEGORY[category])
            equipment = Equipment(
                owner_id=random.choice(owners).id,
                title=f"{title} #{i + 1}",
                description=(
                    f"Well-maintained {title.lower()} available for daily rental. "
                    "Regularly serviced and ready for field use."
                ),
                category=category,
                location=random.choice(LOCATIONS),
                price_per_day=round(random.uniform(800, 5000), 2),
                availability=True,
                image=CATEGORY_IMAGES.get(category.value),
            )
            db.add(equipment)
            equipment_list.append(equipment)

        db.commit()

        for i in range(15):
            equipment = random.choice(equipment_list)
            farmer = random.choice(farmers)
            start = date.today() + timedelta(days=random.randint(1, 30))
            end = start + timedelta(days=random.randint(1, 5))
            days = (end - start).days + 1

            booking = Booking(
                equipment_id=equipment.id,
                farmer_id=farmer.id,
                start_date=start,
                end_date=end,
                status=random.choice(list(BookingStatus)),
                total_price=round(days * equipment.price_per_day, 2),
            )
            db.add(booking)

        db.commit()
        print("Seed complete: 5 owners, 10 farmers, 20 equipment, 15 bookings")
        print("All demo accounts use password: password123")

    finally:
        db.close()


if __name__ == "__main__":
    seed()
