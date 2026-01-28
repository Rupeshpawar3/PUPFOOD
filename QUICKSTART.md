# PUPFOOD - Quick Start Guide

## 🚀 Running the Application

### Prerequisites
- ✅ Node.js 18+ installed
- ✅ MongoDB installed at `C:\Program Files\MongoDB`

---

## Starting the Backend

### 1. Start MongoDB

Open **Windows Terminal** or **PowerShell** as Administrator and run:

```powershell
& 'C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe' --dbpath 'C:\data\db'
```

You should see: `"Waiting for connections"` on port `27017`

**Keep this terminal window open!**

---

### 2. Start Backend Server

Open a **new terminal** window and run:

```bash
cd "C:\Users\rupes\Downloads\pupfood (1)\server"
npm run dev
```

You should see:
```
🚀 Server started on port 5000
📝 Environment: development
🌐 Frontend URL: http://localhost:5173
💾 MongoDB: mongodb://localhost:27017/pupfood
✅ MongoDB connected successfully
```

**Keep this terminal window open!**

---

### 3. Start Frontend

Open **another new terminal** and run:

```bash
cd "C:\Users\rupes\Downloads\pupfood (1)"
npm run dev
```

The frontend will start on `http://localhost:5173`

---

## Testing the Backend

### Health Check
Open browser and visit: **http://localhost:5000/health**

Expected response:
```json
{"status":"OK","message":"PUPFOOD Server is running"}
```

### Test API Endpoints

You can use **Thunder Client** (VS Code extension) or **Postman** to test:

#### 1. Sign Up
```http
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User"
}
```

#### 2. Login
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

Save the `token` from the response!

#### 3. Create a Pet (Requires Authentication)
```http
POST http://localhost:5000/api/pets
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "name": "Buddy",
  "age": "3 years",
  "gender": "Male",
  "breed": "Golden Retriever",
  "weight": "30kg",
  "color": "Golden"
}
```

---

## Frontend Features Now Using Backend

### ✅ Working Features
- **Authentication**: Login/Signup uses backend APIs
- **Token Storage**: JWT tokens saved in localStorage
- **Error Handling**: User-friendly error messages

### 🔄 To Be Updated
The following components need to be updated to use the backend API:

1. **FoodScanner.tsx** → Update to use `foodAPI.analyzeFood()`
2. **MedicineScanner.tsx** → Update to use `healthAPI.analyzeMedicine()`
3. **MyPets.tsx** → Update to use `petAPI` for CRUD operations
4. **Chat.tsx** → Update to use `assistantAPI.chat()`
5. **Community.tsx** → Update to use `communityAPI`

All API functions are ready in `services/apiService.ts`!

---

## Troubleshooting

### MongoDB won't start
**Error**: "Data directory not found"

**Solution**: Create the directory:
```powershell
New-Item -ItemType Directory -Force -Path "C:\data\db"
```

---

### Backend can't connect to MongoDB
**Error**: MongoDB connection failed

**Solution**: Make sure MongoDB is running first (Step 1)

---

### Port already in use
**Error**: Port 5000 or 27017 already in use

**Solution**: 
1. Find the process using the port:
   ```powershell
   Get-NetTCPConnection -LocalPort 5000
   ```
2. Stop the process or change the port in `server/.env`

---

## Environment Configuration

### Backend (`server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pupfood
JWT_SECRET=pupfood-super-secret-jwt-key-2026-change-in-production
GEMINI_API_KEY=AIzaSyB-NOiwlaMmBA4SZzq91wPFRiIDjQRUlds
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (`.env.local`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📝 Quick Reference

| Service | Port | URL |
|---------|------|-----|
| MongoDB | 27017 | localhost:27017 |
| Backend API | 5000 | http://localhost:5000 |
| Frontend | 5173 | http://localhost:5173 |

---

## 🎯 Next Steps

1. **Test Authentication**: Try signing up and logging in from the frontend
2. **Create Pet Profiles**: Once logged in, test creating/editing pets
3. **Test AI Features**: Scan food images, medicines, chat with assistant
4. **Build Community**: Create posts, like, and share pet stories

---

## 📚 Documentation

- [Backend README](server/README.md) - Full API documentation
- [Walkthrough](walktrough.md) - Detailed implementation guide
- [Implementation Plan](implementation_plan.md) - Architecture details

Happy coding! 🐕 🎉
