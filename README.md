# 🍽️ Anubis FoodShare

A web platform for sharing extra food between people who need it — built with MERN stack.

## 📦 Project Structure


foodshare-frontend/ → React frontend
foodshare-backend/ → Express + MongoDB backend
foodshare-deploy/ → Deployment scripts/files (optional)


## 🚀 Setup Instructions

### 1. Clone the project

```bash
git clone https://github.com/MohAli92/Anubis-sharedish.git
cd Anubis-sharedish



### 2. Backend setup 
cd foodshare-backend
cp .env.example .env
# fill in .env with your local config
npm install
npm run dev



### 3. Frontend setup
cd ../foodshare-frontend
npm install
npm start



🔐 Environment Variables
Create a .env file in foodshare-backend using this structure:
MONGO_URI=...
JWT_SECRET=...
FRONTEND_URL=http://localhost:3000
PORT=5000
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...


✅ Notes
Don't push your .env file — use .env.example
All secret keys must be kept private


👨‍💻 Contributors
Mohamed Nouh – @MohAli92
and team 🚀

GREAT