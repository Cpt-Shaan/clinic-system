from fastapi import APIRouter, HTTPException
from database import get_connection
from pydantic import BaseModel

router = APIRouter(prefix="/department", tags=["Department"])

class DepartmentUpdate(BaseModel):
    department_id: int
    new_name: str

@router.get("/{dept_id}")
def get_department_details(dept_id: int):
    with get_connection() as conn:
        cur = conn.cursor()
        cur.execute("SELECT department_id, department_name, head_doctor_id FROM DEPARTMENT WHERE department_id = :1", (dept_id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Department not found")
        return {"id": row[0], "name": row[1], "head_id": row[2]}

@router.put("/update")
def update_department(dept: DepartmentUpdate):
    with get_connection() as conn:
        cur = conn.cursor()
        try:
            cur.execute("""
                UPDATE DEPARTMENT 
                SET department_name = :1 
                WHERE department_id = :2
            """, (dept.new_name, dept.department_id))
            conn.commit()
            return {"message": "Department updated successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=400, detail=str(e))