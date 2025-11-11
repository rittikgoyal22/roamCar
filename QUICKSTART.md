# Quick Start Guide

## ⚡ 30-Second Setup

```bash
cd roamcar
npm install
npm start
```

Then open **http://localhost:4200** in your browser.

---

## 🎯 What You'll See

### Main Screen
- Car listings in a responsive grid
- Search bar (search by car make/model)
- Filter by seats (4, 5, or 7)
- Each car card shows price, year, and seats

### Navigation Buttons (Top Right)
- **List your car** - Add your own car listing
- **Book a car** - Create a booking
- **My listings** - View/edit your cars
- **My bookings** - Manage your bookings
- **Profile** - Set your name and phone

---

## 📱 Responsive Layout

**Desktop (1200px+)**
- 4-column car grid
- All buttons visible
- Hero image on the right

**Tablet (768px - 1199px)**
- 2-3 column car grid
- Buttons wrap if needed
- Reduced padding

**Mobile (< 768px)**
- 1-column car grid (full width)
- Stacked header buttons
- Single column forms
- Touch-friendly tap targets

---

## 🚗 How to Use

### 1. Set Your Profile (First Time)
Click **Profile** button and enter:
- Your Name
- Your Phone Number

This identifies you as the owner/booker.

### 2. List a Car
Click **List your car** and fill in:
- Make & Model (e.g., "Maruti Swift")
- Year (1990-2026)
- Number of seats (4, 5, or 7)
- Price per day (₹)
- Upload an image

✓ Your listing appears instantly!

### 3. Book a Car
Click **Book a car** and:
- Select a car from dropdown
- Pick start and end dates
- Total price calculates automatically
- Confirm booking

✓ Booking saved locally!

### 4. Manage Your Listings
Click **My listings** to:
- Edit your cars
- Delete your cars
- View all your listings

### 5. Manage Your Bookings
Click **My bookings** to:
- Edit your bookings
- Delete your bookings
- View dates and total price

---

## 💾 Where is My Data Stored?

All data is saved in your browser's **localStorage**:
- Cars: `indore_demo_cars_v1`
- Bookings: `indore_demo_bookings_v1`
- Profile: `indore_demo_profile_v1`

**To clear all data:**
```javascript
// Open browser DevTools (F12) → Console
localStorage.removeItem('indore_demo_cars_v1');
localStorage.removeItem('indore_demo_bookings_v1');
localStorage.removeItem('indore_demo_profile_v1');
```

---

## 🔍 Demo Features

### Pre-loaded Cars
30 demo cars are automatically loaded on first visit including:
- Maruti Swift, WagonR
- Hyundai i20, Creta
- Honda City
- Toyota Innova
- Tata Nexon
- And more!

### Ownership Model
- Only you can edit/delete your listings
- Identified by your phone number
- Other users can only book, not modify

---

## 🛠️ Development

### File Structure
```
src/app/
├── components/         # UI components
├── services/          # business logic (StorageService)
├── models/            # TypeScript interfaces
└── app.component.ts   # Main component
```

### Adding Features
1. Create new component: `ng generate component components/my-component`
2. Add to `app.component.ts` imports
3. Use `StorageService` for data

### Styling
- Global styles in `src/styles.scss`
- Component styles in `.component.scss`
- Bootstrap 5 + custom SCSS
- Mobile-first responsive design

---

## 🌐 Browser Compatibility

✓ Chrome (all versions)
✓ Firefox (all versions)
✓ Safari (11+)
✓ Edge (all versions)
✓ Mobile browsers

---

## 📋 Common Issues

| Issue | Solution |
|-------|----------|
| Port 4200 in use | Run `ng serve --port 4300` |
| Data not saving | Check browser localStorage quota |
| Styles not applying | Clear browser cache (Ctrl+Shift+Del) |
| Images not loading | Check internet connection |

---

## 🚀 Build for Production

```bash
npm run build
```

Output will be in `dist/indore-car-rental/`

Deploy to any static hosting:
- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting

---

## 📚 More Info

- **Full Development Guide**: See `DEVELOPMENT.md`
- **Project README**: See `README.md`
- **Angular Docs**: https://angular.io/docs
- **TypeScript Docs**: https://www.typescriptlang.org/docs/

---

## 🎓 Learning Resources

### Angular Concepts Used
- Standalone Components
- Services & Dependency Injection
- Reactive Forms & Two-way Binding
- Event Emitters
- RxJS Observables
- Component Communication

### Try These Next
1. Add unit tests
2. Implement loading states
3. Add image compression
4. Create backend API
5. Add authentication

---

**Happy coding! 🚀**
