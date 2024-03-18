import { TrackDetailsProps } from "../types"

window.addEventListener("load", async () => {
  chrome.runtime.onMessage.addListener(
    (msg: any, sender: chrome.runtime.MessageSender, response: any) => {
      if (msg.from === "content") {
        updateTrackElemDetails(msg.body)
      }
    }
  )

  // TODO get the status of discord client on service worker
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
  const albumImgElem = document.getElementById("album-img") as HTMLImageElement
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

    qualityElemStyleHandler(res.quality, qualityElem)
  }
}

function qualityElemStyleHandler(quality: string, element: Element) {
  switch (quality) {
    case "High":
      element.classList.add("high")
      return
    case "Maxflac":
      element.classList.add("max")
      element.textContent = "MAX | FLAC"
      return
    default:
      element.classList.add("normal")
      return
  }
}
