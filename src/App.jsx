import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

console.log("✅ App.jsx loaded");

export default function App() {
  console.log("✅ App component rendered");

  useEffect(() => {
    const unlockAudio = () => {
      const audio = new Audio("/sounds/new-order.mp3");
      audio.volume = 0;
      audio.play().catch(() => {});
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);
    window.addEventListener("touchstart", unlockAudio);

    return () => {
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };
  }, []);

  return <RouterProvider router={router} />;
}
