import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from "@clerk/clerk-react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import App from './App.tsx';
import './index.css';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <ConvexProvider client={convex}>
        <App />
      </ConvexProvider>
    </ClerkProvider>
  </StrictMode>
);
