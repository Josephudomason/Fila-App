# Reading Library

A cross-platform reading-library app built with Expo and Appwrite. Create an account, add books to a private library, and manage that collection from Android, iOS, or the web.

## Features

- Email and password registration and sign-in
- Private book library backed by Appwrite
- Create, browse, view, and delete books
- Realtime library updates
- Light and dark theme support
- Loading, validation, and human-friendly error states

## Tech Stack

- Expo SDK 57 and React Native
- Expo Router for file-based navigation
- Appwrite for authentication, database storage, permissions, and realtime events
- NativeWind and Tailwind CSS for styling
- TypeScript

## Requirements

- Node.js 22.13 or later
- npm
- An Appwrite project with Email/Password authentication enabled

## Getting Started

1. Install dependencies.

   ```bash
   npm install
   ```

2. Create a local environment file from the example.

   ```bash
   cp .env.example .env
   ```

   On Windows PowerShell, use:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Update `.env` with your Appwrite configuration.

4. Start the Expo development server.

   ```bash
   npm start
   ```

5. Choose a target from the Expo terminal, or run one directly.

   ```bash
   npm run android
   npm run ios
   npm run web
   ```

## Environment Variables

The app reads its public Appwrite configuration from `.env`.

| Variable | Description |
| --- | --- |
| `EXPO_PUBLIC_APPWRITE_ENDPOINT` | Appwrite API endpoint, for example `https://cloud.appwrite.io/v1`. |
| `EXPO_PUBLIC_APPWRITE_PROJECT_ID` | Appwrite project ID. |
| `EXPO_PUBLIC_APPWRITE_PLATFORM` | Registered application platform identifier, such as the Android package name. |
| `EXPO_PUBLIC_APPWRITE_DATABASE_ID` | Database ID that contains the books collection. |
| `EXPO_PUBLIC_APPWRITE_BOOKS_COLLECTION_ID` | Books collection ID. |

`EXPO_PUBLIC_` values are included in the client app. Do not place Appwrite API keys or other secrets in this file.

## Appwrite Setup

1. Create an Appwrite project and register the Android package, iOS bundle ID, and/or web host you plan to use.
2. Enable Email/Password authentication.
3. Create a database and a `books` collection.
4. Add these string attributes to the collection:

   | Attribute | Required |
   | --- | --- |
   | `title` | Yes |
   | `author` | Yes |
   | `description` | Yes |

5. Add the database and collection IDs to `.env`.

Books are created with read, update, and delete permissions assigned to the signed-in user.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the Expo development server. |
| `npm run android` | Open the app on Android. |
| `npm run ios` | Open the app on iOS. |
| `npm run web` | Open the app in a web browser. |
| `npm run lint` | Run Expo ESLint checks. |
| `npm run typecheck` | Run TypeScript without emitting files. |
| `npm run doctor` | Check Expo dependency and configuration health. |

## Project Structure

```text
src/app/
  (auth)/          Authentication screens
  (dashboard)/     Library, create-book, profile, and book-detail screens
  index.tsx        Home screen
components/        Reusable themed UI and route guards
contexts/          Authentication and book-library state
hooks/             Context access hooks
lib/               Appwrite client configuration
constants/         Theme colors
```

## Quality Checks

Run these before opening a pull request or publishing a build:

```bash
npm run typecheck
npm run lint
npm run doctor
```

## License

This project is private and is not licensed for public reuse.
