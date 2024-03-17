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
  (tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) => {
    if (tidalTabId === tabId) {
      console.log("Tidal Tab is closed")
    }
  }
)
