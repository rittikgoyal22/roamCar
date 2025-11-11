# Angular App Architecture & Flow Diagrams

## Component Hierarchy Tree

```
┌─────────────────────────────────────────────────────────────┐
│                   AppComponent (Root)                       │
│              Orchestrates all modals & routing               │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┬──────────────┐
        │                     │                     │              │
        ▼                     ▼                     ▼              ▼
   ┌────────────┐    ┌──────────────┐      ┌──────────────┐  ┌────────────┐
   │  Header    │    │  CarsListDon│      │  Profile     │  │  CarForm   │
   │ Component  │    │  Component   │      │  Component   │  │ Component  │
   │            │    │              │      │              │  │            │
   │ • Buttons  │    │ • Grid view  │      │ • Name input │  │ • File up  │
   │ • Emit     │    │ • Search bar │      │ • Phone in   │  │ • Form val │
   │   events   │    │ • Filter sel │      │ • Save btn   │  │ • Preview  │
   └────────────┘    └──────────────┘      └──────────────┘  └────────────┘
                           │                                       │
                           │ onBookCar event                       │
                           │                                       │
        ┌──────────────────────────────┬──────────────────────────┘
        │                              │
        ▼                              ▼
   ┌────────────────────┐       ┌─────────────────┐
   │ BookingModal       │       │   StorageService│
   │ Component          │       │ (Singleton)     │
   │                    │       │                 │
   │ • Car dropdown     │◄──────► • Cars array    │
   │ • Date picker      │        • Bookings array │
   │ • Price calc       │        • Profile obj    │
   │ • Save booking     │        • Observable     │
   └────────────────────┘       └─────────────────┘
                                        │
                                        ▼
                                ┌──────────────────┐
                                │   localStorage   │
                                │                  │
                                │ indore_demo_     │
                                │ cars_v1          │
                                │ bookings_v1      │
                                │ profile_v1       │
                                └──────────────────┘
```

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERACTION                            │
│  (Click button, type in form, select dropdown, submit form)         │
└──────────────────┬──────────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      COMPONENT METHOD                               │
│  (onListCar, onSubmit, openBooking, deleteCar)                      │
└──────────────────┬──────────────────────────────────────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
         ▼                   ▼
    ┌─────────┐        ┌──────────────────┐
    │ Validate │       │ Call Service     │
    │  Input  │       │  Method          │
    └─────────┘       └────────┬──────────┘
         │                     │
         └────────┬────────────┘
                  ▼
    ┌─────────────────────────────────────┐
    │    StorageService Methods           │
    │  (saveCar, saveBooking, getProfile) │
    └────────────┬────────────────────────┘
                 │
                 ▼
    ┌─────────────────────────────────────┐
    │      Update localStorage            │
    │  (setItem, JSON.stringify)          │
    └────────────┬────────────────────────┘
                 │
                 ▼
    ┌─────────────────────────────────────┐
    │   Update BehaviorSubject            │
    │  (next(newValue))                   │
    └────────────┬────────────────────────┘
                 │
                 ▼
    ┌─────────────────────────────────────┐
    │  Observable Emits New Value         │
    │  (cars$, bookings$, profile$)       │
    └────────────┬────────────────────────┘
                 │
                 ▼
    ┌─────────────────────────────────────┐
    │  Template Binding Updates           │
    │  (*ngFor, *ngIf, Property binding)  │
    └────────────┬────────────────────────┘
                 │
                 ▼
    ┌─────────────────────────────────────┐
    │         DOM Updated                 │
    │  (UI reflects new data)             │
    └─────────────────────────────────────┘
```

## Component Communication Pattern

```
┌──────────────────┐
│  Parent          │
│  (AppComponent)  │
└─────────┬────────┘
          │
          │ @Input() properties
          │  [isOpen]
          │  [editingCarId]
          ▼
    ┌───────────────────┐
    │ Child Component   │
    │ (Modal)           │
    │                   │
    │ Form logic        │
    │ Validation        │
    │ Submit handling   │
    └────────┬──────────┘
             │
             │ @Output() EventEmitter
             │ (close)
             ▼
    ┌──────────────────┐
    │ Parent receives  │
    │ event and closes │
    │ modal            │
    └──────────────────┘
    
    ┌──────────────────┐      ┌────────────────┐
    │ Both components  │──────│ StorageService │
    │ read from       │◄──────│ (shared state)  │
    │ Observable      │      │                 │
    └──────────────────┘     └────────────────┘
