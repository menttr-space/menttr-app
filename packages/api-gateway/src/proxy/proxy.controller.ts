import { All, Controller, HttpStatus, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const routes: Record<string, string> = {};

@Controller()
export class ProxyController {
  @All("*")
  handleRequest(@Req() req: Request, @Res() res: Response) {
    const route = Object.keys(routes).find((path) => req.path.startsWith(path));
    if (!route) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "Service not found" });
    }

    const proxy = createProxyMiddleware({
      target: routes[route],
      changeOrigin: true,
      pathRewrite: (path) => path.replace(route, ""),
    });

    return proxy(req, res, () => null);
  }
}
