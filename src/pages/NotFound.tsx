import React from "react";
import { useNavigate } from "react-router-dom";

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-zinc-900 to-black text-white p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <h1 className="text-[12rem] font-bold leading-none tracking-tighter animate-glow">404</h1>

        <div className="space-y-4">
          <h2 className="text-4xl font-light">Page Not Found</h2>
          <p className="text-zinc-400 text-lg">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="pt-8">
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-white text-black rounded-full hover:bg-zinc-200 transition-colors text-sm font-medium">
            Return Home
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 text-center text-zinc-500 text-sm">
        <p>Built with Convex</p>
      </div>
    </div>
  );
};

export default NotFound;
