import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  formatDuration,
  formatViewCount,
  formatDate,
  formatRating,
  truncateText,
} from '../formatUtils';

describe('formatDuration', () => {
  test('formats minutes under 60', () => {
    expect(formatDuration(10)).toBe('10 min');
  });

  test('formats exactly 60 minutes', () => {
    expect(formatDuration(60)).toBe('1h');
  });

  test('formats over 60 minutes', () => {
    expect(formatDuration(90)).toBe('1h 30m');
  });

  test('formats 0 minutes', () => {
    expect(formatDuration(0)).toBe('0 min');
  });

  test('formats 120 minutes', () => {
    expect(formatDuration(120)).toBe('2h');
  });

  test('formats 150 minutes', () => {
    expect(formatDuration(150)).toBe('2h 30m');
  });
});

describe('formatViewCount', () => {
  test('formats count under 1000', () => {
    expect(formatViewCount(500)).toBe('500');
  });

  test('formats count at 1000', () => {
    expect(formatViewCount(1000)).toBe('1.0K');
  });

  test('formats count between 1K and 10K', () => {
    expect(formatViewCount(1500)).toBe('1.5K');
  });

  test('formats count at 10K and above (no decimal)', () => {
    expect(formatViewCount(15000)).toBe('15K');
  });

  test('formats count at 1M', () => {
    expect(formatViewCount(1000000)).toBe('1.0M');
  });

  test('formats count at 1.5M', () => {
    expect(formatViewCount(1500000)).toBe('1.5M');
  });
});

describe('formatDate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-22T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('formats today', () => {
    expect(formatDate('2026-03-22T10:00:00Z')).toBe('Today');
  });

  test('formats yesterday', () => {
    expect(formatDate('2026-03-21T10:00:00Z')).toBe('Yesterday');
  });

  test('formats days ago', () => {
    expect(formatDate('2026-03-19T10:00:00Z')).toBe('3 days ago');
  });

  test('formats weeks ago', () => {
    expect(formatDate('2026-03-08T10:00:00Z')).toBe('2 weeks ago');
  });

  test('formats months ago', () => {
    expect(formatDate('2026-01-22T10:00:00Z')).toBe('1 months ago');
  });

  test('formats years ago', () => {
    expect(formatDate('2024-03-22T10:00:00Z')).toBe('2 years ago');
  });
});

describe('formatRating', () => {
  test('formats to one decimal place', () => {
    expect(formatRating(4.7)).toBe('4.7');
  });

  test('formats whole number', () => {
    expect(formatRating(5.0)).toBe('5.0');
  });

  test('truncates to one decimal', () => {
    expect(formatRating(3.123)).toBe('3.1');
  });
});

describe('truncateText', () => {
  test('returns short text unchanged', () => {
    expect(truncateText('Hello', 10)).toBe('Hello');
  });

  test('truncates long text with ellipsis', () => {
    expect(truncateText('Hello World, this is long', 10)).toBe('Hello Worl...');
  });

  test('returns text at exact length unchanged', () => {
    expect(truncateText('Hello', 5)).toBe('Hello');
  });
});
