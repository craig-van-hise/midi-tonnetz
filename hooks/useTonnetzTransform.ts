import { useState, useCallback } from 'react';

export interface TransformState {
  I: number[];
  r: number;
  F: 0 | 1;
}

export const mod12 = (n: number): number => ((n % 12) + 12) % 12;

interface DirectionMapping {
  delta_r: number;
  F_new: 0 | 1;
}

const MATRIX_1: Record<string, DirectionMapping> = {
  UP: { delta_r: 1, F_new: 1 },
  DOWN: { delta_r: 0, F_new: 1 },
  LEFT: { delta_r: 9, F_new: 1 },
  RIGHT: { delta_r: 4, F_new: 1 },
  UP_LEFT: { delta_r: 9, F_new: 0 },
  UP_RIGHT: { delta_r: 4, F_new: 0 },
  DOWN_LEFT: { delta_r: 8, F_new: 0 },
  DOWN_RIGHT: { delta_r: 3, F_new: 0 },
};

const MATRIX_2: Record<string, DirectionMapping> = {
  UP: { delta_r: 0, F_new: 0 },
  UP_RIGHT: { delta_r: 4, F_new: 1 },
  RIGHT: { delta_r: 3, F_new: 0 },
  DOWN_RIGHT: { delta_r: 3, F_new: 1 },
  DOWN: { delta_r: 11, F_new: 0 },
  DOWN_LEFT: { delta_r: 8, F_new: 1 },
  LEFT: { delta_r: 8, F_new: 0 },
  UP_LEFT: { delta_r: 9, F_new: 1 },
};

export function useTonnetzTransform() {
  const [state, setState] = useState<TransformState>({
    I: [],
    r: 0,
    F: 0,
  });

  const [seventhState, setSeventhState] = useState<{
    seventhRoot: number;
    seventhIsFlipped: boolean;
    seventhIsActive: boolean;
  }>({
    seventhRoot: 0,
    seventhIsFlipped: false,
    seventhIsActive: false,
  });

  const initTransformState = useCallback((activePitchClasses: Set<number>) => {
    if (activePitchClasses.size === 0) {
      setState({ I: [], r: 0, F: 0 });
      return;
    }
    const sorted = Array.from(activePitchClasses).sort((a, b) => a - b);
    const r = sorted[0];
    const I = sorted.map(note => mod12(note - r));
    setState({
      I,
      r,
      F: 0,
    });

    if (activePitchClasses.size === 4) {
      let foundValid7th = false;
      const arr = Array.from(activePitchClasses);
      for (const rootCandidate of arr) {
        const maj7Intervals = [0, 4, 7, 11];
        const min7Intervals = [0, 3, 7, 10];

        const checkMaj7 = maj7Intervals.every(interval => activePitchClasses.has(mod12(rootCandidate + interval)));
        if (checkMaj7) {
          foundValid7th = true;
          setSeventhState({ seventhRoot: rootCandidate, seventhIsFlipped: false, seventhIsActive: true });
          break;
        }

        const checkMin7 = min7Intervals.every(interval => activePitchClasses.has(mod12(rootCandidate + interval)));
        if (checkMin7) {
          foundValid7th = true;
          setSeventhState({ seventhRoot: rootCandidate, seventhIsFlipped: true, seventhIsActive: true });
          break;
        }
      }

      if (!foundValid7th) {
        setSeventhState({ seventhRoot: 0, seventhIsFlipped: false, seventhIsActive: false });
      }
    } else {
      setSeventhState({ seventhRoot: 0, seventhIsFlipped: false, seventhIsActive: false });
    }
  }, []);

  const handleDirectionalTrigger = useCallback((direction: string) => {
    if (state.I.length === 4 && seventhState.seventhIsActive) {
      setSeventhState(sev => {
        const isFlipped = sev.seventhIsFlipped;
        const R = sev.seventhRoot;
        let newRoot = R;
        let newFlipped = isFlipped;

        if (!isFlipped) {
          // State 1 (Major 7th)
          switch (direction) {
            case 'UP': newRoot = R + 1; newFlipped = true; break;
            case 'UP_RIGHT': newRoot = R + 4; newFlipped = false; break;
            case 'RIGHT': newRoot = R + 4; newFlipped = true; break;
            case 'DOWN_RIGHT': newRoot = R + 3; newFlipped = false; break;
            case 'DOWN': newRoot = R + 0; newFlipped = true; break;
            case 'DOWN_LEFT': newRoot = R + 8; newFlipped = false; break;
            case 'LEFT': newRoot = R + 9; newFlipped = true; break;
            case 'UP_LEFT': newRoot = R + 9; newFlipped = false; break;
          }
        } else {
          // State 2 (Minor 7th)
          switch (direction) {
            case 'UP': newRoot = R + 0; newFlipped = false; break;
            case 'UP_RIGHT': newRoot = R + 4; newFlipped = true; break;
            case 'RIGHT': newRoot = R + 3; newFlipped = false; break;
            case 'DOWN_RIGHT': newRoot = R + 3; newFlipped = true; break;
            case 'DOWN': newRoot = R + 11; newFlipped = false; break;
            case 'DOWN_LEFT': newRoot = R + 8; newFlipped = true; break;
            case 'LEFT': newRoot = R + 8; newFlipped = false; break;
            case 'UP_LEFT': newRoot = R + 9; newFlipped = true; break;
          }
        }

        return {
          seventhRoot: mod12(newRoot),
          seventhIsFlipped: newFlipped,
          seventhIsActive: true,
        };
      });
      return;
    }

    setState(prev => {
      if (prev.I.length === 0) return prev;
      const matrix = prev.F === 0 ? MATRIX_1 : MATRIX_2;
      const mapping = matrix[direction];
      if (!mapping) return prev;

      return {
        ...prev,
        r: mod12(prev.r + mapping.delta_r),
        F: mapping.F_new,
      };
    });
  }, [state.I.length, seventhState.seventhIsActive]);

  const getOutputNotes = useCallback(() => {
    const { I, r, F } = state;
    if (I.length === 0) return [];

    if (I.length === 4 && seventhState.seventhIsActive) {
      const R = seventhState.seventhRoot;
      if (!seventhState.seventhIsFlipped) {
        return [R, mod12(R + 4), mod12(R + 7), mod12(R + 11)];
      } else {
        return [R, mod12(R + 3), mod12(R + 7), mod12(R + 10)];
      }
    }

    if (F === 0) {
      // Operation A: S = (r + I) mod 12
      return I.map(note => mod12(r + note));
    } else {
      // Operation B: S = (r - I + 7) mod 12
      return I.map(note => mod12(r - note + 7));
    }
  }, [state, seventhState]);

  return {
    state,
    seventhState,
    initTransformState,
    handleDirectionalTrigger,
    getOutputNotes,
  };
}
