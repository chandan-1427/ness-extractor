# NESS Frontend

A high-performance React application for secure financial data extraction, management, and analysis. Built with modern engineering standards and designed for fintech professionals.

---

## 📋 Project Overview

**NESS** is a financial data vault application that transforms unstructured financial data (bank statements, transaction logs, SMS notifications) into structured, audit-ready JSON primitives. The frontend provides a premium user experience for account management, transaction extraction, filtering, and secure data vault access.

### Core Value Proposition
- **Precision Extraction**: Convert raw financial text into validated transaction objects
- **Tenant Isolation**: Enterprise-grade data segmentation
- **ACID Compliance**: Every extraction is a guaranteed database transaction
- **Real-time Search**: Debounced full-text search across transactions
- **Secure Authentication**: JWT-based token management with localStorage persistence

---

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 18+ with TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS + Custom Theme |
| **Routing** | React Router DOM |
| **Forms** | React Hook Form + Zod (validation) |
| **UI Components** | Shadcn/ui (custom Radix UI components) |
| **Notifications** | Sonner (toast notifications) |
| **Icons** | Lucide React |
| **HTTP Client** | Fetch API |
| **State Management** | React Hooks + localStorage |

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── pages/              # Page-specific components
│   │   │   ├── landing/
│   │   │   ├── register/
│   │   └── ui/                 # Reusable UI components (Shadcn-based)
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── card.tsx
│   │       └── ... (other UI primitives)
│   │
│   ├── layouts/
│   │   ├── Navbar.tsx          # Top navigation with auth state
│   │   └── Footer.tsx          # Application footer
│   │
│   ├── pages/                  # Route-level pages
│   │   ├── LandingPage.tsx     # Public hero page
│   │   ├── LoginPage.tsx       # Authentication page
│   │   ├── RegisterPage.tsx    # Account creation page
│   │   ├── Dashboard.tsx       # Main transaction vault (protected)
│   │   └── Document.tsx        # Documentation/how-it-works page
│   │
│   ├── lib/
│   │   ├── statements.api.ts   # API service layer for statements
│   │   └── utils.ts            # Shared utility functions
│   │
│   ├── assets/                 # Images, fonts, static files
│   ├── App.tsx                 # Root router component
│   ├── main.tsx                # React DOM entry point
│   └── index.css               # Global Tailwind + theme setup
│
├── public/                     # Static public files
├── vite.config.ts              # Vite build configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
└── index.html                  # HTML entry point
```

---

## 🎨 Design System & Theme

### Color Palette
- **Primary Background**: `#121212` (Deep Black)
- **Secondary Surface**: `#181818` (Slightly lighter black)
- **Text Primary**: `#E0E0E0` (Off-white)
- **Text Secondary**: `#9CA3AF` (Muted gray)
- **Accents**: Pure `#FFFFFF` (High contrast)
- **Destructive**: `#EF4444` / `#DC2626` (Red family)

### Typography
- **Headings**: Bold, `tracking-tighter` (tight letter spacing)
- **Body**: Regular weight with `leading-relaxed`
- **Monospace**: Used for security/protocol labels (`.font-mono`)
- **Accent**: Uppercase tracking-widest for section headers

### Component Variants
UI components support **variant patterns** (default, secondary, outline, ghost, destructive) with smooth transitions and hover states optimized for dark theme.

---

## 🚀 Features

### 1. **Authentication System**
- **Registration** (`/register`): Create vault with username, email, password
- **Login** (`/login`): JWT token-based secure access
- **Token Persistence**: Access token stored in localStorage
- **Logout**: Session termination with vault re-locking

```tsx
// Auth flow: credentials → JWT token → profile fetch → redirect
```

### 2. **Transaction Dashboard** (`/dashboard`)
**Protected Route** - Requires valid `accessToken`

