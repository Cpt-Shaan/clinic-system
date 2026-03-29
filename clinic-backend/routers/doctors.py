from fastapi import APIRouter
from database import get_connection

router = APIRouter(prefix="/doctors")

@router.get("/")
def get_doctors():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT d.doctor_id,
               d.name,
               d.specialization,
               d.phone,
               dept.department_name
        FROM Doctor d
        JOIN Department dept
        ON d.department_id = dept.department_id
    """)

    rows = cursor.fetchall()

    doctors = []

    for r in rows:
        doctors.append({
            "doctor_id": r[0],
            "name": r[1],
            "specialization": r[2],
            "phone": r[3],
            "department": r[4]
        })

    cursor.close()
    conn.close()

    return doctors

@router.get("/{doctor_id}")
def get_doctor_details(doctor_id: int):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT name, specialization, phone, email
        FROM Doctor
        WHERE doctor_id = :1
    """, (doctor_id,))

    row = cursor.fetchone()

    cursor.close()
    conn.close()

    if not row:
        return {"error": "Doctor not found"}

    return {
        "name": row[0],
        "specialization": row[1],
        "phone": row[2],
        "email": row[3]
    }

@router.get("/{doctor_id}/next-slot")
def next_available_slot(doctor_id: int):

    conn = get_connection()
    cursor = conn.cursor()

    slots = [
        "09:00-09:30",
        "09:30-10:00",
        "10:00-10:30",
        "10:30-11:00",
        "11:00-11:30",
        "11:30-12:00"
    ]

    from datetime import date
    today = date.today()

    cursor.execute("""
        SELECT time_slot
        FROM Appointment
        WHERE doctor_id = :1
        AND appointment_date = :2
    """, (doctor_id, today))

    booked = [r[0] for r in cursor.fetchall()]

    cursor.close()
    conn.close()

    for slot in slots:
        if slot not in booked:
            return {
                "doctor_id": doctor_id,
                "date": str(today),
                "next_available_slot": slot
            }

    return {"message": "No slots available today"}

