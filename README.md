# Tidal Now Playing Chrome Extension

## Description

The Tidal Now Playing Chrome Extension is a tool designed to detect the currently playing track on the Tidal web app and update the rich presence on Discord via a local web server. This extension enhances your Tidal listening experience by dynamically updating your Discord status with the track information.

## Features

- Detects the currently playing track on Tidal's web app.
- Sends track details (e.g., title, artist, album) to a local web server.
- Updates Discord's rich presence with the track information.

## Installation

1. Download the extension files from [GitHub repository](https://github.com/JetNicer/tidal-discord-rich-presence-chrome-extension.git).
2. Run `npm run build` in the project directory to generate the `dist` folder.
3. Navigate to `chrome://extensions` in your Chrome browser.
4. Enable "Developer mode" in the top right corner.
5. Click on "Load unpacked" and select the `dist` folder generated in step 2.
6. The extension should now be installed and visible in your Chrome browser.
7a. Run the `index-win.exe` for Windows located in the `local` folder.
7b. Run the `index.js` using node for Linux or macOS located in the `local` folder.

## Usage

- Ensure that the Tidal web app is open and playing music.
- The extension will automatically detect the currently playing track and send its details to your local web server.
- Your Discord rich presence will be updated with the track information.

## Configuration

- Modify the extension settings to specify the URL of your local web server.
- Ensure that your Discord application is configured to accept rich presence updates from external sources.

## Contributing

Contributions are welcome! If you'd like to contribute to the development of this extension, please fork the repository, make your changes, and submit a pull request.

## Disclaimer

This extension is provided as-is without any warranties. Use it at your own risk.
