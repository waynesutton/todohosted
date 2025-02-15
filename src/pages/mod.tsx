import React, { useState } from "react";
import { useUser, UserButton } from "@clerk/clerk-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import NotFound from "./NotFound";
import { Menu, Sun, Moon, X } from "lucide-react";

const AdminDashboard = () => {
  // User and auth hooks
  const { user } = useUser();

  // State hooks
  const [newPageSlug, setNewPageSlug] = useState("");
  const [newPageTitle, setNewPageTitle] = useState("");
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("adminDarkMode");
      return saved ? JSON.parse(saved) : window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Query hooks
  const pages = useQuery(api.pages.getPages) ?? [];
  const defaultPage = useQuery(api.pages.getPageBySlug, { slug: "default" });
  const messages = defaultPage
    ? (useQuery(api.pageMessages.getMessages, { pageId: defaultPage._id }) ?? [])
    : [];
  const todos = defaultPage ? (useQuery(api.todos.get, { pageId: defaultPage._id }) ?? []) : [];

  // Mutation hooks
  const createPage = useMutation(api.pages.createPage);
  const deletePage = useMutation(api.pages.deletePage);
  const togglePageStatus = useMutation(api.pages.togglePageStatus);
  const deleteAllMessages = useMutation(api.pageMessages.deleteAllMessages);
  const deleteAllTodos = useMutation(api.todos.deleteAllTodos);
  const deleteMessage = useMutation(api.pageMessages.deleteMessage);
  const deleteTodo = useMutation(api.todos.remove);
  const sendPageMessage = useMutation(api.pageMessages.send);
  const toggleLike = useMutation(api.pageMessages.toggleLike);
  const getMessages = useMutation(api.pageMessages.getMessages);

  // Effect hooks
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("adminDarkMode", JSON.stringify(isDark));
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [isDark]);

  // If no user or not admin, show 404
  if (!user || user.publicMetadata?.role !== "admin") return <NotFound />;

  const bgClasses = isDark ? "bg-zinc-900" : "bg-[#F5F5F4]";
  const cardClasses = isDark ? "bg-zinc-800" : "bg-white";
  const textClasses = isDark ? "text-zinc-100" : "text-zinc-900";
  const mutedTextClasses = isDark ? "text-zinc-400" : "text-zinc-600";

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
        window.location.href = `/${newPageSlug.trim()}`;
      }
    } catch (error) {
      console.error("Failed to create page:", error);
      alert("Failed to create page. The URL might already be in use.");
    }
  };

  const handleDownloadCsv = async (page: { _id: string; slug: string }) => {
    const pageMessages = await getMessages({ pageId: page._id });
    const csvContent = [
      ["Timestamp", "Sender", "Message", "Likes"].join(","),
      ...pageMessages.map((msg) =>
        [
          new Date(msg.timestamp).toLocaleString(),
          msg.sender,
          `"${msg.text.replace(/"/g, '""')}"`,
          msg.likes ?? 0,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${page.slug}-chat-messages.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen flex flex-col ${bgClasses} ${textClasses}`}>
      {/* Header */}
      <header className={`relative w-full py-6 px-4 ${cardClasses}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center font-['Inter']">
          <h1 className="text-xl font-normal flex flex-col md:flex-row items-center gap-2">
            <a href="/" target="_blank" rel="noopener noreferrer">
              <img
                src={isDark ? "/convex-logo-white.svg" : "/convex-logo-black.svg"}
                alt="Convex Logo"
                className="h-4"
              />
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
              className={`${mutedTextClasses} hover:opacity-80 transition-opacity`}>
              Convex
            </a>
            <a
              href="https://docs.convex.dev"
              target="_blank"
              rel="noopener noreferrer"
              className={`${mutedTextClasses} hover:opacity-80 transition-opacity`}>
              Docs
            </a>
            <a
              href="https://stack.convex.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className={`${mutedTextClasses} hover:opacity-80 transition-opacity`}>
              Blog
            </a>
            <button
              onClick={() => setIsDark(!isDark)}
              className={`${mutedTextClasses} hover:opacity-80 transition-opacity`}>
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <UserButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-8 font-sans flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-normal">Admin Dashboard</h1>
            {/* <div className="text-sm text-gray-600">{user?.emailAddresses[0]?.emailAddress}</div> */}
          </div>

          {/* Create New Page Section */}
          <section className={`mb-8 ${cardClasses} p-6 rounded-lg shadow`}>
            <h2 className="text-xl font-semibold mb-4">Create New Page</h2>
            <form onSubmit={handleCreatePage} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${mutedTextClasses} mb-1`}>
                  Page URL (slug)
                </label>
                <input
                  type="text"
                  value={newPageSlug}
                  onChange={(e) => setNewPageSlug(e.target.value)}
                  placeholder="e.g., team-chat"
                  className={`w-full p-2 border rounded ${isDark ? "bg-zinc-700 border-zinc-600" : "bg-white border-zinc-200"} ${textClasses}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${mutedTextClasses} mb-1`}>
                  Page Title
                </label>
                <input
                  type="text"
                  value={newPageTitle}
                  onChange={(e) => setNewPageTitle(e.target.value)}
                  placeholder="e.g., Team Chat"
                  className={`w-full p-2 border rounded ${isDark ? "bg-zinc-700 border-zinc-600" : "bg-white border-zinc-200"} ${textClasses}`}
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Create Page
              </button>
            </form>
          </section>

          {/* Manage Pages Section */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Manage Pages</h2>
            <div className="space-y-4">
              {pages.map((page) => (
                <div
                  key={page._id}
                  className={`p-4 border rounded-lg ${cardClasses} ${isDark ? "border-zinc-700" : "border-zinc-200"} flex justify-between items-center`}>
                  <div>
                    <h3 className="font-medium">{page.title}</h3>
                    <p className={mutedTextClasses}>/{page.slug}</p>
                    <p className="text-xs text-gray-400">
                      Created: {new Date(page.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`/${page.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                      View
                    </a>
                    <button
                      onClick={() => togglePageStatus({ id: page._id })}
                      className={`px-3 py-1 rounded ${page.isActive ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"} text-white`}>
                      {page.isActive ? "Disable" : "Enable"}
                    </button>
                    <button
                      onClick={() => handleDownloadCsv(page)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                      Download Chat CSV
                    </button>
                    <button
                      onClick={async () => {
                        if (window.confirm("Delete all chat messages for this page?")) {
                          await deleteAllMessages({ pageId: page._id });
                        }
                      }}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                      Clear Chat
                    </button>
                    <button
                      onClick={async () => {
                        if (window.confirm("Delete all todos for this page?")) {
                          await deleteAllTodos({ pageId: page._id });
                        }
                      }}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                      Clear Todos
                    </button>
                    {page.slug !== "default" && (
                      <button
                        onClick={() => {
                          if (window.confirm("Delete this page and all its data?")) {
                            deletePage({ id: page._id });
                          }
                        }}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Chat Messages</h2>
            {/* <button
              className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={async () => {
                if (window.confirm("Are you sure you want to delete all chat messages?")) {
                  await deleteAllMessages();
                }
              }}>
              Delete All Chat Messagess
            </button> */}
            <div className="space-y-2">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`p-2 border rounded flex justify-between items-center ${cardClasses} ${isDark ? "border-zinc-700" : "border-zinc-200"}`}>
                  <div>
                    <p>
                      <strong>{message.sender}</strong>: {message.text}
                    </p>
                    <p className={`text-xs ${mutedTextClasses}`}>
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
            {/* <button
              className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={async () => {
                if (window.confirm("Are you sure you want to delete all reminders?")) {
                  await deleteAllTodos();
                }
              }}>
              Delete All Reminderss
            </button> */}
            <div className="space-y-2">
              {todos.map((todo) => (
                <div
                  key={todo._id}
                  className={`p-2 border rounded flex justify-between items-center ${cardClasses} ${isDark ? "border-zinc-700" : "border-zinc-200"}`}>
                  <div>
                    <p>{todo.text}</p>
                    <p className={`text-xs ${mutedTextClasses}`}>
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
      <footer className={`relative w-full py-6 px-4 mt-[0px] ${cardClasses}`}>
        <div className="max-w-7xl mx-auto text-center">
          <p className={`text-sm mb-2 ${mutedTextClasses}`}>
            All Chats and Reminders are cleared daily via{" "}
            <a
              href="https://docs.convex.dev/scheduling/cron-jobs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:opacity-80 transition-opacity">
              Convex Cron Jobs
            </a>
          </p>
          <p className={`text-sm ${mutedTextClasses}`}>
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

export const ModPage = AdminDashboard;
export default ModPage;
