# Clinic Management System

A full-stack **Clinic Management System** built using **FastAPI**, **ReactJS**, and **Oracle SQL**, designed to streamline patient management, appointments, and clinical workflows through a modern, scalable architecture.

---

## Overview

This project provides a centralized platform for managing clinic operations including:

* Patient registration and records
* Appointment scheduling
* Doctor management
* Medical history tracking
* Admin-level controls and analytics

It follows a **modern web architecture** with a RESTful backend and dynamic frontend, ensuring scalability and maintainability.

---

## Tech Stack

### Backend

* **FastAPI** – High-performance API framework
* **Python**
* **Oracle Database** – Enterprise-grade relational database

### Frontend

* **ReactJS** – Component-based UI
* **JavaScript**
* **HTML5, CSS3**

### Tools & Others

* REST APIs
* Axios / Fetch
* Git & GitHub

---

## System Architecture

```
React Frontend  --->  FastAPI Backend  --->  Oracle SQL Database
       (UI)              (API Layer)            (Data Layer)
```

* Frontend communicates with backend via REST APIs
* Backend handles business logic and database operations
* Oracle SQL ensures structured and secure data storage

---

## Features

### Patient Management

* Add, update, and delete patient records
* Maintain medical history

### Appointment Scheduling

* Book, reschedule, and cancel appointments
* Avoid scheduling conflicts

### Doctor Management

* Manage doctor profiles and availability
* Assign appointments dynamically

### Authentication & Authorization

* Secure login system
* Role-based access (Admin / Staff)

### Dashboard (Optional Enhancement)

* View clinic statistics
* Track appointments and patient flow

---

## Project Structure

```
clinic-system/
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── schemas/
│   │   └── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
│   └── package.json
│
└── README.md
```

---

## Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/Cpt-Shaan/clinic-system.git
cd clinic-system
```

---

### 2. Backend Setup (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs at:

```
http://127.0.0.1:8000
```

API Docs:

```
http://127.0.0.1:8000/docs
```

---

### 3. Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

Frontend runs at:

```
http://localhost:3000
```

---

### 4. Database Setup (Oracle SQL)

* Create required tables using provided SQL scripts
* Configure DB connection in backend

Example:

```python
DATABASE_URL = "oracle+cx_oracle://username:password@localhost:1521/ORCL"
```

## Future Improvements

* AI-based appointment prioritization
* Email/SMS notifications
* Role-based dashboards
* Integration with Electronic Health Records (EHR)
* Deployment on cloud (AWS / Azure)

## Contributing

Contributions are welcome!

1. Fork the repo
2. Create a new branch
3. Commit changes
4. Submit a Pull Request

---

## License

This project is licensed under the MIT License.

---

