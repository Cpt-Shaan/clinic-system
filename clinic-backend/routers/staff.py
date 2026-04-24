from fastapi import APIRouter, HTTPException
from database import get_connection
from pydantic import BaseModel

router = APIRouter(prefix="/staff", tags=["Staff"])

class StaffCreate(BaseModel):
    staff_id: int
    first_name: str
    last_name: str
    position: str
    department_id: int

# ================= ADD NEW STAFF (Admin/Head Only) =================
@router.post("/add")
def add_staff(staff: StaffCreate):
    with get_connection() as conn:
        cur = conn.cursor()
        try:
            cur.execute("""
                INSERT INTO STAFF (staff_id, first_name, last_name, position, department_id)
                VALUES (:1, :2, :3, :4, :5)
            """, (staff.staff_id, staff.first_name, staff.last_name, staff.position, staff.department_id))
            conn.commit()
            return {"message": "Staff member added successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=400, detail=str(e))

@router.get("/{staff_id}")
def get_staff_profile(staff_id: int):
    with get_connection() as conn:
        cur = conn.cursor()
        try:
            cur.execute("""
                SELECT staff_id, first_name, last_name, position, department_id 
                FROM STAFF WHERE staff_id = :1
            """, (staff_id,))
            row = cur.fetchone()
            if not row:
                raise HTTPException(status_code=404, detail="Staff member not found")
                
            return {
                "staff_id": row[0],
                "first_name": row[1],
                "last_name": row[2],
                "position": row[3],
                "department_id": row[4]
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))