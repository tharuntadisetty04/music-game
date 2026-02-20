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
      "guitar_E4.mp3",
      "guitar_F4.mp3",
      "guitar_G4.mp3",
      "guitar_A4.mp3",
      "guitar_B4.mp3",
      "guitar_C5.mp3",
      "guitar_D5.mp3",
      "guitar_E5.mp3",
      "guitar_F5.mp3",
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

const NOTE_FREQUENCIES = {
  "guitar_E4.mp3": 329.63,
  "guitar_F4.mp3": 349.23,
  "guitar_G4.mp3": 392.0,
  "guitar_A4.mp3": 440.0,
  "guitar_B4.mp3": 493.88,
  "guitar_C5.mp3": 523.25,
  "guitar_D5.mp3": 587.33,
  "guitar_E5.mp3": 659.25,
  "guitar_F5.mp3": 698.46,
};

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playGuitarTone(frequency) {
  const sampleRate = audioCtx.sampleRate;
  const bufferSize = Math.round(sampleRate / frequency);
  const duration = 3.0;
  const totalSamples = Math.round(sampleRate * duration);

  const noiseBuffer = new Float32Array(bufferSize);
  for (let i = 0; i < bufferSize; i++) {
    noiseBuffer[i] = Math.random() * 2 - 1;
  }

  const output = new Float32Array(totalSamples);
  for (let i = 0; i < totalSamples; i++) {
    const pos = i % bufferSize;
    const next = (pos + 1) % bufferSize;
    noiseBuffer[pos] = 0.996 * 0.5 * (noiseBuffer[pos] + noiseBuffer[next]);
    output[i] = noiseBuffer[pos];
  }

  const audioBuffer = audioCtx.createBuffer(1, totalSamples, sampleRate);
  audioBuffer.copyToChannel(output, 0);

  const source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;

  const filter = audioCtx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 4000;

  const gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(1.0, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.001,
    audioCtx.currentTime + duration,
  );

  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  source.start();
  source.stop(audioCtx.currentTime + duration);
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
    keyElements[key] = div;

    div.onclick = () => playSound(div);
    container.appendChild(div);
  });
}

function playSound(el) {
  const sound = el.dataset.sound;
  const instrument = el.dataset.instrument;

  if (instrument === "guitar" && NOTE_FREQUENCIES[sound]) {
    playGuitarTone(NOTE_FREQUENCIES[sound]);
  } else {
    const audio = new Audio(`sounds/${instrument}/${sound}`);
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
