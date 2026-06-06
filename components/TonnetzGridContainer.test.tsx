import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TonnetzGridContainer from './TonnetzGridContainer';

let mockGridProps: any = null;

vi.mock('./TonnetzGrid', () => {
  return {
    default: vi.fn((props) => {
      mockGridProps = props;
      return (
        <div data-testid="mock-grid">
          <button data-testid="mock-toggle" onClick={() => props.onToggleNote(3)}>
            Toggle 3
          </button>
        </div>
      );
    })
  };
});

describe('TonnetzGridContainer Phase 3 TDD: Local State Cleanup', () => {
  it('does not have any local state that intercepts change, and relies entirely on externalPitchClasses', () => {
    const handleToggle = vi.fn();
    const external = new Set([1, 2]);
    const { getByTestId } = render(
      <TonnetzGridContainer externalPitchClasses={external} onTogglePitchClass={handleToggle} />
    );

    // Assert that the grid initially receives the external pitch classes exactly
    expect(mockGridProps.activePitchClasses).toEqual(new Set([1, 2]));

    // Simulate clicking node 3 in the grid
    const btn = getByTestId('mock-toggle');
    fireEvent.click(btn);

    // Assert that the callback handleToggle was invoked with 3
    expect(handleToggle).toHaveBeenCalledWith(3);

    // Assert that the grid's activePitchClasses did NOT locally add 3 (no local state mutated)
    expect(mockGridProps.activePitchClasses).toEqual(new Set([1, 2]));
  });
});
