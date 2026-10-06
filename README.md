# 🎧 Producer Tag on Push (`producer-tag`)

> **"MS on the Beat, Yo!"** — Drop your signature producer tag every time you push code to GitHub. 🚀🔥

[![Platform](https://img.shields.io/badge/Platform-macOS-black?logo=apple)](https://www.apple.com/macos/)
[![Git Hook](https://img.shields.io/badge/Git-pre--push-F05032?logo=git&logoColor=white)](https://git-scm.com/)
[![IDE](https://img.shields.io/badge/IDE-VS%20Code%20%7C%20Antigravity-007ACC?logo=visualstudiocode&logoColor=white)](https://code.visualstudio.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🌟 What is this?

Every music producer has a signature audio tag that plays before the beat drops—think **Metro Boomin**, **Murda Beatz**, or **Pierre Bourne**.

As developers, pushing code to production or staging is our version of dropping a hit track. This is a lightweight, super-fun **hobby project** built to bring beatmaker swagger into your development workflow:

**Whenever you push commits to GitHub, your IDE and Mac play your producer tag in the background while firing a sleek desktop notification banner.**

Whether you push from the **terminal** (`git push`), or click the **"Sync Changes" / "Push"** button inside your IDE's Source Control GUI, the beat drops automatically.

---

## ✨ Features

- **⚡ Instant & Non-Blocking**: Audio plays asynchronously via macOS's native `/usr/bin/afplay` in a decoupled subshell. Your `git push` runs at lightning speed without waiting for the audio file to finish.
- **🎯 Smart Target Detection**: Specifically targets pushes to **GitHub** (`github.com` via SSH or HTTPS). Can also be configured to fire on any Git remote.
- **🤫 Zero Noise on Up-to-Date Pushes**: If your branch is already up-to-date and nothing is being pushed, the hook stays silent. It only triggers when actual commits or tags are being pushed out.
- **🔔 Native Desktop Notifications**: Fires a native macOS slide-in notification banner alongside the audio:
  > *"MS on the Beat, Yo! 🚀 — Pushing to GitHub..."*
- **🎛️ Antigravity IDE & VS Code Extension**:
  - Adds a status bar icon (`$(play) MS on the Beat`) in the bottom bar of your IDE.
  - Quick-click menu to test audio, mute/unmute, or open settings.
  - Native Command Palette actions (`Cmd + Shift + P` -> `Producer Tag: Test Play Sound`).
  - Seamless settings editor integration (`Cmd + ,` -> search `producerTag`).
- **🛡️ Chain-Safe**: If any repository has its own local `pre-push` hooks (like linters, test runners, or husky), those hooks are preserved and executed in sequence.

---

## 🏗️ How It Works

```
                       ┌─────────────────────────┐
                       │  git push (Terminal or  │
                       │   IDE Source Control)   │
                       └────────────┬────────────┘
                                    │
                                    ▼
                       ┌─────────────────────────┐
                       │   Global Git Hook       │
                       │  (~/.git_hooks/pre-push)│
                       └────────────┬────────────┘
                                    │
               ┌────────────────────┴────────────────────┐
               ▼                                         ▼
      [Commit / Ref Check]                       [Chain Local Hooks]
  (Silently exit if up-to-date)                (Preserve project hooks)
               │
               ▼
      [GitHub Remote Check]
  (Match github.com / remotes)
               │
               ▼
     ┌───────────────────┐
     │  Background Drop  │
     └─────────┬─────────┘
               ├───────────────────────────────┐
               ▼                               ▼
    /usr/bin/afplay (Audio)        /usr/bin/osascript (Notification)
  "MS on the Beat, Yo.wav"       "MS on the Beat, Yo! 🚀 - Pushing..."
```

---

## 🚀 Quick Start & Installation

### Option 1: Automatic 1-Click Install

Clone this repository and run the installer:

```bash
git clone https://github.com/Themahattva/producer-tag.git
cd producer-tag
chmod +x install.sh
./install.sh
```

The script will automatically:
1. Symlink/copy the global pre-push hook to `~/.git_hooks/pre-push`.
2. Configure `git config --global core.hooksPath ~/.git_hooks`.
3. Set default configuration flags in your global Git config.
4. Install the companion extension into Antigravity IDE and VS Code.

---

### Option 2: Manual Setup

1. **Create the global hooks folder**:
   ```bash
   mkdir -p ~/.git_hooks
   cp hooks/pre-push ~/.git_hooks/pre-push
   chmod +x ~/.git_hooks/pre-push
   ```

2. **Tell Git to use the global hooks**:
   ```bash
   git config --global core.hooksPath ~/.git_hooks
   ```

3. **Configure your producer tag**:
   ```bash
   git config --global producer-tag.enabled true
   git config --global producer-tag.audio-path "/path/to/MS on the Beat, Yo.wav"
   git config --global producer-tag.volume 1.0
   git config --global producer-tag.github-only true
   git config --global producer-tag.notify true
   ```

---

## 🎛️ Configuration & Controls

All settings can be customized either via **Git Config** or directly through the **IDE Settings UI**:

| Setting | Default | Description | Git Config Command |
| :--- | :--- | :--- | :--- |
| **Enabled** | `true` | Toggle tag playback on/off | `git config --global producer-tag.enabled false` |
| **Audio File Path** | *Local .wav path* | Path to your audio tag file | `git config --global producer-tag.audio-path "/path/to/tag.wav"` |
| **Volume** | `1.0` | Output volume (`0.0` to `2.0`) | `git config --global producer-tag.volume 0.7` |
| **GitHub Only** | `true` | Only play on GitHub remotes | `git config --global producer-tag.github-only false` |
| **Notification** | `true` | Show macOS desktop notification banner | `git config --global producer-tag.notify false` |

---

## 🧪 Testing Your Tag

Want to test playback right now?

- **Via Terminal**:
  ```bash
  ./test-producer-tag.sh
  ```
- **Via IDE**:
  - Click the `$(play) MS on the Beat` button in the status bar at the bottom right.
  - Or open the Command Palette (`Cmd + Shift + P`) and select **`Producer Tag: Test Play Sound`**.

---

## 📂 Project Structure

```
producer-tag/
├── MS on the Beat, Yo.wav        # Signature producer tag audio file
├── hooks/
│   └── pre-push                  # Global Git pre-push hook script
├── extension/
│   ├── package.json              # VS Code / Antigravity IDE extension manifest
│   └── extension.js              # Extension activation, status bar & commands
├── install.sh                    # One-command installer for macOS & IDEs
├── test-producer-tag.sh          # One-click test runner script
├── .gitignore                    # Git ignore file
└── README.md                     # You are here!
```

---

## 🎵 Customizing with Your Own Tag

Want to replace the audio with your own producer tag, DJ horn, or game sound effect?
1. Drop your `.wav` or `.mp3` file into any folder on your Mac.
2. Update the audio path:
   ```bash
   git config --global producer-tag.audio-path "/path/to/your-tag.wav"
   ```
3. Push some code and enjoy the drop!

---

## 🤝 Contributing & License

This is a passion / hobby project created for fun and developer delight. Feel free to submit issues, pull requests, or share your own tags!

Distributed under the **MIT License**. Created by [Themahattva](https://github.com/Themahattva).
