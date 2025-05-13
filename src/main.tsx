
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Load fonts immediately
const fontLoader = async () => {
  try {
    // Create a test element to verify font loading
    const testDin = document.createElement('span');
    testDin.style.fontFamily = 'DIN Condensed Bold';
    testDin.style.position = 'absolute';
    testDin.style.visibility = 'hidden';
    testDin.textContent = 'Font Test';
    document.body.appendChild(testDin);

    // Force font loading with a timeout
    const fontPromise = document.fonts.ready.then(() => {
      console.log("Fonts loaded successfully through document.fonts.ready");
      document.body.removeChild(testDin);
      return true;
    });
    
    // Fallback timeout in case fonts.ready never resolves
    const timeoutPromise = new Promise(resolve => {
      setTimeout(() => {
        console.log("Font loading timed out, continuing with rendering");
        if (document.body.contains(testDin)) {
          document.body.removeChild(testDin);
        }
        resolve(false);
      }, 2000); // 2 second timeout
    });
    
    // Race between font loading and timeout
    await Promise.race([fontPromise, timeoutPromise]);
  } catch (err) {
    console.error("Font loading issue:", err);
  }
  
  // Always render the app, even if fonts fail
  createRoot(document.getElementById("root")!).render(<App />);
};

// Start loading fonts
fontLoader();
