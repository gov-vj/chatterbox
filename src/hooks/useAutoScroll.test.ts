import { renderHook, act } from '@testing-library/react';
import { useAutoScroll } from './useAutoScroll';
import {RefObject} from "react";

describe('useAutoScroll', () => {
  it('should call scrollIntoView when dependency changes', () => {
    const mockScrollIntoView = vi.fn();
    const mockElement = { scrollIntoView: mockScrollIntoView };

    const { result, rerender } = renderHook(
      ({ dep }) => useAutoScroll(dep),
      { initialProps: { dep: [1] } }
    );

    act(() => {
      (result.current as RefObject<HTMLDivElement | null>).current = mockElement as unknown as HTMLDivElement;
    });


    rerender({ dep: [1, 2] });
    expect(mockScrollIntoView).toHaveBeenCalledTimes(1);
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });
});