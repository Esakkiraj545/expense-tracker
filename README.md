# Xpenso - Mobile Expense Tracker

A production-ready mobile application for tracking expenses, built with React Native (Expo) and Node.js.

## Project Structure

```
Xpenso/
├── backend/                # Node.js Express API
│   ├── src/
│   │   ├── config/         # Database and global configs
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth and error handling
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API endpoints
│   │   └── app.js          # Express app setup
│   └── server.js           # Server entry point
└── frontend/               # React Native Expo App
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── screens/        # App screens (Auth, Dashboard, etc.)
    │   ├── navigation/     # React Navigation setup
    │   ├── redux/          # Redux Toolkit store and slices
    │   └── services/       # Axios API services
    └── App.js              # App entry point
```

## Tech Stack

### Frontend
- **Framework:** Expo (React Native)
- **Styling:** NativeWind (Tailwind CSS)
- **Navigation:** React Navigation
- **State Management:** Redux Toolkit
- **API Client:** Axios
- **Forms:** React Hook Form + Yup

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas (Mongoose)
- **Authentication:** JWT & bcryptjs
- **Security:** Helmet, CORS

---

## Installation & Setup

### 1. Prerequisites
- Node.js installed
- Expo Go app on your phone (for testing)
- MongoDB Atlas account

### 2. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (template provided) and add your MongoDB URI:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your backend API URL:
   ```env
   EXPO_PUBLIC_API_URL=http://your-ip-address:5000/api/v1
   ```
   *Note: Use your machine's local IP address instead of 'localhost' when testing on a physical device.*
4. Start the Expo project:
   ```bash
   npx expo start
   ```

---

## MongoDB Atlas Setup Guide

1. **Create Account:** Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up.
2. **Create Cluster:** Create a new FREE (M0) cluster. Choose a provider (e.g., AWS) and region.
3. **Database Access:** 
   - Create a database user (e.g., `xpenso_user`).
   - Give them `Read and Write to any database` privileges.
   - Note down the password.
4. **Network Access:**
   - Go to "Network Access" and click "Add IP Address".
   - Choose "Allow Access from Anywhere" (0.0.0.0/0) for development.
5. **Get Connection String:**
   - Go to "Database" -> "Connect" -> "Connect your application".
   - Copy the SRV connection string.
   - Replace `<password>` with your user's password in the string.
6. **Add to Backend:** Paste this string into your backend `.env` file as `MONGODB_URI`.

---

## Git Commands

1. **Initialize & First Commit:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Xpenso architecture setup"
   ```

---

## Author
Created with ❤️ for scalable expense tracking.
