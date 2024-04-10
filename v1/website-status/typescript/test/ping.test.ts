import { handlePing } from "../common/handlers";

describe("handlePing", () => {
  it("should return an up status for a valid URL", async () => {
    const ctx = {
      req: {
        json: () => ({ url: "https://www.google.com" }),
      },
      res: {
        body: {},
      },
    };

    await handlePing(ctx);

    expect(ctx.res.body).toEqual({
      status: true,
      url: "https://www.google.com",
    });
  });

  it("should return a down status for an invalid URL", async () => {
    const ctx = {
      req: {
        json: () => ({ url: "https://www.invalid-website.com" }),
      },
      res: {
        body: {},
      },
    };

    await handlePing(ctx);

    expect(ctx.res.body).toEqual({
      status: false,
      url: "https://www.invalid-website.com",
    });
  });

  it("should prepend https:// to the URL if it does not start with http: or https:", async () => {
    const ctx = {
      req: {
        json: () => ({ url: "example.com" }),
      },
      res: {
        body: {},
      },
    };

    await handlePing(ctx);

    expect(ctx.res.body).toEqual({
      status: true,
      url: "https://example.com",
    });
  });
});
