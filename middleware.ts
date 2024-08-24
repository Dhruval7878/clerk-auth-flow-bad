import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
    publicRoutes: ["/auth/sign-in", "/auth/sign-up", "/images(.*)", "/favicon.ico"],
    ignoredRoutes: ["/chatbot"],
})

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
