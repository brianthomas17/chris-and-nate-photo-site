
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Load fonts and initialize app with improved error handling
const initializeApp = async () => {
  console.log("Starting app initialization");
  
  try {
    // Create test elements for each font to verify loading
    const testDin = document.createElement('span');
    testDin.style.fontFamily = 'DINCondensedBold';
    testDin.style.position = 'absolute';
    testDin.style.visibility = 'hidden';
    testDin.textContent = 'Font Test';
    document.body.appendChild(testDin);

    const testBicyclette = document.createElement('span');
    testBicyclette.style.fontFamily = 'Bicyclette-Light';
    testBicyclette.style.position = 'absolute';
    testBicyclette.style.visibility = 'hidden';
    testBicyclette.textContent = 'Font Test';
    document.body.appendChild(testBicyclette);
    
    // Force browser to load fonts
    document.fonts.ready.then(() => {
      console.log("All fonts loaded successfully via document.fonts.ready");
      cleanupTestElements();
    }).catch(err => {
      console.warn("Font ready promise rejected:", err);
    });
    
    // Cleanup function for test elements
    const cleanupTestElements = () => {
      if (document.body.contains(testDin)) {
        document.body.removeChild(testDin);
      }
      if (document.body.contains(testBicyclette)) {
        document.body.removeChild(testBicyclette);
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
