from pydantic import BaseModel
from datetime import date


class PatientCreate(BaseModel):
    name: str
    gender: str
    date_of_birth: date
    phone: str
    email: str | None = None
    address: str | None = None


class AppointmentCreate(BaseModel):
    patient_id: int
    doctor_id: int
    appointment_date: date
    time_slot: str


class PrescriptionCreate(BaseModel):
    appointment_id: int


class MedicationCreate(BaseModel):
    prescription_id: int
    medicine_name: str
    dosage: str
    frequency: str
    duration: str

class PaymentCreate(BaseModel):
    appointment_id: int
    payment_mode: str