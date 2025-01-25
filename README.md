# Qwacky

## Why Qwacky?

I've been using DuckDuckGo's email protection service for a while and really appreciate it. However, the requirement to install the full DuckDuckGo extension came with some challenges:

- You can't disable the tracking protection feature globally
- You need to manually disable tracking protection for each website
- The extension changes your default search engine to DuckDuckGo
- No way to use just the email protection service standalone

That's why I created Qwacky - initially for personal use, but I realized others might face the same issues. As someone who always wanted to contribute to the open-source community with helpful tools, I decided to share this project publicly.

> **⚠️ Disclaimer**: This is NOT an official DuckDuckGo product. Qwacky is an independent, open-source project and is not affiliated with, endorsed by, or connected to DuckDuckGo in any way. Use at your own risk.

## Features
- Generate and manage private @duck.com email addresses
- Auto-fill addresses in input fields from context menu integration for quick address generation
- Store the generated addresses

## To Do

- [ ] Autofill input icon (like password managers)
- [ ] Change forwarding email
- [ ] Delete duck account
- [ ] Multiple accounts support

## Permissions

This extension requires the following permissions:

- `storage`: Required to store your generated addresses and settings locally
- `contextMenus`: Enables the right-click menu for quick address generation
- `scripting`: Needed to auto-fill addresses in web forms

> All data is stored locally on your device. No data is sent to any third-party servers.

## Installation

### Chrome Web Store
🔜 Coming soon to the Chrome Web Store!

### Manual Installation
1. Download the latest release from the [GitHub Releases](https://github.com/Lanshuns/Qwacky/releases) page
2. Unzip the downloaded file
3. Open Chrome and go to `chrome://extensions/`
4. Enable "Developer mode" in the top right
5. Click "Load unpacked" and select the unzipped folder

## Development

1. Clone the repository
```bash
git clone https://github.com/Lanshuns/Qwacky.git
cd qwacky
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

5. Load the extension
- Open Chrome
- Go to chrome://extensions/
- Enable "Developer mode"
- Click "Load unpacked"
- Select the `dist` folder

## Support Development

If you find Qwacky useful, consider supporting its development:

**Bitcoin**
```
bc1qmmwwsn4cvpsx39sf53qsqcjyjzsqp90lus365w
```

**Litecoin**
```
LKYDeJWeo3kMG1TbY4cqSi87wFeR6YUXP2
```

**Ethereum**
```
0x08658772EeC32e72456048Be5D5a52bd3bcb01bc
```

**USDT (Tron)**
```
LKYDeJWeo3kMG1TbY4cqSi87wFeR6YUXP2
```
