import { ClerkProvider } from "@clerk/clerk-react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function MyApp({ Component, pageProps }) {
  return (
    <ConvexProvider client={convex}>
      <Component {...pageProps} />
    </ConvexProvider>
  );
}

export default MyApp; 