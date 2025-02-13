# TodoHosted / Chat Application

An open source chat and reminder application built with Convex, Clerk, and React. This application features real-time chat, task management, and an administrative dashboard for moderation.

## Features

- **Real-time Chat:**
  - Send and receive chat messages instantly
  - AI-powered chat responses using "@ai" command
  - Real-time message streaming from OpenAI
  - Search functionality for messages using vector search
- **Reminders/Todos:**

  - Create and manage reminders (todos)
  - Toggle completion status and vote on reminders
  - Real-time updates across all connected clients

- **Admin Dashboard:**

  - Moderation dashboard available at `/mod`
  - Sign in using Clerk to manage your profile and sign out
  - View and delete individual or all chat messages and reminders

- **Authentication:**
  - User sign-in and profile management provided by Clerk

## Stack

- **Frontend:**

  - **Language:** TypeScript
  - **Library:** React
  - **Build Tool:** Vite
  - **Styling:** Tailwind CSS
  - **Routing:** React Router

- **Backend:**

  - **Database & Functions:** Convex
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

1. **Real-time Data Sync with Convex:**

   - All data is automatically synchronized across clients using Convex's real-time subscriptions
   - Messages and todos are instantly updated without page refreshes
   - Vector search indexes enable efficient message searching
   - Optimistic updates provide instant UI feedback

2. **AI Integration:**

   - Type "@ai" in the chat to trigger AI responses
   - Messages are streamed in real-time from OpenAI's GPT-4
   - AI responses are processed through Convex's streaming actions
   - Vector embeddings are generated for efficient message searching

3. **Data Flow:**

   ```
   Client Action -> Convex Mutation -> Database Update -> Real-time Updates to All Clients
                                  -> AI Action (if @ai) -> Stream Response -> Real-time Updates
   ```

4. **Message Processing:**

   - Regular messages are stored with vector embeddings for search
   - AI messages are processed in chunks and streamed to clients
   - All messages support real-time likes and moderation

5. **Search Functionality:**

   - Messages are indexed using Convex's vector search
   - Search results update in real-time as you type
   - Results are ranked by relevance using vector similarity

6. **Authentication & Admin:**  
   Clerk handles user authentication. The admin dashboard allows moderators to manage content.

7. **Deployment:**  
   The application uses Convex Cloud for the backend, Netlify for hosting, and integrates with OpenAI's API for AI features

## Open Source

This project is open source. Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License.

[![Netlify Status](https://api.netlify.com/api/v1/badges/3ed77b58-4c94-4674-9443-f2ed21fe9669/deploy-status)](https://app.netlify.com/sites/insyc/deploys)
