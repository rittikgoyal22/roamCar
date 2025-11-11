# Installation Guide

## Current Status: Dependencies Installing ⏳

npm install is running in the background. This will take 2-5 minutes depending on your internet speed.

---

## What's Happening

When you run `npm install`, it:
1. Downloads Angular 17 and all dependencies
2. Downloads TypeScript compiler
3. Downloads RxJS (reactive library)
4. Downloads Bootstrap 5
5. Installs 500+ npm packages
6. Sets up everything needed to run the app

---

## After Installation Completes ✅

### Step 1: Verify Installation
```bash
# Check if Angular CLI is installed
ng version

# Or check if node_modules exists
dir node_modules/@angular
```

### Step 2: Start Development Server
```bash
npm start
# This starts the Angular dev server on http://localhost:4200
```

### Step 3: Open Browser
Visit: **http://localhost:4200**

You should see the car rental app!

---

## Estimated Time

- **First install**: 3-5 minutes (downloads 500+ MB)
- **Subsequent starts**: <2 seconds
- **npm start**: ~10-15 seconds to compile

---

## If Install Takes Too Long

### Troubleshooting
```bash
# Clear npm cache
npm cache clean --force

# Try install again
npm install --legacy-peer-deps
```

### Alternative (if still slow)
```bash
# Use yarn instead (if installed)
yarn install

# Or use pnpm (modern alternative)
pnpm install
```

---

## Next Commands (After Install Completes)

```bash
# Start development server
npm start

# Production build
npm run build

# Run tests (when configured)
npm test
```

---

## What Gets Installed

### Dependencies (in package.json)
- @angular/animations
- @angular/common
- @angular/compiler
- @angular/core
- @angular/forms
- @angular/platform-browser
- @angular/platform-browser-dynamic
- @angular/router
- bootstrap
- rxjs
- tslib
- zone.js

### Dev Dependencies
- @angular/cli
- @angular/compiler-cli
- typescript
- @angular-devkit/build-angular

---

## Verification Checklist

After npm install completes, verify:

- [ ] No error messages in terminal
- [ ] `node_modules/@angular/core` folder exists
- [ ] `package-lock.json` file created
- [ ] Terminal shows "added X packages"

---

## Ready to Start?

Once you see "added XXX packages" in terminal:

```bash
npm start
```

Then visit: http://localhost:4200

---

**Note**: Don't close the terminal while npm install is running!
