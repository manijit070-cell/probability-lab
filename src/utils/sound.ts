import { useEffect, useState } from 'react';

const MUTE_STORAGE_KEY = 'probabilitylab_sound_muted';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private muted: boolean = false;
  private unlocked: boolean = false;
  private lastTickTime: number = 0;
  private listeners: Set<(muted: boolean) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.muted = window.localStorage.getItem(MUTE_STORAGE_KEY) === 'true';
      } catch {
        this.muted = false;
      }

      const unlockHandler = () => {
        this.unlock();
      };

      window.addEventListener('pointerdown', unlockHandler, { passive: true });
      window.addEventListener('keydown', unlockHandler, { passive: true });
    }
  }

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    return this.ctx;
  }

  private getNoiseBuffer(ctx: AudioContext): AudioBuffer {
    if (this.noiseBuffer && this.noiseBuffer.sampleRate === ctx.sampleRate) {
      return this.noiseBuffer;
    }
    const bufferSize = Math.floor(ctx.sampleRate * 0.5);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
    return buffer;
  }

  public unlock(): void {
    try {
      const ctx = this.ensureContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      this.unlocked = true;
    } catch {
      // Ignore in restricted environments
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(mute: boolean): void {
    this.muted = mute;
    try {
      window.localStorage.setItem(MUTE_STORAGE_KEY, String(mute));
    } catch {
      // Ignore storage failures
    }
    this.listeners.forEach((cb) => cb(this.muted));
    if (!mute) {
      this.unlock();
      this.playToggle(true, true);
    }
  }

  public toggleMute(): boolean {
    const next = !this.muted;
    this.setMuted(next);
    return next;
  }

  public subscribe(cb: (muted: boolean) => void): () => void {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private prepare(userInitiated = false): AudioContext | null {
    if (this.muted) return null;
    if (!userInitiated && !this.unlocked) return null;

    try {
      const ctx = this.ensureContext();
      if (!ctx) return null;
      if (ctx.state === 'suspended') {
        if (!userInitiated) return null;
        ctx.resume().catch(() => {});
      }
      if (userInitiated) {
        this.unlocked = true;
      }
      return ctx;
    } catch {
      return null;
    }
  }

  private playTone(
    ctx: AudioContext,
    {
      freqStart,
      freqEnd = freqStart,
      type = 'sine',
      gainPeak = 0.08,
      duration = 0.08,
      delay = 0,
    }: {
      freqStart: number;
      freqEnd?: number;
      type?: OscillatorType;
      gainPeak?: number;
      duration?: number;
      delay?: number;
    }
  ): void {
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(20, freqStart), now);
    if (freqEnd !== freqStart) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, freqEnd), now + duration);
    }

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(gainPeak, now + Math.min(0.008, duration * 0.25));
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  /** Tactile precision glassmorphic button tap */
  public playClick(pitchShift = 0): void {
    const ctx = this.prepare(true);
    if (!ctx) return;

    const factor = Math.pow(2, pitchShift / 12);
    this.playTone(ctx, {
      freqStart: 720 * factor,
      freqEnd: 340 * factor,
      type: 'triangle',
      gainPeak: 0.085,
      duration: 0.045,
    });
    this.playTone(ctx, {
      freqStart: 1440 * factor,
      freqEnd: 920 * factor,
      type: 'sine',
      gainPeak: 0.03,
      duration: 0.025,
    });
  }

  /** Subtle detent tick for sliders, presets, or step adjustments (throttled) */
  public playTick(): void {
    const nowMs = performance.now();
    if (nowMs - this.lastTickTime < 48) return;
    this.lastTickTime = nowMs;

    const ctx = this.prepare(true);
    if (!ctx) return;

    this.playTone(ctx, {
      freqStart: 980,
      freqEnd: 540,
      type: 'sine',
      gainPeak: 0.042,
      duration: 0.022,
    });
  }

  /** Airy futuristic tab navigation shimmer */
  public playTabSwitch(): void {
    const ctx = this.prepare(true);
    if (!ctx) return;

    this.playTone(ctx, {
      freqStart: 420,
      freqEnd: 640,
      type: 'sine',
      gainPeak: 0.055,
      duration: 0.085,
    });
    this.playTone(ctx, {
      freqStart: 840,
      freqEnd: 1120,
      type: 'triangle',
      gainPeak: 0.025,
      duration: 0.075,
      delay: 0.02,
    });
  }

  /** Soft toggle switch feedback */
  public playToggle(enabled: boolean, forceUnmuted = false): void {
    if (!forceUnmuted && this.muted) return;
    const ctx = this.prepare(true);
    if (!ctx) return;

    if (enabled) {
      this.playTone(ctx, { freqStart: 520, freqEnd: 680, type: 'sine', gainPeak: 0.055, duration: 0.06 });
      this.playTone(ctx, { freqStart: 780, freqEnd: 920, type: 'sine', gainPeak: 0.055, duration: 0.07, delay: 0.045 });
    } else {
      this.playTone(ctx, { freqStart: 560, freqEnd: 340, type: 'sine', gainPeak: 0.05, duration: 0.07 });
    }
  }

  /** Metallic coin thumb-flick ring + mid-air spin flutter */
  public playCoinFlip(): void {
    const ctx = this.prepare(true);
    if (!ctx) return;

    // Initial crisp metallic thumb-flick ping (inaudible dissonance partials for coin sheen)
    const partials = [
      { f: 2280, g: 0.05, d: 0.24 },
      { f: 3490, g: 0.032, d: 0.2 },
      { f: 4920, g: 0.02, d: 0.14 },
    ];
    partials.forEach(({ f, g, d }) => {
      this.playTone(ctx, {
        freqStart: f * 0.94,
        freqEnd: f,
        type: 'sine',
        gainPeak: g,
        duration: d,
      });
    });

    // Mid-air spin flutter clicks synced across flip duration
    const flutterOffsets = [0.09, 0.19, 0.31, 0.45, 0.6];
    flutterOffsets.forEach((delay, idx) => {
      this.playTone(ctx, {
        freqStart: 1350 - idx * 75,
        freqEnd: 880 - idx * 50,
        type: 'triangle',
        gainPeak: 0.028 - idx * 0.003,
        duration: 0.035,
        delay,
      });
    });
  }

  /** Crisp coin settle chime when outcome reveals */
  public playCoinLand(outcome: 'H' | 'T' = 'H'): void {
    const ctx = this.prepare(false);
    if (!ctx) return;

    const base = outcome === 'H' ? 1174.66 : 932.33; // D6 vs Bb5
    this.playTone(ctx, {
      freqStart: 165,
      freqEnd: 85,
      type: 'sine',
      gainPeak: 0.06,
      duration: 0.06,
    });
    this.playTone(ctx, {
      freqStart: base,
      freqEnd: base * 1.01,
      type: 'sine',
      gainPeak: 0.055,
      duration: 0.18,
      delay: 0.015,
    });
  }

  /** Organic multi-tap resin/tabletop dice clatter */
  public playDiceRoll(diceCount = 1): void {
    const ctx = this.prepare(true);
    if (!ctx) return;

    const noise = this.getNoiseBuffer(ctx);
    const hits = Math.min(11, 5 + diceCount * 2);
    let offset = 0;

    for (let i = 0; i < hits; i++) {
      const progress = i / hits;
      const delay = offset;
      offset += 0.045 + progress * 0.04 + Math.random() * 0.022;

      const now = ctx.currentTime + delay;
      const src = ctx.createBufferSource();
      src.buffer = noise;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(550 + Math.random() * 850, now);
      filter.Q.setValueAtTime(3.2, now);

      const gain = ctx.createGain();
      const peak = (0.12 - progress * 0.045) * (0.85 + Math.random() * 0.3);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(peak, now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.042);

      src.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      src.start(now);
      src.stop(now + 0.055);

      // Subtle resin body knock
      this.playTone(ctx, {
        freqStart: 280 + Math.random() * 240,
        freqEnd: 140 + Math.random() * 70,
        type: 'triangle',
        gainPeak: 0.055 - progress * 0.02,
        duration: 0.036,
        delay,
      });
    }
  }

  /** Soft felt-table settle sound after dice stop */
  public playDiceLand(): void {
    const ctx = this.prepare(false);
    if (!ctx) return;

    this.playTone(ctx, {
      freqStart: 210,
      freqEnd: 95,
      type: 'triangle',
      gainPeak: 0.065,
      duration: 0.065,
    });
    this.playTone(ctx, {
      freqStart: 784,
      freqEnd: 1046.5,
      type: 'sine',
      gainPeak: 0.038,
      duration: 0.14,
      delay: 0.03,
    });
  }

  /** Crisp staggered card riffle/deal swish */
  public playCardDeal(count = 1): void {
    const ctx = this.prepare(true);
    if (!ctx) return;

    const noise = this.getNoiseBuffer(ctx);
    const dealCount = Math.max(1, Math.min(count, 6));

    for (let i = 0; i < dealCount; i++) {
      const delay = i * 0.088;
      const now = ctx.currentTime + delay;

      const src = ctx.createBufferSource();
      src.buffer = noise;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1100 + i * 140, now);
      filter.frequency.exponentialRampToValueAtTime(2900 + i * 160, now + 0.075);
      filter.Q.setValueAtTime(1.8, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.095, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.085);

      src.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      src.start(now);
      src.stop(now + 0.095);

      // Subtle card snap
      this.playTone(ctx, {
        freqStart: 560 + i * 45,
        freqEnd: 290,
        type: 'triangle',
        gainPeak: 0.035,
        duration: 0.032,
        delay: delay + 0.01,
      });
    }
  }

  /** Harmonic completion chord for simulations and multi-scale LLN */
  public playSuccess(): void {
    const ctx = this.prepare(false);
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
    notes.forEach((freq, i) => {
      this.playTone(ctx, {
        freqStart: freq,
        freqEnd: freq,
        type: 'sine',
        gainPeak: 0.036,
        duration: 0.22,
        delay: i * 0.048,
      });
    });
  }

  /** Downward sweep when resetting parameters */
  public playReset(): void {
    const ctx = this.prepare(true);
    if (!ctx) return;

    this.playTone(ctx, {
      freqStart: 520,
      freqEnd: 250,
      type: 'sine',
      gainPeak: 0.05,
      duration: 0.1,
    });
  }
}

export const soundEngine = new SoundEngine();

export function useSoundMute(): [boolean, () => void] {
  const [muted, setMuted] = useState<boolean>(() => soundEngine.isMuted());

  useEffect(() => {
    return soundEngine.subscribe(setMuted);
  }, []);

  const toggle = () => {
    soundEngine.toggleMute();
  };

  return [muted, toggle];
}

