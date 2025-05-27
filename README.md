# WorkerBuddy 🛠️

**WorkerBuddy** is a full-stack web application built with **Next.js**, designed to help users easily find and connect with skilled workers online. The platform offers role-based access for two main roles: **User** and **Worker**, each with its own features and interfaces.



---

## 🌐 Live Demo

👉 [Click here to visit WorkerBuddy](https://worker-buddy.vercel.app)

---

## 🔑 Features

### 👤 Role-Based Authorization

- **User Role**:
  - View all available workers.
  - Sort and filter workers by category, location, experience, rating, etc.
  - Search bar to find specific workers.
  - Send requests to workers.
  - Manage profile and request history.
  - Add or update reviews after job completion.

- **Worker Role**:
  - View all incoming job requests with status updates.
  - Accept or decline requests.
  - Update request status (e.g., In Progress, Completed).
  - Manage profile information.
  - Review section to view user feedback and ratings.

---

## 🗂️ Pages & Components Overview

### User Side:

- **Homepage**: Browse all workers with sorting, filtering & search.
- **Request History Page**: Track all service requests, leave or edit reviews.
- **Profile Page**: Update personal info, view ratings and past interactions.

### Worker Side:

- **Homepage**: See all incoming requests with current status.
- **Review Menu**: Check reviews submitted by users.
- **Profile Page**: Manage your worker profile and services.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js, React
- **Styling**: Tailwind CSS
- **Backend**: API Routes (Next.js)
- **Database**: MongoDB 
- **Authentication**: JWT 
- **Deployment**: Vercel

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/PKR9759/WorkerBuddy.git
cd WorkerBuddy
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Environment Variables

Create a `.env.local` file and add your environment variables:

```
MONGODB_URI=your_mongodb_url
JWT_SECRET=your_jwt_secret

```

### 4. Run the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 🧪 Functional Highlights

- 🔐 Protected routes using role-based checks
- 📦 Dynamic filtering and sorting
- 📜 Request lifecycle management (Pending, In Progress, Completed)
- ✍️ Rating & Review system
- 🧾 Request history and profile updates
- 🔄 Review editing feature
- 🧑 Profile management for both users and workers

---


## 🧑‍💻 Author

Developed by **[Kukdip Parmar]**  
Feel free to connect with me on:

- LinkedIn: Kuldip Rupsangbhai Parmar
- Email: kuldiprparmar9759@gmail.com


