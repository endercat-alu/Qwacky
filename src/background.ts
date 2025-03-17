import { DuckService } from './services/DuckService'

const duckService = new DuckService()

chrome.contextMenus.removeAll(() => {
  chrome.contextMenus.create({
    id: 'generate-duck-address',
    title: 'Generate Duck Address',
    contexts: ['editable'],
  })
})

const injectContentScript = async (tabId: number) => {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['contentScript.js']
    });
    return true;
  } catch (e) {
    console.warn('Could not inject content script:', e);
    return false;
  }
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab?.id || tab.id < 0) return
  
  if (info.menuItemId === 'generate-duck-address') {
    let domain = '';
    if (tab.url) {
      try {
        const url = new URL(tab.url);
        domain = url.hostname;
      } catch (e) {
        console.error('Failed to parse URL:', e);
      }
    }

    const response = await duckService.generateAddress(domain || undefined)
    
    if (response.status === 'error') {
      try {
        await chrome.tabs.sendMessage(tab.id, {
          type: 'show-notification',
          message: 'You must login first!'
        })
      } catch (error) {
        if (await injectContentScript(tab.id)) {
          chrome.tabs.sendMessage(tab.id, {
            type: 'show-notification',
            message: 'You must login first!'
          });
        }
      }
      return
    }

    try {
      await chrome.tabs.sendMessage(tab.id, {
        type: 'fill-address',
        address: response.address
      })
    } catch (error) {
      if (await injectContentScript(tab.id)) {
        chrome.tabs.sendMessage(tab.id, {
          type: 'fill-address',
          address: response.address
        });
      }
    }
  }
})

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'requestOTP') {
    duckService.login(request.username).then(sendResponse)
    return true
  }
  
  if (request.action === 'verifyOTP') {
    duckService.verifyOTP(request.username, request.otp).then(sendResponse)
    return true
  }
  
  if (request.action === 'generateAddress') {
    duckService.generateAddress().then(sendResponse)
    return true
  }
})