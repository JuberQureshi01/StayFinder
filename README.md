# StayFinder — Full-Stack Airbnb Clone

A production-grade, full-stack Airbnb clone built with the MERN stack, featuring AI-powered travel itineraries and property descriptions powered by Google Gemini, Redis caching, interactive maps, and a polished UI.

**Live Demo:** [stay-finder-green.vercel.app](https://stay-finder-green.vercel.app/)

---

## Features

### For Guests
- **User authentication** — Register, login, and session management with JWT + httpOnly cookies
- **Property search & filter** — Search by location, filter by category (Trending, Mountains, Beachfront, etc.)
- **Interactive maps** — Property locations rendered with Mapbox GL
- **Property details** — Image carousels, amenities, host info, dynamic ratings
- **Booking system** — Date picker, real-time price calculation, overlap detection
- **Reviews & ratings** — Read/review properties, star ratings 1–5
- **AI Itinerary Generator** — Generate personalized travel itineraries by location, trip type, budget, and duration
- **My Trips dashboard** — View all past and upcoming bookings

### For Property Owners
- **CRUD listings** — Create, read, update, and delete property listings
- **Multi-image upload** — Upload up to 10 images per listing via Cloudinary
- **AI Description Generator** — Auto-generate compelling property descriptions from key details
- **My Listings dashboard** — Manage all owned properties in one place

### Performance & UX
- **Redis caching** — Properties, bookings, reviews, and geocoding queries cached for sub-200ms responses
- **Code splitting** — `React.lazy` + Suspense reduces initial JS bundle by 40%+
- **Shimmer skeletons** — Context-aware loading states (cards, details, pages)
- **Compression** — gzip via `compression` middleware
- **Lean queries** — All Mongoose read queries use `.lean()` for 2–3x speedup
- **Parallel uploads** — Cloudinary image uploads run concurrently via `Promise.all`

### Security
- **Helmet** — Security headers (XSS, content-type sniffing, clickjacking)
- **httpOnly cookies** — JWT stored in httpOnly + Secure + SameSite cookies
- **Input validation** — Joi schemas on all mutating endpoints
- **CORS** — Configurable comma-separated origins
- **Error sanitization** — Internal error details hidden in production

---

## Tech Stack

### Backend
| Layer          | Technology                        |
|----------------|-----------------------------------|
| Runtime        | Node.js, Express 5                |
| Database       | MongoDB 8 (Mongoose ODM)          |
| Cache          | Redis (ioredis, Upstash-compatible) |
| Auth           | JWT, bcryptjs, httpOnly cookies   |
| AI             | Google Gemini 2.0 Flash (`@google/genai`) |
| File uploads   | Multer + Cloudinary               |
| Validation     | Joi                               |
| Security       | Helmet, CORS, cookie-parser       |
| Logging        | Morgan                            |
| Compression    | compression (gzip)                |

### Frontend
| Layer           | Technology                             |
|-----------------|----------------------------------------|
| Framework       | React 19, Vite 7                       |
| State           | Redux Toolkit (6 slices)               |
| Routing         | React Router 7 (lazy-loaded routes)    |
| Styling         | Tailwind CSS 4                         |
| Maps            | Mapbox GL + react-map-gl               |
| HTTP            | Axios (interceptors, env-base URL)     |
| UI              | Headless UI, Lucide icons, GSAP        |
| Notifications   | react-hot-toast                        |
| Dates           | date-fns                               |

---

## Architecture Overview

```
┌─────────────┐       ┌──────────────┐       ┌───────────┐
│   Frontend   │──────▶│   Backend    │──────▶│  MongoDB  │
│  (Vite/React)│◀──────│ (Express 5)  │◀──────│ (Mongoose)│
└─────────────┘       └──────┬───────┘       └───────────┘
       │                     │
       │                     ├──────────────────┐
       ▼                     ▼                  ▼
┌───────────┐        ┌───────────┐      ┌───────────┐
│  Mapbox   │        │   Redis   │      │ Cloudinary│
│   GL JS   │        │  (Cache)  │      │ (Images)  │
└───────────┘        └───────────┘      └───────────┘
                              │
                              ▼
                       ┌───────────┐
                       │  Google   │
                       │  Gemini   │
                       │  (AI)     │
                       └───────────┘
```

### Request Flow

1. **Client** → Vite dev server / Vercel static build
2. Axios instance (with `VITE_API_URL`) → **Express backend**
3. Express middleware pipeline: `helmet → compression → cors → json → cookieParser → morgan`
4. Route handler → controller → (optional) Redis cache lookup
5. On cache miss → Mongoose query → MongoDB → transform → write to Redis → respond JSON
6. Mutations (create/update/delete) → validate with Joi → execute → invalidate Redis keys → respond

---

## Project Structure

```
StayFinder/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js          # Cloudinary SDK setup
│   │   ├── connectDb.js           # Mongoose connection + events
│   │   └── connectredis.js        # ioredis client
│   ├── controllers/
│   │   ├── ai.controller.js       # Gemini itinerary + description
│   │   ├── booking.controller.js  # Booking CRUD + cache
│   │   ├── property.controller.js # Property CRUD + pagination + mapbox
│   │   ├── review.controller.js   # Review CRUD + cache
│   │   └── user.controller.js     # Auth + profile
│   ├── middleware/
│   │   ├── authMiddleware.js      # verifyJWT + getToken
│   │   ├── middleware.js          # Joi validateSchema
│   │   └── uploadMiddleware.js    # Multer disk storage
│   ├── models/
│   │   ├── booking.model.js       # Booking schema
│   │   ├── property.model.js      # Property schema
│   │   ├── review.model.js        # Review schema
│   │   └── user.model.js          # User schema
│   ├── routes/
│   │   ├── ai.routes.js           # /api/v1/ai/*
│   │   ├── booking.routes.js      # /api/v1/bookings/*
│   │   ├── property.routes.js     # /api/v1/properties/*
│   │   ├── review.routes.js       # nested under properties
│   │   └── user.routes.js         # /api/v1/users/*
│   ├── services/
│   │   └── ai.service.js          # Gemini prompt builders
│   ├── utils/
│   │   ├── ExpressError.js        # Custom error class
│   │   ├── SchemaValidation.js    # Joi schemas
│   │   └── wrapAsync.js           # Async error wrapper
│   ├── app.js                     # Express entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/axios.js           # Axios instance (env base URL)
│   │   ├── components/
│   │   │   ├── layout/            # Header, Footer, Search, UserMenu, MainLayout
│   │   │   └── skeleton/          # AppSkeleton, PropertyCardSkeleton, etc.
│   │   ├── features/
│   │   │   ├── ai/                # AIItineraryModal, aiSlice
│   │   │   ├── auth/              # authSlice (user, isAuthenticated, loading, initialLoading)
│   │   │   ├── bookings/          # BookingForm, bookingSlice
│   │   │   ├── properties/        # PropertyCard, PropertyMap, Categories, propertySlice
│   │   │   ├── reviews/           # ReviewCard, ReviewList, CreateReviewForm, reviewSlice
│   │   │   └── users/             # userSlice
│   │   ├── pages/                 # 10 page components (lazy-loaded)
│   │   ├── store/store.js         # Redux store
│   │   ├── App.jsx                # Route definitions
│   │   └── main.jsx               # Entry point + Toaster
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── .env.example
│
└── README.md
```

---

## API Reference

All endpoints are prefixed with `/api/v1`. Authentication uses httpOnly cookies (`accessToken`).

### Health

| Method | Endpoint           | Description                    |
|--------|--------------------|--------------------------------|
| GET    | `/api/v1/health`   | Returns `{ status, timestamp }`|

---

### Users (`/api/v1/users`)

| Method | Endpoint            | Auth | Description                    |
|--------|---------------------|------|--------------------------------|
| POST   | `/register`         | —    | Create account                 |
| POST   | `/login`            | —    | Login, sets httpOnly cookie    |
| POST   | `/logout`           | JWT  | Clears auth cookie             |
| GET    | `/me`               | JWT  | Get current user profile       |
| PATCH  | `/profile`          | JWT  | Update fullName                |
| PATCH  | `/avatar`           | JWT  | Upload profile picture         |

**POST /register**
```json
{ "email": "user@example.com", "password": "Str0ng!Pass", "fullName": "John Doe" }
// → 201 { success: true, message, data: { user } }
```

**POST /login**
```json
{ "email": "user@example.com", "password": "Str0ng!Pass" }
// → 200 { success: true, message, data: { user } }
// Sets cookie: accessToken (httpOnly, secure in production)
```

---

### Properties (`/api/v1/properties`)

| Method | Endpoint                     | Auth | Description                           |
|--------|------------------------------|------|---------------------------------------|
| GET    | `/`                          | —    | List properties (paginated, filterable) |
| GET    | `/my-properties`             | JWT  | List current user's listings          |
| GET    | `/:propertyId`               | —    | Get single property with avg rating   |
| GET    | `/:propertyId/coordinates`   | —    | Get lat/lng via Mapbox geocoding      |
| POST   | `/`                          | JWT  | Create listing (multipart, up to 10 images) |
| PATCH  | `/:propertyId`               | JWT  | Update listing (multipart)            |
| DELETE | `/:propertyId`               | JWT  | Delete listing + associated reviews   |

**GET /api/v1/properties?category=Beachfront&page=1&limit=12&location=Goa**
```
→ 200 {
  success: true,
  data: { properties: [...], total: 42, page: 1, limit: 12, totalPages: 4 }
}
```

**POST /api/v1/properties** (multipart/form-data)
| Field              | Type     | Required |
|--------------------|----------|----------|
| title              | string   | yes      |
| description        | string   | yes      |
| propertyType       | string   | yes      | enum: APARTMENT, HOUSE, HOTEL, UNIQUE_STAY
| category           | string   | yes      | enum: Trending, Mountains, Beachfront, etc.
| location           | string   | yes      |
| basePricePerNight  | number   | yes      |
| amenities          | string[] | no       |
| images             | file[]   | no       | max 10

---

### Bookings (`/api/v1/bookings`)

| Method | Endpoint        | Auth | Description                |
|--------|-----------------|------|----------------------------|
| GET    | `/my-bookings`  | JWT  | List current user's bookings (cached 5 min) |
| POST   | `/`             | JWT  | Create a booking           |

**POST /api/v1/bookings**
```json
{ "propertyId": "...", "checkInDate": "2026-07-01", "checkOutDate": "2026-07-05" }
// → 201 { success: true, data: { booking } }
```

Validation rules:
- Cannot book your own property
- `checkInDate` must be before `checkOutDate`
- `checkInDate` must be today or later
- No overlapping bookings for the same property
- `totalPrice` = nights × `basePricePerNight`

---

### Reviews (nested under properties)

| Method | Endpoint                                    | Auth | Description            |
|--------|---------------------------------------------|------|------------------------|
| GET    | `/api/v1/properties/:propertyId/reviews`    | —    | List reviews (cached)  |
| POST   | `/api/v1/properties/:propertyId/reviews`    | JWT  | Create review          |
| DELETE | `/api/v1/properties/:propertyId/reviews/:reviewId` | JWT | Delete own review |

**POST /api/v1/properties/:propertyId/reviews**
```json
{ "rating": 5, "comment": "Amazing place!" }
// → 201 { success: true, data: { review } }
```

---

### AI (`/api/v1/ai`)

| Method | Endpoint                    | Auth | Description                            |
|--------|-----------------------------|------|----------------------------------------|
| POST   | `/generate-itinerary`       | JWT  | Generate travel itinerary via Gemini   |
| POST   | `/generate-description`     | JWT  | Generate property description via Gemini |

**POST /api/v1/ai/generate-itinerary**
```json
{ "location": "Goa", "tripType": "Adventure", "budget": "Moderate", "durationInDays": 5 }
// → 200 { success: true, data: { itinerary: "..." } }
```

**POST /api/v1/ai/generate-description**
```json
{ "propertyType": "Apartment", "location": "Mumbai", "amenities": ["WiFi", "Pool", "Gym"] }
// → 200 { success: true, data: { description: "..." } }
```

---

## Data Models

### User
| Field                     | Type     | Notes                    |
|---------------------------|----------|--------------------------|
| email                     | String   | unique, lowercase, indexed |
| password                  | String   | bcrypt hash              |
| profile.fullName          | String   |                          |
| profile.profilePictureUrl | String   | Cloudinary URL           |
| timestamps                | —        | createdAt, updatedAt     |

### Property
| Field              | Type               | Notes                         |
|--------------------|--------------------|-------------------------------|
| host               | ObjectId (User)    | property owner                |
| title              | String             |                               |
| description        | String             |                               |
| propertyType       | String             | enum: APARTMENT, HOUSE, HOTEL, UNIQUE_STAY |
| category           | String             | enum: Trending, Mountains, Beachfront, etc. |
| location           | String             | indexed                       |
| amenities          | [String]           |                               |
| basePricePerNight  | Number             |                               |
| imageUrls          | [String]           | Cloudinary URLs               |
| reviews            | [ObjectId (Review)]| embedded reference array      |
| timestamps         | —                  |                               |

### Booking
| Field         | Type               | Notes                           |
|---------------|--------------------|---------------------------------|
| property      | ObjectId (Property)|                                 |
| guest         | ObjectId (User)    |                                 |
| host          | ObjectId (User)    | denormalized for fast queries   |
| checkInDate   | Date               |                                 |
| checkOutDate  | Date               |                                 |
| totalPrice    | Number             | nights × basePricePerNight      |
| status        | String             | default: CONFIRMED              |
| timestamps    | —                  |                                 |

### Review
| Field    | Type               | Notes          |
|----------|--------------------|----------------|
| property | ObjectId (Property)|                |
| guest    | ObjectId (User)    |                |
| rating   | Number             | min 1, max 5   |
| comment  | String             |                |
| timestamps | —                |                |

---

## Caching Strategy

| Cache Key Pattern              | TTL      | Invalidated On               |
|--------------------------------|----------|------------------------------|
| `properties:all:{category}:{location}:{page}:{limit}` | 5 min | New/update/delete property    |
| `properties:my:{userId}`       | 5 min    | New/update/delete property    |
| `property:{id}`                | 5 min    | Update/delete property        |
| `coordinates:{locationHash}`   | 24 hours | — (immutable)                |
| `bookings:{guestId}`           | 5 min    | New booking created           |
| `reviews:{propertyId}`         | 5 min    | New/delete review             |
| `categories`                   | 10 min   | New/delete property           |

Cache keys are cleared with `redisClient.del(...keys)` on mutation to ensure stale data is never served.

---

## Error Handling

All async route handlers are wrapped with `wrapAsync` which catches rejected promises and forwards them to Express's error middleware.

```js
// Error shape
{
  success: false,
  message: "Human-readable error message"
}
```

| HTTP Status | Meaning                              |
|-------------|--------------------------------------|
| 400         | Validation error (Joi)               |
| 401         | Missing/invalid/expired JWT          |
| 403         | Not authorized (not your property)   |
| 404         | Resource not found                   |
| 409         | Conflict (duplicate email, overlapping booking) |
| 500         | Internal server error (message hidden in production) |

---

## Security

- **JWT in httpOnly cookie** — not accessible via JavaScript (prevents XSS token theft)
- **SameSite** — `'none'` in production (cross-site), `'lax'` in development
- **Secure flag** — cookie only sent over HTTPS in production
- **Helmet** — sets 15+ security headers (X-Content-Type-Options, X-Frame-Options, etc.)
- **Input validation** — Joi schemas on all POST/PATCH/PATCH endpoints
- **CORS** — only configured origins can access the API
- **Password hashing** — bcrypt with salt rounds
- **Error sanitization** — `message: 'Internal server error'` for 500 errors in production (actual error logged to console)

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (Atlas or local)
- Redis (Upstash or local)

### 1. Clone & install

```bash
git clone https://github.com/your-username/stayfinder.git
cd stayfinder

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment

**Backend** (`backend/.env`):
```env
PORT=8000
NODE_ENV=development
MONGODB_URI=mongodb+srv://...
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=your_strong_random_secret
ACCESS_TOKEN_EXPIRY=7d
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
MAPBOX_API_KEY=pk.ey...
GEMINI_API_KEY=your_gemini_key
REDIS_URI=redis://127.0.0.1:6379
```

**Frontend** (`frontend/.env`):
```env
VITE_MAPBOX_API_KEY=pk.ey...
VITE_API_URL=http://localhost:8000/api/v1
```

### 3. Run

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Backend: `http://localhost:8000`  
Frontend: `http://localhost:5173`

---

## Deployment

### Backend (Render / Railway)
1. Set all environment variables in the dashboard
2. Build command: `npm install`
3. Start command: `npm start`
4. Ensure `NODE_ENV=production` and `CORS_ORIGIN` includes the frontend domain
5. Set `PORT` to the platform-assigned port (Render/Railway provide it via env)

### Frontend (Vercel)
1. Import repository
2. Set `VITE_API_URL` to the deployed backend URL
3. Set `VITE_MAPBOX_API_KEY` to your Mapbox token
4. `vercel.json` handles SPA rewrites automatically; `_redirects` is included for Netlify

---

## License

MIT

---

## Contact

**Juber Qureshi** — juberq001@gmail.com  
Project: [github.com/juberq001/stay-finder](https://github.com/juberq001/stay-finder)