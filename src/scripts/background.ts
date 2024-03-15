import { TrackDetailsProps } from "../types"

chrome.runtime.onInstalled.addListener(async () => {
  console.log("Tidal Discord Rich Pressence successfully installed")
})

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
      trackDetails = { ...msg.body }
    }
  }
)

chrome.tabs.onRemoved.addListener(
  (tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) => {
    console.log(`Tab ID: ${tabId} | Info: ${removeInfo}`)
  }
)
