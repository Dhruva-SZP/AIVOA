"""
Run once to seed a couple of historic complaints so the Duplicate Complaint
Detection feature has something to compare a new submission against.

    python seed_data.py
"""
from app.database import Base, engine, SessionLocal
from app import models

Base.metadata.create_all(bind=engine)
db = SessionLocal()

samples = [
    dict(
        complaint_number="CC-2026-0001",
        customer_name="Meridian Pharma Distributors",
        customer_email="qa@meridianpharma.example",
        product_name="Amoxicillin Trihydrate API",
        batch_number="AMX-2211-B",
        market_country="Kenya",
        quantity_affected="2 drums (50 kg each)",
        complaint_category="Quality Defect",
        date_of_occurrence="2026-06-02",
        description=(
            "Customer reported off-white discoloration and clumping in two drums of "
            "Amoxicillin Trihydrate API from batch AMX-2211-B, inconsistent with the "
            "certificate of analysis on file."
        ),
        status="Under Investigation",
        source_type="email",
    ),
    dict(
        complaint_number="CC-2026-0002",
        customer_name="Novagen Life Sciences",
        customer_email="complaints@novagen.example",
        product_name="Metformin HCl 500mg FDF Tablets",
        batch_number="MET500-0912",
        market_country="Philippines",
        quantity_affected="1 carton (5,000 tablets)",
        complaint_category="Packaging/Labeling",
        date_of_occurrence="2026-06-18",
        description=(
            "Blister strips in one carton of Metformin HCl 500mg tablets, batch "
            "MET500-0912, were found with the secondary carton label printed in the wrong "
            "language for the destination market."
        ),
        status="Closed",
        source_type="pdf",
    ),
]

for s in samples:
    exists = db.query(models.Complaint).filter_by(complaint_number=s["complaint_number"]).first()
    if not exists:
        db.add(models.Complaint(**s))

db.commit()
db.close()
print(f"Seeded {len(samples)} sample complaints.")
