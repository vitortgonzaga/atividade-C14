const RULES = {
  minLength: {
    id: "minLength",
    message: "A senha deve ter no mínimo 8 caracteres.",
    suggestion: "Use ao menos 8 caracteres.",
  },
  upper: {
    id: "upper",
    message: "A senha deve conter pelo menos 1 letra maiúscula.",
    suggestion: "Adicione pelo menos 1 letra maiúscula (A-Z).",
  },
  lower: {
    id: "lower",
    message: "A senha deve conter pelo menos 1 letra minúscula.",
    suggestion: "Adicione pelo menos 1 letra minúscula (a-z).",
  },
  number: {
    id: "number",
    message: "A senha deve conter pelo menos 1 número.",
    suggestion: "Adicione pelo menos 1 número (0-9).",
  },
  special: {
    id: "special",
    message: "A senha deve conter pelo menos 1 caractere especial.",
    suggestion: "Adicione pelo menos 1 caractere especial (ex.: !@#$%).",
  },
  noSpaces: {
    id: "noSpaces",
    message: "A senha não pode conter espaços.",
    suggestion: "Remova espaços da senha.",
  },
};

const checks = [
  {
    ...RULES.minLength,
    validate: (password) => password.length >= 8,
  },
  {
    ...RULES.upper,
    validate: (password) => /[A-Z]/.test(password),
  },
  {
    ...RULES.lower,
    validate: (password) => /[a-z]/.test(password),
  },
  {
    ...RULES.number,
    validate: (password) => /\d/.test(password),
  },
  {
    ...RULES.special,
    validate: (password) => /[^A-Za-z0-9\s]/.test(password),
  },
  {
    ...RULES.noSpaces,
    validate: (password) => !/\s/.test(password),
  },
];

function calculateStrength(score) {
  if (score <= 3) {
    return "fraca";
  }

  if (score <= 5) {
    return "media";
  }

  return "forte";
}

function validatePassword(password) {
  if (typeof password !== "string") {
    return {
      valid: false,
      strength: "fraca",
      errors: ["O campo password deve ser uma string."],
      suggestions: ["Informe uma senha válida em formato texto."],
    };
  }

  const failedRules = checks.filter((rule) => !rule.validate(password));
  const score = checks.length - failedRules.length;

  return {
    valid: failedRules.length === 0,
    strength: calculateStrength(score),
    errors: failedRules.map((rule) => rule.message),
    suggestions: failedRules.map((rule) => rule.suggestion),
  };
}

module.exports = {
  validatePassword,
  calculateStrength,
};
