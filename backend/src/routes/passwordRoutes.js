const express = require("express");
const {
  validatePasswordController,
} = require("../controllers/passwordController");

const router = express.Router();

router.post("/validate-password", validatePasswordController);

module.exports = router;
