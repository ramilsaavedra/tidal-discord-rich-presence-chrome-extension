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
  const albumImgElem = document.getElementById("album-img") as HTMLImageElement
  const artistElem = document.getElementById("artists")
  const qualityElem = document.getElementById("quality")
  const discordClientStatusElem = document.getElementById(
    "discord-client-status"
  )
  const tidalTabStatusElem = document.getElementById("tidal-tab-status")

  if (titleElem) {
    titleElem.textContent = res.title
  }

  if (albumImgElem) {
    albumImgElem.src = res.albumImgUrl as string
  }

  if (artistElem) {
    if (res.artists) {
      artistElem.textContent = "by " + res.artists
    } else {
      artistElem.textContent = ""
    }
  }

  if (qualityElem) {
    qualityElem.textContent = res.quality

    if (res.quality) {
      qualityElemStyleHandler(res.quality, qualityElem)
    }
  }

  if (discordClientStatusElem) {
    discordClientStatusElem.textContent = res.discordClientStatus
  }

  if (tidalTabStatusElem) {
    tidalTabStatusElem.textContent = res.tidalTabStatus
  }

  console.log(res, "res")
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
