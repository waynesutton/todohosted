# Realtime AI Chat & ToDo List Sync App on Convex

An open source chat and reminder application built with [Convex](https://convex.link/chatsynclinks), Clerk, and React. This application features real-time chat, task management, and an administrative dashboard for moderation.

![Sync Engine Screenshot](https://syncengine.dev/syncenginescreenshot.png)

## Features

- **Real-time Chat:**

  - Send and receive chat messages instantly
  - AI-powered chat responses using "@ai" command
  - Real-time message streaming from OpenAI
  - Create reminders by typing "remind me" in chat
  - Search functionality for messages using vector search
  - Like messages and see like counts
  - Send emoji reactions

- **Reminders/Todos:**

  - Create and manage public reminders
  - Toggle completion status
  - Upvote and downvote reminders
  - Real-time updates across all connected clients
  - Delete reminders with hover controls

- **Admin Dashboard:**

  - Moderation dashboard at `/mod`
  - Sign in using Clerk to manage your profile
  - View and delete individual or all chat messages
  - Manage all reminders from one place

- **Dark/Light Mode:**
  - Toggle between dark and light themes
  - Persists across sessions
  - Beautiful UI transitions

## Stack

- **Frontend:**

  - **Language:** TypeScript
  - **Library:** React
  - **Build Tool:** Vite
  - **Styling:** Tailwind CSS
  - **Routing:** React Router

- **Backend:**

  - **Database & Functions:** [Convex](https://convex.link/chatsynclinks)
  - **AI Integration:** OpenAI GPT-4

- **Authentication:**

  - Clerk (for user sign-in and profile management)

- **Hosting:**
  - Hosted on Netlify

## Detailed Setup Instructions

### 1. Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd todohosted

# Install dependencies
bun install
```

### 2. Convex Setup

1. Install Convex CLI globally:

   ```bash
   npm install -g convex
   ```

2. Initialize Convex:

   ```bash
   npx convex dev
   ```

3. This will create a new Convex project and provide you with a deployment URL. Add this URL to your `.env.local`:
   ```env
   VITE_CONVEX_URL=your_convex_deployment_url
   ```

### 3. OpenAI Configuration

1. Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)

2. Set the OpenAI API key in Convex:

   ```bash
   npx convex env set OPENAI_API_KEY=your_openai_api_key
   ```

3. Verify the key is set:
   ```bash
   npx convex env ls
   ```

### 4. Clerk Authentication Setup

1. Create a new application at [Clerk Dashboard](https://dashboard.clerk.dev)

2. Get your API keys from Clerk Dashboard:

   - Publishable Key
   - Secret Key

3. Add Clerk environment variables to `.env.local`:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

### 5. Admin Role Configuration

1. In your Clerk Dashboard:

   - Go to JWT Templates
   - Create a new template for admin roles
   - Add the following claims:
     ```json
     {
       "role": "admin"
     }
     ```

2. Assign admin role to specific users:

   - Go to Users in Clerk Dashboard
   - Select the user you want to make admin
   - Add metadata:
     ```json
     {
       "role": "admin"
     }
     ```

3. Update the `ModPage.tsx` component to check for admin role:

   ```typescript
   const AdminDashboard = () => {
     const { user } = useUser();
     const isAdmin = user?.publicMetadata?.role === "admin";

     if (!isAdmin) return <div>Access Denied</div>;

     // ... rest of the admin dashboard code
   };
   ```

### 6. Development Environment

1. Start the development server:

   ```bash
   bun dev
   ```

2. Access the application:
   - Main app: [http://localhost:3000](http://localhost:3000)
   - Admin dashboard: [http://localhost:3000/mod](http://localhost:3000/mod)

### 7. Production Deployment

1. Deploy to Netlify:

   ```bash
   netlify deploy --prod
   ```

2. Set environment variables in Netlify:

   - Go to Site settings > Environment variables
   - Add all required environment variables from `.env.local`

3. Configure build settings:
   - Build command: `bun run build`
   - Publish directory: `dist`

## How It Works

1. **Real-time Data Sync:**

   - Messages and reminders sync instantly using Convex's real-time subscriptions
   - No page refreshes needed - everything updates live
   - Vector search enables fast message searching
   - Optimistic updates for instant UI feedback
   - Daily cleanup at 1:00 AM PT (8:00 AM UTC)

2. **Chat Features:**

   - Type "@ai" to get AI responses streamed in real-time
   - Type "remind me" to create a new reminder
   - Click heart icon to like messages
   - Use emoji button for quick reactions
   - Search through message history instantly

3. **Reminder System:**

   - Create reminders directly or via chat
   - Check/uncheck to toggle completion
   - Upvote/downvote to rate importance
   - Hover to reveal delete option
   - All changes sync in real-time

4. **Admin Controls:**

   - Secure admin access via Clerk auth
   - Bulk or individual message deletion
   - Reminder management interface
   - Real-time moderation updates

5. **Search System:**

   - Real-time search as you type
   - Vector-based semantic search
   - Results ranked by relevance
   - Highlights matching messages

6. **Authentication:**
   - Clerk handles user management
   - Role-based access control
   - Secure admin dashboard

## Open Source

This project is open source. Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License.

[![Netlify Status](https://api.netlify.com/api/v1/badges/3ed77b58-4c94-4674-9443-f2ed21fe9669/deploy-status)](https://app.netlify.com/sites/insyc/deploys)
