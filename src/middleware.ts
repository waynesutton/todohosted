import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/"], // Add your public routes
  afterAuth(auth, req) {
    // Redirect if not admin trying to access /mod
    if (req.url.includes("/mod") && auth.user?.publicMetadata?.role !== "admin") {
      return Response.redirect("/");
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
