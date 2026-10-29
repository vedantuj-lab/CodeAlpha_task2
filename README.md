# CALCORA — Precision at Your Fingertips

A premium, modern calculator platform built for students, developers, engineers, and everyday users. Calcora combines rigorous mathematical tokenization and Abstract Syntax Tree (AST) evaluation with a polished, accessible design system, full keyboard navigation, calculation history, bookmarked saved expressions, and persistent personal & administrative workspaces.

---

## 1. Project Overview

- **Name**: Calcora
- **Tagline**: Precision at Your Fingertips
- **Repository**: `CodeAlpha_Calculator`
- **Core Principle**: Zero arbitrary JavaScript `eval()` execution. Pure algorithmic recursive descent parsing with operator precedence, domain boundary guards, and IEEE-754 precision normalization.
- **Offline First**: The core calculator requires **no database, no account, and no network connection**.
- **Cloud-Ready**: Optional synchronization via Supabase PostgreSQL, Authentication, and Row Level Security (RLS).

---

## 2. Technology Stack

- **Frontend**: React 19, TypeScript, Vite, React Router 7
- **Styling**: Tailwind CSS v4, custom CSS design tokens
- **Icons**: Lucide React
- **Calculation Engine**: Custom TypeScript Lexer, Recursive-Descent AST Parser, and Precision Normalizer
- **Backend (Optional Persistence)**: Supabase Authentication, Supabase PostgreSQL, Row Level Security (RLS)
- **Local Fallback**: LocalStorage ledger for guest calculations and preferences

---

## 3. Brand Identity & Color Palette

| Token | Hex Value | Application |
|---|---|---|
| **Main Dark Background** | `#151715` | Body background in dark mode |
| **Secondary Dark Background** | `#1D211E` | Sidebar, footer, and secondary panels |
| **Calculator Surface** | `#242925` | Primary keypad and card surface |
| **Secondary Calculator Surface** | `#2D332E` | Action buttons, memory row |
| **Primary Text (Dark)** | `#F6F5EF` | Numerical displays, primary headings |
| **Secondary Text** | `#A8ADA5` | Expressions, labels, timestamps |
| **Primary Border** | `#414940` | Card borders, input frames |
| **Primary Lime Accent** | `#C4F05D` | Equals button (`=`), primary CTAs |
| **Hover Lime** | `#D4FF79` | Active hover states |
| **Warm Orange Accent** | `#F29B63` | Operators (`+`, `−`, `×`, `÷`) |
| **Supporting Lavender** | `#B8A5F5` | Scientific controls and tools |
| **Light Background** | `#F7F6F0` | Light theme background |
| **Light Surface** | `#FFFFFF` | Light theme calculator surface |

---

## 4. Complete Application Structure

### Public Pages
- **Landing Page (`/`)**: Hero with value proposition, live interactive calculator preview, features grid, sequential how-it-works, mission about section, and dynamic footer.
- **Calculator Workspace (`/calculator`)**: Core two-column workspace with responsive display, tactile keypad, collapsible scientific panel, memory tools, history ledger, and saved calculation modal.
- **Features Page (`/features`)**: Detailed breakdown of mathematical precedence, domain guards, keyboard shortcuts, and an interactive browser-based test suite runner.
- **About Page (`/about`)**: Architecture overview, AST explanation, and security guarantees.
- **Sign In (`/login`)**: Split-screen authentication with email/password validation, demo quick-login buttons, and redirect handling.
- **Register Account (`/register`)**: Member registration with password length and confirmation checks.
- **Password Recovery (`/recovery`)**: Email recovery form with Supabase SMTP dispatch or local mode simulation.

### Member Workspace (`/member`)
- **Overview (`/member`)**: Personal dashboard displaying registered email, live metrics, recent calculations, and quick launches.
- **History (`/member/history`)**: Filterable, searchable calculation history with reuse and delete actions.
- **Saved Calculations (`/member/saved`)**: Custom-titled bookmarks with inline rename and delete controls.
- **Profile & Preferences (`/member/profile`)**: Update display name, switch dark/light theme, set default calculator mode (standard/scientific), and configure angle mode (DEG/RAD).

### Admin Control Console (`/admin`)
- **Admin Overview (`/admin`)**: Verified aggregate statistics (registered accounts, total saved formulas, history ledger counts, security actions).
- **User Management (`/admin/users`)**: Search, filter, and assign/revoke administrative roles with database-enforced security checks.
- **Application Activity (`/admin/activity`)**: Real-time audit log of configuration updates and role changes.
- **Calculator Config (`/admin/config`)**: Global application policies (default theme, default angle mode, maximum history retention, scientific function toggles).

---

## 5. Calculation Engine & Mathematical Behavior

