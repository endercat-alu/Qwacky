chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'fill-address') {
    const activeElement = document.activeElement
    if (activeElement && activeElement.isContentEditable) {
      activeElement.textContent = message.address
    } else if (activeElement && activeElement.tagName === 'INPUT') {
      activeElement.value = message.address
    }
    
    navigator.clipboard.writeText(message.address)
    showNotification('Address copied to clipboard')
  }
  
  if (message.type === 'show-notification') {
    showNotification(message.message)
  }
})

function showNotification(message) {
  const notification = document.createElement('div')
  notification.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    z-index: 999999;
  `
  notification.textContent = message
  document.body.appendChild(notification)
  
  setTimeout(() => {
    notification.remove()
  }, 2000)
} 