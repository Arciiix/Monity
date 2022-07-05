import dotenv from "dotenv/config";

export default () => ({
  PORT: process.env.PORT || 5321,
  JWT_ACCESS_TOKEN_EXPIRES_IN: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || 1800,
  JWT_REFRESH_TOKEN_EXPIRES_IN:
    process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || 2592000,
  MAX_REFRESH_TOKENS_PER_USER: process.env.MAX_REFRESH_TOKENS_PER_USER || 10,
  API_VERSION: process.env.API_VERSION || "v1",
});
