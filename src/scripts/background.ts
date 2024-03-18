import { TrackDetailsProps } from "../types"

chrome.runtime.onInstalled.addListener(async () => {
  console.log("Tidal Discord Rich Presence successfully installed")
})

let tidalTabId: number | undefined

let trackDetails: TrackDetailsProps = {
  title: "",
  artists: "",
  albumImgUrl: "",
  quality: "",
  isPlaying: false,
  trackUrl: "",
}

chrome.runtime.onMessage.addListener(
  (msg: any, sender: chrome.runtime.MessageSender, response: any) => {
    // send the track details when the popup is open
    if (msg.from === "popup") {
      response(trackDetails)
    }

    // save the track details data from content script
    if (msg.from === "content") {
      console.log(sender, "sender")
      if (sender.tab) {
        tidalTabId = sender.tab.id
      }
      trackDetails = { ...msg.body }
    }
  }
)

chrome.tabs.onRemoved.addListener(
  async (tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) => {
    if (tidalTabId === tabId) {
      await clearActivity()
      console.log("Tidal Tab is closed")
    }
  }
)

async function clearActivity() {
  try {
    const response = await fetch("http://localhost:3001/clear", {
      method: "GET",
    })
    const data = await response.text()
    console.log(`Response : ${data}`)
    return data
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error :", error.message)
    }
  }
}
