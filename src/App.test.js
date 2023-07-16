import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Grow together by Real time collab with your code/i);
  expect(linkElement).toBeInTheDocument();
});
