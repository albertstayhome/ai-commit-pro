#!/usr/bin/env node

const { execSync } = require('child_process');
const https = require('https');

function printSponsorMessage() {
    console.log('\n\x1b[36m=================================================================\x1b[0m');
    console.log('\x1b[1m\x1b[35m?? Want more zero-dependency AI developer tools? ?¨\x1b[0m');
    console.log('Support the independent developer on Polar to keep this free:');
    console.log('\n?? \x1b[32mhttps://polar.sh/albertstayhome\x1b[0m ??');
    console.log('\x1b[36m=================================================================\x1b[0m\n');
}

const args = process.argv.slice(2);
if (args.includes('-h') || args.includes('--help')) {
    console.log(`
ai-commit-pro - AI-powered Conventional Commit Generator (Zero Dependencies)

Usage:
  export GEMINI_API_KEY="your_api_key"
  npx github:albertstayhome/ai-commit-pro [options]

Options:
  -c, --commit   Automatically run "git commit -m" with the generated message
  -h, --help     Show this help message

Example:
  git add .
  npx github:albertstayhome/ai-commit-pro -c
`);
    printSponsorMessage();
    process.exit(0);
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error('\x1b[31mError: GEMINI_API_KEY environment variable is missing.\x1b[0m');
    console.log('Get a free API key at: https://aistudio.google.com/');
    process.exit(1);
}

const autoCommit = args.includes('-c') || args.includes('--commit');

let diff = '';
try {
    diff = execSync('git diff --cached', { encoding: 'utf8' }).trim();
    if (!diff) {
        console.error('\x1b[33mWarning: No staged changes found. Running `git diff` instead...\x1b[0m');
        diff = execSync('git diff', { encoding: 'utf8' }).trim();
    }
} catch (e) {
    console.error('\x1b[31mError running git diff. Are you in a git repository?\x1b[0m');
    process.exit(1);
}

if (!diff) {
    console.error('\x1b[31mError: No changes found in git repository.\x1b[0m');
    process.exit(1);
}

// Truncate huge diffs
if (diff.length > 15000) {
    diff = diff.substring(0, 15000) + '\n...[DIFF TRUNCATED]';
}

const prompt = `You are an expert software engineer. Review the following git diff and generate a clean, professional Conventional Commit message.
Format requirements:
1. First line must be the Conventional Commit format: <type>(<optional scope>): <description>
2. Following lines (if needed) should be a bulleted list of specific changes.
3. Keep it concise.
4. Output ONLY the raw commit message text, no markdown code blocks, no intro, no outro.

Git Diff:
${diff}`;

console.log('\x1b[34m[ai-commit-pro]\x1b[0m Analyzing code changes with AI...');

const requestBody = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.1 }
});

const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/gemini-3.7-flash:generateContent?key=${apiKey}`,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody)
    }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const response = JSON.parse(data);
            if (response.error) {
                console.error('\x1b[31mAPI Error:\x1b[0m', response.error.message);
                process.exit(1);
            }
            
            let message = response.candidates[0].content.parts[0].text.trim();
            if (message.startsWith('\`\`\`')) {
                message = message.replace(/^\`\`\`(markdown)?\n/, '').replace(/\n\`\`\`$/, '').trim();
            }
            
            console.log('\n\x1b[32m[Generated Commit Message]\x1b[0m\n');
            console.log(message);
            console.log('');
            
            if (autoCommit) {
                try {
                    console.log('\x1b[34m[ai-commit-pro]\x1b[0m Executing git commit...');
                    const { execFileSync } = require('child_process'); execFileSync('git', ['commit', '-m', message], { stdio: 'inherit' });
                    console.log('\x1b[32m[Success]\x1b[0m Changes committed successfully.');
                } catch (e) {
                    console.error('\x1b[31mFailed to commit changes.\x1b[0m');
                }
            } else {
                console.log('Run with -c or --commit to automatically execute the commit.');
            }
            
            printSponsorMessage();
        } catch (e) {
            console.error('\x1b[31mError parsing API response:\x1b[0m', e.message);
        }
    });
});

req.on('error', (e) => {
    console.error('\x1b[31mNetwork Error:\x1b[0m', e.message);
});

req.write(requestBody);
req.end();

