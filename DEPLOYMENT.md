# Deployment Guide

## ✅ Repository Status - Ready for GitHub

Your repository is **SAFE TO PUSH** to GitHub. All sensitive data is properly protected:

- ✅ `.env` files are properly ignored by `.gitignore`
- ✅ No hardcoded secrets in tracked files
- ✅ Database files (`stronic_dev.db`, `stronic_test.db`) are ignored
- ✅ Upload directories are ignored
- ✅ Build artifacts are ignored
- ✅ Only `.env.example` with placeholder values is tracked

## 🚀 Deployment Options

### Option 1: GitHub Pages (Static Frontend Only)

**Prerequisites:**
- GitHub repository
- Backend deployed separately (see Option 3)

**Steps:**

1. **Build the static site:**
   ```bash
   cd frontend
   npm run build
   ```
   This creates the `out` directory with static HTML/CSS/JS.

2. **Deploy to GitHub Pages:**
   - Create a new branch: `gh-pages`
   - Copy contents of `frontend/out` to the root of `gh-pages` branch
   - Enable GitHub Pages in repository settings, select `gh-pages` branch

3. **Configure environment:**
   - Set `NEXT_PUBLIC_API_BASE_URL` to your production backend URL
   - Rebuild before deploying

### Option 2: Vercel/Netlify (Frontend)

**For Vercel:**
```bash
cd frontend
npm install -g vercel
vercel
```

**For Netlify:**
```bash
cd frontend
npm install -g netlify-cli
netlify deploy
```

**Environment Variables to Set:**
- `NEXT_PUBLIC_API_BASE_URL` - Your backend API URL

### Option 3: Backend Deployment (Required for Full Functionality)

**Recommended Platforms:**
- **Railway**: Easy deployment with MySQL support
- **Render**: Free tier with PostgreSQL
- **Heroku**: Classic choice
- **DigitalOcean App Platform**: More control

**Environment Variables Required:**
```bash
# Database
DATABASE_URL=mysql://user:password@host:port/database
# or for PostgreSQL: postgresql://user:password@host:port/database

# Admin Authentication
ADMIN_API_KEY=your-secure-api-key-here
ADMIN_USER=your-admin-username
ADMIN_PASS=your-secure-password
JWT_SECRET=your-jwt-secret-key-min-32-chars

# Email (Optional but recommended)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=Stronic Holdings <noreply@stronicholdings.com>
ADMIN_NOTIFICATION_EMAIL=admin@stronicholdings.com

# AWS S3 (Optional - for file uploads)
AWS_S3_BUCKET=your-bucket-name
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1

# Server
PORT=4000
```

**Deployment Steps:**
1. Create account on chosen platform
2. Connect your GitHub repository
3. Set environment variables in platform dashboard
4. Deploy backend from `backend` directory
5. Note the deployed URL (e.g., `https://your-app.railway.app`)

## 🔧 Important Configuration Changes

### For Static Export (Current Setup)

**⚠️ Known Limitations:**
- Clerk authentication is **disabled** (incompatible with static export)
- Use `/login` page with JWT authentication instead
- No Server Actions or API routes in frontend
- All API calls go directly to backend URL

**Files Modified for Static Export:**
- `frontend/next.config.ts` - Added `output: 'export'`, removed `rewrites`
- `frontend/src/app/layout.tsx` - ClerkProvider commented out
- `frontend/src/app/sign-in/[[...sign-in]]/page.tsx` - Uses `generateStaticParams`
- `frontend/src/app/(site)/services/quick-loans/page.tsx` - Wrapped in `Suspense`

### To Re-enable Clerk (For Non-Static Deployment)

If deploying to Vercel/Netlify (not static export):

1. Remove `output: 'export'` from `next.config.ts`
2. Uncomment `ClerkProvider` in `layout.tsx`
3. Uncomment `<SignIn>` component in `SignInClient.tsx`
4. Add Clerk environment variables:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
   CLERK_SECRET_KEY=sk_...
   ```

## 📝 Pre-Deployment Checklist

- [ ] Update `NEXT_PUBLIC_API_BASE_URL` in frontend `.env.local`
- [ ] Set all backend environment variables on hosting platform
- [ ] Test backend deployment with health check: `GET /api/health`
- [ ] Rebuild frontend with production API URL
- [ ] Test frontend deployment
- [ ] Verify CORS settings allow frontend domain
- [ ] Set up database (MySQL or PostgreSQL)
- [ ] Configure email service (optional)
- [ ] Set up file storage (local or S3)

## 🔒 Security Recommendations

1. **Change Default Credentials:**
   - Update `ADMIN_API_KEY` from example value
   - Change `ADMIN_USER` and `ADMIN_PASS`
   - Generate strong `JWT_SECRET` (min 32 characters)

2. **Database Security:**
   - Use strong database passwords
   - Enable SSL for database connections
   - Regular backups

3. **CORS Configuration:**
   - Set `CORS_ORIGIN` to your frontend domain only
   - Example: `CORS_ORIGIN=https://yourdomain.com`

4. **HTTPS:**
   - Always use HTTPS in production
   - Most platforms provide this automatically

## 🐛 Troubleshooting

### Build Fails with "Server Actions not supported"
- Ensure `output: 'export'` is in `next.config.ts`
- Check no `'use server'` directives in code
- Verify ClerkProvider is disabled

### API Calls Fail (CORS Error)
- Set `CORS_ORIGIN` in backend to include frontend URL
- Check `NEXT_PUBLIC_API_BASE_URL` is correct

### Database Connection Fails
- Verify `DATABASE_URL` format is correct
- Check database is accessible from hosting platform
- Ensure database user has proper permissions

### Email Not Sending
- Verify SMTP credentials
- For Gmail, use App Password, not regular password
- Check SMTP port (587 for TLS, 465 for SSL)

## 📚 Additional Resources

- [Next.js Static Export Docs](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [GitHub Pages Deployment](https://docs.github.com/en/pages)
- [Railway Deployment Guide](https://docs.railway.app/)
- [Vercel Deployment](https://vercel.com/docs)
