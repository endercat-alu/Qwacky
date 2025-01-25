chrome.contextMenus.create({
  id: 'generate-duck-address',
  title: 'Generate Duck Address',
  contexts: ['editable']
})

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'generate-duck-address') {
    const result = await chrome.storage.local.get('access_token')
    
    if (!result.access_token) {
      await chrome.tabs.sendMessage(tab.id, {
        type: 'show-notification',
        message: 'Please login to Qwacky first'
      })
      return
    }

    const auth = new AuthService()
    const response = await auth.generateAddress(result.access_token)
    
    if (response.status === 'success') {
      await chrome.tabs.sendMessage(tab.id, {
        type: 'fill-address',
        address: response.address
      })
      
      const addresses = (await chrome.storage.local.get('generated_addresses')).generated_addresses || []
      await chrome.storage.local.set({
        generated_addresses: [response.address, ...addresses]
      })
    }
  }
}) 