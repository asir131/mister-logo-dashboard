# UNAP Admin Dashboard

Admin dashboard for UNAP (Vite + React).

## Getting Started

1. Run `npm install`
2. Run `npm run dev`

## Admin API Configuration

Set these in a `.env` file (Vite will load `VITE_*`):

```
VITE_ADMIN_API_BASE_URL=http://localhost:4000
VITE_ADMIN_API_KEY=your_admin_key_here
```

You can also override these in the browser using `localStorage` keys:

- `unap-admin-base-url`
- `unap-admin-key`
- `unap-admin-token`

## Login

Open `/login` in the admin dashboard to sign in with the admin email/password.

## Admin API Endpoints Used

Admin requests use `Authorization: Bearer <token>` after login. If no token is set, the dashboard falls back to `x-admin-key: VITE_ADMIN_API_KEY`.

- `POST /api/admin/auth/login` body: `{ email, password }` returns admin JWT token.
- `GET /api/admin/trending/overview` trending sections for the dashboard.
- `POST /api/admin/trending/manual` pin a post to manual trending.
- `PATCH /api/admin/trending/manual/:placementId` update pin position (swaps if occupied).
- `DELETE /api/admin/trending/manual/:placementId` unpin a post.
- `GET /api/admin/ublasts` list scheduled/released UBlasts.
- `POST /api/admin/ublasts` create/schedule a UBlast (multipart `media` optional).
- `POST /api/admin/ublasts/:ublastId/release` release a scheduled UBlast immediately.
- `GET /api/admin/ublasts/submissions` list UBlast submissions.
- `PATCH /api/admin/ublasts/submissions/:submissionId` approve/reject a submission.
