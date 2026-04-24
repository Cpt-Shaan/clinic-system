from fastapi import APIRouter, HTTPException
from database import get_connection
from schemas import PatientCreate

router = APIRouter(prefix="/patient", tags=["Patients"])

@router.post("/register")
def register(patient: PatientCreate):
    with get_connection() as conn:
        cur = conn.cursor()
        try:
            cur.execute("""
                INSERT INTO PATIENT 
                VALUES (:1,:2,:3,:4,:5,:6,:7)
            """, (
                patient.patient_id,
                patient.first_name,
                patient.last_name,
                patient.email,
                patient.phone,
                patient.address,
                patient.date_of_birth
            ))
            conn.commit()
            return {"message": "Registered"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(400, str(e))


@router.get("/{patient_id}")
def get_profile(patient_id: int):
    with get_connection() as conn:
        cur = conn.cursor()
        cur.execute("SELECT * FROM PATIENT WHERE PATIENT_ID=:1", (patient_id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(404, "Not found")
        return row
    

# Assuming you already have a patient router set up
@router.get("/{patient_id}/appointments")
def get_patient_appointments(patient_id: int):
    with get_connection() as conn:
        cur = conn.cursor()
        try:
            # FIXED: Updated column names to match your Oracle schema exactly
            cur.execute("""
                SELECT appointment_id, doctor_id, appointment_date, time_slot 
                FROM APPOINTMENT 
                WHERE patient_id = :1 
                ORDER BY appointment_date DESC
            """, (patient_id,))
            rows = cur.fetchall()
            
            appointments = [
                {
                    "appointment_id": row[0], 
                    "doctor_id": row[1], 
                    "date": str(row[2]), # row[2] is now APPOINTMENT_DATE
                    "slot": row[3]       # row[3] is now TIME_SLOT
                } 
                for row in rows
            ]
            return appointments
        except Exception as e:
            # This prints the exact database error to your terminal so you can see it!
            print(f"Database error: {e}") 
            raise HTTPException(status_code=500, detail=str(e))