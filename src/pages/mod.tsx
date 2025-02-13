import React from "react";
import { useUser, UserButton } from "@clerk/clerk-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import NotFound from "./NotFound";

const AdminDashboard = () => {
  const { user } = useUser();

  // If no user or not admin, show 404
  if (!user || user.publicMetadata?.role !== "admin") return <NotFound />;

  const messages = useQuery(api.messages.get) ?? [];
  const todos = useQuery(api.todos.get) ?? [];

  const deleteAllMessages = useMutation(api.messages.deleteAllMessages);
  const deleteAllTodos = useMutation(api.todos.deleteAllTodos);
  const deleteMessage = useMutation(api.messages.deleteMessage);
  const deleteTodo = useMutation(api.todos.remove);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="relative w-full py-6 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center font-['Inter']">
          <h1 className="text-xl font-normal flex flex-col md:flex-row items-center gap-2">
            <a href="/" target="_blank" rel="noopener noreferrer">
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
            <UserButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-8 font-sans flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-normal">Admin Dashboard</h1>
            <div className="text-sm text-gray-600">{user?.emailAddresses[0]?.emailAddress}</div>
          </div>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Chat Messages</h2>
            <button
              className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={async () => {
                if (window.confirm("Are you sure you want to delete all chat messages?")) {
                  await deleteAllMessages();
                }
              }}>
              Delete All Chat Messages
            </button>
            <div className="space-y-2">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className="p-2 border rounded flex justify-between items-center">
                  <div>
                    <p>
                      <strong>{message.sender}</strong>: {message.text}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(message.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={async () => {
                      if (window.confirm("Delete this message?")) {
                        await deleteMessage({ id: message._id });
                      }
                    }}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Reminders</h2>
            <button
              className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={async () => {
                if (window.confirm("Are you sure you want to delete all reminders?")) {
                  await deleteAllTodos();
                }
              }}>
              Delete All Reminders
            </button>
            <div className="space-y-2">
              {todos.map((todo) => (
                <div
                  key={todo._id}
                  className="p-2 border rounded flex justify-between items-center">
                  <div>
                    <p>{todo.text}</p>
                    <p className="text-xs text-gray-500">
                      Completed: {todo.completed ? "Yes" : "No"}
                    </p>
                  </div>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={async () => {
                      if (window.confirm("Delete this reminder?")) {
                        await deleteTodo({ id: todo._id });
                      }
                    }}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative w-full py-6 px-4 mt-[0px]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm mb-2 text-gray-600">
            All Chats and Reminders are cleared daily via{" "}
            <a
              href="https://docs.convex.dev/scheduling/cron-jobs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:opacity-80 transition-opacity">
              Convex Cron Jobs
            </a>
          </p>
          <p className="text-sm text-gray-600">
            Open Source and built with with ❤️ at{" "}
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

export default AdminDashboard;