#### Features:
- **Real-time Search**: Debounced search across transaction descriptions
- **Type Filtering**: Filter by debit/credit transactions
- **Date Range Selection**: Custom date pickers for transaction windows
- **Pagination**: Cursor-based pagination for large datasets
- **Load More**: Infinite scroll with "Load More" button

#### Transaction Properties:
```typescript
interface Transaction {
  _id: string;           // Unique identifier
  amount: number;        // Transaction value
  balance: number;       // Account balance after transaction
  currency: string;      // ISO currency code
  type: 'debit' | 'credit';
  date: string;          // ISO 8601 timestamp
  description: string;   // Human-readable text
  rawText: string;       // Original extracted text
}
```

### 3. **Raw Text Extraction**
- **Textarea Input**: Paste unstructured transaction data
- **ML Extraction**: Backend AI transforms text → structured JSON
- **Atomic Insertion**: Extracted transactions persist immediately
- **Toast Feedback**: Real-time success/error notifications

### 4. **Navigation & Routing**

| Route | Component | Auth Required | Purpose |
|-------|-----------|---------------|---------|
| `/` | LandingPage | ❌ | Public landing hero |
| `/docs` | Document | ❌ | Technical documentation |
| `/register` | RegisterPage | ❌ | New account creation |
| `/login` | LoginPage | ❌ | Authentication |
| `/dashboard` | Dashboard | ✅ | Main transaction vault |
| `*` | 404 Handler | ❌ | Fallback for unknown routes |

### 5. **Smart Navigation**
The navbar dynamically routes based on auth state:
- **Unauthenticated**: Logo → Landing page
- **Authenticated**: Logo → Dashboard

---

## 📡 API Integration

### Base URL
```
http://localhost:5000
```

### Authentication Endpoints

#### Register
```typescript
POST /auth/register
Body: { username: string; email: string; password: string }
Response: { accessToken: string; username: string }
```

#### Login
```typescript
POST /auth/login
Body: { email: string; password: string }
Response: { accessToken: string }
```

#### Profile Fetch
```typescript
GET /secure/me
Headers: { Authorization: 'Bearer <accessToken>' }
Response: { userId: string; email: string; username: string }
```

### Statement Endpoints

#### Fetch Transactions (with pagination)
```typescript
GET /secure/statements/fetch
Query Params:
  - cursor?: string (pagination cursor)
  - type?: 'debit' | 'credit'
  - search?: string (debounced search term)
  - limit?: number (default: 10)
  - fromDate?: ISO 8601 date
  - toDate?: ISO 8601 date

Headers: { Authorization: 'Bearer <accessToken>' }
Response: { data: Transaction[]; nextCursor: string | null }
```

#### Extract Transactions from Raw Text
```typescript
POST /secure/statements/extract
Body: { text: string }
Headers: 
  - Authorization: 'Bearer <accessToken>'
  - Content-Type: 'application/json'
  
Response: { message: string; transaction: Transaction }
```

### API Service Layer
The `src/lib/statements.api.ts` module provides typed wrappers:

```typescript
// Fetch statements with full filter support
fetchStatements({ token, cursor, limit, type, fromDate, toDate })

// Extract a single statement from raw text
createStatement({ token, text })
```

---

## 🔐 Authentication & Security

### Token Management
```typescript
// Token stored in localStorage
localStorage.setItem('accessToken', token);

// Passed in Authorization header for protected routes
Authorization: `Bearer ${token}`

// Cleared on logout
localStorage.removeItem('accessToken');
```

### Protected Routes
The `Dashboard` component checks for valid token:
```typescript
const token = localStorage.getItem('accessToken');
if (!token) {
  // Redirect to login or show error
}
```

### Session State
- Navbar checks `!!localStorage.getItem('accessToken')` to determine UI
- On logout, token removed and user redirected to home

---

## 🎯 Key Components

