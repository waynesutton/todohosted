import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  PlusCircle,
  Circle,
  CheckCircle2,
  Trash2,
  Github,
  Send,
  Sun,
  Moon,
  Smile,
  Heart,
  ThumbsUp,
  ThumbsDown,
  X,
  Search,
  Menu,
} from "lucide-react";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import ModPage from "./pages/mod";
import NotFound from "./pages/NotFound";
import AdminPage from "./pages/admin";
import type { Id } from "../convex/_generated/dataModel";
import { useUser, UserButton } from "@clerk/clerk-react";
import AnimatedHeart from "react-animated-heart";

const HAPPY_EMOJIS = ["😊", "😄", "🎉", "✨", "🌟"];

interface MessageItemProps {
  message: {
    _id: Id<"messages">;
    sender: string;
    text: string;
    likes?: number;
    isComplete?: boolean;
  };
  isDark: boolean;
  textClasses: string;
  isSelected: boolean;
  isThreaded?: boolean;
}

const MessageItem = ({
  message,
  isDark,
  textClasses,
  isSelected,
  isThreaded,
}: MessageItemProps) => {
  const toggleLike = useMutation(api.messages.toggleLike);

  return (
    <div
      className={`${isDark ? "bg-zinc-800/50" : "bg-zinc-100"} 
        ${isSelected ? "ring-2 ring-[#DFE0DD]" : ""} 
        ${isThreaded ? "ml-8 border-l-2 border-zinc-300 pl-4" : ""}
        rounded-lg py-1.5 px-2 mb-1 ransition-all`}>
      <div className="flex justify-between items-center">
        <div className="flex-1 min-w-0">
          <div className={`${isDark ? "text-zinc-400" : "text-zinc-600"} text-xs mb-0.5`}>
            {message.sender}
          </div>
          <div className={`${textClasses} text-sm`}>{message.text}</div>
        </div>
        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
          <div className="scale-[0.6] -m-2" role="presentation">
            <AnimatedHeart
              isClick={(message.likes ?? 0) > 0}
              onClick={() => toggleLike({ id: message._id })}
            />
          </div>
          <span className="text-sm text-zinc-500">{message.likes ?? 0}</span>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/mod" element={<ModPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

function MainApp() {
  const { user } = useUser();
  const [isDark, setIsDark] = useState(false);
  const [showFloatingBox, setShowFloatingBox] = useState(true);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const todos = useQuery(api.todos.get) ?? [];
  const messages = useQuery(api.messages.get) ?? [];
  const addTodo = useMutation(api.todos.add);
  const toggleTodo = useMutation(api.todos.toggle);
  const deleteTodo = useMutation(api.todos.remove);
  const sendMessage = useMutation(api.messages.sendMessage);
  const upvote = useMutation(api.todos.upvote);
  const downvote = useMutation(api.todos.downvote);

  const [newTodo, setNewTodo] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [streamedMessage, setStreamedMessage] = useState("");
  const [streamedMessageId, setStreamedMessageId] = useState<Id<"messages"> | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessageIds, setSelectedMessageIds] = useState<Id<"messages">[]>([]);

  // Add search function
  const searchMessages = useAction(api.messages.searchMessages);

  const askAIAction = useMutation(api.messages.askAI);

  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const initialLoadRef = useRef(true);

  useEffect(() => {
    if (messages.length > 0) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamedMessage]);

  useEffect(() => {
    if (newMessage) setHasUserInteracted(true);
  }, [newMessage]);

  useEffect(() => {
    const message = messages.find((m) => m._id === streamedMessageId);
    if (message?.isComplete) {
      setStreamedMessageId(null);
      setStreamedMessage("");
    } else if (message && message.text !== streamedMessage) {
      setStreamedMessage(message.text);
    }
  }, [messages, streamedMessageId]);

  const handleSubmitTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    await addTodo({ text: newTodo.trim() });
    setNewTodo("");
  };

  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (newMessage.trim().startsWith("@ai")) {
      const prompt = newMessage.slice(3).trim() || "Hello! How can I help you today?";
      await sendMessage({ text: newMessage.trim(), sender: "User" });
      const messageId = await askAIAction({ prompt });
      setStreamedMessageId(messageId);
      setStreamedMessage("");
    } else await sendMessage({ text: newMessage.trim(), sender: "User" });

    setNewMessage("");
  };

  const sendEmoji = () => {
    const randomEmoji = HAPPY_EMOJIS[Math.floor(Math.random() * HAPPY_EMOJIS.length)];
    sendMessage({
      text: randomEmoji,
      sender: "User",
    });
  };

  const iconClasses = isDark ? "text-zinc-400" : "text-zinc-600";
  const cardClasses = isDark ? "bg-zinc-900" : "bg-white border border-zinc-200 shadow-sm";
  const textClasses = isDark ? "text-zinc-400" : "text-zinc-600";
  const bgClasses = isDark ? "bg-slate-950" : "bg-[#F5F5F4]";

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
              Sync + AI Chat Demo
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
              href="https://stack.convex.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className={`${iconClasses} hover:opacity-80 transition-opacity`}>
              Blog
            </a>
            <button
              onClick={() => setShowFeaturesModal(true)}
              className={`${iconClasses} hover:opacity-80 transition-opacity`}>
              About
            </button>
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
              <button
                onClick={() => {
                  setShowFeaturesModal(true);
                  setShowMobileMenu(false);
                }}
                className={`${iconClasses} hover:opacity-80 transition-opacity text-left`}>
                About
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Content */}
      <main className={`relative flex-1 flex flex-col items-center px-4 ${bgClasses}`}>
        <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

        {/* Features Modal */}
        {showFeaturesModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${cardClasses} max-w-2xl w-full mx-4 p-6 rounded-lg`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-normal tracking-tighter ${iconClasses}`}>
                  Demo Features
                </h2>
                <button
                  onClick={() => setShowFeaturesModal(false)}
                  className={`${iconClasses} hover:text-gray-300 transition-colors`}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className={`${textClasses}`}>
                <p className="text-sm font-medium mb-2">Real-time Chat:</p>
                <ul className="list-disc pl-5 mb-4">
                  <li className="text-sm">Send and receive chat messages instantly</li>
                  <li className="text-sm">AI-powered chat responses using "@ai" command</li>
                  <li className="text-sm">Real-time message streaming from OpenAI</li>
                  <li className="text-sm">Create reminders by typing "remind me" in chat</li>
                  <li className="text-sm">Search functionality for messages using vector search</li>
                  <li className="text-sm">Like messages and see like counts</li>
                  <li className="text-sm">Send emoji reactions</li>
                </ul>
                <p className="text-sm font-medium mb-2">Reminders/Todos:</p>
                <ul className="list-disc pl-5">
                  <li className="text-sm">Create and manage public reminders</li>
                  <li className="text-sm">Toggle completion status</li>
                  <li className="text-sm">Upvote and downvote reminders</li>
                  <li className="text-sm">Real-time updates across all connected clients</li>
                  <li className="text-sm">Delete reminders with hover controls</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="w-full max-w-7xl flex flex-col md:flex-row gap-6 relative items-start mt-8">
          {/* Chat Column */}
          <div className="flex-[2]">
            <h2
              className={`text-xl font-normal mb-3 tracking-tighter ${iconClasses} flex items-center gap-2`}>
              Chat
              <span className="text-sm">(Public)</span>
            </h2>
            <div className={`${cardClasses} rounded-lg p-4 h-[500px] flex flex-col mb-6`}>
              {/* Chat Box */}
              <div className="flex-1 overflow-y-auto mb-4">
                <div className="flex flex-col h-full">
                  <div className="space-y-2 mt-auto">
                    {messages.map((message, index) => {
                      const messageText =
                        streamedMessageId === message._id ? streamedMessage : message.text;
                      const likes = message.likes ?? 0;
                      const isAiResponse =
                        message.sender === "AI" &&
                        index > 0 &&
                        messages[index - 1].text.startsWith("@ai");

                      return (
                        <MessageItem
                          key={message._id}
                          message={{
                            _id: message._id,
                            sender: message.sender,
                            text: messageText,
                            likes,
                            isComplete: message.isComplete,
                          }}
                          isDark={isDark}
                          textClasses={textClasses}
                          isSelected={
                            searchQuery !== "" && selectedMessageIds.includes(message._id)
                          }
                          isThreaded={isAiResponse}
                        />
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmitMessage}>
                <div
                  className={`${isDark ? "bg-zinc-800" : "bg-zinc-100"} rounded-lg p-4 flex items-center gap-4`}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message or @ai or remind me ..."
                    className={`bg-transparent flex-1 outline-none ${textClasses} placeholder-zinc-500`}
                  />
                  <button
                    type="button"
                    onClick={sendEmoji}
                    className={`${isDark ? "text-zinc-400" : "text-zinc-600"} hover:text-yellow-500 transition-colors`}>
                    <Smile className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewMessage("@ai")}
                    className={`${isDark ? "text-zinc-400" : "text-zinc-600"} hover:text-blue-500 transition-colors`}>
                    Ask AI
                  </button>
                  <button
                    type="submit"
                    className={`${isDark ? "text-zinc-400" : "text-zinc-600"} hover:text-blue-500 transition-colors`}>
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>

            {/* Search Messages Box */}
            <h2 className={`text-xl font-normal mb-3 tracking-tighter ${iconClasses}`}>
              Search Messages
            </h2>
            <div className={`${cardClasses} rounded-lg p-4 mb-10`}>
              <div
                className={`${isDark ? "bg-zinc-800" : "bg-zinc-100"} rounded-lg p-4 flex items-center gap-4`}>
                <Search className="w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value) {
                      searchMessages({ query: e.target.value })
                        .then((results) => {
                          console.log("Search results received:", results);
                          setSelectedMessageIds(results);
                        })
                        .catch((error) => {
                          console.error("Search error:", error);
                          setSelectedMessageIds([]);
                        });
                    } else {
                      setSelectedMessageIds([]);
                    }
                  }}
                  placeholder="Search messages..."
                  className={`bg-transparent flex-1 outline-none ${textClasses} placeholder-zinc-500`}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedMessageIds([]);
                    }}
                    className={`${isDark ? "text-zinc-400" : "text-zinc-600"} hover:text-red-500 transition-colors`}>
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {searchQuery && (
                <div className="mt-4 space-y-2">
                  <div className={`${textClasses} text-sm font-medium`}>
                    Search Results {selectedMessageIds.length === 0 && "(No matches found)"}
                  </div>
                  <div className="overflow-y-auto space-y-2">
                    {messages
                      .filter((m) => selectedMessageIds.includes(m._id))
                      .map((message) => (
                        <MessageItem
                          key={message._id}
                          message={message}
                          isDark={isDark}
                          textClasses={textClasses}
                          isSelected={false}
                        />
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Todo Column */}
          <div className="flex-1">
            <h2
              className={`text-xl font-normal mb-3 tracking-tighter ${iconClasses} flex items-center gap-2`}>
              Reminders
              <span className="text-sm">(Public)</span>
            </h2>
            <div
              className={`${cardClasses} rounded-lg p-4 hover:border-zinc-300 transition-colors`}>
              <form onSubmit={handleSubmitTodo} className="mb-6">
                <div
                  className={`flex items-center gap-3 ${isDark ? "bg-zinc-800" : "bg-white"} rounded-lg p-3`}>
                  <PlusCircle className="w-4 h-4" />
                  <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add a task..."
                    className={`bg-transparent flex-1 outline-none ${isDark ? "text-zinc-100" : "text-zinc-900"} placeholder-zinc-500 focus:ring-0`}
                  />
                </div>
              </form>

              <div className="space-y-3">
                {todos.map((todo) => (
                  <div
                    key={todo._id}
                    className={`flex items-center gap-3 p-3 ${isDark ? "bg-zinc-800/50" : "bg-zinc-100"} rounded-lg group`}>
                    <button
                      onClick={() => toggleTodo({ id: todo._id })}
                      className={`${iconClasses} hover:opacity-80 transition-colors`}>
                      {todo.completed ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    <span
                      className={`flex-1 ${todo.completed ? "text-zinc-500 line-through" : iconClasses}`}>
                      {todo.text}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => upvote({ id: todo._id })}
                        className={`${iconClasses} hover:text-green-500 transition-colors flex items-center gap-1`}>
                        <ThumbsUp
                          className={`w-4 h-4 ${(todo.upvotes ?? 0) > 0 ? "fill-green-500 text-green-500" : ""}`}
                        />
                        {(todo.upvotes ?? 0) > 0 && <span className="text-sm">{todo.upvotes}</span>}
                      </button>
                      <button
                        onClick={() => downvote({ id: todo._id })}
                        className={`${iconClasses} hover:text-red-500 transition-colors flex items-center gap-1`}>
                        <ThumbsDown
                          className={`w-4 h-4 ${(todo.downvotes ?? 0) > 0 ? "fill-red-500 text-red-500" : ""}`}
                        />
                        {(todo.downvotes ?? 0) > 0 && (
                          <span className="text-sm">{todo.downvotes}</span>
                        )}
                      </button>
                      <button
                        onClick={() => deleteTodo({ id: todo._id })}
                        className={`opacity-0 group-hover:opacity-100 ${iconClasses} hover:text-red-400 transition-all`}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Convex Logo Section 
      <div className="flex justify-center my-8">
        {isDark ? (
          <a href="https://convex.link/chatsynclinks" target="_blank" rel="noopener noreferrer">
            <img src="/convex-white.svg" alt="Convex Logo" className="h-12" />
          </a>
        ) : (
          <a href="https://convex.link/chatsynclinks" target="_blank" rel="noopener noreferrer">
            <img src="/convex-black.svg" alt="Convex Logo" className="h-12" />
          </a>
        )}
      </div>*/}

      {/* Floating Box */}
      {showFloatingBox && (
        <a href="https://convex.link/chatsynclinks" target="_blank" rel="noopener noreferrer">
          <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded-lg shadow-lg flex items-center gap-3 z-50">
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
}

export default App;
