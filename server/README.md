# PUPFOOD Backend Server

Node.js/Express backend for the PUPFOOD application with MongoDB database and Gemini AI integration.

## Features

- 🔐 JWT Authentication with Email/Password and Google OAuth
- 🐕 Pet Profile Management
- 🍖 AI-Powered Food Analysis (Gemini)
- 💊 Medicine Scanner
- 🏥 Health Records & Vaccination Tracking
- 👥 Community Posts & Social Features
- 🤖 AI Assistant with Chat, TTS, and Transcription
- 🗺️ Nearby Vet Finder using Google Maps

## Prerequisites

- Node.js 18+ installed
- MongoDB installed and running locally, OR use MongoDB Atlas
- Gemini API Key

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```

   Required variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `GEMINI_API_KEY` - Your Google Gemini API key
   - `JWT_SECRET` - Random secret for JWT tokens (change in production!)

3. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

4. **Run the Server**

   Development:
   ```bash
   npm run dev
   ```

   Production:
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /signup` - Register new user
- `POST /login` - Login user
- `POST /google` - Google OAuth authentication
- `GET /me` - Get current user (requires auth)

### Pets (`/api/pets`)
- `GET /` - Get all user's pets
- `POST /` - Create new pet
- `GET /:id` - Get specific pet
- `PUT /:id` - Update pet
- `DELETE /:id` - Delete pet

### Food Scanner (`/api/food`)
- `POST /analyze` - Analyze food image
- `POST /identify-dog` - Identify dog breed from image

### Health (`/api/health`)
- `GET /:petId/records` - Get health records
- `POST /:petId/vaccination` - Add vaccination record
- `POST /medicine/scan` - Scan medicine
- `POST /video/analyze` - Analyze health video
- `POST /vets/nearby` - Find nearby vets

### Community (`/api/community`)
- `GET /posts` - Get community posts
- `POST /posts` - Create post
- `PUT /posts/:id/like` - Like/unlike post

### AI Assistant (`/api/assistant`)
- `POST /chat` - Chat with AI
- `POST /tts` - Text-to-speech
- `POST /transcribe` - Transcribe audio
- `POST /thinking` - Thinking mode query

## Project Structure

```
server/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── services/        # Business logic (Gemini AI)
│   └── server.ts        # Main application
├── .env                 # Environment variables (not in git)
├── .env.example         # Environment template
├── package.json
└── tsconfig.json
```

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT & bcrypt
- **AI**: Google Gemini API
- **Language**: TypeScript
- **Validation**: express-validator
- **Security**: CORS, Rate Limiting

## Development

The server runs on `http://localhost:5000` by default.

Health check: `GET http://localhost:5000/health`

## License

MIT
