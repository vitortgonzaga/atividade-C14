const { validatePassword } = require("../services/passwordValidationService");

function validatePasswordController(req, res, next) {
  try {
    const { password } = req.body || {};
    const result = validatePassword(password);

    console.log("[validate-password] requisição processada", {
      valid: result.valid,
      strength: result.strength,
    });

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  validatePasswordController,
};
