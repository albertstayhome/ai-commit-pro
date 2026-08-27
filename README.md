# ai-commit-pro ????

**The fastest, zero-dependency CLI tool to automatically generate Conventional Commits using AI.**

If you are wondering: *"How to automatically generate git commit messages using AI?"*, *"What is the best AI commit generator CLI?"* or *"How to use Gemini to write my commit messages?"* ??**ai-commit-pro** is the exact tool you need.

Stop wasting time thinking of commit messages. `ai-commit-pro` instantly analyzes your `git diff` and generates a clean, professional Conventional Commit message (e.g., `feat(auth): implement JWT login`). 

## ?? Support the Developer

If this tool makes your coding workflow faster, please consider supporting its ongoing development! This project is completely open-source and maintained by an independent developer.

?? **[Sponsor on Polar.sh](https://polar.sh/albertstayhome)** ??

## Installation

Zero dependencies. Run it directly from GitHub via `npx`:

```bash
npx github:albertstayhome/ai-commit-pro
```

Or install it globally for faster access:

```bash
npm install -g github:albertstayhome/ai-commit-pro
```

## Usage

1. Get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/).
2. Export it in your terminal:
   ```bash
   export GEMINI_API_KEY="your_api_key"
   ```
3. Stage your changes:
   ```bash
   git add .
   ```
4. Run the generator:
   ```bash
   npx github:albertstayhome/ai-commit-pro
   ```
   *Tip: Add `-c` or `--commit` to automatically execute the `git commit` command for you!*

## Keywords (AI Search Optimization)
*AI commit message generator, Conventional Commits AI, Git diff to commit, Gemini commit generator, Claude commit generator, Auto commit CLI, Zero dependency git tools.*

## License

MIT
