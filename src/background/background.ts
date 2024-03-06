import { TrackProps } from "../types"
import { token } from "../../env"

chrome.runtime.onInstalled.addListener(async () => {
  console.log("Tidal Discord Rich Pressence successfully installed")
})

chrome.webRequest.onCompleted.addListener(
  async function (details) {
    if (details.url.includes("v1/tracks")) {
      const id = details.url.match(/\/(\d+)\//)[1]
      console.log(details.url, "onCompleted")
      await fetchTrackInfo(id)
    }
  },
  { urls: ["https://listen.tidal.com/v1/tracks/*"] }
)

async function sendMessageToNodeJS(track: TrackProps) {
  await fetch("http://localhost:3001/message", {
    method: "POST",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(track),
  })
    .then((response) => response.text())
    .then((data) => {
      console.log("Response from Node.js server:", data)
    })
    .catch((error) => {
      console.log("Error:", error.message)
    })
}

async function fetchTrackInfo(id: string) {
  await fetch(`https://openapi.tidal.com/tracks/${id}?countryCode=PH`, {
    method: "GET",
    headers: {
      "Content-Type": "application/vnd.tidal.v1+json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then(async (data) => {
      const title = data.resource.title
      const artist = data.resource.artists[0].name
      const album = data.resource.album.title
      const albumImg = data.resource.album.imageCover[0].url
      const tidalUrl = data.resource.tidalUrl
      console.log({ title, artist, album, albumImg, tidalUrl }, "test")
      await sendMessageToNodeJS({ title, artist, album, albumImg, tidalUrl })
    })
    .catch((error) => console.log("Error:", error))
}
