from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from database import get_connection

router = APIRouter(prefix="/prescriptions", tags=["Prescription"])

# Define the sub-model for a single medication
class MedicationItem(BaseModel):
    medication_name: str
    dosage: str
    frequency: int
    duration_days: int

# Update the main request to accept a LIST of medications
class PrescriptionRequest(BaseModel):
    appointment_id: int
    doctor_id: int
    medications: List[MedicationItem]

@router.post("/create")
def create(req: PrescriptionRequest):
    with get_connection() as conn:
        cur = conn.cursor()
        try:
            # 1. SAFEGUARD: Check if Consultation already exists for this appointment
            cur.execute("SELECT consultation_id FROM CONSULTATION WHERE appointment_id = :1", (req.appointment_id,))
            cons_row = cur.fetchone()
            
            if cons_row:
                cons_id = cons_row[0] # Use existing
            else:
                # Create new Consultation if it doesn't exist
                cur.execute("SELECT CONSULTATION_SEQ.NEXTVAL FROM DUAL")
                cons_id = cur.fetchone()[0]
                cur.execute("""
                    INSERT INTO CONSULTATION (consultation_id, appointment_id, doctor_id, consultation_date)
                    VALUES (:1, :2, :3, SYSDATE)
                """, (cons_id, req.appointment_id, req.doctor_id))

            # 2. SAFEGUARD: Check if Prescription already exists for this consultation
            cur.execute("SELECT prescription_id FROM PRESCRIPTION WHERE consultation_id = :1", (cons_id,))
            presc_row = cur.fetchone()
            
            if presc_row:
                presc_id = presc_row[0] # Use existing
            else:
                # Create new Prescription if it doesn't exist
                cur.execute("SELECT PRESCRIPTION_SEQ.NEXTVAL FROM DUAL")
                presc_id = cur.fetchone()[0]
                cur.execute("""
                    INSERT INTO PRESCRIPTION (prescription_id, consultation_id, issue_date)
                    VALUES (:1, :2, SYSDATE)
                """, (presc_id, cons_id))

            # 3. Insert ALL medications from the array
            for med in req.medications:
                cur.execute("""
                    INSERT INTO MEDICATION (medication_id, prescription_id, medication_name, dosage, frequency, duration_days)
                    VALUES (MEDICATION_SEQ.NEXTVAL, :1, :2, :3, :4, :5)
                """, (presc_id, med.medication_name, med.dosage, med.frequency, med.duration_days))
            
            conn.commit()
            return {"message": f"Successfully saved {len(req.medications)} medication(s)!"}
            
        except Exception as e:
            conn.rollback()
            print("\n🚨 DB ERROR 🚨\n", str(e))
            raise HTTPException(status_code=400, detail=str(e))

@router.get("/{appointment_id}")
def get_prescription_by_appointment(appointment_id: int):
    with get_connection() as conn:
        cur = conn.cursor()
        cur.execute("""
            SELECT M.medication_name, M.dosage, M.frequency, M.duration_days
            FROM PRESCRIPTION P
            JOIN CONSULTATION C ON P.consultation_id = C.consultation_id
            JOIN MEDICATION M ON P.prescription_id = M.prescription_id
            WHERE C.appointment_id = :1
        """, (appointment_id,))
        rows = cur.fetchall()
        
        if not rows:
            raise HTTPException(status_code=404, detail="Prescription not found")
            
        medications = [
            {
                "medicine": r[0],
                "dosage": r[1],
                "frequency": f"{r[2]} times/day" if r[2] else "N/A",
                "duration": f"{r[3]} days" if r[3] else "N/A"
            } for r in rows
        ]
        
        return {"medications": medications}