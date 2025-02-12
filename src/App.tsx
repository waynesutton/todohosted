import React, { useState, useEffect, useRef } from "react";
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
} from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

const HAPPY_EMOJIS = ["😊", "😄", "🎉", "✨", "🌟"];

const MessageItem = ({ message, isDark, textClasses }) => {
  const toggleLike = useMutation(api.messages.toggleLike);

  return (
    <div
      className={`${isDark ? "bg-zinc-800/50" : "bg-zinc-100"} rounded-lg p-4 mb-2 animate-glow`}>
      <div className="flex justify-between items-start">
        <div>
          <div className={`${isDark ? "text-zinc-400" : "text-zinc-600"} text-sm mb-1`}>
            {message.sender}
          </div>
          <div className={textClasses}>{message.text}</div>
        </div>
        <button
          onClick={() => toggleLike({ id: message._id })}
          className={`${isDark ? "text-zinc-400" : "text-zinc-600"} hover:text-red-500 transition-colors flex items-center gap-1`}>
          <Heart className={`w-4 h-4 ${message.likes ? "fill-red-500 text-red-500" : ""}`} />
          {message.likes > 0 && <span className="text-sm">{message.likes}</span>}
        </button>
      </div>
    </div>
  );
};

function App() {
  const [isDark, setIsDark] = useState(false);
  const todos = useQuery(api.todos.get) ?? [];
  const messages = useQuery(api.messages.get) ?? [];
  const addTodo = useMutation(api.todos.add);
  const toggleTodo = useMutation(api.todos.toggle);
  const deleteTodo = useMutation(api.todos.remove);
  const sendMessage = useMutation(api.messages.send);
  const upvote = useMutation(api.todos.upvote);
  const downvote = useMutation(api.todos.downvote);

  const [newTodo, setNewTodo] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmitTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    await addTodo({ text: newTodo.trim() });
    setNewTodo("");
  };

  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    await sendMessage({ text: newMessage.trim(), sender: "User" });
    setNewMessage("");
  };

  const sendEmoji = () => {
    const randomEmoji = HAPPY_EMOJIS[Math.floor(Math.random() * HAPPY_EMOJIS.length)];
    sendMessage({ text: randomEmoji, sender: "User" });
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
          <h1 className={`${iconClasses} text-xl font-bold`}>
            <a href="http://convex.dev" target="_blank" rel="noopener noreferrer">
              Convex in Sync Demo
            </a>
          </h1>
          <div className="flex items-center gap-6">
            <a
              href="https://convex.dev"
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
            <button
              onClick={() => setIsDark(!isDark)}
              className={`${iconClasses} hover:opacity-80 transition-opacity`}>
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className={`relative flex-1 flex flex-col items-center px-4 ${bgClasses}`}>
        <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <div className="w-full max-w-7xl flex flex-col md:flex-row gap-6 relative items-start mt-8">
          {/* Todo Column */}
          <div className="flex-1">
            <h2 className={`text-2xl font-bold mb-4 tracking-tighter ${iconClasses}`}>Reminders</h2>
            <div
              className={`${cardClasses} rounded-lg p-6 hover:border-zinc-300 transition-colors`}>
              <form onSubmit={handleSubmitTodo} className="mb-6">
                <div
                  className={`flex items-center gap-4 ${isDark ? "bg-zinc-800" : "bg-white"} rounded-lg p-4`}>
                  <PlusCircle className={`${isDark ? "text-zinc-400" : "text-black"} w-5 h-5`} />
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
                    className={`flex items-center gap-4 p-4 ${isDark ? "bg-zinc-800/50" : "bg-zinc-100"} rounded-lg group`}>
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
                          className={`w-4 h-4 ${todo.upvotes ? "fill-green-500 text-green-500" : ""}`}
                        />
                        {todo.upvotes > 0 && <span className="text-sm">{todo.upvotes}</span>}
                      </button>
                      <button
                        onClick={() => downvote({ id: todo._id })}
                        className={`${iconClasses} hover:text-red-500 transition-colors flex items-center gap-1`}>
                        <ThumbsDown
                          className={`w-4 h-4 ${todo.downvotes ? "fill-red-500 text-red-500" : ""}`}
                        />
                        {todo.downvotes > 0 && <span className="text-sm">{todo.downvotes}</span>}
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

          {/* Chat Column */}
          <div className="flex-1">
            <h2 className={`text-2xl font-bold mb-4 tracking-tighter ${iconClasses}`}>Chat</h2>
            <div className={`${cardClasses} rounded-lg p-6 h-[600px] flex flex-col`}>
              <div className="flex-1 overflow-y-auto mb-4">
                <div className="flex flex-col h-full">
                  <div className="space-y-2 mt-auto">
                    {messages.map((message) => (
                      <MessageItem
                        key={message._id}
                        message={message}
                        isDark={isDark}
                        textClasses={textClasses}
                      />
                    ))}
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
                    placeholder="Type a message..."
                    className={`bg-transparent flex-1 outline-none ${textClasses} placeholder-zinc-500`}
                  />
                  <button
                    type="button"
                    onClick={sendEmoji}
                    className={`${isDark ? "text-zinc-400" : "text-zinc-600"} hover:text-yellow-500 transition-colors`}>
                    <Smile className="w-5 h-5" />
                  </button>
                  <button
                    type="submit"
                    className={`${isDark ? "text-zinc-400" : "text-zinc-600"} hover:text-blue-500 transition-colors`}>
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative w-full py-6 px-4 mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <p className={`${iconClasses} text-sm mb-2`}>
            All Chats and Reminders are cleared daily.{" "}
            <a
              href="https://www.cronvex.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:opacity-80 transition-opacity">
              Learn more at Cronvex
            </a>
          </p>
          <p className={`${iconClasses} text-sm`}>
            Built with ❤️ at{" "}
            <a
              href="https://convex.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity">
              Convex
            </a>
            . Powered by{" "}
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
}

export default App;
