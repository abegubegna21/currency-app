import React, { useState, useMemo, useEffect, useRef } from 'react';
import { getCurrencyInfo, POPULAR_CURRENCIES } from './currencyData';
import { IconSearch } from './Icons';

export default function CurrencyModal({ isOpen, onClose, onSelect, currentCode, availableCodes = [], title = "Select Currency" }) {
  const [search, setSearch] = useState('');
  const [activeRegion, setActiveRegion] = useState('All');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setActiveRegion('All');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const currencyList = useMemo(() => {
    return availableCodes.map(code => {
      const info = getCurrencyInfo(code);
      return {
        code,
        name: info.name,
        flag: info.flag,
        symbol: info.symbol,
        region: info.region,
        isPopular: POPULAR_CURRENCIES.includes(code)
      };
    });
  }, [availableCodes]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    return currencyList.filter(item => {
      const matchesSearch = !query ||
        item.code.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query) ||
        (item.symbol && item.symbol.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      if (activeRegion === 'All') return true;
      if (activeRegion === 'Popular') return item.isPopular;
      return item.region === activeRegion;
    });
  }, [currencyList, search, activeRegion]);

  if (!isOpen) return null;

  const regions = ['All', 'Popular', 'Africa', 'Europe', 'Americas', 'Asia', 'Middle East'];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-badge">ISO 4217</span>
            <h3>{title}</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">✕</button>
        </div>

        <div className="modal-search-bar">
          <IconSearch className="search-icon" size={18} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by code or currency name (e.g. USD, ETB, Euro)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="clear-search-btn" onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        <div className="modal-region-chips">
          {regions.map(r => (
            <button
              key={r}
              className={`region-chip ${activeRegion === r ? 'active' : ''}`}
              onClick={() => setActiveRegion(r)}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="modal-currency-list">
          {filtered.length === 0 ? (
            <div className="modal-empty-state">
              <span className="empty-icon">🔍</span>
              <p>No currencies found matching "{search}"</p>
            </div>
          ) : (
            filtered.map(item => {
              const isSelected = item.code === currentCode;
              return (
                <div
                  key={item.code}
                  className={`modal-currency-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    onSelect(item.code);
                    onClose();
                  }}
                >
                  <span className="cur-flag">{item.flag}</span>
                  <div className="cur-details">
                    <div className="cur-code-row">
                      <strong className="cur-code">{item.code}</strong>
                      {item.symbol && <span className="cur-symbol">{item.symbol}</span>}
                    </div>
                    <span className="cur-name">{item.name}</span>
                  </div>
                  {isSelected && <span className="cur-check">✓</span>}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
