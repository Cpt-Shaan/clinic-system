from fastapi import APIRouter
from database import get_connection
from schemas import PrescriptionCreate, MedicationCreate

router = APIRouter(prefix="/prescriptions")


@router.post("/create")
def create_prescription(data: PrescriptionCreate):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO Prescription (appointment_id) VALUES (:1)",
        (data.appointment_id,)
    )

    conn.commit()

    cursor.close()
    conn.close()

    return {"message": "Prescription created"}

@router.post("/add-medication")
def add_medication(med: MedicationCreate):

    conn = get_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO Medication (
        prescription_id,
        medicine_name,
        dosage,
        frequency,
        duration
    )
    VALUES (:1,:2,:3,:4,:5)
    """

    cursor.execute(query, (
        med.prescription_id,
        med.medicine_name,
        med.dosage,
        med.frequency,
        med.duration
    ))

    conn.commit()

    cursor.close()
    conn.close()

    return {"message": "Medication added"}

@router.get("/appointment/{appointment_id}")
def get_prescription(appointment_id: int):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT p.prescription_id,
               m.medicine_name,
               m.dosage,
               m.frequency,
               m.duration
        FROM Prescription p
        JOIN Medication m
        ON p.prescription_id = m.prescription_id
        WHERE p.appointment_id = :1
    """, (appointment_id,))

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    meds = []

    for r in rows:
        meds.append({
            "medicine": r[1],
            "dosage": r[2],
            "frequency": r[3],
            "duration": r[4]
        })

    return {
        "appointment_id": appointment_id,
        "medications": meds
    }