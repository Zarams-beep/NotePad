# NotePad API

A full-featured note-taking REST API built with Node.js, Express, PostgreSQL, and Redis.

## Features

- User Authentication (JWT)
- Create, Read, Update, Delete Notes
- Pin/Unpin Notes
- Archive/Unarchive Notes
- Search Notes
- Share Notes (Public & Private)
- Redis Caching
- Input Validation (Zod)

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Sequelize
- **Cache:** Redis
- **Validation:** Zod
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt

## Prerequisites

Before running this project, ensure you have:

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- Redis Server
- npm or yarn

## Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd NotePad/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the backend directory:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=notepad_db
DB_USER=postgres
DB_PASSWORD=your_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Application URL
TOTAL_URL=http://localhost:5000
```

4. **Create the database**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE notepad_db;

# Exit
\q
```

5. **Run the application**
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Documentation

### Base URL
```
http://localhost:5000
```

### Authentication

All endpoints except `/api/auth/register` and `/api/auth/login` require authentication via Bearer token in the Authorization header.
```
Authorization: Bearer <your-jwt-token>
```

---

## Endpoints

### 1. Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-uuid",
      "username": "johndoe",
      "email": "john@example.com"
    }
  }
}
```

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

---

### 2. Notes

#### Create Note
```http
POST /dashboard/notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My First Note",
  "content": "This is the content of my note",
  "color": "#FFEEAA",
  "pinned": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Note created successfully",
  "data": {
    "note_id": "note-uuid",
    "title": "My First Note",
    "content": "This is the content of my note",
    "color": "#FFEEAA",
    "pinned": false,
    "archived": false,
    "user_uuid": "user-uuid",
    "createdAt": "2025-11-09T10:00:00.000Z",
    "updatedAt": "2025-11-09T10:00:00.000Z"
  }
}
```

#### Get All Notes
```http
GET /dashboard/notes
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "note_id": "note-uuid",
      "title": "My First Note",
      "content": "This is the content",
      "color": "#FFEEAA",
      "pinned": false,
      "archived": false,
      "createdAt": "2025-11-09T10:00:00.000Z",
      "updatedAt": "2025-11-09T10:00:00.000Z"
    }
  ]
}
```

#### Update Note
```http
PUT /dashboard/notes/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content",
  "color": "#AADDFF"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Note updated successfully",
  "data": {
    "note_id": "note-uuid",
    "title": "Updated Title",
    "content": "Updated content",
    "color": "#AADDFF"
  }
}
```

#### Delete Note
```http
DELETE /dashboard/notes/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Note deleted successfully",
  "data": {
    "message": "Note deleted successfully"
  }
}
```

#### Search Notes
```http
GET /dashboard/notes/search?keyword=meeting
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "note_id": "note-uuid",
      "title": "Meeting Notes",
      "content": "Discussed project timeline...",
      "color": "#FFEEAA"
    }
  ]
}
```

#### Toggle Pin Note
```http
POST /dashboard/toggle-pin
Authorization: Bearer <token>
Content-Type: application/json

{
  "note_id": "note-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Note pin toggled successfully",
  "data": {
    "note_id": "note-uuid",
    "pinned": true
  }
}
```

#### Toggle Archive Note
```http
POST /dashboard/toggle-archive
Authorization: Bearer <token>
Content-Type: application/json

{
  "note_id": "note-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Note archive toggled successfully",
  "data": {
    "note_id": "note-uuid",
    "archived": true
  }
}
```

#### Share Note (Private)
```http
POST /dashboard/share
Authorization: Bearer <token>
Content-Type: application/json

{
  "note_id": "note-uuid",
  "receiver_uuid": "receiver-user-uuid",
  "permission": "read"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Note shared successfully",
  "data": {
    "message": "Note shared privately with user@example.com",
    "link": "http://localhost:5000/share/share-token",
    "permission": "read",
    "can_edit": false
  }
}
```

#### Share Note (Public)
```http
POST /dashboard/share
Authorization: Bearer <token>
Content-Type: application/json

{
  "note_id": "note-uuid",
  "is_public": true,
  "permission": "read"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Note shared successfully",
  "data": {
    "message": "Note shared publicly",
    "link": "http://localhost:5000/share/public-share-token",
    "permission": "read",
    "via": ["WhatsApp", "Twitter", "Email", "Copy Link"]
  }
}
```

---

### 3. Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "API is running fine and healthy"
}
```

---

## Error Responses

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error message here",
  "data": null
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (Validation Error)
- `401` - Unauthorized (Invalid/Missing Token)
- `404` - Not Found
- `500` - Internal Server Error

---

## Project Structure
```
backend/
├── src/
│   ├── config/
│   │   ├── index.js           # Configuration manager
│   │   ├── db.js              # Database connection
│   │   └── cache.js           # Redis connection
│   ├── controller/
│   │   ├── authController.js  # Auth endpoints
│   │   └── noteController.js  # Note endpoints
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT verification
│   │   ├── validationMiddleware.js # Zod validation
│   │   └── errorHandler.js         # Global error handler
│   ├── models/
│   │   ├── Users.js           # User model
│   │   ├── Note.js            # Note model
│   │   └── sharedModel.js     # Shared notes model
│   ├── routes/
│   │   ├── authRoutes.js      # Auth routes
│   │   └── noteRoutes.js      # Note routes
│   ├── services/
│   │   ├── users/             # User services
│   │   └── notes/             # Note services
│   ├── utils/
│   │   ├── Auth.js            # JWT & password utilities
│   │   ├── AppError.js        # Custom error class
│   │   ├── Validators.js      # Zod schemas for auth
│   │   └── noteValidator.js   # Zod schemas for notes
│   └── templates/
│       └── emails/            # Email templates
├── index.js                   # App entry point
├── package.json
└── README.md
```

---

## Testing with Postman

1. Import the collection from the provided Postman collection file
2. Set up environment variables:
   - `baseUrl`: `http://localhost:5000`
   - `token`: Your JWT token (auto-set after login)
3. Run the requests in order:
   - Register → Login → Create Note → Get Notes → Update → Delete

---

## Development

### Run in development mode
```bash
npm run dev
```

### Environment Variables

Make sure all required environment variables are set in `.env` file before running.

---

## Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Input validation with Zod
- ✅ SQL injection protection (Sequelize ORM)
- ✅ CORS configured
- ✅ Environment variables for sensitive data

---

## Future Enhancements

- [ ] Add tags/labels to notes
- [ ] File attachments support
- [ ] Real-time collaboration
- [ ] Two-factor authentication
- [ ] Rate limiting
- [ ] API versioning

---

## License

MIT

---

## Author

Your Name

---

## Support

For issues and questions, please open an issue on GitHub.