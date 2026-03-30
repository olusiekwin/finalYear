# Clerk Authentication Setup Guide - NSC Client (Next.js)

## Overview

This guide explains how to set up Clerk authentication with Google Sign-In on your Next.js frontend. The login page now supports both Clerk (with Google OAuth) and traditional email/password authentication.

---

## Step 1: Get Your Clerk Publishable Key

1. **Go to Clerk Dashboard**
   - Visit https://dashboard.clerk.com
   - Log in or create an account

2. **Create/Select Your Application**
   - If you haven't already, create a new application
   - Select "Sign In With Google" from the available authentication methods

3. **Copy Your Keys**
   - Go to **API Keys** section
   - Copy your **Publishable Key** (starts with `pk_test_` or `pk_live_`)

---

## Step 2: Configure Environment Variables

1. **Edit `.env.local` in the `client/` directory**

   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

   **Important:** Replace `pk_test_your_publishable_key_here` with your actual Clerk Publishable Key

2. **Verify Environment File**
   - Never commit `.env.local` to git
   - Add `.env.local` to your `.gitignore` file

---

## Step 3: Enable Google in Clerk

1. **Go to Clerk Dashboard → Social Providers**
2. **Click on Google**
3. **Enable Google Sign-In**
4. **Add your OAuth credentials:**
   - Get them from Google Cloud Console
   - Or use Clerk's provided credentials (recommended for development)

---

## Step 4: Set Up Google OAuth (Optional but Recommended)

If you want to use your own Google OAuth credentials:

1. **Go to Google Cloud Console** (console.cloud.google.com)
2. **Create a new project** or select existing one
3. **Enable Google+ API**
4. **Create OAuth 2.0 Credentials:**
   - Type: Web Application
   - Authorized redirect URIs:
     - `http://localhost:3000/sso/oauth_callback` (development)
     - `https://your-production-domain.com/sso/oauth_callback` (production)
5. **Copy Client ID and Client Secret**
6. **Add to Clerk Dashboard:**
   - API Keys → Social Providers → Google
   - Paste your Google Client ID and Secret

---

## Step 5: Update Clerk Sign-In UI (Optional)

The login page is already configured with a nice dark theme matching NSC branding. The `SignIn` component uses:

- Custom styling to match NSC colors (#c56c4a, #2f4b45)
- Rounded buttons with NSC design
- Tab-based selection between Clerk and traditional login

**To customize further**, edit the `appearance` prop in [app/login/page.tsx](app/login/page.tsx#L48-L63):

```typescript
<SignIn
  appearance={{
    elements: {
      // Customize styling here
      rootBox: "w-full",
      button: { primary: "your-custom-styles" },
    },
  }}
  redirectUrl="/dashboard"
/>
```

---

## Step 6: Test Sign In With Google

1. **Start your development server:**

   ```bash
   npm run dev
   ```

2. **Navigate to login page:**
   - Open http://localhost:3000/login
   - Click the "Quick Sign In" tab

3. **Click "Continue with Google"**
   - Select your Google account
   - You should be redirected to `/dashboard` on success

---

## Step 7: Sync User with Backend

When a user signs in with Clerk, their data needs to sync with your MongoDB database. There are two approaches:

### Option A: Frontend Sync (After Sign-In)

1. **In your dashboard or after sign-in:**

```typescript
import { useUser } from "@clerk/nextjs";

export default function Dashboard() {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      // Sync user with backend
      fetch("http://localhost:5000/api/auth/sync-clerk-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.id}`,
        },
        body: JSON.stringify({
          email: user.primaryEmailAddress?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumbers[0]?.phoneNumber || "",
        }),
      });
    }
  }, [user]);

  return <div>Welcome, {user?.firstName}</div>;
}
```

### Option B: Webhook Sync (Recommended)

Configure Clerk webhooks to automatically sync users when created/updated (see [backend CLERK_SETUP_GUIDE.md](../../backend/CLERK_SETUP_GUIDE.md#step-8-webhooks-optional-but-recommended))

---

## Step 8: Authentication in Protected Routes

### Use Clerk's useUser Hook

```typescript
import { useUser } from "@clerk/nextjs";

