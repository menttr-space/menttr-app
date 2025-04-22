import { Test, TestingModule } from "@nestjs/testing";
import { ProxyController } from "./proxy.controller";
import { Request, Response } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

jest.mock("http-proxy-middleware", () => ({
  createProxyMiddleware: jest.fn(),
}));

describe("ProxyController", () => {
  let controller: ProxyController;

  const mockRequest = (path: string): Partial<Request> => ({
    path,
  });

  const mockResponse = () => {
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    return res as Response;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProxyController],
    }).compile();

    controller = module.get<ProxyController>(ProxyController);
    jest.clearAllMocks();
  });

  it("should return 404 if no matching route is found", () => {
    const req = mockRequest("/nonexistent") as Request;
    const res = mockResponse();

    controller.handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Service not found" });
  });

  it("should call proxy middleware if route matches", () => {
    const req = mockRequest("/users/profile") as Request;
    const res = mockResponse();
    const proxyFn = jest.fn((_req, _res, next) => next());

    (createProxyMiddleware as jest.Mock).mockReturnValue(proxyFn);

    controller.handleRequest(req, res);

    expect(createProxyMiddleware).toHaveBeenCalledWith({
      target: "http://localhost:3001",
      changeOrigin: true,
      pathRewrite: expect.any(Function),
    });

    expect(proxyFn).toHaveBeenCalledWith(req, res, expect.any(Function));
  });
});