```

## Responsive Design Transformation

```
DESKTOP VIEW (1200px+)
┌───────────────────────────────────────────────────────────────┐
│  ┌─ Header with full buttons ────────────────────────────────┐ │
│  └─────────────────────────────────────────────────────────────┘ │
│  ┌─ Hero Section ──────────────┐  ┌─ Image ──────────────┐     │
│  │ Title                        │  │                      │     │
│  │ Subtitle                     │  │  Responsive img      │     │
│  │ Filters                      │  │                      │     │
│  └──────────────────────────────┘  └──────────────────────┘     │
│  ┌────────── 4 Column Grid ──────────────────────────────────┐   │
│  │ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐                 │   │
│  │ │ Card  │ │ Card  │ │ Card  │ │ Card  │                 │   │
│  │ └───────┘ └───────┘ └───────┘ └───────┘                 │   │
│  │ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐                 │   │
│  │ │ Card  │ │ Card  │ │ Card  │ │ Card  │                 │   │
│  │ └───────┘ └───────┘ └───────┘ └───────┘                 │   │
│  └──────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────┘

        ↓ Resize to 1000px ↓

TABLET VIEW (768px - 1199px)
┌────────────────────────────────────┐
│ ┌─ Header w/ stacked buttons ─────┐ │
│ └─────────────────────────────────┘ │
│ ┌─ Hero (stacked vertically) ──────┐ │
│ │ Title & content                   │ │
│ │ ┌──────────────┐                  │ │
│ │ │ Image (full) │                  │ │
│ │ └──────────────┘                  │ │
│ └─────────────────────────────────┘ │
│ ┌──── 2-3 Column Grid ─────────────┐ │
│ │ ┌────────┐ ┌────────┐            │ │
│ │ │ Card   │ │ Card   │            │ │
│ │ └────────┘ └────────┘            │ │
│ │ ┌────────┐ ┌────────┐            │ │
│ │ │ Card   │ │ Card   │            │ │
│ │ └────────┘ └────────┘            │ │
│ └─────────────────────────────────┘ │
└────────────────────────────────────┘

        ↓ Resize to 500px ↓

MOBILE VIEW (< 768px)
┌──────────────────┐
│ ┌─ Header ──────┐ │
│ │ • Buttons     │ │
│ │   stack       │ │
│ │   vertically  │ │
│ └───────────────┘ │
│                   │
│ ┌─ Hero ────────┐ │
│ │ Title         │ │
│ │ ┌───────────┐ │ │
│ │ │  Image    │ │ │
│ │ │  Full W   │ │ │
│ │ └───────────┘ │ │
│ │ Filters       │ │
│ │ (stacked)     │ │
│ └───────────────┘ │
│                   │
│ ┌─ 1 Column ────┐ │
│ │ ┌───────────┐ │ │
│ │ │   Card    │ │ │
│ │ │ Full Wdth │ │ │
│ │ └───────────┘ │ │
│ │ ┌───────────┐ │ │
│ │ │   Card    │ │ │
│ │ │ Full Wdth │ │ │
│ │ └───────────┘ │ │
│ │ ┌───────────┐ │ │
│ │ │   Card    │ │ │
│ │ │ Full Wdth │ │ │
│ │ └───────────┘ │ │
│ └───────────────┘ │
└──────────────────┘
```

## Feature Implementation Flowchart

```
START: User wants to add a car
       │
       ▼
  Set Profile? ──NO──> Show Alert: Set Profile First
       │                      ▲
      YES                     │
       │                      │
       ▼                      │
  Click "List Car"            │
       │                      │
       ▼                      │
  Modal Opens                 │
       │                      │
       ▼                      │
  Fill Form ──────────────────┘
  • Title
  • Year
  • Seats
  • Price
  • Image
       │
       ▼
  Submit?
       │
      YES
       │
       ▼
  Validate Form ──NO──> Show Error Alert
       │                      ▲
      YES                     │
       │                      │
       ▼                      │
  Read Image File ────────────┘
       │
       ▼
  Convert to Base64
       │
       ▼
  Create Car Object
  • id = 'car-' + timestamp
  • ownerPhone = current user phone
  • image = base64 data
       │
       ▼
  StorageService.saveCar(car)
       │
       ▼
  Save to localStorage
       │
       ▼
  Update BehaviorSubject
       │
       ▼
  Template refreshes via *ngFor
       │
       ▼
  Show Success Alert
       │
       ▼
  Close Modal
       │
       ▼
  Car appears in grid
       │
       ▼
  END
