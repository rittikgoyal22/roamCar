# Development Guide - IndoreCar Rental Angular App

## Project Overview

This is a responsive Angular-based car rental application with a focus on mobile-first design. The app manages car listings, bookings, and user profiles with all data persisted locally in the browser.

## Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Angular CLI**: v17 (installed via npm)

### Installation Steps

```bash
# 1. Navigate to project directory
cd roamcar

# 2. Install dependencies
npm install

# 3. Start development server
npm start

# 4. Open browser to http://localhost:4200
```

## Project Structure

```
roamcar/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── header/                 # Navigation header with buttons
│   │   │   ├── cars-list/              # Main car listings grid
│   │   │   ├── car-form/               # Modal for listing/editing cars
│   │   │   ├── booking-modal/          # Modal for creating/editing bookings
│   │   │   └── profile-modal/          # Modal for profile management
│   │   ├── services/
│   │   │   └── storage.service.ts      # localStorage management & BehaviorSubjects
│   │   ├── models/
│   │   │   └── index.ts                # TypeScript interfaces
│   │   ├── app.component.ts            # Root component with modal orchestration
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   ├── app.routes.ts               # Routing configuration
│   │   └── app.component.scss
│   ├── styles.scss                      # Global styles & responsive utilities
│   ├── main.ts                          # Bootstrap entry point
│   └── index.html
├── angular.json                         # Angular CLI config
├── tsconfig.json                        # TypeScript config
├── package.json                         # Dependencies & scripts
└── README.md                           # Project documentation
```

## Key Features & Components

### 1. **Storage Service** (`StorageService`)
   - Manages localStorage persistence
   - Provides BehaviorSubjects for reactive data
   - Seeds 30 demo cars on first load
   - CRUD operations for cars and bookings
   - Profile management (name, phone)

### 2. **Car Listing Component**
   - Displays cars in responsive grid (4 cols → 1 col on mobile)
   - Search by make/model
   - Filter by number of seats
   - Emits booking event to parent
   - Delete/Edit buttons visible to owner only

### 3. **Car Form Modal**
   - Create new car listings
   - Edit existing listings (owner only)
   - Image upload with preview
   - Form validation
   - Auto-associate with current user profile

### 4. **Booking Modal**
   - Select car and dates
   - Real-time calculation of days and total price
   - Pre-fill user name/phone from profile
   - Edit existing bookings
   - Only booker can modify their booking

### 5. **Profile Modal**
   - Set user name and phone
   - Used to identify owners and bookers
   - Stored in localStorage

## Responsive Design Breakpoints

```scss
// Desktop: 1200px+
// Tablet: 768px - 1199px
// Mobile: < 768px

// Grid Layout
Desktop:  4 columns
Tablet:   2-3 columns
Mobile:   1 column

// Header & Buttons
Desktop:  Full button labels visible
Tablet:   Reduced padding
Mobile:   Stacked/wrapped, smaller font
```

## Styling Architecture

### CSS Variables
```scss
--accent: #ff6b6b     // Primary red accent
--muted: #666         // Secondary gray text
```

### Component Styling
- SCSS modules per component
- Utility classes for responsive layout
- Bootstrap 5 integration for grid/flexbox
- Smooth transitions and hover effects

## Storage Keys

Data persists using these localStorage keys:
- `indore_demo_cars_v1` - Array of Car objects
- `indore_demo_bookings_v1` - Array of Booking objects
- `indore_demo_profile_v1` - UserProfile object

## Development Commands

```bash
# Start dev server (localhost:4200)
npm start

# Build for production
npm run build

# Watch mode for development
npm run watch

# Run tests (if configured)
npm test
```

## Component Communication

The app uses Angular's standard patterns:

1. **Parent to Child**: `@Input` properties
2. **Child to Parent**: `@Output` EventEmitters
3. **Shared State**: Services with BehaviorSubjects
4. **Cross-component**: StorageService singleton

### Data Flow Example
```
Header (List Car Click)
    ↓
App Component (opens modal)
    ↓
CarFormComponent (form submission)
    ↓
StorageService (saves to localStorage)
    ↓
CarsListComponent (receives via Observable)
```

## Key TypeScript Interfaces

```typescript
interface Car {
  id: string;
  title: string;
  year: number;
  seats: 4 | 5 | 7;
  price_per_day: number;
  image: string;
  ownerPhone: string | null;
  ownerName: string | null;
  createdAt: string;
  updatedAt?: string;
}

interface Booking {
  id: string;
  carId: string;
  carTitle: string;
  start: string;
  end: string;
  name: string;
  phone: string;
  days: number;
  total: number;
  createdAt: string;
  updatedAt?: string;
}

interface UserProfile {
  name: string;
  phone: string;
}
```

## Form Validation

All forms include:
- ✓ Required field validation
- ✓ Type checking
- ✓ Min/Max values for year
- ✓ Date range validation for bookings
- ✓ User feedback via alerts

## Common Tasks

### Adding a New Feature
1. Create component in `src/app/components/`
2. Create corresponding model in `src/app/models/`
3. Add service methods to `StorageService`
4. Integrate component into `app.component.ts`

### Styling a Component
1. Create `component-name.component.scss`
2. Use SCSS nesting for organization
3. Include responsive media queries
4. Reference CSS variables for consistency

### Modifying localStorage Structure
1. Update model interfaces in `models/index.ts`
2. Update StorageService methods
3. Handle migration if changing keys
4. Update seed data if needed

## Performance Considerations

- ✓ Standalone components (no module dependencies)
- ✓ OnPush detection strategy ready
- ✓ Observables with RxJS for efficient subscriptions
- ✓ Lazy modal initialization
- ✓ Minimal DOM manipulation

## Testing (Future)

To add unit tests:
```bash
ng generate component components/test-component --skip-tests=false
npm test
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Port 4200 already in use
```bash
ng serve --port 4300
```

### localStorage not working
- Check browser privacy/incognito mode
- Verify localStorage quota not exceeded
- Clear cache and try again

### Styles not applying
- Ensure SCSS is compiled
- Check CSS specificity (use developer tools)
- Verify Bootstrap CSS is loaded

## Next Steps / TODOs

- [ ] Add unit tests for services
- [ ] Implement e2e tests
- [ ] Add Google Forms integration for bookings
- [ ] Implement image optimization
- [ ] Add more robust form validation
- [ ] Add loading spinners
- [ ] Implement pagination for car list
- [ ] Add car review/rating system
- [ ] Backend API integration

## Resources

- [Angular Documentation](https://angular.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [RxJS Documentation](https://rxjs.dev/)
- [Bootstrap 5 Docs](https://getbootstrap.com/docs/5.0/)
