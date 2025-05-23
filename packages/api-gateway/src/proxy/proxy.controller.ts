import { All, Controller, HttpStatus, Next, Req, Res } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const routes: Record<string, string> = {
  "/auth": "http://localhost:3001/auth",
  "/user": "http://localhost:3001/user",
  "/admin": "http://localhost:3001/admin",
  "/programs": "http://localhost:3002/programs",
  "/participants": "http://localhost:3002/participants",
  "/taxonomy": "http://localhost:3003/taxonomy",
  "/search": "http://localhost:3004/search",
  "/posts": "http://localhost:3005/posts",
  "/comments": "http://localhost:3005/comments",
  "/feed": "http://localhost:3004/feed",
};

const proxyMiddlewares: Record<
  string,
  ReturnType<typeof createProxyMiddleware>
> = {};

// Pre-create proxy middlewares for each route
for (const [route, target] of Object.entries(routes)) {
  proxyMiddlewares[route] = createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: {
      [`^/api${route}`]: "", // strip /api and service prefix
    },
  });
}

@Controller("api")
export class ProxyController {
  @All("*path")
  handleRequest(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    const path = req.path.replace(/^\/api/, "");

    const matchedRoute = Object.keys(routes).find((prefix) =>
      path.startsWith(prefix),
    );

    if (!matchedRoute) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "Service not found" });
    }

    return proxyMiddlewares[matchedRoute](req, res, next);
  }
}
