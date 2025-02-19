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
  Edit2,
  Save,
  ChevronUp,
  ChevronDown,
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
import { TipTapEditor } from "./components/TipTapEditor";

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
    <div id={`message-${message._id}`} className="flex flex-col w-full">
      <div className="flex items-start gap-2 mb-4">
        <div className="flex-1 max-w-[97%]">
          <div
            className={`${isSelected ? "bg-[#551D49] text-white" : isDark ? "bg-zinc-800/50" : "bg-black"} 
              ${isThreaded ? "ml-8 border-l-2 border-zinc-300 pl-4" : ""}
              rounded-2xl py-2 px-3 inline-block`}>
            <div className="flex flex-col">
              <div
                className={`${isSelected ? "text-zinc-200" : isDark ? "text-zinc-400" : "text-white"} text-xs mb-0.5`}>
                {message.sender || "Anonymous"}
              </div>
              <div
                className={`${isSelected ? "text-white" : isDark ? textClasses : "text-white"} text-sm`}>
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
                        <code
                          className="bg-zinc-200 dark:bg-zinc-700 px-1 py-0.5 rounded"
                          {...props}>
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
          </div>
        </div>
        <div className="flex items-center gap-1 mr-5">
          <button
            onClick={() => toggleLike({ id: message._id })}
            className={`hover:scale-110 transition-transform ${hasLikes ? "text-red-500" : isDark ? "text-zinc-400" : "text-zinc-600"}`}>
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
  const notes = pageId ? (useQuery(api.pageNotes.getNotes, { pageId }) ?? []) : [];

  // Mutation hooks
  const addTodo = useMutation(api.todos.add);
  const toggleTodo = useMutation(api.todos.toggle);
  const deleteTodo = useMutation(api.todos.remove);
  const sendMessage = useMutation(api.pageMessages.send);
  const upvote = useMutation(api.todos.upvote);
  const downvote = useMutation(api.todos.downvote);
  const askAIAction = useMutation(api.messages.askAI);
  const searchMessages = useAction(api.messages.searchMessages);
  const createNote = useMutation(api.pageNotes.createNote);
  const updateNote = useMutation(api.pageNotes.updateNote);
  const deleteNote = useMutation(api.pageNotes.deleteNote);
  const createPage = useMutation(api.pages.createPage);
  const sendPageMessage = useMutation(api.pageMessages.send);

  // State hooks
  const [isDark, setIsDark] = useState(false);
  const [showFloatingBox, setShowFloatingBox] = useState(true);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [hasShownWarning, setHasShownWarning] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("hasShownWarning") === "true";
    }
    return false;
  });
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
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<Id<"pageNotes"> | null>(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [copiedNoteId, setCopiedNoteId] = useState<Id<"pageNotes"> | null>(null);
  const [expandedNotes, setExpandedNotes] = useState<Record<Id<"pageNotes">, boolean>>({});
  const [newPageSlug, setNewPageSlug] = useState("");
  const [newPageTitle, setNewPageTitle] = useState("");

  // Ref hooks
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const initialLoadRef = useRef(true);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

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
    if (messages && messages.length > 0 && !isMuted && hasUserInteracted) {
      const lastMessage = messages[0];
      if (lastMessage) {
        audioRef.current?.play().catch(console.error);
      }
    }
  }, [messages, isMuted, hasUserInteracted]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false);
      }
    };

    if (showMobileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMobileMenu]);

  // Memoized values
  const iconClasses = isDark ? "text-white" : "text-zinc-600";
  const cardClasses = isDark ? "bg-zinc-900 select-text" : "bg-white select-text";
  const textClasses = isDark ? "text-zinc-400 select-text" : "text-zinc-600 select-text";
  const bgClasses = isDark ? "bg-slate-950" : "bg-[#F5F5F4]";
  const mutedTextClasses = isDark ? "text-zinc-500" : "text-zinc-500";
  const inputBgClasses = isDark ? "bg-zinc-800" : "bg-white border border-zinc-200";

  // Event handlers
  const handleSubmitTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim() || !pageId) return;
    await addTodo({ text: newTodo.trim(), pageId });
    setNewTodo("");
  };

  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasShownWarning) {
      setShowWarning(true);
      return;
    }
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
    } else if (newMessage.trim().toLowerCase().startsWith("note:")) {
      const noteText = newMessage.slice(5).trim();
      if (noteText) {
        await sendMessage({ text: newMessage.trim(), sender: username, pageId });
        await createNote({
          pageId,
          title: `Note from ${username}`,
          content: noteText,
        });
        await sendMessage({
          text: `📝 I've created a new note with your message!`,
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

  const handleCreateNote = async () => {
    if (!hasShownWarning) {
      setShowWarning(true);
      return;
    }
    if (!pageId || !noteTitle.trim()) return;

    await createNote({
      pageId,
      title: noteTitle.trim(),
      content: noteContent.trim(),
    });

    setNoteTitle("");
    setNoteContent("");
    setIsCreatingNote(false);
  };

  const handleUpdateNote = async (id: Id<"pageNotes">) => {
    await updateNote({
      id,
      title: noteTitle.trim(),
      content: noteContent.trim(),
    });
    setEditingNoteId(null);
    setNoteTitle("");
    setNoteContent("");
  };

  const copyNoteContent = (content: string, noteId: Id<"pageNotes">) => {
    navigator.clipboard.writeText(content);
    setCopiedNoteId(noteId);
    setTimeout(() => setCopiedNoteId(null), 2000);
  };

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageSlug.trim() || !newPageTitle.trim()) return;

    try {
      const pageId = await createPage({
        slug: newPageSlug.trim(),
        title: newPageTitle.trim(),
      });

      if (pageId) {
        setNewPageSlug("");
        setNewPageTitle("");
        await sendPageMessage({
          pageId,
          text: `Welcome to ${newPageTitle.trim()}!`,
          sender: "System",
        });
        await sendPageMessage({
          pageId,
          text: 'Start typing to chat, use "@ai" to ask OpenAI, type "remind me" to set a reminder, or type "note:" to create a new note.',
          sender: "System",
        });
        window.location.href = `/${newPageSlug.trim()}`;
      }
    } catch (error) {
      console.error("Failed to create page:", error);
      alert("Failed to create page. The URL might already be in use.");
    }
  };

  // Message list rendering
  const messageList = [...messages].reverse().map((message, index, array) => {
    const messageText = streamedMessageId === message._id ? streamedMessage : message.text;
    const likes = message.likes ?? 0;
    const isAiResponse =
      message.sender === "AI" &&
      index < array.length - 1 &&
      array[index + 1].text.startsWith("@ai");

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
      <span
        className={`flex-1 text-sm ${todo.completed ? "text-zinc-500 line-through" : iconClasses}`}>
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
    <div
      className={`min-h-screen ${cardClasses} relative flex flex-col font-['Inter'] select-text`}>
      <style>
        {`
          @keyframes highlight {
            0% { background-color: rgba(59, 130, 246, 0.2); }
            100% { background-color: transparent; }
          }
          .highlight {
            animation: highlight 2s ease-out;
          }
        `}
      </style>
      {/* Grid background with gradient */}
      <div className="relative h-full w-full">
        {isDark ? (
          <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        ) : (
          <div className="absolute inset-0 -z-10 h-full w-full bg-[#FAFAFA]"></div>
        )}
      </div>

      {/* Header */}
      <header className="w-full py-6 px-4 bg-white dark:bg-black relative">
        <div className="max-w-7xl mx-auto flex justify-between items-center font-['Inter']">
          {/* Mobile Menu Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowMobileMenu(!showMobileMenu);
            }}
            aria-label="Toggle mobile menu"
            className="md:hidden">
            <Menu className={`w-6 h-6 ${iconClasses}`} />
          </button>

          {/* Logo and Title */}
          <h1
            className={`${isDark ? "text-white" : iconClasses} text-xl font-normal flex flex-col md:flex-row items-center gap-2 flex-1 justify-center md:justify-start`}>
            <a href="/" target="_blank" rel="noopener noreferrer" className="md:flex">
              <img
                src={isDark ? "/convex-logo-white.svg" : "/convex-logo-black.svg"}
                alt="Convex Logo"
                className="h-4"
              />
            </a>
            Sync Engine Demo
          </h1>

          {/* Desktop Navigation with Search */}
          <div className="hidden md:flex items-center gap-6">
            {/* Search Box */}
            <div className="relative flex items-center">
              <div
                className={`flex items-center gap-2 ${isDark ? "bg-zinc-800" : "bg-zinc-100"} rounded-lg px-3 py-1.5 border border-zinc-300`}>
                <Search className="w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value && pageId) {
                      searchMessages({ query: e.target.value, pageId })
                        .then((results) => setSelectedMessageIds(results))
                        .catch(() => setSelectedMessageIds([]));
                    } else setSelectedMessageIds([]);
                  }}
                  placeholder="Search messages..."
                  className={`bg-transparent w-40 outline-none ${textClasses} placeholder-zinc-500 text-sm`}
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedMessageIds([]);
                    }}
                    className={`${isDark ? "text-zinc-400" : "text-zinc-600"} hover:text-red-500 transition-colors`}>
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {/* Search Results Dropdown */}
              {searchQuery && selectedMessageIds.length > 0 && (
                <div
                  className={`absolute top-full left-0 right-0 mt-1 ${cardClasses} border border-zinc-300 rounded-lg shadow-lg overflow-hidden max-h-[300px] overflow-y-auto z-50`}>
                  {messages
                    .filter((m) => selectedMessageIds.includes(m._id))
                    .map((message) => (
                      <button
                        key={message._id}
                        onClick={() => {
                          const messageElement = document.getElementById(`message-${message._id}`);
                          if (messageElement) {
                            messageElement.scrollIntoView({ behavior: "smooth" });
                            messageElement.classList.add("highlight");
                            setTimeout(() => messageElement.classList.remove("highlight"), 2000);
                          }
                        }}
                        className={`w-full text-left p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 ${textClasses} text-sm border-b border-zinc-200 dark:border-zinc-700 last:border-0`}>
                        <div className="font-medium mb-0.5">{message.sender}</div>
                        <div className="line-clamp-2">{message.text}</div>
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Existing Navigation Items */}
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
            {user && user.publicMetadata?.role !== "admin" && <UserButton />}
          </div>

          {/* Mobile Icons */}
          <div className="flex md:hidden items-center gap-4">
            {user && user.publicMetadata?.role !== "admin" && <UserButton />}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {showMobileMenu && (
          <div
            ref={mobileMenuRef}
            className="md:hidden absolute left-0 right-0 bg-white dark:bg-black border-t border-zinc-200 dark:border-zinc-800 py-4 px-4 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto flex flex-col gap-4">
              {/* Search Box in Mobile Menu */}
              <div
                className={`flex items-center gap-2 ${isDark ? "bg-zinc-800" : "bg-zinc-100"} rounded-lg p-3`}>
                <Search className="w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  id="search-input"
                  name="search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value && pageId) {
                      searchMessages({ query: e.target.value, pageId })
                        .then((results) => setSelectedMessageIds(results))
                        .catch(() => setSelectedMessageIds([]));
                    } else setSelectedMessageIds([]);
                  }}
                  placeholder="Search messages..."
                  className={`bg-transparent w-full outline-none ${textClasses} placeholder-zinc-500 text-sm`}
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedMessageIds([]);
                      setShowMobileMenu(false);
                    }}
                    className={`${isDark ? "text-zinc-400" : "text-zinc-600"} hover:text-red-500 transition-colors`}>
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {searchQuery && selectedMessageIds.length > 0 && (
                <div
                  className={`${cardClasses} border border-zinc-300 rounded-lg shadow-lg overflow-hidden max-h-[300px] overflow-y-auto`}>
                  {messages
                    .filter((m) => selectedMessageIds.includes(m._id))
                    .map((message) => (
                      <button
                        key={message._id}
                        onClick={() => {
                          const messageElement = document.getElementById(`message-${message._id}`);
                          if (messageElement) {
                            messageElement.scrollIntoView({ behavior: "smooth" });
                            messageElement.classList.add("highlight");
                            setTimeout(() => messageElement.classList.remove("highlight"), 2000);
                          }
                          setShowMobileMenu(false);
                        }}
                        className={`w-full text-left p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 ${textClasses} text-sm border-b border-zinc-200 dark:border-zinc-700 last:border-0`}>
                        <div className="font-medium mb-0.5">{message.sender}</div>
                        <div className="line-clamp-2">{message.text}</div>
                      </button>
                    ))}
                </div>
              )}

              {/* Navigation Links */}
              <a
                href="https://convex.link/chatsynclinks"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowMobileMenu(false)}
                className={`${iconClasses} hover:opacity-80 transition-opacity`}>
                Convex
              </a>
              <a
                href="https://docs.convex.dev"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowMobileMenu(false)}
                className={`${iconClasses} hover:opacity-80 transition-opacity`}>
                Docs
              </a>
              <a
                href="https://stack.convex.dev/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowMobileMenu(false)}
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

      {/* Main Content */}
      <main className={`relative flex-1 flex flex-col items-center px-4 ${bgClasses} mt-0`}>
        <div className="absolute top-0 z-[-2] h-screen w-screen bg-[#F5F5F4] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

        <div className="w-full max-w-7xl flex flex-col gap-6 relative items-start mt-8">
          {/* Top Section - Chat and Todo */}
          <div className="w-full flex flex-col md:flex-row gap-6">
            {/* Chat Column - Full width on mobile, 2/3 on desktop */}
            <div className="w-full md:flex-[2]">
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
              <div
                className={`${cardClasses} rounded-lg p-4 h-[600px] flex flex-col border border-zinc-300 shadow`}>
                {/* Chat Box */}
                <div className="flex-1 overflow-y-auto mb-4">
                  <div className="space-y-4 flex flex-col">{messageList}</div>
                </div>
                <form onSubmit={handleSubmitMessage}>
                  <div
                    className={`${inputBgClasses} rounded-lg p-4 flex items-center gap-4 shadow-sm`}>
                    {isEditingUsername ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          id="username-input"
                          name="username"
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
                          className="bg-white text-black outline-none placeholder-zinc-500 text-sm rounded px-2 py-1 border border-zinc-200"
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
                      id="message-input"
                      name="message"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onFocus={() => {
                        if (!hasShownWarning) {
                          setShowWarning(true);
                        }
                      }}
                      placeholder="Chat or @ai or remind me or note:..."
                      className={`bg-transparent flex-1 outline-none ${textClasses} placeholder-zinc-500`}
                    />
                    <button
                      type="button"
                      onClick={sendEmoji}
                      className={`${isDark ? "text-zinc-400" : "text-zinc-500"} hover:text-yellow-500 transition-colors`}>
                      <Smile className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewMessage("@ai")}
                      className={`${isDark ? "text-zinc-400" : "text-zinc-500"} hover:text-blue-500 transition-colors`}>
                      Ask AI
                    </button>
                    <button
                      type="submit"
                      className={`${isDark ? "text-zinc-400" : "text-zinc-500"} hover:text-blue-500 transition-colors`}>
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Todo and Notes Column - 1/3 width */}
            <div className="flex-1 flex flex-col gap-6">
              {/* Todo Section */}
              <div className="w-full">
                <h2
                  className={`text-xl font-normal mb-3 tracking-tighter ${iconClasses} flex items-center gap-2`}>
                  ToDo List
                  <span className="text-sm">(Public)</span>
                </h2>
                <div className={`${cardClasses} rounded-lg p-4 shadow border border-zinc-300`}>
                  <form onSubmit={handleSubmitTodo} className="mb-6">
                    <div className={`flex items-center gap-3 ${inputBgClasses} rounded-lg p-3`}>
                      <PlusCircle className="w-4 h-4" />
                      <input
                        type="text"
                        id="todo-input"
                        name="todo"
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

              {/* Notes Section */}
              <div className="w-full">
                <h2 className={`text-xl font-normal mb-3 tracking-tighter ${iconClasses}`}>
                  Notes <span className="text-sm">(Public)</span>
                </h2>
                <div className={`${cardClasses} rounded-lg p-4 shadow border border-zinc-300`}>
                  {!isCreatingNote && (
                    <button
                      onClick={() => setIsCreatingNote(true)}
                      className={`flex items-center gap-2 ${isDark ? "text-zinc-400" : "text-zinc-600"} hover:text-blue-500 transition-colors mb-4`}>
                      <PlusCircle className="w-4 h-4" />
                      <span>New Note</span>
                    </button>
                  )}

                  {(isCreatingNote || editingNoteId) && (
                    <div className={`${isDark ? "bg-zinc-800" : "bg-white"} rounded-lg p-4 mb-4`}>
                      <input
                        type="text"
                        id="note-title-input"
                        name="note-title"
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                        onFocus={() => {
                          if (!hasShownWarning) {
                            setShowWarning(true);
                          }
                        }}
                        placeholder="Note title..."
                        className={`w-full mb-2 bg-transparent outline-none ${isDark ? "text-zinc-100" : "text-zinc-900"} placeholder-zinc-500 text-lg font-medium`}
                      />
                      <textarea
                        id="note-content-input"
                        name="note-content"
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        onFocus={() => {
                          if (!hasShownWarning) {
                            setShowWarning(true);
                          }
                        }}
                        placeholder="Start typing..."
                        rows={4}
                        className={`w-full bg-transparent outline-none ${isDark ? "text-zinc-100" : "text-zinc-900"} placeholder-zinc-500 resize-none`}
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={() => {
                            setIsCreatingNote(false);
                            setEditingNoteId(null);
                            setNoteTitle("");
                            setNoteContent("");
                          }}
                          className="px-3 py-1 text-sm bg-white text-black rounded border border-zinc-200 hover:bg-zinc-50">
                          Cancel
                        </button>
                        <button
                          onClick={() =>
                            editingNoteId ? handleUpdateNote(editingNoteId) : handleCreateNote()
                          }
                          className="px-3 py-1 text-sm bg-black text-white rounded hover:bg-zinc-800">
                          {editingNoteId ? "Save" : "Create"}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {notes.map((note) => (
                      <div
                        key={note._id}
                        className={`rounded-lg p-4 group border ${isDark ? "border-zinc-700 bg-zinc-800" : "border-zinc-300 bg-white"}`}>
                        <div className="flex justify-between items-start mb-2">
                          <h3
                            className={`font-medium ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                            {note.title}
                          </h3>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() =>
                                setExpandedNotes((prev) => ({
                                  ...prev,
                                  [note._id]: !prev[note._id],
                                }))
                              }
                              className={`${iconClasses} hover:text-blue-500 transition-colors`}>
                              {expandedNotes[note._id] ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => copyNoteContent(note.content, note._id)}
                              className={`${iconClasses} hover:text-blue-500 transition-colors`}>
                              {copiedNoteId === note._id ? "Copied!" : <Copy className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => {
                                setEditingNoteId(note._id);
                                setNoteTitle(note.title);
                                setNoteContent(note.content);
                              }}
                              className={`${iconClasses} hover:text-blue-500 transition-colors`}>
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm("Delete this note?")) {
                                  deleteNote({ id: note._id });
                                }
                              }}
                              className={`${iconClasses} hover:text-red-500 transition-colors`}>
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className={`${textClasses} whitespace-pre-wrap`}>
                          {expandedNotes[note._id] ? (
                            <ReactMarkdown
                              components={{
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
                                    <code
                                      className="bg-zinc-200 dark:bg-zinc-700 px-1 py-0.5 rounded"
                                      {...props}>
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
                              {note.content}
                            </ReactMarkdown>
                          ) : note.content.length > 250 ? (
                            `${note.content.slice(0, 250)}...`
                          ) : (
                            note.content
                          )}
                        </div>
                        <div className={`text-xs ${mutedTextClasses} mt-2`}>
                          Last updated: {new Date(note.updatedAt).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Docs Section - Full Width */}
          <div className="w-full">
            <h2 className={`text-xl font-normal mb-3 tracking-tighter ${iconClasses}`}>
              Collaborative Docs <span className="text-sm">(Public)</span>
            </h2>
            <div className={`${cardClasses} rounded-lg p-4 shadow border border-zinc-300`}>
              <TipTapEditor />
            </div>
          </div>
        </div>
        {/* space start */}
        <section className="relative bg-[#F5F5F4] w-full py-6 px-4 mt-1">
          <div className="max-w-7xl mx-auto text-center">
            <p></p>
          </div>
        </section>
        {/* space end */}
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

      {/* Footer 
      <section className="relative bg-[#F5F5F4] w-full py-6 px-4 mt-1">
        <div className="max-w-7xl mx-auto text-center">
          <p></p>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="relative w-full py-6 px-4 mt-5">
        <div className="max-w-7xl mx-auto text-center">
          <p className={`${iconClasses} text-sm mb-2`}>
            All data is cleared every five hours via{" "}
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

      {/* Features Modal */}
      {showFeaturesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div
            className={`${cardClasses} rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative`}>
            <button
              onClick={() => setShowFeaturesModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100 transition-colors">
              <X className="w-6 h-6" />
            </button>

            <h2 className={`text-2xl font-normal tracking-tighter ${textClasses} mb-6`}>
              Features
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className={`text-lg font-medium ${textClasses} mb-3`}>Real-time Chat</h3>
                <ul className={`list-disc pl-5 space-y-2 ${textClasses}`}>
                  <li>Send and receive chat messages instantly</li>
                  <li>AI-powered chat responses using "@ai" command</li>
                  <li>Create reminders by typing "remind me" in chat</li>
                  <li>Create notes by typing "note:" in chat</li>
                  <li>Search functionality for messages</li>
                  <li>Like messages and see like counts</li>
                  <li>Send emoji reactions</li>
                  <li>Message sound notifications with mute control</li>
                </ul>
              </div>

              <div>
                <h3 className={`text-lg font-medium ${textClasses} mb-3`}>Notes</h3>
                <ul className={`list-disc pl-5 space-y-2 ${textClasses}`}>
                  <li>Create and manage notes for each page</li>
                  <li>Rich text editing support</li>
                  <li>Title and content organization</li>
                  <li>Preview with content truncation</li>
                  <li>Copy note content with one click</li>
                  <li>Real-time updates across all clients</li>
                </ul>
              </div>

              <div>
                <h3 className={`text-lg font-medium ${textClasses} mb-3`}>Reminders/Todos</h3>
                <ul className={`list-disc pl-5 space-y-2 ${textClasses}`}>
                  <li>Create and manage public reminders</li>
                  <li>Toggle completion status</li>
                  <li>Upvote and downvote reminders</li>
                  <li>Real-time updates across all connected clients</li>
                  <li>Delete reminders with hover controls</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`${cardClasses} rounded-lg max-w-md w-full p-6 relative`}>
            <h2 className={`text-xl font-medium ${textClasses} mb-4`}>⚠️ Public Demo Warning</h2>
            <p className={`${textClasses} mb-6`}>
              Any text you enter in this demo is publicly visible to showcase Convex sync features.
              Please be kind!
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowWarning(false);
                  setHasShownWarning(true);
                  localStorage.setItem("hasShownWarning", "true");
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  const defaultPage = useQuery(api.pages.getPageBySlug, { slug: "default" });
  const createDefaultPage = useMutation(api.pages.createPage);
  const sendPageMessage = useMutation(api.pageMessages.send);

  useEffect(() => {
    if (defaultPage === null)
      createDefaultPage({ slug: "default", title: "Default Page" })
        .then((pageId) => {
          if (pageId) {
            sendPageMessage({
              pageId,
              text: 'Start typing to chat, use "@ai" to ask OpenAI, type "remind me" to set a reminder, or type "note:" to create a new note.',
              sender: "System",
            });
          }
        })
        .catch((error) => {
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
