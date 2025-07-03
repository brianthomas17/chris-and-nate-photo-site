
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Load fonts and initialize app with improved error handling
const initializeApp = async () => {
  console.log("Starting app initialization");
  
  try {
    // Create test elements for each font to verify loading
    const testFino = document.createElement('span');
    testFino.style.fontFamily = 'Fino_Sans_Regular';
    testFino.style.position = 'absolute';
    testFino.style.visibility = 'hidden';
    testFino.textContent = 'Font Test';
    document.body.appendChild(testFino);

    const testHaboro = document.createElement('span');
    testHaboro.style.fontFamily = 'Haboro_Contrast';
    testHaboro.style.position = 'absolute';
    testHaboro.style.visibility = 'hidden';
    testHaboro.textContent = 'Font Test';
    document.body.appendChild(testHaboro);
    
    // Force browser to load fonts
    document.fonts.ready.then(() => {
      console.log("All fonts loaded successfully via document.fonts.ready");
      cleanupTestElements();
    }).catch(err => {
      console.warn("Font ready promise rejected:", err);
    });
    
    // Cleanup function for test elements
    const cleanupTestElements = () => {
      if (document.body.contains(testFino)) {
        document.body.removeChild(testFino);
      }
      if (document.body.contains(testHaboro)) {
        document.body.removeChild(testHaboro);
      }
    };
    
    // Start rendering regardless of font state after a short delay
    // This ensures the app shows up even if fonts are still loading
    setTimeout(() => {
      console.log("Initializing React application");
      createRoot(document.getElementById("root")!).render(<App />);
    }, 100);
    
    // Set a timeout to clean up test elements if fonts.ready never resolves
    setTimeout(() => {
      cleanupTestElements();
    }, 3000);
    
  } catch (err) {
    console.error("Error during initialization:", err);
    // Ensure the app renders even if there's an error in font loading
    createRoot(document.getElementById("root")!).render(<App />);
  }
};

// Start initialization
initializeApp();
