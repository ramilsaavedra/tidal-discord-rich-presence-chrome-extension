# Tidal Now Playing Chrome Extension

## Description

The Tidal Now Playing Chrome Extension is a tool designed to detect the currently playing track on the Tidal web app and update the rich presence on Discord via a local web server. This extension enhances your Tidal listening experience by dynamically updating your Discord status with the track information.

## Features

- Detects the currently playing track on Tidal's web app.
- Sends track details (e.g., title, artist, album) to a local web server.
- Updates Discord's rich presence with the track information.

## Installation

### Chrome web store

1. Install using the Chrome web store. [Link](https://chromewebstore.google.com/detail/tidal-discord-rich-presen/lnehmemdaeieccibicjpnamckdlgchdf)

### Manual

1. Download the extension files from [GitHub repository](https://github.com/JetNicer/tidal-discord-rich-presence-chrome-extension.git).
2. Run `npm run build` in the project directory to generate the `dist` folder.
3. Navigate to `chrome://extensions` in your Chrome browser.
4. Enable "Developer mode" in the top right corner.
5. Click on "Load unpacked" and select the `dist` folder generated in step 2.
6. The extension should now be installed and visible in your Chrome browser.
7. Run the local app server. Download the files [here](https://drive.google.com/file/d/1nBiYnCQWDiIHysJJq0VAkhES6i1CF-Rr/view?usp=sharing)
    * Run the `index-win.exe` for Windows.
    * Run the `index.js` using node for Linux or macOS.

## Usage

- Ensure that the Tidal web app is open and playing music.
- The extension will automatically detect the currently playing track and send its details to your local web server.
- Your Discord rich presence will be updated with the track information.

## Disclaimer

This extension is provided as-is without any warranties. Use it at your own risk.
