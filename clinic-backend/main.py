from fastapi import FastAPI

from routers import patients
from routers import appointments
from routers import prescriptions
from routers import billing
from routers import doctors

app = FastAPI(
    title="Clinic Management System API"
)

app.include_router(patients.router)
app.include_router(appointments.router)
app.include_router(prescriptions.router)
app.include_router(billing.router)
app.include_router(doctors.router)