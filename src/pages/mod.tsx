import React from "react";
import { ClerkProvider, SignedIn, SignedOut, SignIn, useUser } from "@clerk/clerk-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  // Check for admin role
  if (!user?.publicMetadata?.role === "admin") {
    // Redirect non-admins to home page
    window.location.href = "/";
    return null;
  }

  // Optional: restrict access further. For example:
  // if (user?.primaryEmailAddress?.emailAddress !== "admin@example.com") return <div>Access Denied</div>;

  const messages = useQuery(api.messages.get) ?? [];
  const todos = useQuery(api.todos.get) ?? [];

  const deleteAllMessages = useMutation(api.messages.deleteAllMessages);
  const deleteAllTodos = useMutation(api.todos.deleteAllTodos);
  const deleteMessage = useMutation(api.messages.deleteMessage);
  const deleteTodo = useMutation(api.todos.remove); // Individual deletion for todos already exists

  return (
    <div className="p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="text-sm text-gray-600">
            Logged in as: {user?.emailAddresses[0]?.emailAddress}
          </div>
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

const ModPage = () => {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!clerkPubKey) {
    return <div>Missing Clerk Publishable Key</div>;
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <div className="min-h-screen bg-gray-50">
        <SignedIn>
          <AdminDashboard />
        </SignedIn>
        <SignedOut>
          <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
              <SignIn />
            </div>
          </div>
        </SignedOut>
      </div>
    </ClerkProvider>
  );
};

export default ModPage;
