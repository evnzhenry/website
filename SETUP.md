# Stronic Holdings - Setup Instructions

## Environment Configuration

### Backend Setup

1. **Create `.env` file in the `backend` directory:**

```bash
cd backend
cp .env.example .env
```

2. **Edit `.env` with your configuration:**

```env
PORT=5000
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
DATABASE_URL=mysql://root:@localhost:3306/stronic_db

# Email Configuration (optional - for OTP and notifications)
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=noreply@stronicholdings.com
ADMIN_NOTIFICATION_EMAIL=admin@stronicholdings.com

# OTP Configuration
OTP_RESEND_COOLDOWN_MS=60000

# JWT Secret (for admin auth)
JWT_SECRET=your-secret-key-change-in-production
```

3. **Install dependencies and start:**

```bash
npm install
npm run dev
```

The backend will run on **http://localhost:5000**

---

### Frontend Setup (stronic_new)

1. **Create `.env.local` file in the `stronic_new` directory:**

```bash
cd stronic_new
```

Create `.env.local` with:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

2. **Install dependencies (if not already done):**

```bash
npm install
```

3. **Start development server:**

```bash
npm run dev
```

The frontend will run on **http://localhost:3000**

---

## Testing the Integration

### 1. Start Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd stronic_new
npm run dev
```

### 2. Test Endpoints

- **Loan Application**: http://localhost:3000/apply
- **Status Check**: http://localhost:3000/status
- **Contact Form**: http://localhost:3000/contact

### 3. API Endpoints Available

- `POST /api/applications` - Submit loan application
- `POST /api/loan-status/request-otp` - Request OTP for status check
- `POST /api/loan-status/verify-otp` - Verify OTP and get applications
- `GET /api/loan-status/status/:email` - Get loan status (with token)
- `POST /api/contacts` - Submit contact form

---

## Database Setup

The backend will automatically create the database and tables on first run if using MySQL. Make sure MySQL is running:

```bash
# Check MySQL status
mysql -u root -p

# Or use the DATABASE_URL in .env to connect
```

For development without MySQL, the backend will fall back to SQLite automatically.

---

## Next Steps

1. ✅ Backend configured on port 5000
2. ✅ API client created with TypeScript
3. ✅ All endpoints mounted and ready
4. ⏳ **TODO**: Integrate forms with API client
5. ⏳ **TODO**: Create admin panel
6. ⏳ **TODO**: Test end-to-end flow

---

## Troubleshooting

### Port Already in Use
If port 5000 or 3000 is already in use:
- Change `PORT` in backend `.env`
- Update `NEXT_PUBLIC_API_URL` in frontend `.env.local`

### CORS Errors
Make sure `CORS_ORIGIN` in backend `.env` includes your frontend URL.

### Database Connection Failed
The backend will automatically fall back to SQLite for development if MySQL connection fails.
