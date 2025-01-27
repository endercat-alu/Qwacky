# Why Qwacky?

I've been using [DuckDuckGo Email Protection](https://duckduckgo.com/email) service for a while and really appreciate it. However, the requirement to install the full DuckDuckGo extension came with some challenges:

- You can't disable the tracking protection feature globally
- You need to manually disable tracking protection for each website
- The extension changes your default search engine to DuckDuckGo
- No way to use just the email protection service standalone

That's why I created Qwacky - initially for personal use, but I realized others might face the same issues. As someone who always wanted to contribute to the open-source community with helpful tools, I decided to share this project publicly.

# Features
- Generate and manage private @duck.com email addresses
- Copy the generated address to the clipboard
- Auto-fill addresses in input fields from context menu for a quick address generation
- Store the generated addresses

# Planned Features

- [ ] Autofill input icon
- [ ] Multiple accounts support
- [ ] Change forwarding email
- [ ] Create duck account
- [ ] Delete duck account

# Privacy Policy

> **⚠️ Disclaimer**: This is NOT an official [DuckDuckGo](https://duckduckgo.com) product. Qwacky is an independent, open-source project and is not affiliated with, endorsed by, or connected to DuckDuckGo in any way. Use at your own risk.

## Permissions

This extension requires specific permissions to function properly:

### Host Permissions
- `http://*/*` and `https://*/*`: Required to detect and fill email input fields on websites
  - Only activated when you use the right-click menu to generate an address
  - No automatic scanning or data collection from websites
  - No tracking or monitoring of browsing activity

### Chrome Permissions
- `storage`: Stores your generated addresses and settings locally on your device
- `contextMenus`: Enables the right-click menu for quick address generation
- `scripting`: Required to fill generated addresses in web forms
- `clipboardWrite`: Allows copying generated addresses to your clipboard

### Data Collection
- **Local Storage Only**: All data is stored locally on your device
- **No Analytics**: We don't collect any usage statistics or analytics
- **No Tracking**: We don't track your browsing history or behavior
- **No Third-Party Services**: We don't send data to any third-party services

### Data Storage
The following data is stored locally:
- Generated @duck.com addresses
- Theme preference (dark/light mode)
- Login state for session persistence
- DuckDuckGo authentication token

### Website Access
- The extension only interacts with web pages when you explicitly use the right-click menu
- No automatic scanning of web pages
- No data is collected from websites you visit
- Content scripts are only activated for email input field interaction

### Security
- All communication with DuckDuckGo servers is done through their official API
- No sensitive data is transmitted outside of the DuckDuckGo authentication process
- Your forwarding email and generated addresses are stored securely on your device
- The extension uses HTTPS for all API communications



# Usage

### Chrome Web Store
[Qwacky](https://)

### Manual Installation
1. Download the latest release from the [GitHub Releases](https://github.com/Lanshuns/Qwacky/releases) page
2. Unzip the downloaded file
3. Open Chrome and go to `chrome://extensions/`
4. Enable "Developer mode" in the top right
5. Click "Load unpacked" and select the unzipped folder

# Development

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

# Support Development

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
