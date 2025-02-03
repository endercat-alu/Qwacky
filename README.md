<p align="center">
  <img src="src/icons/qwacky.png" alt="Qwacky Logo" width="128" height="128">
</p>

# Why Qwacky?

I've been using [DuckDuckGo Email Protection](https://duckduckgo.com/email) service for a while and really appreciate it. However, the requirement to install the full DuckDuckGo extension came with some challenges:

- You can't disable the tracking protection feature globally
- You need to manually disable tracking protection for each website
- The extension changes your default search engine to DuckDuckGo
- No way to use just the email protection service standalone

That's why I created Qwacky - initially for personal use, but I realized others might face the same issues. As someone who always wanted to contribute to the open-source community with helpful tools, I decided to share this project publicly.

## Download

<p align="center" style="display: flex; justify-content: center; gap: 20px;">
  <a href="https://chromewebstore.google.com/detail/qwacky/kieehbhdbincplacegpjdkoglfakboeo" target="_blank" rel="noopener noreferrer">
    <img src="https://user-images.githubusercontent.com/585534/107280622-91a8ea80-6a26-11eb-8d07-77c548b28665.png" alt="Get Qwacky for Chrome">
  </a>
  <a href="https://addons.mozilla.org/en-US/firefox/addon/qwacky/" target="_blank" rel="noopener noreferrer">
    <img src="https://user-images.githubusercontent.com/585534/107280546-7b9b2a00-6a26-11eb-8f9f-f95932f4bfec.png" alt="Get Qwacky for Firefox">
  </a>
</p>


## Features
- Generate and manage private @duck.com email addresses
- Copy the generated address to the clipboard
- Auto-fill addresses in input fields from context menu for a quick address generation
- Store the generated addresses

## Screenshots
![](https://raw.githubusercontent.com/Lanshuns/Qwacky/refs/heads/main/screenshots/banner2.jpg)

## Planned Features

- [ ] Autofill input icon
- [ ] Multiple accounts support
- [ ] Create duck account
- [ ] Change forwarding email
- [ ] Delete duck account

# Security & Privacy
- Uses minimal permissions required for functionality
- Only accesses tabs when explicitly requested by user action
- All data is stored locally on your device
- No tracking or analytics
- Open source for transparency

## Permissions

This extension requires the following permissions with detailed explanations of why each is needed:

- `activeTab`: Required to access and inject scripts into the current tab only when you explicitly interact with the extension (e.g., using the context menu to fill email addresses)
- `storage`: Required to store your generated addresses and settings locally
- `contextMenus`: Enables the right-click menu for quick address generation
- `clipboardWrite`: Needed to copy the generated address to the clipboard

> **Security Note**: The extension only accesses web pages when you explicitly use the context menu to generate an address. No automatic or background access to web pages occurs.

## Browser Compatibility

Qwacky is designed to work seamlessly on both Chrome and Firefox. The build process automatically handles browser-specific requirements:

- **Chrome**: Uses service workers for background scripts (Manifest V3)
- **Firefox**: Uses background scripts with polyfill support (Manifest V3)

Both versions maintain feature parity while adhering to each browser's best practices and security models.


# Manual Installation

#### Chrome
1. Download the latest release from the [GitHub Releases](https://github.com/Lanshuns/Qwacky/releases) page
2. Unzip the downloaded file
3. Open Chrome and go to `chrome://extensions/`
4. Enable "Developer mode" in the top right
5. Click "Load unpacked" and select the unzipped folder

#### Firefox
1. Download the Firefox version (.xpi file) from the [GitHub Releases](https://github.com/Lanshuns/Qwacky/releases) page
2. Open Firefox and go to `about:addons`
3. Click the gear icon and select "Install Add-on From File..."
4. Select the downloaded .xpi file

# Development

### Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)

### Setup
1. Clone the repository
```bash
git clone https://github.com/Lanshuns/Qwacky.git
cd qwacky
```

2. Install dependencies
```bash
npm install
```

### Development Mode

#### For Chrome:
```bash
npm run dev
```

#### For Firefox:
```bash
npm run dev:firefox
```

### Production Build

#### For Chrome:
```bash
npm run build
```

#### For Firefox:
```bash
npm run build:firefox
```

The built extension will be available in the `dist` directory.

> **Note**: For development and temporary installation in Firefox, you can use `about:debugging` method:
> 1. Go to `about:debugging`
> 2. Click "This Firefox" in the left sidebar
> 3. Click "Load Temporary Add-on"
> 4. Select the `manifest.json` file from the unzipped folder

# Acknowledgments

This project is a derivative work based on DuckDuckGo's Email Protection service, which is licensed under the Apache License 2.0. The original work's copyright notice:

Copyright (c) 2010-2021 Duck Duck Go, Inc.

For the full license text, see [APACHE-LICENSE](https://github.com/duckduckgo/duckduckgo-privacy-extension/blob/main/LICENSE.md).