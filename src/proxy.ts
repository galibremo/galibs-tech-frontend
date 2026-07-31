import { NextRequest, NextResponse } from "next/server";
import { route, getDefaultLoginRedirect } from "@/routes/routes";

const PRIVATE_ROUTES = Object.values(route.private).filter(
    (val) => typeof val === "string",
) as string[];

const PROTECTED_ROUTES = Object.values(route.protected).filter(
    (val) => typeof val === "string",
) as string[];

function isRouteMatch(pathname: string, routePath: string): boolean {
    if (routePath === route.public.home) {
        return pathname === route.public.home;
    }

    return pathname === routePath || pathname.startsWith(`${routePath}/`);
}

function matchesAnyRoute(pathname: string, routes: string[]): boolean {
    return routes.some((routePath) => isRouteMatch(pathname, routePath));
}

async function checkAuth(cookieString: string): Promise<{ isAuthenticated: boolean; user?: { role?: string } }> {
    if (!cookieString) return { isAuthenticated: false };

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/auth/session`,
            {
                headers: { Cookie: cookieString },
                cache: "no-store",
            }
        );
        if (!res.ok) return { isAuthenticated: false };
        const json = await res.json();
        return { isAuthenticated: true, user: json.data };
    } catch (error) {
        console.error("Auth proxy fetch error:", error);
        return { isAuthenticated: false };
    }
}

function getPublicAppOrigin(request: NextRequest): string {
    const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;
    if (frontendUrl) {
        try {
            return new URL(frontendUrl).origin;
        } catch {
            // Fall back to the inbound request origin when env is malformed.
        }
    }

    return request.nextUrl.origin;
}

function getPublicRequestUrl(request: NextRequest): URL {
    return new URL(
        `${request.nextUrl.pathname}${request.nextUrl.search}`,
        getPublicAppOrigin(request)
    );
}

export async function proxy(request: NextRequest) {
    const { nextUrl } = request;
    const pathname = nextUrl.pathname;

    const isPrivate = matchesAnyRoute(pathname, PRIVATE_ROUTES);
    const isProtected = matchesAnyRoute(pathname, PROTECTED_ROUTES);

    if (!isPrivate && !isProtected) {
        return NextResponse.next();
    }

    // Check auth
    const cookieString = request.cookies.toString();
    const { isAuthenticated, user } = await checkAuth(cookieString);

    if (isPrivate && !isAuthenticated) {
        const encodedCallbackUrl = encodeURIComponent(getPublicRequestUrl(request).href);

        return NextResponse.redirect(
            new URL(`/login?redirect=${encodedCallbackUrl}`, getPublicAppOrigin(request))
        );
    }

    if (isProtected && isAuthenticated) {
        return NextResponse.redirect(new URL(getDefaultLoginRedirect(user?.role), getPublicAppOrigin(request)));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
