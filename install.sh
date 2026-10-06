#!/bin/bash
# ==============================================================================
# Installer Script: Producer Tag on GitHub Push
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AUDIO_FILE="$SCRIPT_DIR/MS on the Beat, Yo.wav"

echo "🎧 Installing Producer Tag on Push..."

# 1. Setup global git hooks directory
HOOKS_DIR="$HOME/.git_hooks"
mkdir -p "$HOOKS_DIR"

# Copy pre-push hook
cp "$SCRIPT_DIR/hooks/pre-push" "$HOOKS_DIR/pre-push"
chmod +x "$HOOKS_DIR/pre-push"

# 2. Configure Git globally
git config --global core.hooksPath "$HOOKS_DIR"
git config --global producer-tag.enabled true
git config --global producer-tag.audio-path "$AUDIO_FILE"
git config --global producer-tag.volume 1.0
git config --global producer-tag.github-only true
git config --global producer-tag.notify true

echo "✅ Global Git pre-push hook installed at $HOOKS_DIR/pre-push"

# 3. Install IDE / VS Code extension
EXT_DIR_NAME="themahattva.producer-tag-on-push-1.0.0"

for TARGET in "$HOME/.antigravity-ide/extensions" "$HOME/.vscode/extensions"; do
    if [ -d "$(dirname "$TARGET")" ] || [ -d "$TARGET" ]; then
        mkdir -p "$TARGET/$EXT_DIR_NAME"
        cp -r "$SCRIPT_DIR/extension/"* "$TARGET/$EXT_DIR_NAME/"
        echo "✅ IDE extension installed to $TARGET/$EXT_DIR_NAME"
    fi
done

echo ""
echo "🔥 Done! Your producer tag ('MS on the Beat, Yo!') is active."
echo "Whenever you run 'git push' to GitHub, the beat will drop!"
echo "Run ./test-producer-tag.sh to hear a sample right now."
