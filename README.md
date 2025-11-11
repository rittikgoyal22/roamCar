# IndoreCar Rental - Angular Application

A responsive car rental application built with **Angular** for browsing, listing, and booking cars in Indore. All data is stored locally in the browser using localStorage.

## 🚀 Features

- **Browse Cars**: View available cars with filters (search, seats)
- **List Your Car**: Add your own car listing with image upload
- **Book a Car**: Create bookings with date selection
- **Profile Management**: Set your name and phone for identification
- **My Listings**: View, edit, and delete your car listings
- **My Bookings**: Manage your bookings
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Local Storage**: All data persists in your browser

## 📋 Tech Stack

- **Angular 17** - Frontend framework
- **TypeScript** - Type-safe programming
- **SCSS** - Styling
- **Bootstrap 5** - Responsive grid & utilities
- **localStorage** - Client-side data persistence

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Clone or extract the project
cd roamcar

# Install dependencies
npm install

# Start development server
npm start
```

The app will be available at `http://localhost:4200`

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── header/
│   │   ├── cars-list/
│   │   ├── car-form/
│   │   ├── booking-form/
│   │   └── profile-modal/
│   ├── services/
│   │   └── storage.service.ts
│   ├── models/
│   │   └── index.ts
│   ├── app.component.ts
│   ├── app.routes.ts
│   └── app.component.html
├── styles.scss
├── main.ts
└── index.html
```

## 💾 Data Storage

The app uses three localStorage keys:
- `indore_demo_cars_v1` - Car listings
- `indore_demo_bookings_v1` - Bookings
- `indore_demo_profile_v1` - User profile

Data is seeded with 30 demo cars on first load.

## 📱 Responsive Breakpoints

- **Desktop (1200px+)**: Full grid layout with 4 columns
- **Tablet (768px - 1199px)**: 2-3 columns
- **Mobile (< 768px)**: Single column, stacked layout

## 🎨 Customization

### Colors
Edit the CSS variables in `src/styles.scss`:
```scss
:root {
  --accent: #ff6b6b;
  --muted: #666;
}
```

### Booking Form Integration
To integrate with Google Forms:
1. Create a Google Form
2. Replace the empty `BOOKING_FORM_URL` in the booking service

## 🚀 Build for Production

```bash
npm run build
```

Output will be in `dist/indore-car-rental/`

## 📝 License

MIT - Feel free to use and modify as needed.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!
