# Contributing to EmojiPass

Thanks for improving EmojiPass.

## Before opening a change

1. Keep password generation entirely client-side.
2. Preserve Web Crypto based randomness.
3. Do not introduce external runtime dependencies without a strong reason.
4. Keep generated passwords out of logs and persistent storage.
5. Preserve keyboard accessibility and reduced-motion behavior.

## Local checks

Run the application with:

```bash
python -m http.server 8000
```

Then run the same checks used by CI where practical:

```bash
node --check script.js
```

Also manually verify generation, copy, history, settings persistence/reset, keyboard generation and mobile layout.

## Pull requests

Keep pull requests focused. Explain the user-visible behavior changed and mention any security or browser-compatibility implications.
