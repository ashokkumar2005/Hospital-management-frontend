# Hospital Management System – Frontend

## 📌 Project Overview

The **Hospital Management System Frontend** is built using **React.js** and provides an interactive user interface for patients, doctors, and administrators.

The application allows users to:

* Find nearby hospitals based on location
* Book doctor appointments
* Donate blood or request blood
* Use AI to check symptoms
* Manage hospital activities through dedicated dashboards

This frontend communicates with the backend API built using **Node.js, Express, and MongoDB**.

---

## 🚀 Tech Stack

* React.js
* React Router
* Axios
* Bootstrap / Tailwind CSS
* Google Maps API / Location API
* Context API / Redux (optional)
* AI API for symptoms checker

---

## 📂 Folder Structure

```
src/
 ├── components/
 │     ├── Navbar.js
 │     ├── Footer.js
 │     └── HospitalCard.js
 │
 ├── pages/
 │     ├── Home.js
 │     ├── Login.js
 │     ├── Register.js
 │     ├── HospitalsNearby.js
 │     ├── AppointmentBooking.js
 │     ├── BloodDonation.js
 │     ├── SymptomChecker.js
 │     ├── PatientDashboard.js
 │     ├── DoctorDashboard.js
 │     └── AdminDashboard.js
 │
 ├── services/
 │     └── api.js
 │
 ├── context/
 │     └── AuthContext.js
 │
 ├── App.js
 └── index.js
```

---

## ✨ Features

### 👤 Patient Features

* User registration and login
* Find nearby hospitals using location
* Book doctor appointments
* View appointment history
* Blood donation and blood request
* AI symptom checker

### 🩺 Doctor Features

* Doctor login
* View patient appointments
* Update appointment status
* Manage availability

### 🛠 Admin Features

* Manage hospitals
* Manage doctors
* View system analytics
* Manage blood donation requests

---

## 📍 Nearby Hospital Finder

The system uses **Geolocation API** to detect the user's location and display nearby hospitals using maps.

---

## 🤖 AI Symptom Checker

Users can enter symptoms and get possible health suggestions using AI.

Example:

```
Input: Fever, headache
Output: Possible flu or viral infection
Suggestion: Consult a doctor
```

---

## 🔧 Installation

### 1️⃣ Clone the Repository

```
git clone https://github.com/yourusername/hospital-management-system.git
```

### 2️⃣ Navigate to Frontend

```
cd frontend
```

### 3️⃣ Install Dependencies

```
npm install
```

### 4️⃣ Start the React App

```
npm start
```

The frontend will run on:

```
http://localhost:3000
```

---

## 🌐 API Connection

Example API call:

```javascript
axios.get("http://localhost:5000/api/hospitals")
```

---

## 🔮 Future Improvements

* Online payment for appointments
* Video consultation with doctors
* Real-time chat with hospital support
* Health record storage
* Emergency ambulance request

---

## 👨‍💻 Author

Ashok Sam

Full Stack Developer (MERN)
