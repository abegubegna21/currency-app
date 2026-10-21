import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import { getCurrencyInfo, POPULAR_CURRENCIES } from './currencyData';
import CurrencyModal from './CurrencyModal';
import HelpModal from './HelpModal';
import TrendChart from './TrendChart';
import {
  IconSwap,
  IconStar,
  IconHistory,
  IconRates,
  IconConvert,
  IconSearch,
  IconDownload,
  IconTrash,
  IconCopy,
  IconCheck,
  IconSun,
  IconMoon,
  IconSparkles,
  IconHelp
} from './Icons';

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('ETB');
  const [rates, setRates] = useState({});
  const [loadingRates, setLoadingRates] = useState(true);
  const [rateUpdateTime, setRateUpdateTime] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState('converter'); // 'converter', 'rates', 'favorites', 'history'
  const [theme, setTheme] = useState(() => localStorage.getItem('zenith_theme') || 'dark');
  const [invertRate, setInvertRate] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Modal State
  const [modalState, setModalState] = useState({ isOpen: false, target: null, title: '' });
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Rates tab state
  const [ratesSearch, setRatesSearch] = useState('');
  const [ratesCategory, setRatesCategory] = useState('All');
  const [ratesSort, setRatesSort] = useState('code-asc');

  // Multi-currency comparison list
  const comparisonCurrencies = ['EUR', 'GBP', 'ETB', 'JPY', 'CAD', 'AED', 'CNY', 'CHF'];

  // Toast notification helper
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  }, []);

  // Sync theme
  useEffect(() => {
    localStorage.setItem('zenith_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Fetch live rates when 'fromCurrency' changes
  const fetchRates = useCallback(async (base) => {
    setLoadingRates(true);
    try {
      const response = await axios.get(`${API_BASE}/rates?base=${base}`);
      if (response.data && response.data.rates) {
        setRates(response.data.rates);
        setRateUpdateTime(response.data.time_last_update_utc || new Date().toUTCString());
      }
    } catch (error) {
      console.error("Error fetching rates:", error);
      addToast("Could not fetch latest rates. Retrying...", "error");
    } finally {
      setLoadingRates(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchRates(fromCurrency);
  }, [fromCurrency, fetchRates]);

  // Fetch history and favorites on initial load
  const fetchHistory = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/history?limit=50`);
      setHistory(response.data || []);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  }, []);

  const fetchFavorites = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/favorites`);
      setFavorites(response.data || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
    fetchFavorites();
  }, [fetchHistory, fetchFavorites]);

  // Real-time calculation effect
  useEffect(() => {
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount) && rates[toCurrency]) {
      const calc = (numAmount * rates[toCurrency]).toFixed(2);
      setResult(calc);
    } else {
      setResult(null);
    }
  }, [amount, toCurrency, rates]);

  // Explicit convert & record to history
  const handleConvert = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      addToast("Please enter a valid amount", "warning");
      return;
    }
    if (!rates[toCurrency]) {
      addToast("Rate not available yet", "warning");
      return;
    }

    const convertedAmount = (numAmount * rates[toCurrency]).toFixed(2);
    setResult(convertedAmount);

    try {
      await axios.post(`${API_BASE}/history`, {
        from_currency: fromCurrency,
        to_currency: toCurrency,
        amount: numAmount,
        result: parseFloat(convertedAmount)
      });
      fetchHistory();
      addToast(`Converted ${numAmount} ${fromCurrency} → ${convertedAmount} ${toCurrency}`);
    } catch (error) {
      console.error("Error saving history:", error);
    }
  };

  // Swap currencies with animation
  const handleSwap = () => {
    setIsSwapping(true);
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setTimeout(() => setIsSwapping(false), 450);
  };

  // Save or remove favorite
  const isCurrentPairFavorite = useMemo(() => {
    return favorites.some(
      f => f.from_currency === fromCurrency && f.to_currency === toCurrency
    );
  }, [favorites, fromCurrency, toCurrency]);

  const toggleFavorite = async () => {
    const existing = favorites.find(
      f => f.from_currency === fromCurrency && f.to_currency === toCurrency
    );

    if (existing) {
      try {
        await axios.delete(`${API_BASE}/favorites/${existing.id}`);
        setFavorites(prev => prev.filter(f => f.id !== existing.id));
        addToast(`Removed ${fromCurrency} / ${toCurrency} from favorites`, 'info');
      } catch (err) {
        console.error("Error deleting favorite:", err);
      }
    } else {
      try {
        const res = await axios.post(`${API_BASE}/favorites`, {
          from_currency: fromCurrency,
          to_currency: toCurrency
        });
        fetchFavorites();
        if (res.data?.alreadyExists) {
          addToast(`${fromCurrency} / ${toCurrency} is already in favorites`, 'info');
        } else {
          addToast(`Added ${fromCurrency} / ${toCurrency} to favorites ⭐`);
        }
      } catch (err) {
        console.error("Error saving favorite:", err);
      }
    }
  };

  const removeFavoriteById = async (id, e) => {
    e?.stopPropagation();
    try {
      await axios.delete(`${API_BASE}/favorites/${id}`);
      setFavorites(prev => prev.filter(f => f.id !== id));
      addToast("Favorite pair removed", 'info');
    } catch (err) {
      console.error("Error removing favorite:", err);
    }
  };

  const loadFavoriteInConverter = (fav) => {
    setFromCurrency(fav.from_currency);
    setToCurrency(fav.to_currency);
    setActiveTab('converter');
    addToast(`Loaded ${fav.from_currency} / ${fav.to_currency}`);
  };

  // Delete single history item
  const deleteHistoryItem = async (id, e) => {
    e?.stopPropagation();
    try {
      await axios.delete(`${API_BASE}/history/${id}`);
      setHistory(prev => prev.filter(h => h.id !== id));
      addToast("Conversion entry removed", 'info');
    } catch (err) {
      console.error("Error removing history item:", err);
    }
  };

  // Clear all history
  const clearAllHistory = async () => {
    if (history.length === 0) return;
    if (!window.confirm("Are you sure you want to clear your conversion history?")) return;
    try {
      await axios.delete(`${API_BASE}/history`);
      setHistory([]);
      addToast("Conversion history cleared", 'info');
    } catch (err) {
      console.error("Error clearing history:", err);
    }
  };

  // Export history to CSV
  const exportToCSV = () => {
    if (history.length === 0) {
      addToast("No conversion history to export", "warning");
      return;
    }
    const headers = "ID,From Currency,To Currency,Amount,Result,Timestamp\n";
    const csvRows = history.map(h =>
      `"${h.id}","${h.from_currency}","${h.to_currency}","${h.amount}","${h.result}","${new Date(h.created_at).toLocaleString()}"`
    ).join("\n");

    const blob = new Blob([headers + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute("href", url);
    a.setAttribute("download", `zenith_fx_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    addToast("CSV export downloaded successfully!");
  };

  // Copy result to clipboard
  const copyResultToClipboard = () => {
    if (!result) return;
    const text = `${amount} ${fromCurrency} = ${result} ${toCurrency} (Rate: 1 ${fromCurrency} = ${rates[toCurrency]} ${toCurrency})`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      addToast("Rate copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Preset amount handler
  const handlePresetAmount = (presetVal) => {
    setAmount(presetVal.toString());
  };

  // Available currency codes
  const availableCurrencyCodes = useMemo(() => {
    const keys = Object.keys(rates);
    if (keys.length === 0) return ['USD', 'EUR', 'GBP', 'ETB', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'AED'];
    return keys.sort();
  }, [rates]);

  // Open modal
  const openModal = (target, title) => {
    setModalState({ isOpen: true, target, title });
  };

  const handleSelectCurrency = (code) => {
    if (modalState.target === 'from') {
      setFromCurrency(code);
    } else if (modalState.target === 'to') {
      setToCurrency(code);
    }
    setModalState({ isOpen: false, target: null, title: '' });
  };

  // Currency Info Objects
  const fromInfo = getCurrencyInfo(fromCurrency);
  const toInfo = getCurrencyInfo(toCurrency);
  const currentRate = rates[toCurrency] || 1;
  const inverseRate = currentRate > 0 ? (1 / currentRate) : 0;

  // Filtered rates list for the Rates Explorer tab
  const filteredRates = useMemo(() => {
    const query = ratesSearch.toLowerCase().trim();
    let entries = Object.entries(rates);

    // Filter by query
    if (query) {
      entries = entries.filter(([code]) => {
        const info = getCurrencyInfo(code);
        return code.toLowerCase().includes(query) || info.name.toLowerCase().includes(query);
      });
    }

    // Filter by category
    if (ratesCategory !== 'All') {
      if (ratesCategory === 'Popular') {
        entries = entries.filter(([code]) => POPULAR_CURRENCIES.includes(code));
      } else {
        entries = entries.filter(([code]) => {
          const info = getCurrencyInfo(code);
          return info.region === ratesCategory;
        });
      }
    }

    // Sort
    entries.sort((a, b) => {
      if (ratesSort === 'code-asc') return a[0].localeCompare(b[0]);
      if (ratesSort === 'code-desc') return b[0].localeCompare(a[0]);
      if (ratesSort === 'rate-desc') return b[1] - a[1];
      if (ratesSort === 'rate-asc') return a[1] - b[1];
      return 0;
    });

    return entries;
  }, [rates, ratesSearch, ratesCategory, ratesSort]);

  return (
    <div className="zenith-app">
      {/* Toast notifications */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast-pill toast-${toast.type}`}>
            <span className="toast-dot" />
            <span className="toast-text">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Currency Picker Modal */}
      <CurrencyModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        currentCode={modalState.target === 'from' ? fromCurrency : toCurrency}
        availableCodes={availableCurrencyCodes}
        onSelect={handleSelectCurrency}
        onClose={() => setModalState({ isOpen: false, target: null, title: '' })}
      />

      {/* Help & User Guide Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Top Header */}
      <header className="zenith-header">
        <div className="header-brand">
          <div className="brand-gem">
            <IconSparkles size={20} />
          </div>
          <div className="brand-text">
            <span className="brand-name">Zenith<span className="brand-accent">FX</span></span>
            <span className="brand-tagline">Currency Intelligence</span>
          </div>
        </div>

        {/* Live Ticker Bar */}
        <div className="header-ticker">
          <span className="live-status-pill">
            <span className="pulse-indicator" /> LIVE RATES
          </span>
          <div className="ticker-scroll">
            {['EUR', 'GBP', 'ETB', 'JPY', 'CAD'].map(code => (
              <span key={code} className="ticker-pair">
                {fromCurrency}/{code}: <strong>{rates[code] ? rates[code].toFixed(3) : '...'}</strong>
              </span>
            ))}
          </div>
        </div>

        {/* Theme and Actions */}
        <div className="header-actions">
          <button
            className="help-toggle-btn"
            onClick={() => setIsHelpOpen(true)}
            title="Help & User Guide"
            aria-label="Help & User Guide"
          >
            <IconHelp size={18} />
            <span className="help-toggle-label">Help</span>
          </button>
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
            <span className="theme-toggle-label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="zenith-layout">
        {/* Navigation Sidebar */}
        <aside className="zenith-sidebar">
          <nav className="nav-menu">
            <button
              className={`nav-btn ${activeTab === 'converter' ? 'active' : ''}`}
              onClick={() => setActiveTab('converter')}
            >
              <IconConvert size={18} />
              <span>Converter</span>
            </button>
            <button
              className={`nav-btn ${activeTab === 'rates' ? 'active' : ''}`}
              onClick={() => setActiveTab('rates')}
            >
              <IconRates size={18} />
              <span>Live Rates</span>
              <span className="badge-count">{Object.keys(rates).length || 166}</span>
            </button>
            <button
              className={`nav-btn ${activeTab === 'favorites' ? 'active' : ''}`}
              onClick={() => setActiveTab('favorites')}
            >
              <IconStar size={18} filled={activeTab === 'favorites'} />
              <span>Favorites</span>
              {favorites.length > 0 && <span className="badge-count gold">{favorites.length}</span>}
            </button>
            <button
              className={`nav-btn ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <IconHistory size={18} />
              <span>History</span>
              {history.length > 0 && <span className="badge-count">{history.length}</span>}
            </button>
          </nav>

          {/* Quick Summary Card in Sidebar */}
          <div className="sidebar-fx-card">
            <div className="fx-card-header">
              <span className="fx-label">Base Reference</span>
              <span className="fx-flag">{fromInfo.flag}</span>
            </div>
            <div className="fx-base-val">1 {fromCurrency}</div>
            <div className="fx-mini-rates">
              <div className="fx-row">
                <span>EUR</span>
                <strong>{rates['EUR'] ? rates['EUR'].toFixed(4) : '--'}</strong>
              </div>
              <div className="fx-row">
                <span>GBP</span>
                <strong>{rates['GBP'] ? rates['GBP'].toFixed(4) : '--'}</strong>
              </div>
              <div className="fx-row">
                <span>ETB</span>
                <strong>{rates['ETB'] ? rates['ETB'].toFixed(2) : '--'}</strong>
              </div>
            </div>
          </div>
        </aside>

        {/* Workspace Body */}
        <main className="zenith-content">

          {/* TAB 1: SMART CONVERTER */}
          {activeTab === 'converter' && (
            <div className="converter-view fade-in-up">
              
              {/* Main Card */}
              <div className="zenith-card converter-card">
                <div className="card-top-bar">
                  <div>
                    <h2 className="card-heading">Currency Converter</h2>
                    <p className="card-subheading">Accurate, real-time mid-market foreign exchange calculations</p>
                  </div>
                  <button
                    className={`favorite-action-btn ${isCurrentPairFavorite ? 'active' : ''}`}
                    onClick={toggleFavorite}
                    title={isCurrentPairFavorite ? "Remove from favorites" : "Save to favorites"}
                  >
                    <IconStar size={18} filled={isCurrentPairFavorite} />
                    <span>{isCurrentPairFavorite ? "Favorited" : "Favorite"}</span>
                  </button>
                </div>

                {/* Amount Input Section */}
                <div className="amount-section">
                  <div className="label-row">
                    <label htmlFor="amount-input">Enter Amount</label>
                    <span className="cur-symbol-indicator">{fromInfo.symbol}</span>
                  </div>
                  <div className="input-with-symbol">
                    <span className="input-prefix">{fromInfo.symbol || '$'}</span>
                    <input
                      id="amount-input"
                      type="number"
                      min="0"
                      step="any"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>

                  {/* Quick Preset Amount Chips */}
                  <div className="preset-chips">
                    {[10, 50, 100, 500, 1000, 5000].map(val => (
                      <button
                        key={val}
                        className={`chip-btn ${amount === val.toString() ? 'active' : ''}`}
                        onClick={() => handlePresetAmount(val)}
                      >
                        +{val.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Currency Selector Deck */}
                <div className="currency-selector-deck">
                  {/* FROM BOX */}
                  <div className="currency-box" onClick={() => openModal('from', 'Convert From Currency')}>
                    <span className="box-label">From</span>
                    <div className="cur-pill">
                      <span className="cur-pill-flag">{fromInfo.flag}</span>
                      <div className="cur-pill-text">
                        <strong className="cur-pill-code">{fromCurrency}</strong>
                        <span className="cur-pill-name">{fromInfo.name}</span>
                      </div>
                      <span className="cur-pill-arrow">▾</span>
                    </div>
                  </div>

                  {/* SWAP BUTTON */}
                  <button
                    className={`swap-center-btn ${isSwapping ? 'spinning' : ''}`}
                    onClick={handleSwap}
                    title="Swap Currencies"
                    aria-label="Swap Currencies"
                  >
                    <IconSwap size={20} />
                  </button>

                  {/* TO BOX */}
                  <div className="currency-box" onClick={() => openModal('to', 'Convert To Currency')}>
                    <span className="box-label">To</span>
                    <div className="cur-pill">
                      <span className="cur-pill-flag">{toInfo.flag}</span>
                      <div className="cur-pill-text">
                        <strong className="cur-pill-code">{toCurrency}</strong>
                        <span className="cur-pill-name">{toInfo.name}</span>
                      </div>
                      <span className="cur-pill-arrow">▾</span>
                    </div>
                  </div>
                </div>

                {/* Conversion Trigger and Controls */}
                <div className="convert-action-row">
                  <button className="primary-convert-btn" onClick={handleConvert}>
                    <IconConvert size={18} />
                    <span>Convert Now</span>
                  </button>
                </div>

                {/* Result Display Box */}
                {result && (
                  <div className="result-display-panel fade-in-up">
                    <div className="result-header">
                      <span className="result-tag">Converted Total</span>
                      <div className="result-actions">
                        <button
                          className="copy-btn"
                          onClick={copyResultToClipboard}
                          title="Copy Result"
                        >
                          {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                          <span>{copied ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                    </div>

                    <div className="result-main-val">
                      <span className="result-amt">{parseFloat(amount || 0).toLocaleString()} {fromCurrency} =</span>
                      <h1 className="result-huge-number">
                        {toInfo.symbol} {parseFloat(result).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="to-code">{toCurrency}</span>
                      </h1>
                    </div>

                    <div className="rate-ratio-bar">
                      <span className="ratio-text">
                        {invertRate ? (
                          <>1 {toCurrency} = <strong>{inverseRate.toFixed(6)}</strong> {fromCurrency}</>
                        ) : (
                          <>1 {fromCurrency} = <strong>{currentRate.toFixed(4)}</strong> {toCurrency}</>
                        )}
                      </span>
                      <button
                        className="invert-btn"
                        onClick={() => setInvertRate(!invertRate)}
                        title="Invert Exchange Rate"
                      >
                        ⇄ Invert
                      </button>
                    </div>

                    {rateUpdateTime && (
                      <div className="rate-timestamp">
                        <span>● Market Data Updated: {new Date(rateUpdateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Side Panels: Multi-currency overview & 7-Day Trend */}
              <div className="converter-side-col">
                {/* 7-Day Trend Chart */}
                <TrendChart
                  fromCurrency={fromCurrency}
                  toCurrency={toCurrency}
                  currentRate={currentRate}
                />

                {/* Multi-Currency Matrix */}
                <div className="multi-matrix-card">
                  <div className="matrix-title">
                    <span className="matrix-heading">Global Comparison</span>
                    <span className="matrix-sub">{amount || 1} {fromCurrency} in Major FX</span>
                  </div>

                  <div className="matrix-list">
                    {comparisonCurrencies
                      .filter(code => code !== fromCurrency)
                      .slice(0, 6)
                      .map(code => {
                        const rate = rates[code];
                        const info = getCurrencyInfo(code);
                        const val = rate ? (parseFloat(amount || 1) * rate).toFixed(2) : '--';
                        return (
                          <div
                            key={code}
                            className="matrix-item"
                            onClick={() => setToCurrency(code)}
                            title={`Switch target to ${code}`}
                          >
                            <div className="matrix-item-left">
                              <span className="matrix-flag">{info.flag}</span>
                              <div className="matrix-text">
                                <strong>{code}</strong>
                                <span className="matrix-curname">{info.name}</span>
                              </div>
                            </div>
                            <div className="matrix-item-right">
                              <span className="matrix-val">{info.symbol} {parseFloat(val).toLocaleString()}</span>
                              <span className="matrix-rate">1 {fromCurrency} = {rate ? rate.toFixed(3) : '--'}</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: LIVE RATES EXPLORER */}
          {activeTab === 'rates' && (
            <div className="rates-explorer-view fade-in-up">
              <div className="rates-controls-bar">
                <div className="base-selector-wrap">
                  <span className="control-label">Base Currency:</span>
                  <button
                    className="base-picker-pill"
                    onClick={() => openModal('from', 'Select Base Currency')}
                  >
                    <span className="picker-flag">{fromInfo.flag}</span>
                    <strong className="picker-code">{fromCurrency}</strong>
                    <span className="picker-name">({fromInfo.name})</span>
                    <span className="picker-arrow">▾</span>
                  </button>
                </div>

                {/* Search Bar */}
                <div className="rates-search-input-wrap">
                  <IconSearch size={18} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search 160+ currencies by name or ISO code..."
                    value={ratesSearch}
                    onChange={(e) => setRatesSearch(e.target.value)}
                  />
                  {ratesSearch && (
                    <button className="clear-btn" onClick={() => setRatesSearch('')}>✕</button>
                  )}
                </div>

                {/* Sort Selector */}
                <div className="rates-sort-wrap">
                  <label htmlFor="sort-select">Sort:</label>
                  <select
                    id="sort-select"
                    value={ratesSort}
                    onChange={(e) => setRatesSort(e.target.value)}
                  >
                    <option value="code-asc">Code (A → Z)</option>
                    <option value="code-desc">Code (Z → A)</option>
                    <option value="rate-desc">Highest Rate</option>
                    <option value="rate-asc">Lowest Rate</option>
                  </select>
                </div>
              </div>

              {/* Category Filter Chips */}
              <div className="rates-category-tabs">
                {['All', 'Popular', 'Africa', 'Europe', 'Americas', 'Asia', 'Middle East'].map(cat => (
                  <button
                    key={cat}
                    className={`cat-pill ${ratesCategory === cat ? 'active' : ''}`}
                    onClick={() => setRatesCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Rates Grid */}
              {loadingRates ? (
                <div className="loading-state">
                  <div className="spinner" />
                  <p>Fetching real-time exchange rates...</p>
                </div>
              ) : filteredRates.length === 0 ? (
                <div className="empty-rates-state">
                  <span>🔍</span>
                  <h3>No currencies match your filter</h3>
                  <p>Try clearing your search term or selecting "All" categories.</p>
                </div>
              ) : (
                <div className="rates-dynamic-grid">
                  {filteredRates.map(([code, rate]) => {
                    const info = getCurrencyInfo(code);
                    const isFav = favorites.some(
                      f => f.from_currency === fromCurrency && f.to_currency === code
                    );

                    return (
                      <div key={code} className="rate-card">
                        <div className="rate-card-top">
                          <div className="cur-flag-wrap">
                            <span className="rate-flag">{info.flag}</span>
                            <div>
                              <div className="rate-code-text">
                                <strong>{code}</strong>
                                {info.symbol && <span className="rate-sym">({info.symbol})</span>}
                              </div>
                              <span className="rate-fullname">{info.name}</span>
                            </div>
                          </div>
                          <button
                            className={`star-icon-btn ${isFav ? 'active' : ''}`}
                            onClick={async () => {
                              if (isFav) {
                                const item = favorites.find(f => f.from_currency === fromCurrency && f.to_currency === code);
                                if (item) removeFavoriteById(item.id);
                              } else {
                                await axios.post(`${API_BASE}/favorites`, {
                                  from_currency: fromCurrency,
                                  to_currency: code
                                });
                                fetchFavorites();
                                addToast(`Added ${fromCurrency} / ${code} to favorites ⭐`);
                              }
                            }}
                            title={isFav ? "Remove favorite" : "Save as favorite"}
                          >
                            <IconStar size={16} filled={isFav} />
                          </button>
                        </div>

                        <div className="rate-card-middle">
                          <div className="rate-val-number">
                            {typeof rate === 'number' ? rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : rate}
                          </div>
                          <span className="rate-unit">1 {fromCurrency} = {rate.toFixed(4)} {code}</span>
                        </div>

                        <div className="rate-card-bottom">
                          <button
                            className="rate-action-btn"
                            onClick={() => {
                              setToCurrency(code);
                              setActiveTab('converter');
                              addToast(`Converted to ${code}`);
                            }}
                          >
                            Convert with {code} →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FAVORITES */}
          {activeTab === 'favorites' && (
            <div className="favorites-view fade-in-up">
              <div className="section-header-row">
                <div>
                  <h2 className="section-title">Saved Currency Pairs</h2>
                  <p className="section-desc">Quickly access, monitor, and trade your favorite currency pairs.</p>
                </div>
                <button
                  className="quick-add-btn"
                  onClick={() => openModal('to', 'Add Favorite Currency')}
                >
                  + Add New Pair
                </button>
              </div>

              {favorites.length === 0 ? (
                <div className="empty-favorites-card">
                  <div className="empty-star-icon">⭐</div>
                  <h3>No Favorite Pairs Saved</h3>
                  <p>Click the star icon in the Converter or Live Rates tab to keep your essential pairs right here.</p>
                  <button className="primary-cta-btn" onClick={() => setActiveTab('converter')}>
                    Go to Converter
                  </button>
                </div>
              ) : (
                <div className="favorites-grid">
                  {favorites.map(fav => {
                    const fromInf = getCurrencyInfo(fav.from_currency);
                    const toInf = getCurrencyInfo(fav.to_currency);
                    const pairRate = rates[fav.to_currency];

                    return (
                      <div key={fav.id} className="favorite-card">
                        <div className="fav-card-header">
                          <div className="fav-flags-pair">
                            <span className="fav-flag">{fromInf.flag}</span>
                            <span className="fav-arrow">⇄</span>
                            <span className="fav-flag">{toInf.flag}</span>
                          </div>
                          <button
                            className="fav-delete-btn"
                            onClick={(e) => removeFavoriteById(fav.id, e)}
                            title="Remove Favorite"
                          >
                            <IconTrash size={16} />
                          </button>
                        </div>

                        <div className="fav-pair-names">
                          <h3>{fav.from_currency} / {fav.to_currency}</h3>
                          <span className="fav-names-sub">{fromInf.name} to {toInf.name}</span>
                        </div>

                        <div className="fav-rate-metric">
                          {fav.from_currency === fromCurrency && pairRate ? (
                            <div className="live-metric">
                              <span className="metric-rate">1 {fav.from_currency} = {pairRate.toFixed(4)} {fav.to_currency}</span>
                              <span className="metric-pill">Live</span>
                            </div>
                          ) : (
                            <span className="metric-note">Base: {fav.from_currency}</span>
                          )}
                        </div>

                        <div className="fav-card-actions">
                          <button
                            className="fav-use-btn"
                            onClick={() => loadFavoriteInConverter(fav)}
                          >
                            Use in Converter →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: HISTORY & AUDIT LOG */}
          {activeTab === 'history' && (
            <div className="history-view fade-in-up">
              <div className="section-header-row">
                <div>
                  <h2 className="section-title">Conversion History</h2>
                  <p className="section-desc">Record of past exchange transactions and calculations.</p>
                </div>
                <div className="history-head-actions">
                  {history.length > 0 && (
                    <>
                      <button className="history-btn outline" onClick={clearAllHistory}>
                        <IconTrash size={16} />
                        <span>Clear All</span>
                      </button>
                      <button className="history-btn export" onClick={exportToCSV}>
                        <IconDownload size={16} />
                        <span>Export CSV</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {history.length === 0 ? (
                <div className="empty-history-card">
                  <div className="empty-hist-icon">📜</div>
                  <h3>No History Yet</h3>
                  <p>Perform a conversion using the Converter tab to log your calculations here.</p>
                  <button className="primary-cta-btn" onClick={() => setActiveTab('converter')}>
                    Make First Conversion
                  </button>
                </div>
              ) : (
                <div className="history-list-wrapper">
                  <table className="zenith-table">
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>Exchange Pair</th>
                        <th>From Amount</th>
                        <th>Converted Result</th>
                        <th>Quick Action</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map(item => {
                        const fInfo = getCurrencyInfo(item.from_currency);
                        const tInfo = getCurrencyInfo(item.to_currency);
                        const formattedDate = new Date(item.created_at).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        });

                        return (
                          <tr key={item.id} className="history-row">
                            <td className="hist-time">{formattedDate}</td>
                            <td className="hist-pair">
                              <span className="pair-flags">{fInfo.flag} → {tInfo.flag}</span>
                              <strong className="pair-codes">{item.from_currency} / {item.to_currency}</strong>
                            </td>
                            <td className="hist-amount">
                              {fInfo.symbol} {parseFloat(item.amount).toLocaleString()} {item.from_currency}
                            </td>
                            <td className="hist-result">
                              <span className="result-highlight">
                                {tInfo.symbol} {parseFloat(item.result).toLocaleString()} {item.to_currency}
                              </span>
                            </td>
                            <td>
                              <button
                                className="table-repeat-btn"
                                onClick={() => {
                                  setAmount(item.amount.toString());
                                  setFromCurrency(item.from_currency);
                                  setToCurrency(item.to_currency);
                                  setActiveTab('converter');
                                  addToast(`Loaded ${item.amount} ${item.from_currency} → ${item.to_currency}`);
                                }}
                              >
                                Re-run ↺
                              </button>
                            </td>
                            <td>
                              <button
                                className="table-delete-btn"
                                onClick={(e) => deleteHistoryItem(item.id, e)}
                                title="Delete record"
                              >
                                <IconTrash size={15} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default App;