```

## Booking Price Calculation

```
START: User selects dates
       │
       ├─ Start Date: 2024-03-15
       │
       ├─ End Date: 2024-03-18
       │
       ├─ Car: Maruti Swift
       │  └─ Price: ₹1000/day
       │
       ▼
Calculate Days:
  end - start = 3 calendar days
  + 1 = 4 days total (inclusive)
       │
       ▼
Calculate Total:
  4 days × ₹1000/day = ₹4000
       │
       ▼
Display to User:
  ┌──────────────────────┐
  │ Days: 4              │
  │ Total Price: ₹4000   │
  └──────────────────────┘
       │
       ▼
User Confirms
       │
       ▼
Create Booking Object:
  {
    id: 'bk-1234567890',
    carId: 'car-1',
    start: '2024-03-15',
    end: '2024-03-18',
    days: 4,
    total: 4000,
    name: 'John Doe',
    phone: '9876543210'
  }
       │
       ▼
Save to Storage
       │
       ▼
END: Booking Confirmed
```

## Storage Architecture

```
┌────────────────────────────────────────────────────┐
│              localStorage                          │
│  (5-10MB available, persistent across sessions)    │
└────────────────────────────────────────────────────┘
          │
          ├─ indore_demo_cars_v1
          │  └─ [
          │      { id, title, year, seats, price_per_day, image, ownerPhone, ... },
          │      { id, title, year, seats, price_per_day, image, ownerPhone, ... },
          │      ...30 cars total...
          │    ]
          │
          ├─ indore_demo_bookings_v1
          │  └─ [
          │      { id, carId, start, end, name, phone, days, total, ... },
          │      { id, carId, start, end, name, phone, days, total, ... },
          │      ...user's bookings...
          │    ]
          │
          └─ indore_demo_profile_v1
             └─ { name: "John Doe", phone: "9876543210" }

Each key stores JSON string
Retrieved and parsed by StorageService
Updated via Observable pattern
```

## Ownership & Permission Model

```
┌─────────────────────────────────────────────────┐
│              Current User Profile               │
│         Phone: 9876543210                       │
│         Name: John Doe                          │
└────────┬────────────────────────────────────────┘
         │
         ▼
    When viewing a Car:
    ┌────────────────────────────┐
    │ Car ownerPhone: 9876543210  │ ──► IS OWNER = TRUE
    │                             │
    │ Show: [Edit] [Delete]       │
    └────────────────────────────┘

    ┌────────────────────────────┐
    │ Car ownerPhone: 1111111111  │ ──► IS OWNER = FALSE
    │                             │
    │ Show: [Book]                │
    │ Hide: [Edit] [Delete]       │
    └────────────────────────────┘

    When viewing a Booking:
    ┌────────────────────────────┐
    │ Booking phone: 9876543210   │ ──► IS BOOKER = TRUE
    │                             │
    │ Show: [Edit] [Delete]       │
    └────────────────────────────┘

    ┌────────────────────────────┐
    │ Booking phone: 2222222222   │ ──► IS BOOKER = FALSE
    │                             │
    │ Cannot see this booking     │
    │ (filtered out)              │
    └────────────────────────────┘
```

---

**Note**: These diagrams represent the logical flow and structure. Actual implementations may vary based on specific requirements and optimizations.
