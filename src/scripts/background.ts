import { runtime } from "webpack"

chrome.runtime.onInstalled.addListener(async () => {
  console.log("Tidal Discord Rich Pressence successfully installed")
})

// keep the sw alive
chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== "tidal-content-script") {
    return
  }

  port.onMessage.addListener((msg: unknown, port: chrome.runtime.Port) => {
    console.log(`Message: ${msg} | Port Name: ${port.name}`)
  })

  port.onDisconnect.addListener((port: chrome.runtime.Port) => {
    console.log(`Disconnected ${port.name}`)
  })

  port.postMessage("hi from service worker")
})
