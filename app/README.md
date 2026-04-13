# Chic Charm Co. — Mobile App (`app/`)

Expo SDK 54 + Expo Router 6 native app for iOS and Android. See the [root README](../README.md) for full project context, all third-party integrations, and Web vs. App differences.

## Commands

```bash
npx expo run:ios                     # first build — installs native deps, ~5 min
npx expo start --ios --clear         # subsequent iOS starts
npx expo start --android --clear     # subsequent Android starts
npm run lint
npx tsc --noEmit
npm test                             # Jest (jest-expo preset)
npm run test:watch
npm run test:coverage
cd ios && pod install --no-repo-update   # after adding native deps
```

**Never use `npx expo start` without `--ios` or `--android`** — web bundler fails.  
**Never use Expo Go** — requires a native dev build (expo-router 6).

## Environment Variables

Create `.env.local` in this directory:

```
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
EXPO_PUBLIC_API_BASE_URL=https://<project>.supabase.co/functions/v1
```

`EXPO_PUBLIC_API_BASE_URL` must end in `/functions/v1` — checkout appends `/checkout`, Klaviyo appends `/klaviyo-subscribe`. Do NOT include `/api` in the path.

All `EXPO_PUBLIC_` variables are inlined at build time by Metro.

## Architecture Notes

See `CLAUDE.md` in this directory for full architecture details including routing rules, state management, NativeWind setup, and React Native pitfalls.
