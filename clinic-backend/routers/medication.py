from fastapi import APIRouter, HTTPException
from database import get_connection
from pydantic import BaseModel

class MedicationCreate(BaseModel):
    name: str

# Keep the prefix here
router = APIRouter(prefix="/medications", tags=["Medications"])

# CHANGE THIS: Remove "/medications" from the decorator
@router.get("/") 
def get_all_medications():
    with get_connection() as conn:
        cur = conn.cursor()
        try:
            cur.execute("SELECT medication_id, medication_name FROM MEDICATION_LIST ORDER BY medication_name")
            rows = cur.fetchall()
            
            medications = [
                {"medication_id": row[0], "medication_name": row[1]} 
                for row in rows
            ]
            return medications
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

# THIS IS NOW CORRECT: Points to /medications/add
@router.post("/add")
def add_medication(med: MedicationCreate):
    with get_connection() as conn:
        cur = conn.cursor()
        try:
            cur.execute("SELECT NVL(MAX(medication_id), 0) + 1 FROM MEDICATION_LIST")
            next_id = cur.fetchone()[0]

            cur.execute("""
                INSERT INTO MEDICATION_LIST (medication_id, medication_name)
                VALUES (:1, :2)
            """, (next_id, med.name))
            
            conn.commit()
            return {"message": f"Successfully added {med.name}", "id": next_id}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=str(e))