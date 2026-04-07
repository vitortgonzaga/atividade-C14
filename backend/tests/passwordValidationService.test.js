const {
  validatePassword,
  calculateStrength,
} = require("../src/services/passwordValidationService");

describe("calculateStrength", () => {
  it("deve retornar fraca para score até 3", () => {
    expect(calculateStrength(0)).toBe("fraca");
    expect(calculateStrength(3)).toBe("fraca");
  });

  it("deve retornar media para score 4 e 5", () => {
    expect(calculateStrength(4)).toBe("media");
    expect(calculateStrength(5)).toBe("media");
  });

  it("deve retornar forte para score 6", () => {
    expect(calculateStrength(6)).toBe("forte");
  });
});

describe("validatePassword - casos válidos", () => {
  it("deve validar senha forte completa", () => {
    const result = validatePassword("Abcdef1!");

    expect(result.valid).toBe(true);
    expect(result.strength).toBe("forte");
    expect(result.errors).toHaveLength(0);
    expect(result.suggestions).toHaveLength(0);
  });

  it("deve validar senha forte longa", () => {
    const result = validatePassword("SenhaMuitoF0rte!2026");

    expect(result.valid).toBe(true);
    expect(result.strength).toBe("forte");
  });

  it("deve validar senha no limite mínimo de tamanho", () => {
    const result = validatePassword("Aa1!aaaa");

    expect(result.valid).toBe(true);
    expect(result.strength).toBe("forte");
  });
});

describe("validatePassword - força fraca e média", () => {
  it("deve classificar como fraca quando poucos critérios são atendidos", () => {
    const result = validatePassword("abc");

    expect(result.valid).toBe(false);
    expect(result.strength).toBe("fraca");
  });

  it("deve classificar como média quando 4 critérios são atendidos", () => {
    const result = validatePassword("Abcdefgh1");

    expect(result.valid).toBe(false);
    expect(result.strength).toBe("media");
    expect(result.errors).toContain(
      "A senha deve conter pelo menos 1 caractere especial.",
    );
  });

  it("deve classificar como média quando 5 critérios são atendidos", () => {
    const result = validatePassword("Abcdefg!1 ");

    expect(result.valid).toBe(false);
    expect(result.strength).toBe("media");
    expect(result.errors).toContain("A senha não pode conter espaços.");
  });
});

describe("validatePassword - regras de erro", () => {
  it("deve falhar para senha curta", () => {
    const result = validatePassword("Ab1!a");

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("A senha deve ter no mínimo 8 caracteres.");
  });

  it("deve falhar sem letra maiúscula", () => {
    const result = validatePassword("abcdef1!");

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "A senha deve conter pelo menos 1 letra maiúscula.",
    );
  });

  it("deve falhar sem letra minúscula", () => {
    const result = validatePassword("ABCDEF1!");

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "A senha deve conter pelo menos 1 letra minúscula.",
    );
  });

  it("deve falhar sem número", () => {
    const result = validatePassword("Abcdefg!");

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("A senha deve conter pelo menos 1 número.");
  });

  it("deve falhar sem caractere especial", () => {
    const result = validatePassword("Abcdefg1");

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "A senha deve conter pelo menos 1 caractere especial.",
    );
  });

  it("deve falhar quando contém espaço", () => {
    const result = validatePassword("Abcd ef1!");

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("A senha não pode conter espaços.");
  });
});

describe("validatePassword - casos extremos", () => {
  it("deve falhar com null", () => {
    const result = validatePassword(null);

    expect(result.valid).toBe(false);
    expect(result.strength).toBe("fraca");
    expect(result.errors).toContain("O campo password deve ser uma string.");
  });

  it("deve falhar com undefined", () => {
    const result = validatePassword(undefined);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("O campo password deve ser uma string.");
  });

  it("deve falhar com string vazia", () => {
    const result = validatePassword("");

    expect(result.valid).toBe(false);
    expect(result.strength).toBe("fraca");
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("deve falhar com número como entrada", () => {
    const result = validatePassword(123456789);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("O campo password deve ser uma string.");
  });
});

describe("validatePassword - sugestões e consistência", () => {
  it("deve retornar sugestões para cada erro encontrado", () => {
    const result = validatePassword("abc");

    expect(result.errors.length).toBe(result.suggestions.length);
    expect(result.suggestions.length).toBeGreaterThan(0);
  });

  it("deve retornar arrays vazios para senha válida", () => {
    const result = validatePassword("Xyz12345!");

    expect(result.errors).toEqual([]);
    expect(result.suggestions).toEqual([]);
  });

  it("deve retornar exatamente 2 falhas para senha sem número e especial", () => {
    const result = validatePassword("Abcdefgh");

    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(2);
  });

  it("deve considerar quebra de linha como espaço inválido", () => {
    const result = validatePassword("Abcd\nef1!");

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("A senha não pode conter espaços.");
  });

  it("deve manter força forte quando todos critérios são cumpridos", () => {
    const result = validatePassword("S3nha@MuitoBoa");

    expect(result.valid).toBe(true);
    expect(result.strength).toBe("forte");
  });
});
