const vscode = require('vscode');
const cp = require('child_process');
const fs = require('fs');
const path = require('path');

let statusBarItem;

function getAudioPath() {
    const config = vscode.workspace.getConfiguration('producerTag');
    const audioPath = config.get('audioPath') || '/Users/mahattava/Developer/PRODUCER TAG/MS on the Beat, Yo.wav';
    return audioPath;
}

function getVolume() {
    const config = vscode.workspace.getConfiguration('producerTag');
    return config.get('volume') ?? 1.0;
}

function isEnabled() {
    const config = vscode.workspace.getConfiguration('producerTag');
    return config.get('enabled') !== false;
}

function playAudio(customPath, customVolume) {
    const audioPath = customPath || getAudioPath();
    const volume = customVolume ?? getVolume();

    if (!fs.existsSync(audioPath)) {
        vscode.window.showErrorMessage(`Producer tag audio not found at: ${audioPath}`);
        return;
    }

    try {
        const child = cp.spawn('/usr/bin/afplay', ['-v', String(volume), audioPath], {
            detached: true,
            stdio: 'ignore'
        });
        child.unref();
    } catch (err) {
        vscode.window.showErrorMessage(`Failed to play producer tag: ${err.message}`);
    }
}

function syncToGitConfig() {
    const config = vscode.workspace.getConfiguration('producerTag');
    const enabled = config.get('enabled') !== false;
    const audioPath = config.get('audioPath') || '/Users/mahattava/Developer/PRODUCER TAG/MS on the Beat, Yo.wav';
    const volume = config.get('volume') ?? 1.0;
    const githubOnly = config.get('githubOnly') !== false;
    const notifyOnPush = config.get('notifyOnPush') !== false;

    try {
        cp.execSync(`git config --global producer-tag.enabled ${enabled}`);
        cp.execSync(`git config --global producer-tag.audio-path "${audioPath}"`);
        cp.execSync(`git config --global producer-tag.volume ${volume}`);
        cp.execSync(`git config --global producer-tag.github-only ${githubOnly}`);
        cp.execSync(`git config --global producer-tag.notify ${notifyOnPush}`);
    } catch (e) {
        // Silently ignore if git config fails
    }
}

function updateStatusBar() {
    if (!statusBarItem) return;
    const enabled = isEnabled();
    if (enabled) {
        statusBarItem.text = '$(play) MS on the Beat';
        statusBarItem.tooltip = 'Producer Tag: Active ("MS on the Beat, Yo!")\nClick for options';
    } else {
        statusBarItem.text = '$(mute) Producer Tag: Off';
        statusBarItem.tooltip = 'Producer Tag: Muted\nClick to enable';
    }
}

function activate(context) {
    // Sync initial settings to git config
    syncToGitConfig();

    // Create status bar item
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'producerTag.statusBarMenu';
    updateStatusBar();
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    // Command: Test Play
    const playDisposable = vscode.commands.registerCommand('producerTag.play', () => {
        playAudio();
        vscode.window.showInformationMessage('🔥 Playing producer tag: "MS on the Beat, Yo!"');
    });
    context.subscriptions.push(playDisposable);

    // Command: Toggle
    const toggleDisposable = vscode.commands.registerCommand('producerTag.toggle', async () => {
        const current = isEnabled();
        const config = vscode.workspace.getConfiguration('producerTag');
        await config.update('enabled', !current, vscode.ConfigurationTarget.Global);
        updateStatusBar();
        syncToGitConfig();
        vscode.window.showInformationMessage(`Producer tag ${!current ? 'Enabled ✅' : 'Muted 🔇'}`);
    });
    context.subscriptions.push(toggleDisposable);

    // Command: Open Audio File Location
    const openAudioDisposable = vscode.commands.registerCommand('producerTag.openAudio', () => {
        const audioPath = getAudioPath();
        if (fs.existsSync(audioPath)) {
            cp.exec(`/usr/bin/open -R "${audioPath}"`);
        } else {
            vscode.window.showErrorMessage(`Audio file not found: ${audioPath}`);
        }
    });
    context.subscriptions.push(openAudioDisposable);

    // Command: Status Bar Click Menu
    const menuDisposable = vscode.commands.registerCommand('producerTag.statusBarMenu', async () => {
        const enabled = isEnabled();
        const items = [
            {
                label: '$(play) Test Play Producer Tag',
                description: '"MS on the Beat, Yo!"',
                action: 'play'
            },
            {
                label: enabled ? '$(mute) Mute Producer Tag' : '$(unmute) Enable Producer Tag',
                description: enabled ? 'Disable playback on push' : 'Enable playback on push',
                action: 'toggle'
            },
            {
                label: '$(folder) Reveal Audio File in Finder',
                description: getAudioPath(),
                action: 'reveal'
            },
            {
                label: '$(settings-gear) Open Producer Tag Settings',
                description: 'Configure volume, triggers, and audio path',
                action: 'settings'
            }
        ];

        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: 'Producer Tag Controls'
        });

        if (!selected) return;

        switch (selected.action) {
            case 'play':
                vscode.commands.executeCommand('producerTag.play');
                break;
            case 'toggle':
                vscode.commands.executeCommand('producerTag.toggle');
                break;
            case 'reveal':
                vscode.commands.executeCommand('producerTag.openAudio');
                break;
            case 'settings':
                vscode.commands.executeCommand('workbench.action.openSettings', 'producerTag');
                break;
        }
    });
    context.subscriptions.push(menuDisposable);

    // Watch for config changes
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('producerTag')) {
                updateStatusBar();
                syncToGitConfig();
            }
        })
    );
}

function deactivate() {
    if (statusBarItem) {
        statusBarItem.dispose();
    }
}

module.exports = {
    activate,
    deactivate
};
