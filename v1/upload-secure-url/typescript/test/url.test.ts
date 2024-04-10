import { getUrl } from "../common/handlers";

describe("getUrl", () => {
  test("should return a signed URL for an image upload", async () => {
    const mockCtx = {
      req: {
        params: { id: "123" },
        path: "/images/123/upload",
      },
      res: { json: jest.fn() },
    };
    await getUrl(mockCtx);
    expect(mockCtx.res.json).toHaveBeenCalledWith({
      url: expect.stringContaining("SignedHeaders"),
    });
  });

  test("should return a signed URL for an image download", async () => {
    const mockCtx = {
      req: {
        params: { id: "123" },
        path: "/images/123/download",
      },
      res: { json: jest.fn() },
    };
    await getUrl(mockCtx);
    expect(mockCtx.res.json).toHaveBeenCalledWith({
      url: expect.stringContaining("SignedHeaders"),
    });
  });
});
