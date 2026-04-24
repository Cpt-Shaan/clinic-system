from pydantic import BaseModel,Field
from datetime import date
from typing import Optional


# ========================
# DEPARTMENT
# ========================
class DepartmentCreate(BaseModel):
    department_id: int
    department_name: str
    head_doctor_id: Optional[int] = None


# ========================
# DOCTOR
# ========================
class DoctorCreate(BaseModel):
    doctor_id: int
    first_name: str
    last_name: str
    specialization: Optional[str] = None
    phone: Optional[str] = None
    department_id: int


# ========================
# PATIENT
# ========================
class PatientCreate(BaseModel):
    patient_id: int
    first_name: str
    last_name: str
    email: str
    phone: str
    address: str
    date_of_birth: date


# ========================
# STAFF
# ========================
class StaffCreate(BaseModel):
    staff_id: int
    first_name: str
    last_name: str
    position: Optional[str] = None
    department_id: int


# ========================
# APPOINTMENT
# ========================
class AppointmentCreate(BaseModel):
    patient_id: int
    doctor_id: int
    appointment_date: date
    time_slot: int = Field(..., ge=0, le=23)

# ========================
# MEDICAL RECORD
# ========================
class MedicalRecordCreate(BaseModel):
    record_id: int
    appointment_id: int
    patient_id: int
    symptoms: Optional[str] = None
    treatment: Optional[str] = None


# ========================
# BILLING
# ========================
class PaymentCreate(BaseModel):
    billing_id: int
    appointment_id: int
    amount: Optional[float] = None
    payment_mode: Optional[str] = None
    payment_status: str  # PAID / PENDING
    billing_date: Optional[date] = None


# ========================
# CONSULTATION
# ========================
class ConsultationCreate(BaseModel):
    consultation_id: int
    appointment_id: int
    doctor_id: int
    notes: Optional[str] = None
    consultation_date: Optional[date] = None


# ========================
# PRESCRIPTION
# ========================
class PrescriptionCreate(BaseModel):
    prescription_id: int
    consultation_id: int
    issue_date: Optional[date] = None


# ========================
# MEDICATION
# ========================
class MedicationCreate(BaseModel):
    medication_id: int
    prescription_id: int
    medication_name: str
    dosage: Optional[str] = None
    frequency: Optional[int] = None
    duration_days: Optional[int] = None