import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders ZenithFX application brand and navigation', () => {
  render(<App />);
  const brandElements = screen.getAllByText(/Zenith/i);
  expect(brandElements.length).toBeGreaterThan(0);
  expect(screen.getByText(/Currency Converter/i)).toBeInTheDocument();
  expect(screen.getByText(/Live Rates/i)).toBeInTheDocument();
  expect(screen.getByText(/Favorites/i)).toBeInTheDocument();
  expect(screen.getByText(/History/i)).toBeInTheDocument();
});

test('renders amount input and preset chips', () => {
  render(<App />);
  const amountInput = screen.getByLabelText(/Enter Amount/i);
  expect(amountInput).toBeInTheDocument();
  expect(screen.getByText('+50')).toBeInTheDocument();
  expect(screen.getByText('+100')).toBeInTheDocument();
});

test('allows clicking preset chips to update amount', () => {
  render(<App />);
  const chip500 = screen.getByText('+500');
  fireEvent.click(chip500);
  const amountInput = screen.getByLabelText(/Enter Amount/i);
  expect(amountInput.value).toBe('500');
});

test('toggles theme between dark and light', () => {
  render(<App />);
  const themeBtn = screen.getByTitle(/switch to/i);
  expect(themeBtn).toBeInTheDocument();
  fireEvent.click(themeBtn);
  expect(document.documentElement.getAttribute('data-theme')).toBeTruthy();
});

test('renders help button and opens help modal', () => {
  render(<App />);
  const helpBtn = screen.getByLabelText(/Help & User Guide/i);
  expect(helpBtn).toBeInTheDocument();
  fireEvent.click(helpBtn);
  expect(screen.getByText(/How to Use ZenithFX/i)).toBeInTheDocument();
  expect(screen.getByText(/Got It, Thanks!/i)).toBeInTheDocument();
  fireEvent.click(screen.getByText(/Got It, Thanks!/i));
});

