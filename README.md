# StudioSpace — Creative Workspace Booking Platform

StudioSpace is a peer-to-peer platform where creators can discover, list, and book creative workspaces and production studios.

## Live Website

https://studiospace-client-sigma.vercel.app/

## Features

- User registration and login with email/password.
- Google authentication.
- Browse and explore available creative studios.
- View detailed information about each studio.
- Add, edit, and delete your own studio listings.
- Book creative studios and manage your bookings.
- View personal dashboard, studio listings, and booking history.
- Secure authentication using JWT and HTTP-only cookies.

## Technologies Used

**Frontend**
- Next.js
- React
- TypeScript
- Tailwind CSS

**Backend**
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Google OAuth

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/sarzilhossainshafin/studiospace-client.git
cd studiospace-client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

Replace the Google Client ID placeholder with your configured Google OAuth Client ID.

### 4. Start the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Backend Repository

https://github.com/sarzilhossainshafin/studiospace-server

## Examiner Login Credentials

Email: [Add examiner test email]

Password: [Add examiner test password]
