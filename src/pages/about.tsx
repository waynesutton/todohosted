import React, { useState } from "react";
import { useUser, UserButton } from "@clerk/clerk-react";
import { Menu, Sun, Moon, X } from "lucide-react";

const AboutPage = () => {
  const { user } = useUser();
  const [isDark, setIsDark] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showFloatingBox, setShowFloatingBox] = useState(true);

  const iconClasses = isDark ? "text-zinc-400" : "text-zinc-600";
  const cardClasses = isDark ? "bg-zinc-900" : "bg-white border border-zinc-200 shadow-sm";

  return (
    <div className={`min-h-screen ${cardClasses} relative flex flex-col font-['Inter']`}>
      {/* Grid background with gradient */}
      <div className="relative h-full w-full">
        {isDark ? (
          <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        ) : (
          <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div>
          </div>
        )}
      </div>

      {/* Header */}
      <header className="relative w-full py-6 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center font-['Inter']">
          {/* Mobile Menu Button */}
          <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden">
            <Menu className={`w-6 h-6 ${iconClasses}`} />
          </button>

          {/* Logo and Title */}
          <h1
            className={`${iconClasses} text-xl font-normal flex flex-col md:flex-row items-center gap-2 flex-1 justify-center md:justify-start`}>
            <a href="/" target="_blank" rel="noopener noreferrer" className="md:flex">
              <img
                src={isDark ? "/convex-logo-white.svg" : "/convex-logo-black.svg"}
                alt="Convex Logo"
                className="h-4"
              />
            </a>
            <a
              href="https://convex.link/chatsynclinks"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm md:text-xl">
              AI Chat & ToDo List Sync App
            </a>
          </h1>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="https://convex.link/chatsynclinks"
              target="_blank"
              rel="noopener noreferrer"
              className={`${iconClasses} hover:opacity-80 transition-opacity`}>
              Convex
            </a>
            <a
              href="https://docs.convex.dev"
              target="_blank"
              rel="noopener noreferrer"
              className={`${iconClasses} hover:opacity-80 transition-opacity`}>
              Docs
            </a>
            <a
              href="https://stack.convex.dev/tag/Local-First"
              target="_blank"
              rel="noopener noreferrer"
              className={`${iconClasses} hover:opacity-80 transition-opacity`}>
              Blog
            </a>
            <button
              onClick={() => setIsDark(!isDark)}
              className={`${iconClasses} hover:opacity-80 transition-opacity`}>
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {user && user.publicMetadata?.role !== "admin" && <UserButton />}
          </div>

          {/* Mobile Icons */}
          <div className="flex md:hidden items-center gap-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className={`${iconClasses} hover:opacity-80 transition-opacity`}>
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {user && user.publicMetadata?.role !== "admin" && <UserButton />}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {showMobileMenu && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 py-4 px-4 z-50">
            <div className="flex flex-col gap-4">
              <a
                href="https://convex.link/chatsynclinks"
                target="_blank"
                rel="noopener noreferrer"
                className={`${iconClasses} hover:opacity-80 transition-opacity`}>
                Convex
              </a>
              <a
                href="https://docs.convex.dev"
                target="_blank"
                rel="noopener noreferrer"
                className={`${iconClasses} hover:opacity-80 transition-opacity`}>
                Docs
              </a>
              <a
                href="https://stack.convex.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className={`${iconClasses} hover:opacity-80 transition-opacity`}>
                Blog
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className={`text-4xl font-normal tracking-tighter ${iconClasses} mb-4`}>
              AI Chat & ToDo List Sync App
            </h1>
            <p className={`${iconClasses}`}>A real-time collaborative platform powered by Convex</p>
          </div>

          {/* Features Section */}
          <div className={`${cardClasses} rounded-lg p-8 mb-16`}>
            <h2 className={`text-2xl font-normal tracking-tighter ${iconClasses} mb-6`}>
              Features
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className={`text-lg font-medium ${iconClasses} mb-3`}>Real-time Chat</h3>
                <ul className={`list-disc pl-5 space-y-2 ${iconClasses}`}>
                  <li>Send and receive chat messages instantly</li>
                  <li>AI-powered chat responses using "@ai" command</li>
                  <li>Real-time message streaming from OpenAI</li>
                  <li>Create reminders by typing "remind me" in chat</li>
                  <li>Search functionality for messages using vector search</li>
                  <li>Like messages and see like counts</li>
                  <li>Send emoji reactions</li>
                </ul>
              </div>

              <div>
                <h3 className={`text-lg font-medium ${iconClasses} mb-3`}>Reminders/Todos</h3>
                <ul className={`list-disc pl-5 space-y-2 ${iconClasses}`}>
                  <li>Create and manage public reminders</li>
                  <li>Toggle completion status</li>
                  <li>Upvote and downvote reminders</li>
                  <li>Real-time updates across all connected clients</li>
                  <li>Delete reminders with hover controls</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className={`${cardClasses} rounded-lg p-8`}>
            <h2 className={`text-2xl font-normal tracking-tighter ${iconClasses} mb-6`}>Pricing</h2>

            <div className={`${isDark ? "bg-zinc-800" : "bg-zinc-50"} rounded-lg p-6`}>
              <div className="text-center">
                <h3 className={`text-xl font-medium ${iconClasses} mb-2`}>Free Forever</h3>
                <p className={`text-3xl font-bold ${iconClasses} mb-4`}>$0</p>
                <p className={`${iconClasses} mb-6`}>All features included</p>
              </div>

              <ul className={`space-y-3 ${iconClasses}`}>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Unlimited messages
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  AI chat assistance
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Real-time collaboration
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Vector search
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Todo management
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Box */}
      {showFloatingBox && (
        <a href="https://convex.link/chatsynclinks" target="_blank" rel="noopener noreferrer">
          <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded-lg shadow flex items-center gap-3 z-50">
            <span>Powered by</span>
            <img src="/convex-logo-white.svg" alt="Convex Logo" className="h-4" />
            <button
              onClick={() => setShowFloatingBox(false)}
              className="ml-2 hover:text-gray-300 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </a>
      )}

      {/* Footer */}
      <footer className="relative w-full py-6 px-4 mt-1">
        <div className="max-w-7xl mx-auto text-center">
          <p className={`${iconClasses} text-sm mb-2`}>
            All Chats and Reminders are cleared daily via{" "}
            <a
              href="https://docs.convex.dev/scheduling/cron-jobs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:opacity-80 transition-opacity">
              Convex Cron Jobs
            </a>
          </p>
          <p className={`${iconClasses} text-sm`}>
            Open Source and built with ❤️ at{" "}
            <a
              href="https://convex.link/chatsynclinks"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity">
              Convex
            </a>
            . Powered by{" "}
            <a
              href="https://convex.link/chatsynclinks"
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

export default AboutPage;
