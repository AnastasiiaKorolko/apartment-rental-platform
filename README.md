Apartment Rental Management Platform
A platform for managing apartment rentals with full CRUD functionality, filtering, and an admin panel.

Features
Implemented features:
Add apartments with full details (title, description, price, rooms)

Edit existing apartments

Delete apartments from the system

View list of all apartments

Filter by price and number of rooms

Upload photos (optional)

Admin panel for management

Additional features:
Universal form for adding/editing

Responsive design

Form validation

Error handling

Technologies
Frontend:
React 18 - main framework

Redux Toolkit - state management

Module css - styling

Axios - HTTP requests

Backend:
Node.js - server environment

Express.js - web framework

MongoDB - database

Mongoose - MongoDB ODM

Multer - file uploads

CORS - cross-origin requests

DevOps:
Docker - containerization

Docker Compose - orchestration

MongoDB Atlas - cloud database

Quick Start
Prerequisites:
Node.js 18+

MongoDB (local or Atlas)

Docker (optional)

1️⃣ Clone the repo
bash

git clone https://github.com/AnastasiiaKorolko/apartment-rental-platform.git
cd apartment-rental-platform
2️⃣ Setup environment variables

# Copy example file
cp .env.example .env

# Edit .env with your settings
3️⃣ Run with Docker (recommended)
bash
Копировать
Редактировать
# Run the entire project
docker-compose up --build

# Or in detached mode
docker-compose up -d --build
4️⃣ Manual start (alternative)
Backend:

cd server
npm install
npm run dev
Frontend:
cd client
npm install
npm start
🌐 URLs
Frontend: http://localhost:3000

Backend API: http://localhost:5000

API Endpoints
Apartments
GET    /api/apartments        # Get all apartments
GET    /api/apartments/:id    # Get apartment by ID
POST   /api/apartments        # Create new apartment
PUT    /api/apartments/:id    # Update apartment
DELETE /api/apartments/:id    # Delete apartment
Filters
bash
Копировать
Редактировать
GET /api/apartments?minPrice=1000&maxPrice=5000
GET /api/apartments?rooms=2
GET /api/apartments?minPrice=1000&rooms=3

# Frontend
REACT_APP_API_URL=http://localhost:5000/api
MongoDB Atlas (recommended)
Create an account at MongoDB Atlas

Create a new cluster

Get the connection string

Update MONGODB_URI in your .env file

🐳 Docker
Local development
bash
Копировать
Редактировать
# Run with rebuild
docker-compose up --build

# Stop containers
docker-compose down

# View logs
docker-compose logs -f
Production
bash
Копировать
Редактировать
# For production environment
docker-compose -f docker-compose.prod.yml up -d
Deployment
Frontend (Vercel)
Connect repo to Vercel

Configure environment variables

Set frontend folder as root

Deploy

Backend (Railway)
Connect repo to Railway

Configure environment variables

Set backend folder as root

Add MongoDB Atlas connection string

Testing
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
Usage
Adding an apartment
Go to the main page

Click "Add Apartment"

Fill out the form:

Title (up to 90 characters)

Description (up to 335 characters)

Price (in UAH)

Number of rooms (1, 2, or 3)

Photos (optional)

Click "Save"

Filtering
Use the sidebar for filtering

Filters can be combined

Results update in real-time

Editing
Click an apartment in the list

Click "Edit"

Change necessary fields

Click "Save changes"

Implementation Details
Redux Toolkit
Centralized state management

RTK Query for API requests

Automatic serialization

Validation
Client-side validation with React Hook Form

Server-side validation with Mongoose

Error handling at all levels

Security
CORS setup

File validation

Known Issues and Limitations
Max photo size: 5MB

Supported formats: JPG, PNG, WEBP, Gif

Maximum 5 photos per apartment

Future Improvements
 User authentication

 Apartment geolocation

 Text search

 Email notifications

 Mobile app

 Payment system integration

Author
Anastasia Korolko

GitHub: @AnastasiiaKorolko

Email: anastasiia.korolko.dev@gmail.com

LinkedIn: https://www.linkedin.com/in/anastasia-korolko-299a0b353/

License
This project was created as a test task for Nitrix.

Acknowledgments
Thanks to the Nitrix team for the interesting test task!