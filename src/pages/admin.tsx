import React from "react";
import { SignIn, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  // After login, check if user is admin and redirect accordingly
  React.useEffect(() => {
    if (user) {
      if (user.publicMetadata?.role === "admin") navigate("/mod");
      else navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="relative w-full py-6 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center font-['Inter']">
          <h1 className="text-xl font-normal flex flex-col md:flex-row items-center gap-2">
            <a href="https://convex.dev" target="_blank" rel="noopener noreferrer">
              <img src="/convex-logo-black.svg" alt="Convex Logo" className="h-4" />
            </a>
            <a href="/" className="text-sm md:text-xl">
              Sync AI Demo
            </a>
          </h1>
          <div className="flex items-center gap-6">
            <a
              href="https://convex.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity">
              Convex
            </a>
            <a
              href="https://docs.convex.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity">
              Docs
            </a>
            <a
              href="https://stack.convex.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity">
              Blog
            </a>
          </div>
        </div>
      </header>

      {/* Login Content */}
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
          <SignIn redirectUrl="/mod" />
        </div>
      </div>

      {/* Footer */}
      <footer className="relative w-full py-6 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm mb-2">
            All Chats and Reminders are cleared daily via{" "}
            <a
              href="https://docs.convex.dev/scheduling/cron-jobs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:opacity-80 transition-opacity">
              Convex Cron Jobs
            </a>
          </p>
          <p className="text-sm">
            Built with ❤️ at{" "}
            <a
              href="https://convex.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity">
              Convex
            </a>
            . The source code is available on{" "}
            <a
              href="https://github.com/waynesutton/todohosted"
              target="_blank"
              rel="noopener noreferrer">
              GitHub
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AdminPage;
