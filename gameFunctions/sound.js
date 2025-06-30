
export const sounds = {
  jump: new Audio('sounds/jump.mp3'),
  hit: new Audio('sounds/hit.mp3'),
  score: new Audio('sounds/score.mp3')
};

let audioUnlocked = false;
export function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  if (window.AudioContext || window.webkitAudioContext) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
      setTimeout(() => ctx.close(), 100);
    } catch (e) {}
  }
  for (const key in sounds) {
    try {
      sounds[key].muted = true;
      sounds[key].play().catch(()=>{});
      sounds[key].pause();
      sounds[key].muted = false;
    } catch (e) {}
  }
}
