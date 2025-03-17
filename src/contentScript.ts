const setupConnection = () => {
  try {
    chrome.runtime.connect();
    return true;
  } catch {
    window.location.reload();
    return false;
  }
}

const showNotification = (message: string) => {
  const notification = document.createElement('div')
  notification.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #ff9f19;
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    z-index: 999999;
  `
  notification.textContent = message === 'Not authenticated' ? 'You need to login first' : message
  document.body.appendChild(notification)
  
  setTimeout(() => {
    notification.remove()
  }, 2000)
}

const fillInput = (element: HTMLElement | null, value: string) => {
  if (!element) return false

  const fullAddress = `${value}@duck.com`

  try {
    if (element.isContentEditable) {
      element.textContent = fullAddress
      return true
    }

    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      element.value = fullAddress

      element.dispatchEvent(new Event('input', { bubbles: true }))
      element.dispatchEvent(new Event('change', { bubbles: true }))
      
      return true
    }
  } catch (error) {
    console.error('Failed to fill input:', error)
    return false
  }

  return false
}

chrome.runtime.onMessage.addListener((message, _sender) => {
  if (!setupConnection()) return;

  if (message.type === 'fill-address') {
    const activeElement = document.activeElement
    const filled = fillInput(activeElement as HTMLElement, message.address)

    navigator.clipboard.writeText(`${message.address}@duck.com`)
    
    if (!filled) {
      showNotification('Could not fill input, address copied to clipboard')
    } else {
      showNotification('Address filled and copied to clipboard')
    }
  }
  
  if (message.type === 'show-notification') {
    showNotification(message.message)
  }
})


export {} 