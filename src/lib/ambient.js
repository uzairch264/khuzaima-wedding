// A soft, generative background piece made with the Web Audio API — slow warm chords plus the odd
// bell, drenched in reverb. No audio file needed. If public/assets/music.mp3 exists it is used instead.

const CHORDS = [
  [146.83, 220.0, 329.63, 369.99], // D · A · E · F#
  [123.47, 185.0, 277.18, 293.66], // Bm
  [98.0, 146.83, 246.94, 369.99],  // G
  [110.0, 164.81, 246.94, 277.18], // A
];
const BELLS = [587.33, 659.25, 739.99, 880.0, 987.77, 1108.73];
const LEVEL = 0.4;

export function createAmbient() {
  let ctx = null, master = null, bus = null, echo = null;
  let chordTimer = 0, bellTimer = 0, step = 0, muted = false, started = false;

  const impulse = (c) => {
    const len = Math.floor(c.sampleRate * 3.4);
    const buf = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    return buf;
  };

  const build = () => {
    const AC = window.AudioContext || window.webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    const tone = ctx.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = 1900;
    const verb = ctx.createConvolver();
    verb.buffer = impulse(ctx);
    const wet = ctx.createGain();
    wet.gain.value = 0.6;
    bus = ctx.createGain();
    bus.connect(tone);
    tone.connect(master);
    tone.connect(verb);
    verb.connect(wet);
    wet.connect(master);

    echo = ctx.createDelay(1.5);
    echo.delayTime.value = 0.45;
    const fb = ctx.createGain();
    fb.gain.value = 0.32;
    echo.connect(fb);
    fb.connect(echo);
    echo.connect(bus);
  };

  const pad = (freqs, t, dur) => {
    freqs.forEach((f) => [-5, 5].forEach((detune) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "triangle";
      o.frequency.value = f;
      o.detune.value = detune;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.026, t + dur * 0.4);
      g.gain.linearRampToValueAtTime(0, t + dur + 2);
      o.connect(g);
      g.connect(bus);
      o.start(t);
      o.stop(t + dur + 2.2);
    }));
  };

  const bell = () => {
    const t = ctx.currentTime + 0.05;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = BELLS[Math.floor(Math.random() * BELLS.length)];
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.05, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 3.4);
    o.connect(g);
    g.connect(bus);
    g.connect(echo);
    o.start(t);
    o.stop(t + 3.6);
  };

  const nextChord = () => {
    pad(CHORDS[step++ % CHORDS.length], ctx.currentTime + 0.05, 9);
    chordTimer = setTimeout(nextChord, 8000);
  };
  const nextBell = () => {
    bell();
    bellTimer = setTimeout(nextBell, 2200 + Math.random() * 3400);
  };
  const loops = (on) => {
    clearTimeout(chordTimer);
    clearTimeout(bellTimer);
    if (on) { nextChord(); bellTimer = setTimeout(nextBell, 3500); }
  };

  return {
    /** Must be called from a user gesture the first time. */
    async start() {
      if (!ctx) build();
      await ctx.resume();
      started = true;
      muted = false;
      loops(true);
      master.gain.setTargetAtTime(LEVEL, ctx.currentTime, 1.8);
    },
    async setMuted(m) {
      if (!started) return;
      muted = m;
      if (m) {
        master.gain.setTargetAtTime(0, ctx.currentTime, 0.25);
        loops(false);
        setTimeout(() => { if (muted) ctx.suspend(); }, 900);
      } else {
        await ctx.resume();
        loops(true);
        master.gain.setTargetAtTime(LEVEL, ctx.currentTime, 0.6);
      }
    },
    stop() { loops(false); ctx?.close(); ctx = null; started = false; },
  };
}
