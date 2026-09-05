import React from 'react';
import { renderHook } from '@testing-library/react';
import { TutorialProvider, TutorialContext } from '../TutorialContext';
import { describe, it, expect, beforeEach } from 'vitest';

const wrapper = ({ children }) => (
  <TutorialProvider>{children}</TutorialProvider>
);

describe('TutorialContext getFreshnessStatus', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('returns unknown consensus when there are no votes', () => {
    const { result } = renderHook(() => React.useContext(TutorialContext), { wrapper });
    const status = result.current.getFreshnessStatus('t1');
    expect(status).toEqual({
      worksCount: 0,
      outdatedCount: 0,
      consensus: 'unknown'
    });
  });

  it('returns works when all votes are works and < 3 votes', () => {
    window.localStorage.setItem('kaz_freshness_votes', JSON.stringify({
      't1': [{ userId: 'u1', type: 'works' }]
    }));
    const { result } = renderHook(() => React.useContext(TutorialContext), { wrapper });
    const status = result.current.getFreshnessStatus('t1');
    expect(status.consensus).toBe('works');
    expect(status.worksCount).toBe(1);
    expect(status.outdatedCount).toBe(0);
  });

  it('returns outdated when all votes are outdated and < 3 votes', () => {
    window.localStorage.setItem('kaz_freshness_votes', JSON.stringify({
      't1': [{ userId: 'u1', type: 'outdated' }]
    }));
    const { result } = renderHook(() => React.useContext(TutorialContext), { wrapper });
    const status = result.current.getFreshnessStatus('t1');
    expect(status.consensus).toBe('outdated');
    expect(status.worksCount).toBe(0);
    expect(status.outdatedCount).toBe(1);
  });

  it('returns unknown when there are mixed votes but total < 3', () => {
    window.localStorage.setItem('kaz_freshness_votes', JSON.stringify({
      't1': [
        { userId: 'u1', type: 'works' },
        { userId: 'u2', type: 'outdated' }
      ]
    }));
    const { result } = renderHook(() => React.useContext(TutorialContext), { wrapper });
    const status = result.current.getFreshnessStatus('t1');
    expect(status.consensus).toBe('unknown');
  });

  it('returns works when total >= 3 and works > outdated', () => {
    window.localStorage.setItem('kaz_freshness_votes', JSON.stringify({
      't1': [
        { userId: 'u1', type: 'works' },
        { userId: 'u2', type: 'works' },
        { userId: 'u3', type: 'outdated' }
      ]
    }));
    const { result } = renderHook(() => React.useContext(TutorialContext), { wrapper });
    const status = result.current.getFreshnessStatus('t1');
    expect(status.consensus).toBe('works');
    expect(status.worksCount).toBe(2);
    expect(status.outdatedCount).toBe(1);
  });

  it('returns outdated when total >= 3 and outdated > works', () => {
    window.localStorage.setItem('kaz_freshness_votes', JSON.stringify({
      't1': [
        { userId: 'u1', type: 'outdated' },
        { userId: 'u2', type: 'outdated' },
        { userId: 'u3', type: 'works' }
      ]
    }));
    const { result } = renderHook(() => React.useContext(TutorialContext), { wrapper });
    const status = result.current.getFreshnessStatus('t1');
    expect(status.consensus).toBe('outdated');
    expect(status.worksCount).toBe(1);
    expect(status.outdatedCount).toBe(2);
  });

  it('returns works when total >= 3 and works == outdated', () => {
    // Current logic: if (outdatedCount > worksCount) consensus = 'outdated'; else consensus = 'works';
    window.localStorage.setItem('kaz_freshness_votes', JSON.stringify({
      't1': [
        { userId: 'u1', type: 'works' },
        { userId: 'u2', type: 'works' },
        { userId: 'u3', type: 'outdated' },
        { userId: 'u4', type: 'outdated' }
      ]
    }));
    const { result } = renderHook(() => React.useContext(TutorialContext), { wrapper });
    const status = result.current.getFreshnessStatus('t1');
    expect(status.consensus).toBe('works');
  });
});
