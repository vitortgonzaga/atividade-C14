jest.mock("../src/services/passwordValidationService", () => ({
  validatePassword: jest.fn(),
}));

const {
  validatePasswordController,
} = require("../src/controllers/passwordController");
const {
  validatePassword,
} = require("../src/services/passwordValidationService");

describe("validatePasswordController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve responder 200 com o resultado retornado pelo service", () => {
    const req = {
      body: {
        password: "Abc123!@",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    const mockedResult = {
      valid: true,
      strength: "forte",
      errors: [],
      suggestions: [],
    };

    validatePassword.mockReturnValue(mockedResult);

    validatePasswordController(req, res, next);

    expect(validatePassword).toHaveBeenCalledWith("Abc123!@");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockedResult);
    expect(next).not.toHaveBeenCalled();
  });

  it("deve chamar next quando o service lançar erro", () => {
    const req = {
      body: {
        password: "Abc123!@",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    const error = new Error("Erro inesperado");

    validatePassword.mockImplementation(() => {
      throw error;
    });

    validatePasswordController(req, res, next);

    expect(validatePassword).toHaveBeenCalledWith("Abc123!@");
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
