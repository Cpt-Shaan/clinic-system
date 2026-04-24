from fastapi import FastAPI

from routers import patient
from routers import appointment
from routers import prescription
from routers import billing
from routers import doctor
from routers import auth
from routers import medication
from routers import staff
from routers import department
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Clinic Management System API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all (fine for your project)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router)
app.include_router(patient.router)
app.include_router(appointment.router)
app.include_router(prescription.router)
app.include_router(billing.router)
app.include_router(doctor.router)  
app.include_router(medication.router)
app.include_router(staff.router)
app.include_router(department.router)
@app.get("/")
def root():
    return {"message": "running"}