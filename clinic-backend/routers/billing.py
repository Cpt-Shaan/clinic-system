from fastapi import APIRouter, HTTPException
from database import get_connection
from pydantic import BaseModel
from typing import Optional

# Schema for updating a bill
class BillingUpdate(BaseModel):
    amount: Optional[float] = None
    payment_status: str
    payment_mode: Optional[str] = None

router = APIRouter(prefix="/billing", tags=["Billing"])

@router.get("/patient/{patient_id}")
def get_bills(patient_id: int):
    with get_connection() as conn:
        cur = conn.cursor()
        cur.execute("""
            SELECT B.* FROM BILLING B
            JOIN APPOINTMENT A ON B.APPOINTMENT_ID=A.APPOINTMENT_ID
            WHERE A.PATIENT_ID=:1
        """, (patient_id,))
        return cur.fetchall()

@router.post("/pay/{appointment_id}")
def pay(appointment_id: int):
    with get_connection() as conn:
        cur = conn.cursor()
        cur.execute("""
            UPDATE BILLING 
            SET PAYMENT_STATUS='PAID'
            WHERE APPOINTMENT_ID=:1
        """, (appointment_id,))
        conn.commit()
    return {"message": "Paid"}

# FIX 1: Filter report by the specific Doctor's ID
@router.get("/report/{doctor_id}")
def get_billing_report(doctor_id: int):
    with get_connection() as conn:
        cur = conn.cursor()
        # We fetch billing_id so React knows which record to update
        cur.execute("""
            SELECT B.billing_id, P.first_name || ' ' || P.last_name AS patient, 
                   B.amount, B.payment_status, B.payment_mode
            FROM BILLING B
            JOIN APPOINTMENT A ON B.appointment_id = A.appointment_id
            JOIN PATIENT P ON A.patient_id = P.patient_id
            WHERE A.doctor_id = :1
        """, (doctor_id,))
        
        rows = cur.fetchall()
        return [
            {
                "billing_id": r[0],
                "patient": r[1],
                "amount": r[2] or 0, # Default to 0 if null
                "status": r[3],
                "payment_mode": r[4] or "" # Default to empty string if null
            } for r in rows
        ]

# FIX 2: Create a route to save changes made by the doctor
@router.put("/update/{billing_id}")
def update_billing(billing_id: int, payload: BillingUpdate):
    with get_connection() as conn:
        cur = conn.cursor()
        try:
            cur.execute("""
                UPDATE BILLING 
                SET AMOUNT = :1, 
                    PAYMENT_STATUS = :2, 
                    PAYMENT_MODE = :3
                WHERE BILLING_ID = :4
            """, (payload.amount, payload.payment_status, payload.payment_mode, billing_id))
            conn.commit()
            return {"message": "Billing updated successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=400, detail=str(e))