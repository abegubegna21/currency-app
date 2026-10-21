# ⚓ መልህቅFX — Real-Time Currency & Forex Intelligence Platform

A full-stack foreign exchange application featuring live market rates, an instant multi-currency converter, interactive 7-day SVG trend charts, MySQL database persistence for conversion history and favorites, and an **Emerald & Velvet Obsidian** design system (strictly zero blue hues).

---

## ✨ Features

- **⚡ Real-Time Currency Converter**:
  - Convert between 166+ world currencies with instant calculation.
  - Quick amount presets (`+10`, `+50`, `+100`, `+500`, `+1,000`, `+5,000`).
  - Animated 180° currency swap button (↔).
  - 1-click rate inversion (`⇄ Invert`).
  - Copy result to clipboard with visual confirmation.

- **📈 Interactive 7-Day Trend Chart**:
  - Lightweight vector SVG chart with smooth Bézier curves and emerald gradient fill.
  - Hover over daily points to inspect historical trajectory and percentage change.
  - Zero external chart dependencies for fast loading.

- **🌐 Global Multi-Currency Matrix**:
  - Live preview of your entered amount across major world currencies (`EUR`, `GBP`, `ETB`, `JPY`, `CAD`, `AED`, `CNY`, `CHF`) simultaneously.

- **🔍 Searchable Currency Modal**:
  - Filter 166+ currencies by ISO code, symbol, or currency/country name.
  - Regional category filters: *All, Popular, Africa, Europe, Americas, Asia, Middle East*.

- **⭐ Favorites Management**:
  - Bookmark frequent currency pairs with live exchange rate metrics.
  - Duplicate prevention with friendly notifications.
  - 1-click loading into the converter.

- **📜 Conversion History & CSV Export**:
  - Automatically logs every conversion to the MySQL database.
  - Relative timestamps and formatted figures.
  - Re-run past conversions with a single click.
  - Delete individual entries or clear all history.
  - Export full conversion audit log as a `.csv` file.

- **🎨 Emerald & Velvet Obsidian Design System (Zero Blue)**:
  - Curated luxury fintech aesthetic inspired by modern trading platforms.
  - Deep obsidian dark mode (`#080c10` / `#0e151c`) with luminous emerald green (`#10b981` / `#059669`) and champagne gold (`#fbbf24`).
  - Light mode toggle (*Mint & Alabaster*).

- **❓ Built-in Help & User Guide Modal**:
  - Clickable Help button in the top navigation header.
  - Interactive walkthrough of converter tools, presets, 7-day trajectory chart, matrix, and mid-market forex rate FAQs.

---

## 🛠️ Tech Stack

- **Frontend**:
  - [React 19](https://react.dev/)
  - Vanilla CSS with Design System Variables
  - Custom SVG Icons & Vector Components
  - [Axios](https://axios-http.com/)
- **Backend**:
  - [Node.js](https://nodejs.org/) & [Express 5](https://expressjs.com/)
  - [MySQL2](https://github.com/sidorares/node-mysql2) (Connection Pool with Promises)
  - `dotenv`, `cors`
- **Exchange Rate API**:
  - Real-time mid-market forex rates via [Open Exchange Rates API](https://open.er-api.com/)

---

## 📁 Project Structure

```
currency-app/
├── backend/
│   ├── .env                    # Database & port configurations
│   ├── db.js                   # MySQL connection pool
│   ├── index.js                # Express API server & routes
│   ├── package.json
│   └── test_all_features.js    # Automated end-to-end test suite
├── frontend/
│   ├── public/
│   │   └── index.html          # Web fonts & page metadata
│   ├── src/
│   │   ├── App.js              # Main application logic & tabs
│   │   ├── App.css             # Emerald & Obsidian design system
│   │   ├── App.test.js         # Jest unit tests
│   │   ├── CurrencyModal.js    # Searchable currency selector modal
│   │   ├── TrendChart.js       # Interactive 7-day SVG trend graph
│   │   ├── currencyData.js     # Currency metadata (flags, symbols, names)
│   │   ├── Icons.js            # Custom inline SVG icons
│   │   └── index.js
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **MySQL Server** (running locally or remotely)

---

### 2. Database Setup

1. Open your MySQL client (e.g. MySQL Workbench, phpMyAdmin, or terminal):
   ```sql
   CREATE DATABASE IF NOT EXISTS currency_db;
   USE currency_db;

   -- History Table
   CREATE TABLE IF NOT EXISTS history (
       id INT AUTO_INCREMENT PRIMARY KEY,
       from_currency VARCHAR(10) NOT NULL,
       to_currency VARCHAR(10) NOT NULL,
       amount DECIMAL(10,2) NOT NULL,
       result DECIMAL(10,2) NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Favorites Table
   CREATE TABLE IF NOT EXISTS favorites (
       id INT AUTO_INCREMENT PRIMARY KEY,
       from_currency VARCHAR(10) NOT NULL,
       to_currency VARCHAR(10) NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

2. Configure `backend/.env`:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=currency_db
   ```

---

### 3. Backend Setup & Launch

```bash
cd backend
npm install
node index.js
```
The backend will start at `http://localhost:5000`.

---

### 4. Frontend Setup & Launch

```bash
cd frontend
npm install
npm start
```
The frontend will open at `http://localhost:3000`.

---

## 📡 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check verification |
| `GET` | `/api/rates?base=USD` | Fetch live exchange rates for a given base currency |
| `POST` | `/api/history` | Log a conversion transaction (`from_currency`, `to_currency`, `amount`, `result`) |
| `GET` | `/api/history?limit=50` | Retrieve past conversion logs |
| `DELETE`| `/api/history/:id` | Delete a single history record |
| `DELETE`| `/api/history` | Clear entire conversion history |
| `POST` | `/api/favorites` | Save a currency pair to favorites (with duplicate check) |
| `GET` | `/api/favorites` | Retrieve all saved favorite pairs |
| `DELETE`| `/api/favorites/:id` | Remove a pair from favorites |

---

## 🧪 Testing

Run the automated 21-point test suite covering database connectivity, endpoints, frontend server, and color palette tokens:

```bash
cd backend
node test_all_features.js
```

Run frontend unit tests:
```bash
cd frontend
npm test -- --watchAll=false
```

---

## 📄 License
This project is open source and available under the [ISC License](LICENSE).
