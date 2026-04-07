const request = require("supertest");
const app = require("../src/app");

describe("API de validação de senha", () => {
  it("deve responder healthcheck com status ok", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("deve validar uma senha forte e retornar todos os campos esperados", async () => {
    const response = await request(app)
      .post("/validate-password")
      .send({ password: "S3nha@MuitoBoa" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      valid: true,
      strength: "forte",
      errors: [],
      suggestions: [],
    });
  });

  it("deve apontar erros e sugestões quando a senha não atende às regras", async () => {
    const response = await request(app)
      .post("/validate-password")
      .send({ password: "abc" });

    expect(response.status).toBe(200);
    expect(response.body.valid).toBe(false);
    expect(response.body.strength).toBe("fraca");
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        "A senha deve ter no mínimo 8 caracteres.",
        "A senha deve conter pelo menos 1 letra maiúscula.",
        "A senha deve conter pelo menos 1 número.",
        "A senha deve conter pelo menos 1 caractere especial.",
      ]),
    );
    expect(response.body.suggestions.length).toBe(response.body.errors.length);
  });

  it("deve rejeitar valores não string com mensagem de validação", async () => {
    const response = await request(app)
      .post("/validate-password")
      .send({ password: 123456 });

    expect(response.status).toBe(200);
    expect(response.body.valid).toBe(false);
    expect(response.body.strength).toBe("fraca");
    expect(response.body.errors).toEqual([
      "O campo password deve ser uma string.",
    ]);
    expect(response.body.suggestions).toEqual([
      "Informe uma senha válida em formato texto.",
    ]);
  });

  it("deve retornar 404 para rotas inexistentes", async () => {
    const response = await request(app).get("/rota-inexistente");

    expect(response.status).toBe(404);
  });
});