### Operator Precedence
Expressions are parsed into an Abstract Syntax Tree:
1. **Parentheses**: `( ... )`
2. **Postfix Operations**: Factorials (`!`) and percentages (`%`)
3. **Unary Operations**: `-` and `+`
4. **Exponentiation**: `^` (right-associative)
5. **Multiplication & Division**: `*` / `×` and `/` / `÷` (left-to-right)
6. **Addition & Subtraction**: `+` and `-`

*Example*: `7 + 2 × 3` evaluates strictly to `13`. `(2 + 3) × 4` evaluates strictly to `20`.

### Floating-Point Precision Normalization
To eliminate IEEE-754 binary floating-point noise (e.g. `0.1 + 0.2 = 0.30000000000000004`), Calcora cleans significant digits using a 12-digit epsilon tolerance filter (`cleanPrecision()`), rendering clean `0.3`.

### Percentage Calculations
- **Standalone**: `50%` = `0.5`
- **Chained**: `100 + 10%` evaluates to `100 + (100 × 0.10) = 110`. `100 - 20%` evaluates to `80`.

### Scientific Functions
- **Trigonometry**: `sin(x)`, `cos(x)`, `tan(x)` with Degree (`DEG`) and Radian (`RAD`) toggles. Exact angles snap to exact values (e.g. `sin(30°) = 0.5`, `cos(60°) = 0.5`, `tan(45°) = 1`).
- **Inverse Arcs**: `asin(x)`, `acos(x)`, `atan(x)` with $[-1, 1]$ domain enforcement.
- **Logarithms**: Base-10 (`log10`) and natural (`ln`) requiring $x > 0$.
- **Powers & Roots**: $x^2$, $x^3$, $x^y$, $\sqrt{x}$, $\sqrt[3]{x}$.
- **Special Functions**: Reciprocal $1/x$, absolute value $|x|$, factorial $x!$ ($0 \le n \le 170$), constants $\pi$ and $e$.

---

## 6. Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `0` – `9` | Digit entry |
| `.` | Decimal separator |
| `+`, `-`, `*`, `/` | Basic arithmetic operators |
| `^` | Exponentiation |
| `%` | Percentage |
| `(`, `)` | Parentheses |
| `Enter` or `=` | Execute calculation |
| `Backspace` | Delete last entered character |
| `Escape` | All Clear (AC) |
| `Ctrl + H` / `⌘H` | Open / toggle calculation history |
| `Ctrl + Shift + C` | Copy current result to clipboard |

---

## 7. Database & Row Level Security (RLS)

The database migration script is provided in `supabase/migrations/001_initial_schema.sql`.

### Tables
1. `profiles`: `id`, `display_name`, `role` (`member` | `admin`), `created_at`, `updated_at`
2. `calculation_history`: `id`, `user_id`, `expression`, `result`, `numeric_result`, `mode`, `angle_mode`, `created_at`
3. `saved_calculations`: `id`, `user_id`, `title`, `expression`, `result`, `mode`, `angle_mode`, `created_at`
4. `user_preferences`: `user_id`, `theme`, `calculator_mode`, `angle_mode`, `max_stored_history`
5. `admin_activity`: `id`, `actor_user_id`, `action`, `target_type`, `target_id`, `metadata`, `created_at`
6. `app_config`: Global application settings accessible to public read and admin update.

### Security Guarantees
- Users can view and mutate **only their own** calculations and bookmarks.
- Users **cannot** self-assign or elevate their role to `admin`.
- Administrators are authenticated server-side via Supabase `auth.uid()` and the `is_admin()` SQL security definer.

---

## 8. Installation & Local Development

### Prerequisites
- Node.js (v18+)
- npm

### Setup
```bash
# Clone the repository
git clone https://github.com/your-username/CodeAlpha_Calculator.git
cd CodeAlpha_Calculator

# Install dependencies
npm install

# (Optional) Configure Supabase credentials in .env
cp .env.example .env
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# Start Vite development server on port 3000
npm run dev
```

### Production Build
```bash
npm run build
```

---

## 9. Verification & Test Suite

Calcora includes an automated test runner accessible via the Features page (`/features`) or directly imported from `src/calculator/test-engine.ts`. Tests include:
- Arithmetic correctness (`25 + 15 = 40`, `25 - 15 = 10`, `12 * 8 = 96`, `100 / 4 = 25`)
- Precedence checks (`7 + 2 * 3 = 13`)
- Decimal floating-point accuracy (`0.1 + 0.2 = 0.3`)
- Negatives (`-5 + 8 = 3`)
- Parenthesized algebra (`(2 + 3) * 4 = 20`)
- Percentage expansion (`100 + 10% = 110`, `50% = 0.5`)
- Domain boundaries (division by zero, negative square roots, logarithms of zero)
- Trigonometry (`sin 30° = 0.5`, `cos 60° = 0.5`, `tan 45° = 1`)
- Exponentiation & Factorial (`2^3 = 8`, `5! = 120`)

---

## 10. License

Released under the MIT License. Developed for CodeAlpha and portfolio submission.