### App.tsx (Root Component)
- **BrowserRouter**: Wraps all routes
- **ScrollToTop**: Resets scroll position on navigation
- **Flexbox Layout**: Ensures footer sticks to bottom (`flex flex-col min-h-screen`)
- **Dark Theme**: `bg-[#121212]` base color
- **Sonner Toaster**: Global notification system

### Navbar.tsx
- Dynamic logo redirection (home vs. dashboard)
- Responsive hamburger menu (hidden on mobile)
- Auth state detection
- Scroll-aware styling with backdrop blur

### Dashboard.tsx (Main Feature)
```typescript
// State Management
const [transactions, setTransactions] = useState<Transaction[]>([]);
const [searchQuery, setSearchQuery] = useState("");
const [debouncedSearch, setDebouncedSearch] = useState("");
const [filters, setFilters] = useState({ type: 'all', limit: '10' });
const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });
const [isLoading, setIsLoading] = useState(true);

// Search Debouncing: 500ms delay before API call
useEffect(() => {
  const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
  return () => clearTimeout(timer);
}, [searchQuery]);

// Data Fetching: Triggered by filter or search changes
const fetchData = useCallback(async (cursor = null, isLoadMore = false) => {
  // Builds URLSearchParams with filters
  // Calls /secure/statements/fetch with Authorization header
}, [token, filters, debouncedSearch]);
```

### Form Validation (Zod + React Hook Form)
```typescript
// Example: RegisterPage
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Minimum 8 characters"),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(registerSchema),
});
```

---

## 🎬 Getting Started

### Prerequisites
```bash
node >= 16.x
npm >= 8.x
```

### Installation
```bash
# Install dependencies
npm install

# Verify node modules
npm list react react-dom

# Check for peer dependency warnings
npm install --legacy-peer-deps  # If needed
```

### Development Server
```bash
# Start Vite dev server with HMR
npm run dev

# Runs on: http://localhost:5173 (default)
```

### Build for Production
```bash
npm run build

# Output: dist/
```

### Type Checking
```bash
# Check for TypeScript errors (strict mode enabled)
npm run type-check
```

### Linting
```bash
npm run lint
```

---

## ⚙️ Configuration Files

### vite.config.ts
- **React Plugin**: JSX transformation
- **Tailwind CSS Plugin**: Atomic CSS generation
- **Path Alias**: `@/` maps to `./src/`

### tsconfig.app.json
- **Target**: ES2022 (modern JavaScript)
- **Strict Mode**: Enabled (`"strict": true`)
- **Path Mapping**: `@/*` → `./src/*`
- **JSX**: React JSX transform

### index.css
- **Tailwind Directives**: `@import 'tailwindcss'`
- **Custom Themes**: Dark mode CSS variables
- **Color System**: OKLch color space for accessibility
- **Radius System**: Scalable border-radius tokens

---

## 🔄 Data Flow

### Authentication Flow
```
User Input
    ↓
Zod Validation (Client-side)
    ↓
POST /auth/register or /auth/login
    ↓
Receive JWT accessToken
    ↓
localStorage.setItem('accessToken', token)
    ↓
Redirect to Dashboard or Home
```

### Transaction Fetching Flow
```
User Interacts (search/filter)
    ↓
State Update (searchQuery, filters)
    ↓
500ms Debounce
    ↓
fetchData() Called
    ↓
URLSearchParams Built with filters
    ↓
GET /secure/statements/fetch
    ↓
setTransactions(result.data)
    ↓
UI Re-renders with new data
```

### Text Extraction Flow
```
User Pastes Raw Text
    ↓
Click "Extract"
    ↓
POST /secure/statements/extract
    ↓
Sonner Toast: "Extracting..."
    ↓
Backend Processes
    ↓
Success: Refresh dashboard
    ↓
Toast: "Transaction secured"
```

---

## 🎨 Styling Conventions

### Tailwind Classes
- **Spacing**: Consistent use of `space-y-4`, `gap-6`
- **Responsive**: `md:` and `lg:` prefixes for breakpoints
- **Transitions**: All interactive elements use `transition-all duration-300`
- **Dark Mode**: Manual dark class application (not media query)

