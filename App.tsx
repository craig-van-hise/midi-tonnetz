import React, { useState, useEffect, useRef, useMemo } from 'react';
import TonnetzGridContainer from './components/TonnetzGridContainer';
import { TitleBar } from './components/TitleBar';
import { useTonnetzTransform } from './hooks/useTonnetzTransform';

function App() {
  const [bypass, setBypass] = useState(false);
  const [midiInputs, setMidiInputs] = useState<any[]>([]);
  const [selectedInputId, setSelectedInputId] = useState<string>('');
  const [activeChannels, setActiveChannels] = useState<Set<number>>(new Set(Array.from({length: 16}, (_, i) => i + 1)));

  const { initTransformState, handleDirectionalTrigger, getOutputNotes } = useTonnetzTransform();

  // Map of currently active MIDI note numbers (0-127) to velocity. 
  const [midiNoteState, setMidiNoteState] = useState({
    down: new Map<number, number>(),
    held: new Map<number, number>(),
    chordStarts: 0
  });

  // We need a ref to the selected input id and active channels for the event listener
  const midiStateRef = useRef({ selectedInputId, activeChannels, bypass });
  useEffect(() => {
    midiStateRef.current = { selectedInputId, activeChannels, bypass };
  }, [selectedInputId, activeChannels, bypass]);

  const handleMidiMessage = (e: any) => {
    const { bypass, activeChannels } = midiStateRef.current;
    if (bypass) return;

    const [status, data1, data2] = e.data;
    
    // Status byte contains message type (upper 4 bits) and channel (lower 4 bits)
    const messageType = status & 0xf0;
    const channel = (status & 0x0f) + 1;

    // Filter by channel
    if (!activeChannels.has(channel)) return;

    if (messageType === 0x90) { // Note on
      const velocity = data2;
      if (velocity > 0) {
        setMidiNoteState(prev => {
          const nextDown = new Map(prev.down);
          let nextHeld = new Map(prev.held);
          let nextChordStarts = prev.chordStarts;

          if (nextDown.size === 0) {
            // New chord started, clear held notes
            nextHeld = new Map();
            nextChordStarts++;
          }

          nextDown.set(data1, velocity);
          nextHeld.set(data1, velocity);

          const nextPCs = new Set<number>();
          for (const note of nextHeld.keys()) {
            nextPCs.add(note % 12);
          }
          setTimeout(() => {
            initTransformState(nextPCs);
          }, 0);

          return { down: nextDown, held: nextHeld, chordStarts: nextChordStarts };
        });
      } else {
        // Velocity 0 is effectively Note Off
        setMidiNoteState(prev => {
          const nextDown = new Map(prev.down);
          nextDown.delete(data1);
          return { ...prev, down: nextDown };
        });
      }
    } else if (messageType === 0x80) { // Note off
      setMidiNoteState(prev => {
        const nextDown = new Map(prev.down);
        nextDown.delete(data1);
        return { ...prev, down: nextDown };
      });
    }
  };

  useEffect(() => {
    let currentInput: any = null;

    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(
        (access) => {
          const updateInputs = () => {
            const inputs = Array.from(access.inputs.values());
            setMidiInputs(inputs);
          };
          
          updateInputs();

          access.onstatechange = () => {
            updateInputs();
          };

          // Attach listener if input is selected
          const attachListener = () => {
            if (currentInput) {
              currentInput.removeEventListener('midimessage', handleMidiMessage);
            }
            if (selectedInputId) {
              currentInput = access.inputs.get(selectedInputId);
              if (currentInput) {
                currentInput.addEventListener('midimessage', handleMidiMessage);
              }
            }
          };

          attachListener();
          
          // Re-attach if selection changes
          // Note: we can just attach it in this effect by reacting to selectedInputId
        },
        (err) => console.error("MIDI access failed", err)
      );
    }
    return () => {
      if (currentInput) currentInput.removeEventListener('midimessage', handleMidiMessage);
    };
  }, [selectedInputId]); // Re-run when selectedInputId changes

  // Derive active pitch classes (0-11) from held midi notes
  const midiPitchClasses = useMemo(() => {
    const pcSet = new Set<number>();
    if (!bypass) {
      for (const note of midiNoteState.held.keys()) {
        pcSet.add(note % 12);
      }
    }
    return pcSet;
  }, [midiNoteState.held, bypass]);

  // Overwrite held state when transformation updates
  useEffect(() => {
    const transformedNotes = getOutputNotes();
    if (transformedNotes.length > 0) {
      setMidiNoteState(prev => {
        const currentHeldPC = Array.from(prev.held.keys()).map(n => n % 12).sort().join(',');
        const newHeldPC = [...transformedNotes].sort().join(',');
        if (currentHeldPC === newHeldPC) return prev;

        const nextHeld = new Map<number, number>();
        transformedNotes.forEach(note => {
          nextHeld.set(note, 100);
        });
        return {
          ...prev,
          held: nextHeld
        };
      });
    }
  }, [getOutputNotes]);

  const handleTogglePitchClass = (pc: number) => {
    setMidiNoteState(prev => {
      const isCurrentlyActive = Array.from(prev.held.keys()).some(key => key % 12 === pc);
      const nextHeld = new Map(prev.held);
      if (isCurrentlyActive) {
        for (const key of prev.held.keys()) {
          if (key % 12 === pc) {
            nextHeld.delete(key);
          }
        }
      } else {
        nextHeld.set(pc, 100);
      }

      const nextPCs = new Set<number>();
      for (const note of nextHeld.keys()) {
        nextPCs.add(note % 12);
      }
      setTimeout(() => {
        initTransformState(nextPCs);
      }, 0);

      return { ...prev, held: nextHeld };
    });
  };

  const handlePanic = () => {
    setMidiNoteState(prev => ({
      ...prev,
      down: new Map(),
      held: new Map()
    }));
    // Also send Note Off to all channels on all connected outputs as requested
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(access => {
        access.outputs.forEach(output => {
          for (let ch = 0; ch < 16; ch++) {
            // Some devices prefer CC 123 (All Notes Off), but we'll send it and also individual note offs if needed.
            // CC 123 All Notes Off
            output.send([0xB0 + ch, 123, 0]);
          }
        });
      });
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50 flex flex-col relative">
      <TitleBar 
        bypass={bypass} 
        setBypass={setBypass}
        onPanic={handlePanic}
        midiInputs={midiInputs}
        selectedInputId={selectedInputId}
        setSelectedInputId={setSelectedInputId}
        activeChannels={activeChannels}
        setActiveChannels={setActiveChannels}
      />
      <div className="flex-1 overflow-auto flex flex-col items-center justify-center p-4">
        <TonnetzGridContainer 
          externalPitchClasses={midiPitchClasses} 
          clearSignal={midiNoteState.chordStarts} 
          onTogglePitchClass={handleTogglePitchClass}
          onDirectionalTrigger={handleDirectionalTrigger}
        />
      </div>
    </div>
  );
}

export default App;