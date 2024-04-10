import { speak } from "../common/handlers";

describe("speak", () => {
  let ctx;

  beforeEach(() => {
    ctx = {
      req: {
        params: {
          animal: "dog",
        },
      },
      res: {
        json: jest.fn(),
        status: jest.fn(),
      },
    };
  });

  it("should return a greeting for a valid animal", async () => {
    const mockSayHelloMock = jest.fn(() => "Woof!");
    jest.mock("../animals/dog/greeting", () => ({
      sayHello: mockSayHelloMock,
    }));

    await speak(ctx);

    expect(mockSayHelloMock).toHaveBeenCalled();
    expect(ctx.res.json).toHaveBeenCalledWith({ message: "Woof!" });
    expect(ctx.res.status).not.toHaveBeenCalled();
  });
});
