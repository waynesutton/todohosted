import React from "react";
import { SignedIn, SignedOut, SignIn, useUser, UserButton } from "@clerk/clerk-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

const AdminDashboard = () => {
  const { user } = useUser();
  const messages = useQuery(api.messages.get) ?? [];
  const todos = useQuery(api.todos.get) ?? [];
  const pages = useQuery(api.pages.list) ?? [];

  const deleteAllMessages = useMutation(api.messages.deleteAllMessages);
  const deleteAllTodos = useMutation(api.todos.deleteAllTodos);
  const deleteMessage = useMutation(api.messages.deleteMessage);
  const deleteTodo = useMutation(api.todos.remove);
  const deleteAllPageDocs = useMutation(api.docs.deleteAllPageDocs);

  return (
    <div className="p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Logged in as: {user?.emailAddresses[0]?.emailAddress}</span>
            <UserButton />
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Pages</h2>
          <div className="space-y-4">
            {pages.map((page) => {
              const pageDocs = useQuery(api.docs.getPageDocs, { pageId: page._id }) ?? [];
              return (
                <div key={page._id} className="p-4 border rounded">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">{page.title}</h3>
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={async () => {
                        if (window.confirm("Delete all docs for this page?")) {
                          await deleteAllPageDocs({ pageId: page._id });
                        }
                      }}>
                      Delete All Docs
                    </button>
                  </div>
                  <div className="space-y-2">
                    {pageDocs.map((doc) => (
                      <div
                        key={doc._id}
                        className="p-2 border rounded flex justify-between items-center">
                        <div>
                          <p className="font-medium">{doc.title}</p>
                          <p className="text-xs text-gray-500">
                            Last updated: {new Date(doc.updatedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

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
              <div key={todo._id} className="p-2 border rounded flex justify-between items-center">
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
  );
};

const Header = () => (
  <header className="relative w-full py-6 px-4 bg-white border-b">
    <div className="max-w-7xl mx-auto flex justify-between items-center font-['Inter']">
      <a href="/" className="text-xl font-normal text-gray-900 hover:underline">
        Home
      </a>
      <div className="flex items-center gap-6">
        <a
          href="https://convex.link/chatsynclinks"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm hover:opacity-80 transition-opacity">
          Convex
        </a>
        <a
          href="https://docs.convex.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm hover:opacity-80 transition-opacity">
          Docs
        </a>
      </div>
    </div>
  </header>
);

const Footer = () => (
  <footer className="relative w-full py-6 px-4 mt-[40px] bg-white border-t">
    <div className="max-w-7xl mx-auto text-center">
      <p className="text-sm mb-2 text-gray-500">
        All Chats and Reminders are cleared daily.{" "}
        <a
          href="https://www.cronvex.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:opacity-80 transition-opacity">
          Learn more at Cronvex
        </a>
        .
      </p>
      <p className="text-sm text-gray-500">
        Built with ❤️ at{" "}
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
);

const ModPageContent = () => (
  <>
    <Header />
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1">
        <SignedIn>
          <AdminDashboard />
        </SignedIn>
        <SignedOut>
          <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
              <SignIn afterSignInUrl="/mod" />
            </div>
          </div>
        </SignedOut>
      </div>
    </div>
    <Footer />
  </>
);

const ModPage = () => {
  return <ModPageContent />;
};

export default ModPage;
