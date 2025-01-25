import { DuckService } from './services/DuckService'

const duckService = new DuckService()

// Remove existing menu item if it exists
chrome.contextMenus.removeAll(() => {
  // Create new menu item
  chrome.contextMenus.create({
    id: 'generate-duck-address',
    title: 'Generate Duck Address',
    contexts: ['editable'],
  })
})

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  // Check if tab exists and has a valid ID
  if (!tab?.id || tab.id < 0) return
  
  if (info.menuItemId === 'generate-duck-address') {
    const response = await duckService.generateAddress()
    
    if (response.status === 'error') {
      try {
        await chrome.tabs.sendMessage(tab.id, {
          type: 'show-notification',
          message: 'You must login first!'
        })
      } catch (error) {
        // Inject content script only if scripting permission is available
        if (chrome.scripting) {
          try {
            await chrome.scripting.executeScript({
              target: { tabId: tab.id },
              files: ['contentScript.js']
            });
            // Try sending message again after injection
            chrome.tabs.sendMessage(tab.id, {
              type: 'show-notification',
              message: 'You must login first!'
            });
          } catch (e) {
            console.warn('Could not inject content script:', e);
          }
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
      if (chrome.scripting) {
        try {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['contentScript.js']
          });
          // Try sending message again after injection
          chrome.tabs.sendMessage(tab.id, {
            type: 'fill-address',
            address: response.address
          });
        } catch (e) {
          console.warn('Could not inject content script:', e);
        }
      }
    }
  }
})

// Handle messages from popup
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