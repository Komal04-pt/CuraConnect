# 🩺 CuraConnect - Doctor Appointment Booking System

CuraConnect is a full-stack web application built for a hospital to manage its entire appointment booking process online — from a patient discovering a doctor, to booking a slot, paying for it, and the hospital's admin team managing everything behind the scenes.

It is built for **one hospital's own use** — not as a multi-hospital marketplace where patients pick between different hospitals. Any hospital or clinic can take this project and deploy it as their own official appointment booking website, with their own doctors, their own branding, and their own admin team running it.

---

🔗 Live Demo
Patient Website: https://doctor-appointment-frontend-2c3j.onrender.com
Admin Panel: https://doctor-appointment-system-admin-3j9e.onrender.com
---

## 🌐 What This Website Does

CuraConnect has two sides that work together on a shared backend:

- **A patient-facing website** where people can create an account, look through the hospital's doctors by specialty, check availability, and book an appointment — either paying online or choosing to pay cash at the hospital.
- **An admin panel** where the hospital's staff can add or remove doctors, view and manage every appointment (mark it as scheduled, completed, no-show, or cancelled), manage patient accounts, create additional admin accounts, check overall stats, and respond to enquiries, feedback, or complaints submitted by patients.

In short, it replaces the need for patients to call or walk in to book an appointment, and gives the hospital a simple dashboard to run the whole booking process digitally.

---

## 👥 Who Uses It

- **Patients** – Register/login, browse doctors by specialty, check availability, book or cancel appointments, pay online or choose cash, track their appointment history, and reach out via enquiry/feedback/complaint forms.
- **Admins** – Login to a separate dashboard to add/remove doctors, view and manage all appointments, manage patient accounts, create other admin accounts, view platform stats, and respond to patient enquiries/feedback/complaints.

---

## 🚀 Features

- **Patient Portal:** Browse doctors, select specialties, and book appointments.
- **Doctor Search:** Find doctors based on specialization and availability.
- **Appointment Management:** Book, reschedule, and cancel appointments.
- **Secure Authentication:** Role-based authentication for Admins and Patients.
- **Admin Dashboard:** Manage doctors, appointments, patients, and system users.
- **Online & Cash Payment:** Supports both online payments and cash payment options.
- **General Enquiry:** Users can submit general questions or enquiries directly through the platform.
- **Feedback & Reviews:** Patients can provide feedback and rate their experience after appointments.
- **Complaint & Issue Reporting:** Users can report complaints or technical issues for quick resolution.
- **REST API Backend:** Built with Node.js, Express.js, and MongoDB for efficient data management.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Vite, JavaScript, HTML, CSS, Bootstrap
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT
- **Payment:** Razorpay

---

## 📁 Project Structure

```
CuraConnect/
│── admin-panel/
│── server-with-client/
│   ├── client/
│   └── ...
│── README.md
```

---

## 🔄 How It Works

1. A patient registers/logs in on the patient website and browses doctors by specialty.
2. They pick a doctor, choose an available slot, and book the appointment — paying either via Razorpay or opting for cash at the hospital.
3. The appointment shows up in the patient's "My Appointments" section, where they can track or cancel it.
4. On the other side, hospital admins log into the admin panel to see every appointment coming in, manage doctor profiles, and handle any enquiries, feedback, or complaints raised by patients.
