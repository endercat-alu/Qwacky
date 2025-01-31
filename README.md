## Why Qwacky?

I've been using [DuckDuckGo Email Protection](https://duckduckgo.com/email) service for a while and really appreciate it. However, the requirement to install the full DuckDuckGo extension came with some challenges:

- You can't disable the tracking protection feature globally
- You need to manually disable tracking protection for each website
- The extension changes your default search engine to DuckDuckGo
- No way to use just the email protection service standalone

That's why I created Qwacky - initially for personal use, but I realized others might face the same issues. As someone who always wanted to contribute to the open-source community with helpful tools, I decided to share this project publicly.

## Features
- Generate and manage private @duck.com email addresses
- Copy the generated address to the clipboard
- Auto-fill addresses in input fields from context menu for a quick address generation
- Store the generated addresses

## Planned Features

- [ ] Autofill input icon
- [ ] Multiple accounts support
- [ ] Create duck account
- [ ] Change forwarding email
- [ ] Delete duck account

## Security & Privacy
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

## Installation

### Chrome Web Store
Coming soon!

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

## Acknowledgments

This project is a derivative work based on DuckDuckGo's Email Protection service, which is licensed under the Apache License 2.0. The original work's copyright notice:

Copyright (c) 2010-2021 Duck Duck Go, Inc.

For the full license text, see [APACHE-LICENSE](https://github.com/duckduckgo/duckduckgo-privacy-extension/blob/main/LICENSE.md).
