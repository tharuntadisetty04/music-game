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
  const audio = new Audio(
    `sounds/${el.dataset.instrument}/${el.dataset.sound}`,
  );

  audio.currentTime = 0;
  audio.play();

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
