from fastapi import APIRouter, HTTPException
from database import get_connection
from pydantic import BaseModel

router = APIRouter(prefix="/doctor", tags=["Doctor"])

# ================= SCHEMAS =================

class DoctorCreate(BaseModel):
    doctor_id: int
    first_name: str
    last_name: str
    specialization: str
    phone: str
    department_id: int

# ================= ROUTES =================

@router.get("/all")
def get_all_doctors():
    with get_connection() as conn:
        cur = conn.cursor()
        cur.execute("SELECT doctor_id, first_name, specialization FROM Doctor")
        rows = cur.fetchall()
        return [{"doctor_id": r[0], "name": r[1], "specialization": r[2]} for r in rows]


@router.get("/{doctor_id}")
def get_doctor_profile(doctor_id: int):
    """
    Fetches doctor details and checks if they hold 
    administrative (Head Doctor) privileges.
    """
    with get_connection() as conn:
        cur = conn.cursor()
        try:
            # 1. Fetch Basic Info
            cur.execute("""
                SELECT doctor_id, first_name, last_name, specialization 
                FROM Doctor 
                WHERE doctor_id = :1
            """, (doctor_id,))
            
            row = cur.fetchone()
            if not row:
                raise HTTPException(status_code=404, detail="Doctor not found")

            # 2. Check Head Doctor Status in Department Table
            cur.execute("""
                SELECT COUNT(*) 
                FROM DEPARTMENT 
                WHERE head_doctor_id = :1
            """, (doctor_id,))
            
            is_head_count = cur.fetchone()[0]

            return {
                "id": row[0],
                "first_name": row[1],
                "last_name": row[2],
                "specialization": row[3],
                "isHead": is_head_count > 0
            }
        except HTTPException:
            raise
        except Exception as e:
            print(f"Database Error in get_doctor_profile: {e}")
            raise HTTPException(status_code=500, detail="Internal Server Error")


@router.post("/add")
def add_doctor(doc: DoctorCreate):
    """
    Adds a new doctor to the database. 
    Requires department_id to satisfy NOT NULL constraints.
    """
    with get_connection() as conn:
        cur = conn.cursor()
        try:
            cur.execute("""
                INSERT INTO DOCTOR (
                    doctor_id, 
                    first_name, 
                    last_name, 
                    specialization, 
                    phone, 
                    department_id
                )
                VALUES (:1, :2, :3, :4, :5, :6)
            """, (
                doc.doctor_id, 
                doc.first_name, 
                doc.last_name, 
                doc.specialization, 
                doc.phone, 
                doc.department_id
            ))
            conn.commit()
            return {"message": "Doctor added successfully", "id": doc.doctor_id}
        except Exception as e:
            conn.rollback()
            # If there's a unique constraint violation (ID already exists), 
            # this catches it and returns a 400.
            raise HTTPException(status_code=400, detail=str(e))



@router.get("/{doctor_id}/appointments")
def get_doctor_appointments(doctor_id: int):
    """Fetches the specific schedule for a doctor."""
    with get_connection() as conn:
        cur = conn.cursor()
        try:
            cur.execute("""
                SELECT appointment_id, patient_id, appointment_date, time_slot
                FROM Appointment
                WHERE doctor_id = :1
                ORDER BY appointment_date, time_slot
            """, (doctor_id,))
            rows = cur.fetchall()
            return [
                {
                    "appointment_id": r[0], 
                    "patient_id": r[1], 
                    "date": str(r[2]), 
                    "slot": r[3]
                } for r in rows
            ]
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))