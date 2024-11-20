import { allowedOrigins } from './allowedOrigins.js'; // Import the allowedOrigins array from the allowedOrigins module

// Define the corsOptions object to configure CORS settings
export const corsOptions = {
  // The origin property is a function that checks if the request's origin is allowed
  origin: (origin, callback) => {
    // Check if the origin is in the allowedOrigins array or if there is no origin (e.g., same-origin requests)
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // Allow the request by calling the callback with no error and true
    } else {
      callback(new Error('Not allowed by CORS')); // Reject the request by calling the callback with an error
    }
  },
  credentials: true, // Allow credentials (cookies, authorization headers, TLS client certificates)
  optionsSuccessStatus: 200 // Set the status code for successful OPTIONS requests to 200
};