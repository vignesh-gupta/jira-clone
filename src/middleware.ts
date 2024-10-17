import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "./features/auth/queries";

// TODO: Add redirect on unauthenticated users

export async function middleware(request: NextRequest) {
  return NextResponse.next(); // TODO: Remove this line to explore the following code

  const url = request.nextUrl;

  const ignoreResourcesExt = ["ico", "css", "js", "svg", "png"];
  if (
    url.href.includes("static") ||
    ignoreResourcesExt.some((ext) => url.href.includes(ext)) ||
    url.pathname.includes("api")
  ) {
    return NextResponse.next();
  }

  const user = await getCurrentUser();

  const authRoutes = ["/sign-in", "/sign-up"];
  if (authRoutes.includes(url.pathname)) {
    const searchParams = new URLSearchParams(url.search);
    const redirectUrl = searchParams.get("q") ?? "/";

    if (user) return NextResponse.redirect(new URL(redirectUrl, url.origin));

    return NextResponse.next();
  }

  const publicRoute: string[] = [];

  if (publicRoute.includes(url.pathname)) {
    return NextResponse.next();
  }

  if (!user) {
    const currentUrl = encodeURI(url.pathname);
    return NextResponse.redirect(
      new URL(`/sign-in?q=${currentUrl}`, url.origin)
    );
  }

  return NextResponse.next();
}
