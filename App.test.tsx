import React from 'react';
import { render, fireEvent, act, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import App from './App';

let mockContainerProps: any = null;

// Mock TonnetzGridContainer directly to simplify testing the state flows in App
vi.mock('./components/TonnetzGridContainer', () => {
  return {
    default: vi.fn((props) => {
      mockContainerProps = props;
      return (
        <div data-testid="mock-container">
          <div data-testid="active-classes">{Array.from(props.externalPitchClasses).join(',')}</div>
          <button data-testid="toggle-pc-0" onClick={() => props.onTogglePitchClass(0)}>Toggle 0</button>
          <button data-testid="toggle-pc-4" onClick={() => props.onTogglePitchClass(4)}>Toggle 4</button>
        </div>
      );
    })
  };
});

describe('App Phase 2 TDD: Modulo-12 Latch Mutation', () => {
  let midiListener: any = null;
  const mockMidiInput = {
    id: 'mock-input-id',
    name: 'Mock MIDI Input',
    addEventListener: vi.fn((event, listener) => {
      if (event === 'midimessage') {
        midiListener = listener;
      }
    }),
    removeEventListener: vi.fn(),
  };

  beforeEach(() => {
    midiListener = null;
    mockContainerProps = null;
    vi.restoreAllMocks();

    const mockAccess = {
      inputs: {
        values: () => [mockMidiInput],
        get: () => mockMidiInput,
      },
      outputs: {
        forEach: vi.fn(),
      },
      onstatechange: null,
    };

    // Mock requestMIDIAccess
    vi.stubGlobal('navigator', {
      requestMIDIAccess: vi.fn().mockResolvedValue(mockAccess)
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('Test Case 1: removes all absolute MIDI notes with same pitch class from held map when active pitch class is toggled off', async () => {
    const { getByRole, getByTestId } = render(<App />);

    // Wait for requestMIDIAccess to resolve
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Select the mock input from the select dropdown
    const select = getByRole('combobox');
    await act(async () => {
      fireEvent.change(select, { target: { value: 'mock-input-id' } });
    });

    expect(midiListener).not.toBeNull();

    // Populate active notes via midi note-on messages (60 and 72)
    await act(async () => {
      // Note On for 60
      midiListener({ data: [0x90, 60, 100] });
      // Note On for 72
      midiListener({ data: [0x90, 72, 80] });
    });

    // Verify 0 is active (since 60%12 === 0 and 72%12 === 0)
    expect(mockContainerProps.externalPitchClasses.has(0)).toBe(true);

    // Toggle 0 (C) off by clicking the button that triggers onTogglePitchClass(0)
    const toggle0Btn = getByTestId('toggle-pc-0');
    await act(async () => {
      fireEvent.click(toggle0Btn);
    });

    // Assert C (0) is removed from active pitch classes
    expect(mockContainerProps.externalPitchClasses.has(0)).toBe(false);
  });

  it('Test Case 2: adds the pitch class directly to held when toggled on from empty', async () => {
    const { getByTestId } = render(<App />);

    // Wait for requestMIDIAccess to resolve
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Toggle 4 (E) on from empty by clicking button
    const toggle4Btn = getByTestId('toggle-pc-4');
    await act(async () => {
      fireEvent.click(toggle4Btn);
    });

    // Assert E (4) is now in active pitch classes
    expect(mockContainerProps.externalPitchClasses.has(4)).toBe(true);
  });
});
