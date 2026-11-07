/**
 * Veira Neurological Reinforcement & Haptic Feedback Engine
 * Simulates the neurological reward circuitry (dopamine reinforcement loop)
 * when a user acknowledges or revisits an achieved goal or milestone.
 */

import { audioEngine } from './audioEngine';

export interface NeurologicalFeedbackOptions {
  pitch?: number;
  enableAudio?: boolean;
  hapticPattern?: number[];
}

/**
 * Triggers tactile haptic feedback using the standard Vibration API.
 * Uses a double-pulse pattern (18ms ping -> 38ms rest -> 26ms affirming pulse)
 * mimicking the synaptic response of cognitive accomplishment.
 */
export const triggerNeurologicalHaptic = (
  pattern: number[] = [18, 38, 26]
): boolean => {
  if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
    try {
      return navigator.vibrate(pattern);
    } catch {
      // Safe fallback if permission is restricted by browser policy
      return false;
    }
  }
  return false;
};

/**
 * Executes the complete sensory reinforcement loop:
 * 1. Physical: Tactile haptic vibration
 * 2. Acoustic: 963Hz Solfeggio frequency harmonic chime (Crown chakra / awakening)
 */
export const triggerNeurologicalReinforcement = (
  options: NeurologicalFeedbackOptions = {}
): { hapticFired: boolean } => {
  const {
    pitch = 963,
    enableAudio = true,
    hapticPattern = [18, 38, 26],
  } = options;

  // 1. Fire haptic feedback
  const hapticFired = triggerNeurologicalHaptic(hapticPattern);

  // 2. Play high-purity crystalline chime for acoustic affirmation
  if (enableAudio) {
    try {
      audioEngine.playCelestialChime(pitch);
    } catch {
      // Non-blocking fallback
    }
  }

  return { hapticFired };
};