export default function BookingsPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;

  return <div>Welcome, {user.firstName}!{" "}
    Your email: {user.primaryEmailAddress?.emailAddress}
  </div>;
}
```

### Protect Routes with Middleware

```typescript
// middleware.ts
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware();

export const config = {
  matcher: ["/dashboard/:path*", "/bookings/:path*", "/profile/:path*"],
};
```

---

## Step 9: Make Authenticated API Calls

```typescript
import { useAuth } from "@clerk/nextjs";

export default function BookingForm() {
  const { getToken } = useAuth();

  const createBooking = async () => {
    const token = await getToken();

    const response = await fetch("http://localhost:5000/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        appointmentDate: "2026-04-15",
        dermatologistId: "123",
      }),
    });

    const data = await response.json();
    console.log("Booking created:", data);
  };

  return (
    <button onClick={createBooking}>Create Booking</button>
  );
}
```

---

## Step 10: Styled Google Sign-In Button

For a custom look, you can create a button instead of using `SignIn`:

```typescript
import { useSignIn } from "@clerk/nextjs";

export default function GoogleSignIn() {
  const { signIn } = useSignIn();

  const handleGoogleSignIn = async () => {
    try {
      await signIn?.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso/oauth_callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="w-full rounded-full border-2 border-[#c56c4a] px-4 py-3 text-[#c56c4a] hover:bg-[#c56c4a]/5 font-semibold transition"
    >
      <svg className="inline-block mr-2 h-4 w-4" viewBox="0 0 24 24">
        {/* Google logo SVG */}
      </svg>
      Continue with Google
    </button>
  );
}
```

---

## Deployment Considerations

### Production Environment Variables

For production deployment:

1. **Get Production Keys from Clerk:**
   - Dashboard → API Keys → Production
   - Copy your production Publishable Key (`pk_live_...`)

2. **Set Environment Variables on Your Hosting:**
   - Vercel: Project Settings → Environment Variables
   - Other platforms: Follow their docs

3. **Update Clerk Settings:**
   - Add your production domain to:
     - Dashboard → API → Allowed Origins
     - Allowed Redirect URLs

---

## Common Issues & Troubleshooting

### Issue: "401 Unauthorized" when signing in

**Solution:**

- Verify `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set correctly in `.env.local`
- Make sure the key starts with `pk_` not `sk_`
- Restart dev server after changing environment variables

### Issue: "Google OAuth button not showing"

**Solution:**

- Ensure Google is enabled in Clerk Dashboard → Social Providers
- Check browser console for errors
- Verify Clerk is correctly wrapped in `ClerkProvider` in layout

### Issue: "Sign in works but user not synced to backend"

**Solution:**

- Ensure backend `.env` has `CLERK_SECRET_KEY` set
- Check backend logs for webhook errors
- Implement manual sync endpoint (Option A in Step 7)

### Issue: "Redirects to login after signing in"

**Solution:**

- Check if `redirectUrl` is set correctly in `SignIn` component
- Verify `/dashboard` route exists and is not protected
- Check browser local storage for Clerk session

---

## Useful Links

- **Clerk Docs**: https://clerk.com/docs
- **Next.js Integration**: https://clerk.com/docs/quickstarts/nextjs
- **Google OAuth Setup**: https://clerk.com/docs/authentication/social/google
- **Clerk API Reference**: https://clerk.com/docs/reference/frontend/JavaScript

---

## Next Steps

1. ✅ Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` to `.env.local`
2. ✅ Test "Sign in with Google" on login page
3. ✅ Create dashboard redirect after login
4. ✅ Set up user sync with backend
5. ✅ Add Clerk to protected routes
6. ✅ Test end-to-end flow

---

## Support

For issues or questions:

- Check [Clerk documentation](https://clerk.com/docs)
- Review [backend integration guide](../../backend/CLERK_SETUP_GUIDE.md)
- Enable debug logging: `CLERK_DEBUG=true` in `.env.local`
