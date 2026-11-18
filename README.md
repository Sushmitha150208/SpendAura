# SpendAura – Personal Expense Tracker

A vibrant, mindful, responsive personal expense tracking application built in strict accordance with the **SpendAura Software Requirements Specification (SRS)** and the provided **UI Template Design**.

---

## 🌟 Highlights & UI Design Fidelity

The application faithfully mirrors the provided dashboard design:
- **Soft Blush-Pink Aesthetic**: Soft pastel background (`#FCEDF0`), lavender (`#F3E8FF`), mint/teal (`#E0F7F6`), coral/peach (`#FFEAEA`), and cream (`#FEF7E6`) summary cards with plum/maroon (`#581C38`) primary accents.
- **Typography**: Elegant serif headings (*Playfair Display*) and modern geometric sans-serif numbers/body (*Plus Jakarta Sans*).
- **Hand-Crafted Vector Illustrations**:
  - Top header desk scene: books stacked, ceramic pencil cup, upright spiral calendar with checkmark, and trailing green pothos ivy leaves.
  - Sidebar bottom: decorative ceramic blush vase with eucalyptus leafy branches and pastel pink waves.
  - Goal card: sleek modern laptop with glowing sunset screen and celebratory sparks.
  - Donut chart center: twin green leaves icon with total expense.
- **Indian Rupee (₹) Currency**: Fully formatted with Indian numbering format (e.g. `₹ 18,450`, `₹ 35,000`, `₹ 16,550`, `₹ 60,000`).

---

## 🚀 Quick Start (Zero Setup Instant Preview)

You can run and interact with the complete application immediately without any build steps:

1. Double-click **`start_app.bat`** (or open **`SpendAura_Live.html`** directly in Chrome, Edge, or Firefox).
2. The entire interactive application runs in your browser with full local storage persistence, charts, filters, modals, and all 10 pages!

---

## 🛠️ Complete Tech Stack

### Frontend
- **Framework**: React.js 18 with Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React / SVG icons
- **State Management**: React Context (`AppContext`, `AuthContext`) + LocalStorage Service Layer
- **API Client**: Axios with JWT Bearer token integration

### Backend
- **Framework**: Python Django 4.2+ & Django REST Framework (DRF)
- **Database**: SQLite (dev) / PostgreSQL compatible
- **Authentication**: JWT via `djangorestframework-simplejwt`
- **CORS**: `django-cors-headers`

---

## 📂 Project Architecture

```
EXP-1/
├── SpendAura_Live.html         # Instant zero-setup browser app (all 10 pages + modals)
├── start_app.bat               # One-click launcher for live app
├── start_frontend.bat          # Launcher for React + Vite development server
├── start_backend.bat           # Launcher for Django REST API server
│
├── frontend/                   # Full modular React.js + Vite + Tailwind project
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── styles/index.css
│       ├── utils/formatters.js
│       ├── services/
│       │   ├── seedData.js
│       │   ├── storageService.js
│       │   └── apiService.js
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   └── AppContext.jsx
│       ├── components/
│       │   ├── Sidebar.jsx
│       │   ├── Header.jsx
│       │   ├── SummaryCards.jsx
│       │   ├── ExpenseDonutChart.jsx
│       │   ├── MonthlyOverviewChart.jsx
│       │   ├── RecentTransactions.jsx
│       │   ├── BudgetProgress.jsx
│       │   ├── GoalCard.jsx
│       │   ├── AddExpenseModal.jsx
│       │   ├── NotificationsDrawer.jsx
│       │   └── Illustrations.jsx
│       └── pages/
│           ├── Dashboard.jsx
│           ├── Transactions.jsx
│           ├── Budgets.jsx
│           ├── Categories.jsx
│           ├── Reports.jsx
│           ├── Goals.jsx
│           ├── Login.jsx
│           ├── SignUp.jsx
│           ├── ForgotPassword.jsx
│           └── Profile.jsx
│
└── backend/                    # Full Django REST Framework API project
    ├── manage.py
    ├── requirements.txt
    ├── spendaura/
    │   ├── settings.py
    │   ├── urls.py
    │   ├── wsgi.py
    │   └── asgi.py
    ├── authentication/
    │   ├── models.py
    │   ├── serializers.py
    │   ├── views.py
    │   └── urls.py
    └── expenses/
        ├── models.py
        ├── serializers.py
        ├── views.py
        ├── urls.py
        └── management/commands/
            └── seed_data.py
```

---

## 💻 Running the Modular React Frontend

When Node.js 18+ is available on your machine:

```bash
cd frontend
npm install
npm run dev
```
The frontend will start at `http://localhost:5173`.

---

## 🐍 Running the Django Backend API

When Python 3.10+ is available on your machine:

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```
The backend API will start at `http://localhost:8000/api/`.

### Planned REST Endpoints (Section 9.2)
- **Auth**: `POST /api/auth/register/`, `POST /api/auth/login/`, `GET/PUT /api/auth/profile/`
- **Transactions**: `GET, POST /api/transactions/`, `GET, PUT, DELETE /api/transactions/{id}/`
- **Categories**: `GET, POST /api/categories/`, `DELETE /api/categories/{id}/` (reassigns to *Others*)
- **Budgets**: `GET, POST /api/budgets/`, `PUT, DELETE /api/budgets/{id}/`
- **Goals**: `GET, POST /api/goals/`, `POST /api/goals/{id}/add_money/`
- **Summary**: `GET /api/summary/`
- **Reports**: `GET /api/reports/`
- **Notifications**: `GET, POST /api/notifications/`

---

## 📋 SRS Requirements Traceability Matrix

| Requirement | Description | Status |
|-------------|-------------|--------|
| **FR-1 & FR-2** | Register, Login, Demo one-click access | ✅ Implemented |
| **FR-3** | Forgot password email flow | ✅ Implemented |
| **FR-4** | Profile & Settings (currency, theme, export) | ✅ Implemented |
| **FR-5** | Total Balance, Income, Expense, Savings cards | ✅ Implemented |
| **FR-6** | Donut chart with category percentages & center total | ✅ Implemented |
| **FR-7** | Monthly Overview area chart with Income vs Expense | ✅ Implemented |
| **FR-8** | Recent 3 transactions with red/green indicator | ✅ Implemented |
| **FR-9** | Category budget progress bars | ✅ Implemented |
| **FR-10** | Active savings goal card with laptop art & progress | ✅ Implemented |
| **FR-12 & FR-13**| Add, edit, delete transactions with modal & validation | ✅ Implemented |
| **FR-14 & FR-15**| Filter by category, type, date, amount, sort & paginate | ✅ Implemented |
| **FR-16** | Receipt image attachment & preview | ✅ Implemented |
| **FR-17 - FR-19**| Monthly budgets per category with 80% & 100% alerts | ✅ Implemented |
| **FR-20 - FR-22**| Default & custom categories; delete moves items to Others | ✅ Implemented |
| **FR-23 - FR-25**| Weekly/monthly/yearly reports, MoM comparison, CSV & PDF export | ✅ Implemented |
| **FR-26 - FR-28**| Savings goals with progress, deposit, withdraw, celebration | ✅ Implemented |
| **FR-29 - FR-31**| Global search, notification bell with unread badge, LocalStorage | ✅ Implemented |
