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
  Volume2,
  VolumeX,
  Copy,
} from "lucide-react";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import ModPage from "./pages/mod";
import NotFound from "./pages/NotFound";
import AdminPage from "./pages/admin";
import type { Id } from "../convex/_generated/dataModel";
import { useUser, UserButton } from "@clerk/clerk-react";
import AboutPage from "./pages/about";
import { DynamicPage } from "./pages/DynamicPage";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { CodeProps } from "react-markdown/lib/ast-to-react";
import type { Components } from "react-markdown";

const HAPPY_EMOJIS = ["😊", "😄", "🎉", "✨", "🌟"];

interface MessageItemProps {
  message: {
    _id: Id<"pageMessages">;
    sender?: string;
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
  const toggleLike = useMutation(api.pageMessages.toggleLike);
  const hasLikes = (message.likes ?? 0) > 0;
  const [copied, setCopied] = useState(false);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`${isDark ? "bg-zinc-800/50" : "bg-zinc-100"} 
        ${isSelected ? "ring-2 ring-[#DFE0DD]" : ""} 
        ${isThreaded ? "ml-8 border-l-2 border-zinc-300 pl-4" : ""}
        rounded-lg py-1.5 px-2 mb-1 transition-all`}>
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <div className={`${isDark ? "text-zinc-400" : "text-zinc-600"} text-xs mb-0.5`}>
            {message.sender || "Anonymous"}
          </div>
          <div className={`${textClasses} text-sm text-left`}>
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-2xl font-bold mb-2">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-bold mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg font-bold mb-2">{children}</h3>,
                h4: ({ children }) => <h4 className="text-base font-bold mb-2">{children}</h4>,
                h5: ({ children }) => <h5 className="text-sm font-bold mb-2">{children}</h5>,
                h6: ({ children }) => <h6 className="text-xs font-bold mb-2">{children}</h6>,
                p: ({ children }) => <p className="mb-2">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-2">
                    {children}
                  </blockquote>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-blue-500 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer">
                    {children}
                  </a>
                ),
                strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                code({ inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const code = String(children).replace(/\n$/, "");

                  if (!inline && match) {
                    return (
                      <div className="relative">
                        <div className="flex justify-between items-center bg-zinc-700 text-zinc-300 px-4 py-1 text-xs rounded-t">
                          <span>{match[1].toUpperCase()}</span>
                          <button
                            onClick={() => copyCode(code)}
                            className="hover:text-white transition-colors">
                            {copied ? "Copied!" : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                        <SyntaxHighlighter
                          language={match[1]}
                          style={isDark ? oneDark : oneLight}
                          customStyle={{
                            margin: 0,
                            borderTopLeftRadius: 0,
                            borderTopRightRadius: 0,
                          }}>
                          {code}
                        </SyntaxHighlighter>
                      </div>
                    );
                  }

                  return inline ? (
                    <code className="bg-zinc-200 dark:bg-zinc-700 px-1 py-0.5 rounded" {...props}>
                      {children}
                    </code>
                  ) : (
                    <div className="relative">
                      <div className="flex justify-between items-center bg-zinc-700 text-zinc-300 px-4 py-1 text-xs rounded-t">
                        <span>CODE</span>
                        <button
                          onClick={() => copyCode(code)}
                          className="hover:text-white transition-colors">
                          {copied ? "Copied!" : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <SyntaxHighlighter
                        language="plaintext"
                        style={isDark ? oneDark : oneLight}
                        customStyle={{
                          margin: 0,
                          borderTopLeftRadius: 0,
                          borderTopRightRadius: 0,
                        }}>
                        {code}
                      </SyntaxHighlighter>
                    </div>
                  );
                },
              }}>
              {message.text}
            </ReactMarkdown>
          </div>
        </div>
        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
          <button
            onClick={() => toggleLike({ id: message._id })}
            className={`hover:scale-110 transition-transform pr-[10px] ${hasLikes ? "text-red-500" : isDark ? "text-zinc-400" : "text-zinc-600"}`}>
            <Heart className="w-4 h-4" fill={hasLikes ? "currentColor" : "none"} />
          </button>
          {hasLikes && <span className="text-sm text-red-500">{message.likes}</span>}
        </div>
      </div>
    </div>
  );
};

interface MainAppProps {
  pageId?: Id<"pages">;
}

