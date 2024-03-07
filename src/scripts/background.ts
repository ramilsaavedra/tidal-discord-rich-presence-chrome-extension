import { KeepAlivePort } from "../types"

let tabId: chrome.tabs.Tab["id"]

chrome.runtime.onInstalled.addListener(async () => {
  console.log("Tidal Discord Rich Pressence successfully installed")
})

// keep the sw alive
chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== "keep-alive") {
    console.log("not keep alive port")
    return
  }
  console.log("keep-alive port connect")
  port.onMessage.addListener(onMessage)
  port.onDisconnect.addListener(deleteTimer)
  // @ts-ignore
  port._timer = setTimeout(forReconnect, 250e3, port)
})

function onMessage(msg: any, port: chrome.runtime.Port) {
  console.log("received", msg, "from", port)
  tabId = port.sender.tab.id
}

function forReconnect(port: chrome.runtime.Port) {
  deleteTimer(port)
  port.disconnect()
}

function deleteTimer(port: KeepAlivePort) {
  if (port._timer) {
    clearTimeout(port._timer)
    delete port._timer
  }
}

chrome.webRequest.onCompleted.addListener(
  async function (details) {
    if (details.url.includes("v1/tracks")) {
      const id = details.url.match(/\/(\d+)\//)[1]
      chrome.tabs.sendMessage(tabId, id)
    }
  },
  { urls: ["https://listen.tidal.com/v1/tracks/*"] }
)
