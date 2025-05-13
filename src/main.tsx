
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Check if fonts are loaded before rendering
document.fonts.ready.then(() => {
  console.log("Fonts loaded successfully");
  createRoot(document.getElementById("root")!).render(<App />);
}).catch(err => {
  console.error("Font loading issue:", err);
  // Render anyway even if fonts fail
  createRoot(document.getElementById("root")!).render(<App />);
});
