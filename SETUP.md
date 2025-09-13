# 🚀 Hydro-Cred Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API key
- Firebase project

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in your project root:

```bash
# Windows PowerShell
echo "VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here" > .env.local

# Or manually create .env.local with:
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**Get your Gemini API key from:** [Google AI Studio](https://aistudio.google.com/app/apikey)

### 3. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Enable Authentication with Email/Password provider
4. Create Firestore Database (select "Start in test mode")
5. Get your Firebase config from Project Settings > General > Web App
6. Update `services/firebase.ts` with your config

### 4. Run the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm run preview
```

## Troubleshooting

### Gemini API Key Issues
- Ensure `.env.local` file exists in project root
- Verify API key is correct and not placeholder text
- Restart dev server after adding environment variables

### Firebase Connection Issues
- Check Firebase project is properly configured
- Ensure Authentication and Firestore are enabled
- Verify security rules are set to "test mode" for development

### Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility
- Verify all environment variables are set

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key for AI features | Yes |
| `VITE_FIREBASE_*` | Firebase configuration (optional) | No |

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify all setup steps are completed
3. Check the Firebase and Gemini API documentation
4. Review the application logs in the terminal
