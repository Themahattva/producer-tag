#!/bin/bash
# ==============================================================================
# Test Script: Producer Tag ("MS on the Beat, Yo!")
# ==============================================================================

AUDIO_FILE="/Users/mahattava/Developer/PRODUCER TAG/MS on the Beat, Yo.wav"

echo "🎵 Testing Producer Tag..."
echo "📂 Audio file: $AUDIO_FILE"

if [ ! -f "$AUDIO_FILE" ]; then
    echo "❌ Error: Audio file not found at $AUDIO_FILE"
    exit 1
fi

VOLUME=$(git config --get producer-tag.volume 2>/dev/null || echo "1.0")

echo "🔊 Playing at volume: $VOLUME"
/usr/bin/afplay -v "$VOLUME" "$AUDIO_FILE" &

/usr/bin/osascript -e 'display notification "MS on the Beat, Yo! 🚀" with title "Producer Tag Dropped" subtitle "Pushing to GitHub"' &>/dev/null &

echo "✅ Producer tag played and notification sent successfully!"
