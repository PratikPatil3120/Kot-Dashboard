const playSound = (path, volume = 0.6) => {
  const audio = new Audio(path);
  audio.volume = volume;
  audio.play().catch(() => {});
};

export const playNewOrderSound = () =>
  playSound("/public/universfield-new-notification-031-480569.mp3", 0.7);

export const playDragSound = () =>
  playSound("/public/quiandrea96-notification-457196.mp3", 0.5);
