Airbnb Clone - Full-Stack MERN Project
A feature-rich, full-stack clone of Airbnb built with the MERN stack, incorporating modern web technologies, advanced LLD principles, and AI-powered features.

Live Demo: [[Live Demo](https://stay-finder-green.vercel.app/)]

✨ Key Features
This application replicates the core functionality of Airbnb, providing a seamless experience for both guests and users managing their listings.

🤵 For Guests:
User Authentication: Secure registration and login with JWT-based session management.

Dynamic Search: Search for properties by location.

Advanced Filtering: Filter listings by category.

Interactive Maps: View property locations on an interactive map powered by Mapbox.

Property Details: View detailed property pages with image carousels, descriptions, and amenities.

Booking System: Check property availability and book stays.

Reviews & Ratings: Read and write reviews for properties after a completed stay.

My Trips: A dedicated page to view all past and upcoming bookings.

🏠 For Property Owners:
Unified User Role: Any user can create and manage listings.

CRUD for Listings: Full functionality to create, read, update, and delete property listings.

Multi-Image Upload: Upload multiple property images directly to Cloudinary.

My Listings Dashboard: A dedicated page to view and manage all personal listings.

🤖 AI-Powered Features (with Google Gemini):
AI Itinerary Generator: Guests can generate a personalized travel itinerary for their booking location with a dynamic, word-by-word typing effect.

AI Description Generator: Users can automatically generate attractive property descriptions by providing a few key details.

🛠️ Tech Stack & Architecture
This project is built on a modern, scalable, and feature-based architecture for both the frontend and backend, ensuring maintainability and ease of development.

Area

Technology

Frontend

React (with Vite), Redux Toolkit, Tailwind CSS, Axios, React Router, Mapbox GL

Backend

Node.js, Express.js, MongoDB (with Mongoose)

Authentication

JSON Web Tokens (JWT), bcrypt.js

Image Storage

Cloudinary

Caching

Redis

AI

Google Gemini API

Deployment

(e.g., Vercel for Frontend, Render for Backend)

Low-Level Design (LLD)
The backend is architected using strong LLD principles to ensure code is decoupled and scalable. Key design patterns used include:

Strategy Pattern: For handling different booking flows.

Observer Pattern: For notifying users of booking status changes.

Factory Pattern: For creating different types of notifications.

Singleton Pattern: For the notification and Redis services.

And many more...

🚀 Getting Started
To get a local copy up and running, follow these simple steps.

Prerequisites
Node.js (v18.x or higher)

npm or yarn

MongoDB (local instance or a cloud URI from MongoDB Atlas)

Redis (local instance or a cloud URI)

Installation
Clone the repository:

git clone 
cd 

Setup the Backend:

cd backend
npm install

Create a .env file in the backend directory and add the environment variables from the template below.

Start the backend server:

npm run dev

Setup the Frontend:

cd ../frontend
npm install

Create a .env file in the frontend directory and add the environment variables.

Start the frontend development server:

npm run dev

🔑 Environment Variables
You will need to create .env files for both the backend and frontend.

Backend (/backend/.env)
PORT=8000

MONGODB_URI=your_mongodb_connection_string

CORS_ORIGIN='http://localhost:5173'

ACCESS_TOKEN_SECRET=your_super_secret_access_token_key

ACCESS_TOKEN_EXPIRY=7d

 Cloudinary Credentials
 
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name

CLOUDINARY_API_KEY=your_cloudinary_api_key

CLOUDINARY_API_SECRET=your_cloudinary_api_secret

 Mapbox API Key
 
MAPBOX_API_KEY=your_mapbox_api_key

 Google Gemini API Key
 
GEMINI_API_KEY=your_gemini_api_key

Redis Connection URI

REDIS_URI="redis://127.0.0.1:6379"

Frontend (/frontend/.env)
VITE_MAPBOX_API_KEY=your_mapbox_api_key

📜 License
Distributed under the MIT License. See LICENSE for more information.

👤 Contact
Juber Qureshi - juberq001@gmail.com
