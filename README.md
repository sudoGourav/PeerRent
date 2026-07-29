<img width="2880" height="1800" alt="image" src="https://github.com/user-attachments/assets/78188b7a-86b0-4c29-9ea3-41fd719697d7" /># 🏠 PeerRent - Peer-to-Peer Rental Marketplace

A full-stack Peer-to-Peer Rental Marketplace where users can list items for rent, discover products nearby, book rentals, and securely complete payments online.

## 🌐 Live Demo

**Frontend:** https://peer-rent.vercel.app/

**Backend API:** https://peer-rent-api.onrender.com/api

---

# ✨ Features

### 👤 Authentication
- User Registration
- Secure Login
- JWT Authentication
- Protected Routes
- Forgot Password
- Reset Password

### 📦 Item Management
- Create Listings
- Upload Multiple Images
- Edit Listings
- Delete Listings
- Category Filtering
- Search Listings

### 📅 Booking System
- Select Rental Dates
- Availability Check
- Booking History
- Cancel Booking

### 💳 Online Payments
- Razorpay Integration
- Secure Payment Verification
- Booking Confirmation

### ⭐ User Experience
- Responsive Design
- Toast Notifications
- Loading Skeletons
- Empty States
- Confirmation Modals

---

# 🛠 Tech Stack

## Frontend
- React
- Vite
- Tailwind CSS
- Axios
- React Router
- React Hook Form
- React Hot Toast
- Date-fns
- Lucide React

## Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Nodemailer
- Multer
- Cloudinary
- Razorpay

## Deployment
- Frontend: Vercel
- Backend: Render
- Database: PostgreSQL

---

# 📁 Project Structure

```
peer-rental-marketplace/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── prisma/
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/your-username/PeerRent.git

cd PeerRent/peer-rental-marketplace
```

---

## Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file inside the backend directory.

Example:

```env
PORT=5000

DATABASE_URL=your_postgresql_database_url

JWT_SECRET=your_secret_key

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_USER=your_email
EMAIL_PASS=your_password

RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
```

Run Prisma:

```bash
npx prisma generate

npx prisma migrate deploy
```

Start backend:

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend

npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm run dev
```

---

# 🌍 Environment Variables

## Backend

```
DATABASE_URL
JWT_SECRET
CLIENT_URL

CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET

EMAIL_USER
EMAIL_PASS

RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
```

## Frontend

```
VITE_API_URL
```

---

# 📸 Screenshots

<img width="2880" height="1800" alt="image" src="https://github.com/user-attachments/assets/dd43ecdb-3f01-4890-8cfa-7985a72e4162" />
<img width="2880" height="1800" alt="image" src="https://github.com/user-attachments/assets/a01d0ba4-8498-458e-bfc7-a9b485a8dca3" />
<img width="2880" height="1800" alt="image" src="https://github.com/user-attachments/assets/8092ef98-bb07-4680-9e4e-6ffc69a5027f" />








Example:

```
Home Page

Login Page

Product Details

My Listings

Bookings

Payment
```

---

# 🔒 Security

- JWT Authentication
- Password Hashing (bcrypt)
- Protected Routes
- Input Validation
- Secure Payment Verification

---

# 🚀 Deployment

## Frontend

Deploy on **Vercel**

Set environment variable:

```
VITE_API_URL=https://peer-rent-api.onrender.com/api
```

---

## Backend

Deploy on **Render**

Set all backend environment variables.

Database:

- PostgreSQL

---

# Future Improvements

- Wishlist
- Product Reviews
- User Ratings
- Live Chat
- Notifications
- Admin Dashboard
- Map-based Search
- AI Recommendations

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Gourav**

B.Tech Computer Science Engineering

Made with ❤️ using React, Node.js, Prisma & PostgreSQL.
