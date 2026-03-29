from fastapi import APIRouter
from database import get_connection
from schemas import AppointmentCreate, PaymentCreate

router = APIRouter(prefix="/appointments")


@router.post("/book")
def book_appointment(appt: AppointmentCreate):

    conn = get_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO Appointment (
        patient_id,
        doctor_id,
        appointment_date,
        time_slot
    )
    VALUES (:1,:2,:3,:4)
    """

    cursor.execute(query, (
        appt.patient_id,
        appt.doctor_id,
        appt.appointment_date,
        appt.time_slot
    ))

    conn.commit()

    cursor.close()
    conn.close()

    return {
        "message": "Appointment booked",
        "note": "Billing record automatically created with Pending status by database trigger"
    }

@router.post("/pay")
def pay_for_appointment(payment: PaymentCreate):

    conn = get_connection()
    cursor = conn.cursor()

    # Check billing status
    cursor.execute(
        """
        SELECT payment_status
        FROM Billing
        WHERE appointment_id = :1
        """,
        (payment.appointment_id,)
    )

    result = cursor.fetchone()

    if result is None:
        cursor.close()
        conn.close()
        return {"error": "No billing record found for this appointment"}

    status = result[0]

    if status != "Pending":
        cursor.close()
        conn.close()
        return {"error": "Payment already completed for this appointment"}

    # Update payment
    cursor.execute(
        """
        UPDATE Billing
        SET payment_mode = :1,
            payment_date = SYSDATE
        WHERE appointment_id = :2
        """,
        (payment.payment_mode, payment.appointment_id)
    )

    conn.commit()

    cursor.close()
    conn.close()

    return {
        "message": "Payment successful",
        "appointment_id": payment.appointment_id
    }

@router.get("/patient/{patient_id}")
def patient_appointments(patient_id: int):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT a.appointment_id,
               d.name,
               a.appointment_date,
               a.time_slot,
               a.status
        FROM Appointment a
        JOIN Doctor d
        ON a.doctor_id = d.doctor_id
        WHERE a.patient_id = :1
        ORDER BY a.appointment_date DESC
    """, (patient_id,))

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    appointments = []

    for r in rows:
        appointments.append({
            "appointment_id": r[0],
            "doctor": r[1],
            "date": str(r[2]),
            "slot": r[3],
            "status": r[4]
        })

    return appointments

@router.get("/doctor/{doctor_id}")
def doctor_schedule(doctor_id: int):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT a.appointment_id,
               p.name,
               a.appointment_date,
               a.time_slot
        FROM Appointment a
        JOIN Patient p
        ON a.patient_id = p.patient_id
        WHERE a.doctor_id = :1
        ORDER BY a.appointment_date
    """, (doctor_id,))

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    schedule = []

    for r in rows:
        schedule.append({
            "appointment_id": r[0],
            "patient": r[1],
            "date": str(r[2]),
            "slot": r[3]
        })

    return schedule