import { render, screen, fireEvent } from '@testing-library/react';
import { Search } from './Search';

import '@testing-library/jest-dom';

describe('Search', () => {
  const defaultProps = {
    query: '',
    onSearch: jest.fn(),
    resultsCount: 0,
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input', () => {
    render(<Search {...defaultProps} />);
    expect(screen.getByLabelText(/search for a smartphone/i)).toBeInTheDocument();
  });

  it('renders search input with placeholder', () => {
    render(<Search {...defaultProps} />);
    const input = screen.getByPlaceholderText('Search for a smartphone...');
    expect(input).toBeInTheDocument();
  });

  it('displays results count when not loading', () => {
    render(<Search {...defaultProps} resultsCount={5} loading={false} />);
    expect(screen.getByText('5 RESULTS')).toBeInTheDocument();
  });

  it('displays singular "RESULT" when count is 1', () => {
    render(<Search {...defaultProps} resultsCount={1} loading={false} />);
    expect(screen.getByText('1 RESULT')).toBeInTheDocument();
  });

  it('displays "Searching..." when loading', () => {
    render(<Search {...defaultProps} resultsCount={0} loading={true} />);
    expect(screen.getByText('Searching...')).toBeInTheDocument();
  });

  it('calls onSearch when input changes', () => {
    const onSearch = jest.fn();
    render(<Search {...defaultProps} onSearch={onSearch} />);
    const input = screen.getByLabelText(/search for a smartphone/i);
    fireEvent.change(input, { target: { value: 'iphone' } });
    expect(onSearch).toHaveBeenCalledWith('iphone');
  });

  it('uses the query value as input value', () => {
    render(<Search {...defaultProps} query="test query" />);
    const input = screen.getByLabelText(/search for a smartphone/i);
    expect(input).toHaveValue('test query');
  });
});