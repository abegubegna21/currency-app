import React, { useEffect } from 'react';
import { IconConvert, IconRates, IconStar, IconHistory } from './Icons';

export default function HelpModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window help-modal-window" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-badge">User Guide</span>
            <h3>How to Use ⚓ መልህቅFX</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close help modal">✕</button>
        </div>

        <div className="help-modal-body">
          {/* Welcome Banner */}
          <div className="help-hero">
            <div className="help-hero-icon">
              <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>⚓</span>
            </div>
            <div>
              <h4>Welcome to ⚓ መልህቅFX Intelligence</h4>
              <p>Your real-time platform for currency conversions, live market rates, and foreign exchange history.</p>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="help-features-grid">
            <div className="help-feature-card">
              <div className="feature-card-header">
                <span className="feature-icon emerald">
                  <IconConvert size={18} />
                </span>
                <strong>Smart Converter</strong>
              </div>
              <p>
                Enter an amount or tap quick presets (<strong>+50</strong>, <strong>+100</strong>, <strong>+500</strong>).
                Use the <strong>Swap (↔)</strong> button to quickly switch currencies, or <strong>Invert (⇄)</strong> to see the reverse rate.
              </p>
            </div>

            <div className="help-feature-card">
              <div className="feature-card-header">
                <span className="feature-icon emerald">
                  <IconRates size={18} />
                </span>
                <strong>7-Day Trajectory & Matrix</strong>
              </div>
              <p>
                Hover over the 7-day vector curve to inspect daily price movement. The Global FX Matrix compares your amount across 6 top world currencies simultaneously.
              </p>
            </div>

            <div className="help-feature-card">
              <div className="feature-card-header">
                <span className="feature-icon gold">
                  <IconStar size={18} filled />
                </span>
                <strong>Favorites & Live Monitoring</strong>
              </div>
              <p>
                Star any pair by clicking the <strong>Favorite</strong> button. Access all your saved pairs in the Favorites tab and load them into the converter with 1 click.
              </p>
            </div>

            <div className="help-feature-card">
              <div className="feature-card-header">
                <span className="feature-icon emerald">
                  <IconHistory size={18} />
                </span>
                <strong>History & CSV Export</strong>
              </div>
              <p>
                Every conversion is saved to the database. Review past transactions, re-run previous calculations, or click <strong>Export CSV</strong> to download a spreadsheet.
              </p>
            </div>
          </div>

          {/* Quick FAQ Section */}
          <div className="help-faq-section">
            <h5>💡 Frequently Asked Questions</h5>
            <div className="faq-item">
              <strong>What rates are shown?</strong>
              <p>Rates are real-time, mid-market foreign exchange rates aggregated from global banking and liquidity providers via ER-API.</p>
            </div>
            <div className="faq-item">
              <strong>How do I switch themes?</strong>
              <p>Click the <strong>Light / Dark</strong> button in the top right header to switch between Emerald Obsidian (dark) and Mint Alabaster (light).</p>
            </div>
          </div>
        </div>

        <div className="help-modal-footer">
          <button className="help-primary-btn" onClick={onClose}>
            Got It, Thanks!
          </button>
        </div>
      </div>
    </div>
  );
}
