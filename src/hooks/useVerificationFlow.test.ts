import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useVerificationFlow } from './useVerificationFlow';

describe('useVerificationFlow', () => {
  it('starts at splash step', () => {
    const { result } = renderHook(() => useVerificationFlow());
    expect(result.current.currentStep).toBe('splash');
  });

  it('advances through all steps correctly', () => {
    const { result } = renderHook(() => useVerificationFlow());
    const expectedSteps = [
      'splash',
      'liveness',
      'photo-capture',
      'id-capture',
      'face-match',
      'voice-verify',
      'eye-blink',
      'success',
    ];

    expectedSteps.forEach((step, i) => {
      expect(result.current.currentStep).toBe(step);
      if (i < expectedSteps.length - 1) {
        act(() => result.current.goNext());
      }
    });
  });

  it('goes back correctly', () => {
    const { result } = renderHook(() => useVerificationFlow());
    act(() => result.current.goNext());
    act(() => result.current.goNext());
    expect(result.current.currentStep).toBe('photo-capture');

    act(() => result.current.goBack());
    expect(result.current.currentStep).toBe('liveness');
  });

  it('does not go before splash', () => {
    const { result } = renderHook(() => useVerificationFlow());
    act(() => result.current.goBack());
    expect(result.current.currentStep).toBe('splash');
  });

  it('does not go past success', () => {
    const { result } = renderHook(() => useVerificationFlow());
    for (let i = 0; i < 7; i++) {
      act(() => result.current.goNext());
    }
    expect(result.current.currentStep).toBe('success');
    act(() => result.current.goNext());
    expect(result.current.currentStep).toBe('success');
  });

  it('resets to splash', () => {
    const { result } = renderHook(() => useVerificationFlow());
    act(() => result.current.goNext());
    act(() => result.current.goNext());
    act(() => result.current.reset());
    expect(result.current.currentStep).toBe('splash');
  });

  it('calculates progress correctly', () => {
    const { result } = renderHook(() => useVerificationFlow());
    expect(result.current.progress).toBe(0);

    act(() => result.current.goNext());
    expect(result.current.progress).toBe(0);

    act(() => result.current.goNext());
    expect(result.current.progress).toBeGreaterThan(0);

    for (let i = 0; i < 5; i++) {
      act(() => result.current.goNext());
    }
    expect(result.current.progress).toBe(100);
  });
});
