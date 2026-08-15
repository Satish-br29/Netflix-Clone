# 🎬 Netflix Clone

A full-stack Netflix-inspired streaming platform built using the MERN stack. This project replicates Netflix's modern UI and core functionality, including authentication, dynamic movie browsing, TMDB integration, hover previews, cinematic modals, and responsive design.

---

## 🚀 Features

### ✅ Phase 1 – Landing Page & Hero Section

- Netflix-style landing page
- Transparent navbar with scroll effect
- Full-screen hero banner
- Email CTA section
- Responsive layout
- Netflix-inspired typography and colors

### ✅ Phase 2 – Content Rows

- Trending Movies
- Netflix Originals
- Top Rated Movies
- Action Movies
- Comedy Movies
- Horror Movies
- Romance Movies
- Documentaries

### ✅ TMDB Integration

- Dynamic movie and TV show data
- Real movie posters and backdrops
- Category-based content fetching
- Dynamic hero banner content

### ✅ Phase 3 – Hover Cards

- Netflix-style hover animations
- Delayed expansion effect
- Smooth scaling
- Trailer preview support
- Movie metadata display
- Play, Like, and Add-to-List buttons

### ✅ Phase 4 – Movie Detail Modal

- Cinematic modal overlay
- Backdrop image display
- Trailer playback
- Movie overview
- Genre information
- Responsive modal layout
- Smooth Framer Motion animations

### ✅ Phase 5 – Authentication System

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Password Hashing with bcrypt
- MongoDB User Storage
- Persistent Login Sessions

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- React Router DOM
- Framer Motion
- Axios
- Vanilla CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- CORS
- dotenv

### External APIs

- TMDB (The Movie Database API)

---

## 📂 Project Structure

```bash
Netflix Clone
│
├── public
│   ├── favicon.svg
│   ├── icons.svg
│   └── landing-bg.jpg
│
├── server
│   ├── controllers
│   │   └── authController.js
│   │
│   ├── data
│   │   └── users.json
│   │
│   ├── middleware
│   │   └── authMiddleware.js
│   │
│   ├── models
│   │   ├── Profile.js
│   │   └── User.js
│   │
│   ├── routes
│   │   └── authRoutes.js
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── src
│   ├── assets
│   │   ├── hero.png
│   │   └── react.svg
│   │
│   ├── components
│   │   ├── FAQ
│   │   │   ├── FAQ.css
│   │   │   └── FAQ.jsx
│   │   │
│   │   ├── Footer
│   │   │   ├── Footer.css
│   │   │   └── Footer.jsx
│   │   │
│   │   ├── HeroBanner
│   │   │   ├── BrowseHero.jsx
│   │   │   ├── HeroBanner.css
│   │   │   └── LandingHero.jsx
│   │   │
│   │   ├── Modal
│   │   │   ├── Modal.css
│   │   │   └── Modal.jsx
│   │   │
│   │   ├── Navbar
│   │   │   ├── BrowseNavbar.jsx
│   │   │   ├── LandingNavbar.jsx
│   │   │   └── Navbar.css
│   │   │
│   │   ├── Row
│   │   │   ├── Card.jsx
│   │   │   ├── Row.css
│   │   │   └── Row.jsx
│   │   │
│   │   └── ProtectedRoute.jsx
│   │
│   ├── context
│   │   ├── AuthContext.jsx
│   │   └── MyListContext.jsx
│   │
│   ├── pages
│   │   ├── Auth
│   │   │   ├── Auth.css
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   │
│   │   ├── BrowsePage
│   │   │   └── BrowsePage.jsx
│   │   │
│   │   └── LandingPage
│   │       └── LandingPage.jsx
│   │
│   ├── services
│   │   └── api.js
│   │
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .env
├── package.json
├── vite.config.js
└── README.md
```

---

## ⚙️ Environment Variables

### Frontend (.env)

```env
VITE_TMDB_API_KEY=YOUR_TMDB_API_KEY
VITE_API_URL=http://localhost:5000
```

### Backend (server/.env)

```env
PORT=5000

MONGO_URI=YOUR_MONGODB_CONNECTION_STRING

JWT_SECRET=YOUR_SECRET_KEY

TMDB_API_KEY=YOUR_TMDB_API_KEY
```

---

## 🔑 Getting TMDB API Key

1. Create an account on TMDB.
2. Go to API Settings.
3. Request API Access.
4. Copy your API Key or Read Access Token.
5. Add it to your `.env` file.

---

## 🗄️ MongoDB Setup

### Local MongoDB

```env
MONGO_URI=mongodb://localhost:27017/netflix-clone
```

### MongoDB Atlas

```env
MONGO_URI=YOUR_MONGODB_ATLAS_URI
```

Example:

```env
mongodb+srv://username:password@cluster.mongodb.net/netflix-clone
```

---

## 📦 Installation

### Clone Repository

```bash
git clone <repository-url>

cd Netflix-Clone
```

---

### Install Frontend Dependencies

```bash
npm install
```

---

### Install Backend Dependencies

```bash
cd server

npm install
```

---

## ▶️ Running The Project

### Start Backend

```bash
cd server

npm start
```

or

```bash
node server.js
```

Server:

```bash
http://localhost:5000
```

---

### Start Frontend

```bash
npm run dev
```

Frontend:

```bash
http://localhost:5173
```

---

## 🔐 Authentication Flow

### Signup

```text
User
  ↓
Create Account
  ↓
Password Hashed
  ↓
Stored in MongoDB
  ↓
JWT Generated
  ↓
Logged In
```

### Login

```text
User
  ↓
Enter Credentials
  ↓
Validate User
  ↓
Verify Password
  ↓
Generate JWT
  ↓
Access Protected Pages
```

---

## 🎥 TMDB Endpoints Used

### Trending

```bash
/trending/all/week
```

### Top Rated

```bash
/3/movie/top_rated
```

### Action Movies

```bash
/discover/movie?with_genres=28
```

### Comedy Movies

```bash
/discover/movie?with_genres=35
```

### Horror Movies

```bash
/discover/movie?with_genres=27
```

### Romance Movies

```bash
/discover/movie?with_genres=10749
```

### Documentaries

```bash
/discover/movie?with_genres=99
```

---

## 📱 Responsive Design

Supported Devices:

- Mobile Phones
- Tablets
- Laptops
- Desktop Screens

Responsive Features:

- Adaptive Content Rows
- Responsive Hero Banner
- Mobile Navigation
- Responsive Modals
- Flexible Layout System

---

## 🎯 Future Enhancements

### Planned Features

- Profile Management
- My List
- Continue Watching
- Search Overlay
- Browse By Language
- Notifications
- Video Player
- Admin Dashboard

---

## 📸 Screens Included

- Landing Page
- Login Page
- Signup Page
- Browse Page
- Hero Banner
- Content Rows
- Hover Cards
- Movie Detail Modal

---

## 🎓 Academic Purpose

This project was developed for learning and academic purposes to practice:

- MERN Stack Development
- REST APIs
- Authentication & Authorization
- React State Management
- Responsive UI Design
- Third-Party API Integration

---

## ⚠️ Disclaimer

This project is a Netflix-inspired clone created solely for educational purposes.

Netflix is a registered trademark of Netflix, Inc.

Movie posters, backdrops, metadata, and trailers are provided by TMDB.

This project is not affiliated with Netflix or TMDB.


---

## ⭐ If you like this project

Give it a star and feel free to fork it for learning purposes.