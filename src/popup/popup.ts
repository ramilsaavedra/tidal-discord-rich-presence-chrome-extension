import { TrackDetailsProps } from "../types"

window.addEventListener("load", async () => {
  chrome.runtime.onMessage.addListener(
    (msg: any, sender: chrome.runtime.MessageSender, response: any) => {
      if (msg.from === "content") {
        updateTrackElemDetails(msg.body)
      }
    }
  )

  chrome.runtime.sendMessage(
    {
      from: "popup",
      subject: "request track details",
    },
    (res: TrackDetailsProps) => {
      updateTrackElemDetails(res)
    }
  )
})

function updateTrackElemDetails(res: TrackDetailsProps) {
  const titleElem = document.getElementById("title")
  const albumImgElem = document.getElementById("albumImg") as HTMLImageElement
  const artistElem = document.getElementById("artists")
  const qualityElem = document.getElementById("quality")

  if (titleElem) {
    titleElem.textContent = res.title
  }

  if (albumImgElem) {
    albumImgElem.src = res.albumImgUrl as string
  }

  if (artistElem) {
    artistElem.textContent = "by " + res.artists
  }

  if (qualityElem) {
    qualityElem.textContent = res.quality
  }
}
