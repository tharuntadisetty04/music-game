const mappings = {
  piano: {
    keys: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    sounds: [
      "1.mp3",
      "2.mp3",
      "3.mp3",
      "4.mp3",
      "5.mp3",
      "6.mp3",
      "7.mp3",
      "8.mp3",
      "9.mp3",
      "10.mp3",
    ],
  },
  guitar: {
    keys: ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    sounds: [
      "guitar_E2.mp3",
      "guitar_A2.mp3",
      "guitar_D3.mp3",
      "guitar_G3.mp3",
      "guitar_B3.mp3",
      "guitar_E4.mp3",
      "guitar_A3.mp3",
      "guitar_D4.mp3",
      "guitar_G4.mp3",
    ],
  },
  drums: {
    keys: ["z", "x", "c", "v", "b", "n", "m"],
    sounds: [
      "kick.mp3",
      "snare.mp3",
      "hihat_closed.mp3",
      "hihat_open.mp3",
      "tom_low.mp3",
      "tom_mid.mp3",
      "crash.mp3",
    ],
  },
};

const guitarNotes = [
  { key: "a", freq: 82.41 },
  { key: "s", freq: 110.0 },
  { key: "d", freq: 146.83 },
  { key: "f", freq: 196.0 },
  { key: "g", freq: 246.94 },
  { key: "h", freq: 329.63 },
  { key: "j", freq: 220.0 },
  { key: "k", freq: 293.66 },
  { key: "l", freq: 392.0 },
];

const guitarFreqMap = {};
guitarNotes.forEach((n) => (guitarFreqMap[n.key] = n.freq));

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playGuitarTone(freq) {
  const ctx = audioCtx;
  const sampleRate = ctx.sampleRate;
  const bufLen = Math.round(sampleRate / freq);
  const buf = ctx.createBuffer(1, sampleRate * 3, sampleRate);
  const data = buf.getChannelData(0);

  for (let i = 0; i < bufLen; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  for (let i = bufLen; i < data.length; i++) {
    data[i] = 0.996 * 0.5 * (data[i - bufLen] + data[i - bufLen + 1]);
  }

  const src = ctx.createBufferSource();
  src.buffer = buf;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.8, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3);

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 4000;

  src.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  src.start(ctx.currentTime);
  src.stop(ctx.currentTime + 3);
}

const keyElements = {};

function createInstrument(name, containerId) {
  const container = document.getElementById(containerId);
  mappings[name].keys.forEach((key, i) => {
    const div = document.createElement("div");
    div.className = "key";
    div.textContent = key.toUpperCase();
    div.dataset.sound = mappings[name].sounds[i];
    div.dataset.instrument = name;
    div.dataset.key = key;
    keyElements[key] = div;

    div.onclick = () => playSound(div);
    container.appendChild(div);
  });
}

function playSound(el) {
  const instrument = el.dataset.instrument;
  const key = el.dataset.key;

  if (instrument === "guitar" && guitarFreqMap[key] !== undefined) {
    playGuitarTone(guitarFreqMap[key]);
  } else {
    const audio = new Audio(`sounds/${instrument}/${el.dataset.sound}`);
    audio.currentTime = 0;
    audio.play();
  }

  el.classList.add("active");
  setTimeout(() => el.classList.remove("active"), 150);
}

document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if (keyElements[key]) playSound(keyElements[key]);
});

createInstrument("piano", "piano");
createInstrument("guitar", "guitar");
createInstrument("drums", "drums");
