# Security Policy

## Scope

EmojiPass is a client-side password generator. It is designed so generated passwords remain in the browser and random values come from the Web Crypto API.

## Reporting a vulnerability

Please do not publish sensitive security details in a public issue. Report a suspected vulnerability privately to the repository owner through GitHub, including:

- a clear description of the issue;
- affected browser/environment;
- reliable reproduction steps;
- security impact;
- a minimal proof of concept when safe to provide.

Do not include real passwords, private credentials, or other secrets in a report.

## Security principles

- Never replace `crypto.getRandomValues()` with `Math.random()` for password generation.
- Never transmit generated passwords to a server.
- Never add password history to persistent storage by default.
- Never log generated passwords.
- Treat all browser APIs as potentially unavailable and fail safely.

EmojiPass has not undergone a professional security audit. It should not be represented as a security-audited password manager.