### Custom Theme Variables
```css
--color-primary: #FFFFFF
--color-destructive: oklch(0.577 0.245 27.325)
--radius: 0.625rem (10px)
```

---

## 📦 Dependencies

### Core
- `react` (18+)
- `react-dom` (18+)
- `react-router-dom` (navigation)
- `typescript` (strict typing)

### Forms & Validation
- `react-hook-form` (form state)
- `zod` (schema validation)
- `@hookform/resolvers` (Zod integration)

### UI & Styling
- `tailwindcss` (utility CSS)
- `@tailwindcss/vite` (Vite plugin)
- `class-variance-authority` (component variants)
- `lucide-react` (icons)
- `@radix-ui/react-*` (unstyled components)

### Notifications
- `sonner` (toast notifications)

### Build Tools
- `vite` (build tool)
- `@vitejs/plugin-react` (React support)
- `eslint` (linting)

---

## 🐛 Debugging & Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill existing process on port 5173
lsof -ti:5173 | xargs kill -9

# Or specify different port
npm run dev -- --port 3000
```

#### Module Not Found (`@/`)
Verify `vite.config.ts` and `tsconfig.json` both have:
```typescript
resolve.alias: { '@': path.resolve(__dirname, "./src") }
```

#### API Connection Refused
Ensure backend is running:
```bash
# Backend should be on http://localhost:5000
curl http://localhost:5000/health
```

#### TypeScript Errors
```bash
# Check for type issues without building
npx tsc --noEmit
```

---

## 🔍 Environment Variables

Currently, the API base URL is hardcoded:
```typescript
const API_BASE = 'http://localhost:5000';
```

**Future Improvement**: Create `.env.local` file:
```
VITE_API_BASE=http://localhost:5000
VITE_API_TIMEOUT=30000
```

Then use:
```typescript
const API_BASE = import.meta.env.VITE_API_BASE;
```

---

## 📚 Additional Resources

### File Documentation

| File | Purpose |
|------|---------|
| [App.tsx](src/App.tsx) | Root router, scroll management, global UI setup |
| [Dashboard.tsx](src/pages/Dashboard.tsx) | Main vault: transactions, filtering, extraction |
| [LoginPage.tsx](src/pages/LoginPage.tsx) | User authentication with secure token handling |
| [RegisterPage.tsx](src/pages/RegisterPage.tsx) | Account creation with validation |
| [Navbar.tsx](src/layouts/Navbar.tsx) | Global navigation with auth state awareness |
| [statements.api.ts](src/lib/statements.api.ts) | Typed API wrappers for backend communication |

### Design Decisions

1. **Debounced Search**: Prevents excessive API calls while typing (500ms window)
2. **Cursor-Based Pagination**: Scalable for large datasets vs. offset/limit
3. **Optimistic UI**: Transitions and loading states for perceived performance
4. **Dark Theme First**: Designed for fintech professionals working extended hours
5. **Token in localStorage**: Simple auth for frontend; consider upgrading to secure HttpOnly cookies

---

## 📝 Notes for Development

- All API calls require valid `accessToken` in Authorization header for `/secure/*` routes
- Frontend assumes backend is running locally on port 5000
- Dates are handled as ISO 8601 strings
- All timestamps include timezone information
- Search is case-insensitive (handled by backend)

---

## 🚀 Future Enhancements

- [ ] React Query for advanced caching and state management
- [ ] Zustand for global auth state (replace localStorage)
- [ ] Environment variable configuration (API URL, timeouts)
- [ ] Offline mode with IndexedDB caching
- [ ] Advanced analytics dashboard
- [ ] CSV/PDF export functionality
- [ ] Multi-currency support with conversion rates
- [ ] Two-factor authentication
- [ ] Audit logs and compliance reporting

---

**Built with precision. No bluff, no buzzwords. Just pure engineering.**
