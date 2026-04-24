from fastapi import APIRouter, HTTPException
from database import get_connection

router = APIRouter(prefix="/login", tags=["Auth"])


@router.post("/patient")
def patient_login(patient_id: int):

    with get_connection() as conn:
        cur = conn.cursor()

        cur.execute(
            "SELECT 1 FROM PATIENT WHERE PATIENT_ID = :1",
            (patient_id,)
        )

        if not cur.fetchone():
            raise HTTPException(status_code=404, detail="Patient not found")

    return {
        "message": "Login successful",
        "patient_id": patient_id
    }


@router.post("/doctor")
def doctor_login(doctor_id: int):

    with get_connection() as conn:
        cur = conn.cursor()

        cur.execute(
            "SELECT 1 FROM DOCTOR WHERE DOCTOR_ID = :1",
            (doctor_id,)
        )

        if not cur.fetchone():
            raise HTTPException(status_code=404, detail="Doctor not found")

    return {
        "message": "Login successful",
        "doctor_id": doctor_id
    }