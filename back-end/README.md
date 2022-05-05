<p align="center">
    <img src="https://github.com/Arciiix/Monity/blob/main/assets/icon-1024-regular.png?raw=true" width="120px" height="120px" alt="Monity icon">
    <h2 align="center">Back-end</h2>
</p>

# Environment variables

| name                         | description                                                | default           |
| ---------------------------- | ---------------------------------------------------------- | ----------------- |
| PORT                         | A port the back-end will run on.                           | 5321              |
| DATABASE_URL                 | Prisma's database url (default's is for PostgreSQL)        |                   |
| JWT_ACCESS_TOKEN_SECRET      | JWT access token secret                                    |                   |
| JWT_REFRESH_TOKEN_SECRET     | JWT refresh token secret                                   |                   |
| JWT_ACCESS_TOKEN_EXPIRES_IN  | JWT access token expiration time in seconds                | 1800 (30 minutes) |
| JWT_REFRESH_TOKEN_EXPIRES_IN | JWT refresh token expiration time in seconds               | 2592000 (1 month) |
| MAX_REFRESH_TOKENS_PER_USER  | Maximum number of refresh tokens (login sessions) per user | 10                |

Made with ❤ by Arciiix
