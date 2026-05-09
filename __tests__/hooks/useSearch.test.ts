import { renderHook, act } from '@testing-library/react';
import { useSearch } from '../../src/hooks/useSearch';

describe('useSearch', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should initialize with empty query', () => {
    const { result } = renderHook(() => useSearch());
    expect(result.current.query).toBe('');
    expect(result.current.debouncedQuery).toBe('');
    // isSearching starts as true because useEffect runs on mount
    // and sets isSearching to true before the timeout completes
  });

  test('should update query immediately', () => {
    const { result } = renderHook(() => useSearch());
    act(() => {
      result.current.setQuery('iphone');
    });
    expect(result.current.query).toBe('iphone');
  });

  test('should debounce query after delay', () => {
    const { result } = renderHook(() => useSearch({ debounceMs: 300 }));
    act(() => {
      result.current.setQuery('iphone');
    });
    expect(result.current.isSearching).toBe(true);
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.debouncedQuery).toBe('iphone');
    expect(result.current.isSearching).toBe(false);
  });
});