export const MainApp: React.FC<MainAppProps> = ({ pageId }) => {
  // Context hooks first
  const { user } = useUser();

  // Query hooks next
  const messages = pageId ? (useQuery(api.pageMessages.getMessages, { pageId }) ?? []) : [];
  const todos = pageId ? (useQuery(api.todos.get, { pageId }) ?? []) : [];

  // Mutation hooks
  const addTodo = useMutation(api.todos.add);
  const toggleTodo = useMutation(api.todos.toggle);
  const deleteTodo = useMutation(api.todos.remove);
  const sendMessage = useMutation(api.pageMessages.send);
  const upvote = useMutation(api.todos.upvote);
  const downvote = useMutation(api.todos.downvote);
  const askAIAction = useMutation(api.messages.askAI);
  const searchMessages = useAction(api.messages.searchMessages);

  // State hooks
  const [isDark, setIsDark] = useState(false);
  const [showFloatingBox, setShowFloatingBox] = useState(true);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [streamedMessage, setStreamedMessage] = useState("");
  const [streamedMessageId, setStreamedMessageId] = useState<Id<"pageMessages"> | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessageIds, setSelectedMessageIds] = useState<Id<"pageMessages">[]>([]);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [username, setUsername] = useState("setusername");
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState("");

  // Ref hooks
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const initialLoadRef = useRef(true);

  // Effect hooks
  useEffect(() => {
    if (messages && messages.length > 0)
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamedMessage]);

  useEffect(() => {
    if (newMessage) setHasUserInteracted(true);
  }, [newMessage]);

  useEffect(() => {
    if (!messages) return;
    const message = messages.find((m) => m._id === streamedMessageId);
    if (message?.isComplete) {
      setStreamedMessageId(null);
      setStreamedMessage("");
    } else if (message && message.text !== streamedMessage) {
      setStreamedMessage(message.text);
    }
  }, [messages, streamedMessageId]);

  useEffect(() => {
    if (messages && messages.length > 0 && !isMuted) {
      const lastMessage = messages[0];
      if (lastMessage) {
        audioRef.current?.play().catch(console.error);
      }
    }
  }, [messages, isMuted]);

  // Memoized values
  const iconClasses = isDark ? "text-zinc-400" : "text-zinc-600";
  const cardClasses = isDark ? "bg-zinc-900" : "bg-white border border-zinc-200 shadow-sm";
  const textClasses = isDark ? "text-zinc-400" : "text-zinc-600";
  const bgClasses = isDark ? "bg-slate-950" : "bg-[#F5F5F4]";

  // Event handlers
  const handleSubmitTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim() || !pageId) return;
    await addTodo({ text: newTodo.trim(), pageId });
    setNewTodo("");
  };

  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !pageId) return;

    if (newMessage.trim().startsWith("@ai")) {
      const prompt = newMessage.slice(3).trim() || "Hello! How can I help you today?";
      await sendMessage({ text: newMessage.trim(), sender: username, pageId });
      const messageId = await askAIAction({ prompt, pageId });
      setStreamedMessageId(messageId);
      setStreamedMessage("");
    } else if (newMessage.toLowerCase().includes("remind me") && pageId) {
      const reminderText = newMessage.toLowerCase().replace("remind me", "").trim();

      if (reminderText) {
        await sendMessage({ text: newMessage.trim(), sender: username, pageId });
        await addTodo({ text: reminderText, pageId });
        await sendMessage({
          text: `✅ I've added "${reminderText}" to your todo list!`,
          sender: "System",
          pageId,
        });
      }
    } else {
      await sendMessage({ text: newMessage.trim(), sender: username, pageId });
    }

    setNewMessage("");
  };

  const sendEmoji = () => {
    if (!pageId) return;
    const randomEmoji = HAPPY_EMOJIS[Math.floor(Math.random() * HAPPY_EMOJIS.length)];
    sendMessage({
      text: randomEmoji,
      sender: "User",
      pageId,
    });
  };

  // Message list rendering
  const messageList = messages.map((message, index) => {
    const messageText = streamedMessageId === message._id ? streamedMessage : message.text;
    const likes = message.likes ?? 0;
    const isAiResponse =
      message.sender === "AI" && index > 0 && messages[index - 1].text.startsWith("@ai");

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
        isSelected={searchQuery !== "" && selectedMessageIds.includes(message._id)}
        isThreaded={isAiResponse}
      />
    );
  });

  // Todo list rendering
  const todoList = todos.map((todo) => (
    <div
      key={todo._id}
      className={`flex items-center gap-3 p-3 ${isDark ? "bg-zinc-800/50" : "bg-zinc-100"} rounded-lg group`}>
      <button
        onClick={() => toggleTodo({ id: todo._id })}
        className={`${iconClasses} hover:opacity-80 transition-colors`}>
        {todo.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
      </button>
      <span className={`flex-1 ${todo.completed ? "text-zinc-500 line-through" : iconClasses}`}>
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
          {(todo.downvotes ?? 0) > 0 && <span className="text-sm">{todo.downvotes}</span>}
        </button>
        <button
          onClick={() => deleteTodo({ id: todo._id })}
          className={`opacity-0 group-hover:opacity-100 ${iconClasses} hover:text-red-400 transition-all`}>
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  ));

  // Render
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
              className="text-sm md:text-lg">
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
              <button
                onClick={() => {
                  setIsMuted(!isMuted);
                  if (!isMuted) audioRef.current?.pause();
                }}
                className={`${iconClasses} hover:opacity-80 transition-opacity ml-2`}
                aria-label={isMuted ? "Unmute chat sounds" : "Mute chat sounds"}>
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </h2>
            <div className={`${cardClasses} rounded-lg p-4 h-[500px] flex flex-col mb-6`}>
              {/* Chat Box */}
              <div className="flex-1 overflow-y-auto mb-4">
                <div className="flex flex-col h-full">
                  <div className="space-y-2 mt-auto">
                    {messageList}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmitMessage}>
                <div
                  className={`${isDark ? "bg-zinc-800" : "bg-zinc-100"} rounded-lg p-4 flex items-center gap-4`}>
                  {isEditingUsername ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tempUsername}
                        onChange={(e) => setTempUsername(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (tempUsername.trim()) {
                              setUsername(tempUsername.trim());
                              setIsEditingUsername(false);
                            }
                          }
                        }}
                        placeholder="Enter username..."
                        className="bg-white text-black outline-none placeholder-zinc-500 text-sm rounded px-2 py-1"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (tempUsername.trim()) {
                            setUsername(tempUsername.trim());
                          }
                          setIsEditingUsername(false);
                        }}
                        className="text-sm bg-black text-white px-2 py-1 rounded hover:bg-zinc-800">
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingUsername(false)}
                        className="text-sm bg-white text-black px-2 py-1 rounded border border-zinc-200 hover:bg-zinc-50">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setTempUsername(username);
                        setIsEditingUsername(true);
                      }}
                      title="Click to set name"
                      className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-600"} hover:text-blue-500 transition-colors`}>
                      {username}
                    </button>
                  )}
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
                    if (e.target.value && pageId) {
                      searchMessages({ query: e.target.value, pageId })
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
              ToDo List
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

              <div className="space-y-3">{todoList}</div>
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
          <p className={`${iconClasses} text-sm flex items-center justify-center gap-1`}>
            Open Source and built with ❤️ at{" "}
            <a
              href="https://convex.link/chatsynclinks"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity">
              Convex
            </a>
            .{" "}
            <a
              href="https://github.com/waynesutton/todohosted"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity flex items-center gap-1">
              <Github className="w-4 h-4" />
              The source code is available on GitHub
            </a>
            .
          </p>
        </div>
      </footer>

      {/* Audio Element */}
      <audio ref={audioRef} preload="auto">
        <source src="/message.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
};

function App() {
  const defaultPage = useQuery(api.pages.getPageBySlug, { slug: "default" });
  const createDefaultPage = useMutation(api.pages.createPage);

  useEffect(() => {
    if (defaultPage === null)
      createDefaultPage({ slug: "default", title: "Default Page" }).catch((error) => {
        if (!error.message?.includes("already exists"))
          console.error("Failed to create default page:", error);
      });
  }, [defaultPage]);

  if (defaultPage === undefined)
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (defaultPage === null)
    return <div className="min-h-screen flex items-center justify-center">Error loading page</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp pageId={defaultPage._id} />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/mod" element={<ModPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/:slug" element={<DynamicPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
