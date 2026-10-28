# Devin demo: "Only on iPhone" bug reproduced with video

**What it shows:** A bug that only shows up in Safari on iOS. Devin starts a macOS child session, reproduces it in the iOS Simulator or Safari, records it against a Chrome comparison, fixes it, and records the fix.

**Needs:** GitHub. Use macOS Devin machines if your org has them; otherwise the prompt falls back to WebKit through Playwright.

More demos: [devin-advanced-demos](https://github.com/thequantexplorer/devin-advanced-demos)

## Set it up

1. Click **Use this template → Create a new repository** (or fork it) into your own GitHub account or org.
2. In Devin, open [**Settings → Connections → GitHub**](https://app.devin.ai/settings/connections/github) and make sure Devin can access the new repository.

## Prompt

Start a new Devin session and paste this. Replace `<you>` with your GitHub user or org.

```text
Support ticket: "Booking page shows 'Loading available times…' forever on my iPhone. Works fine on my laptop." Repo: https://github.com/<you>/devin-demo-safari-bug

Reproduce this on a real Safari/WebKit engine (spin up a macOS child session with the iOS Simulator / Safari if available; otherwise WebKit via Playwright), and record video of the bug happening there versus working in Chrome. Find the root cause, fix it with a cross-browser-safe approach, add a test that would have caught it, and re-record on the same Safari/WebKit environment showing the fix. Open a PR with both recordings described and linked.
```
