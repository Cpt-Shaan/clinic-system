from fastapi import APIRouter
from database import get_connection

router = APIRouter(prefix="/billing")


@router.get("/report")
def billing_report():

    conn = get_connection()
    cursor = conn.cursor()

    query = """
    SELECT 
        b.bill_id,
        p.name,
        b.amount,
        b.payment_status,
        b.payment_mode
    FROM Billing b
    JOIN Appointment a ON b.appointment_id = a.appointment_id
    JOIN Patient p ON a.patient_id = p.patient_id
    """

    cursor.execute(query)

    rows = cursor.fetchall()

    result = []

    for r in rows:
        result.append({
            "bill_id": r[0],
            "patient": r[1],
            "amount": r[2],
            "status": r[3],
            "payment_mode": r[4]
        })

    cursor.close()
    conn.close()

    return result