from fastapi import APIRouter, HTTPException
from database import get_connection
from schemas import AppointmentCreate

router = APIRouter(prefix="/appointments", tags=["Appointments"])

@router.post("/book")
def book(app: AppointmentCreate):
    with get_connection() as conn:
        cur = conn.cursor()
        try:
            # Format date safely
            date_str = app.appointment_date.strftime("%Y-%m-%d")

            # FIX: Changed 'Scheduled' to 'BOOKED' to match the database constraint exactly!
            cur.execute("""
                INSERT INTO Appointment (
                    appointment_id, patient_id, doctor_id, appointment_date, time_slot, status
                )
                VALUES (APPOINTMENT_SEQ.NEXTVAL, :1, :2, TO_DATE(:3, 'YYYY-MM-DD'), :4, 'BOOKED')
            """, (
                app.patient_id,
                app.doctor_id,
                date_str,
                app.time_slot
            ))
            
            conn.commit()
            return {"message": "Appointment booked successfully"}
            
        except Exception as e:
            conn.rollback()
            print("\n" + "="*50)
            print("🚨 ORACLE DATABASE ERROR 🚨")
            print(str(e))
            print("="*50 + "\n")
            raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{appointment_id}")
def cancel(appointment_id: int):
    with get_connection() as conn:
        cur = conn.cursor()
        cur.execute("DELETE FROM APPOINTMENT WHERE APPOINTMENT_ID=:1", (appointment_id,))
        conn.commit()
    return {"message": "Cancelled"}

@router.get("/patient/{patient_id}")
def get_patient_appointments(patient_id: int):
    with get_connection() as conn:
        cur = conn.cursor()
        cur.execute("""
            SELECT A.appointment_id, D.first_name || ' ' || D.last_name AS doctor, 
                   A.appointment_date, A.time_slot, A.status
            FROM APPOINTMENT A
            JOIN DOCTOR D ON A.doctor_id = D.doctor_id
            WHERE A.patient_id = :1
        """, (patient_id,))
        rows = cur.fetchall()
        
        return [
            {
                "appointment_id": r[0],
                "doctor": r[1],
                "date": r[2].strftime("%Y-%m-%d") if r[2] else "",
                "slot": f"{str(r[3]).zfill(2)}:00 - {str(r[3] + 1).zfill(2)}:00",
                "status": r[4]
            } for r in rows
        ]