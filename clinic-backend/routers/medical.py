from fastapi import APIRouter
from database import get_connection

router = APIRouter(prefix="/medical", tags=["Medical"])

@router.get("/{patient_id}")
def records(patient_id: int):
    with get_connection() as conn:
        cur = conn.cursor()
        cur.execute("SELECT * FROM MEDICAL_RECORD WHERE PATIENT_ID=:1", (patient_id,))
        return cur.fetchall()