from fastapi import APIRouter
from database import get_connection
from schemas import PatientCreate

router = APIRouter(prefix="/patients")


@router.post("/register")
def register_patient(patient: PatientCreate):

    conn = get_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO Patient (
        name,
        gender,
        date_of_birth,
        phone,
        email,
        address
    )
    VALUES (:1,:2,:3,:4,:5,:6)
    """

    cursor.execute(query, (
        patient.name,
        patient.gender,
        patient.date_of_birth,
        patient.phone,
        patient.email,
        patient.address
    ))

    conn.commit()
    cursor.close()
    conn.close()

    return {"message": "Patient registered successfully"}

@router.get("/")
def get_patients():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT patient_id, name, phone
        FROM Patient
    """)

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    patients = []

    for r in rows:
        patients.append({
            "patient_id": r[0],
            "name": r[1],
            "phone": r[2]
        })

    return patients