# TodoHosted / Chat Application

An open source chat and reminder application built with Convex, Clerk, and React. This application features real-time chat, task management, and an administrative dashboard for moderation.

## Features

- **Real-time Chat:**
  - Send and receive chat messages instantly.
  - Search functionality for messages.
- **Reminders/Todos:**

  - Create and manage reminders (todos).
  - Toggle completion status and vote on reminders.

- **Admin Dashboard:**

  - Moderation dashboard available at `/mod`.
  - Sign in using Clerk to manage your profile and sign out.
  - View and delete individual or all chat messages and reminders.

- **Authentication:**
  - User sign-in and profile management provided by Clerk.

## Stack

- **Frontend:**

  - **Language:** TypeScript
  - **Library:** React
  - **Build Tool:** Vite
  - **Styling:** Tailwind CSS
  - **Routing:** React Router

- **Backend:**

  - **Database & Serverless Functions:** Convex

- **Authentication:**

  - Clerk (for user sign-in and profile management)

- **Hosting:**
  - Hosted on Netlify

## How It Works

1. **Real-time Data:**  
   The frontend subscribes to Convex for real-time updates. New chat messages and reminders appear instantly.

2. **Serverless Functions:**  
   Business logic (sending messages, toggling reminders, vector search for chat, etc.) is implemented as Convex mutations and queries.

3. **Authentication & Admin:**  
   Clerk is integrated for secure user authentication. The admin dashboard (`/mod`) allows moderators to sign in, manage their profile via the UserButton, and perform moderation actions (delete individual or all messages/reminders).

4. **Deployment:**  
   The application is hosted on Netlify and uses Convex Cloud as the backend database and serverless functions platform.

## Installation & Running Locally

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd todohosted
   ```

2. **Install dependencies:**

   ```bash
   bun install
   # or use npm/yarn if preferred
   ```

3. **Configure Environment Variables:**  
   Create an `.env.local` file with:

   ```env
   VITE_CONVEX_URL=Your Convex URL
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

4. **Run the Application:**

   ```bash
   bun dev
   ```

5. **Access:**
   - Main app: [http://localhost:3000](http://localhost:3000)
   - Admin dashboard: [http://localhost:3000/mod](http://localhost:3000/mod)

## Open Source

This project is open source. Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License.
