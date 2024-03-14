let validURL = document.URL.includes("listen")

let title: Element | null
let artists: Element | null
let albumImg: Element | null
let playBtn: Element | null
let qualityElem: Element | null
let linkElem: Element | null | undefined
let durationElem: Element | null

let timer: ReturnType<typeof setTimeout>

let songTitle: string
let artistsName: string
let albumImgUrl: string
let playBtnState = false
let quality: string
let trackUrl: string

if (validURL) {
  console.log("Valid URL")
  const targetNode = document.getElementById("wimp")
  // Create an observer instance linked to the callback function
  // Callback function to execute when mutations are observed
  const callback: MutationCallback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.target === targetNode) {
        playBtn = document.querySelector(
          "#playbackControlBar > div > button > svg > use"
        )
        durationElem = document.querySelector("#footerPlayer time:last-of-type")
        initObserver(observer)
      }

      if (mutation.target === playBtn) {
        playBtnState = !playBtn.getAttribute("href")?.includes("_play")
      }

      getTrackElements()
      mutationConsoleHandler()
    }
  }

  const observer = new MutationObserver(callback)

  // Start observing the target node for configured mutations
  if (targetNode) {
    observer.observe(targetNode, { childList: true })
  }
}

function initObserver(observer: MutationObserver) {
  if (durationElem && playBtn) {
    observer.observe(durationElem, { characterData: true, subtree: true })
    observer.observe(playBtn, {
      attributes: true,
    })
  }
}

function getTrackElements() {
  try {
    title = document.querySelector("#footerPlayer .wave-text-description-demi")
    artists = document.querySelector("#footerPlayer .artist-link")
    albumImg = document.querySelector("#footerPlayer figure[data-test] img")
    qualityElem = document.querySelector(
      "button[data-test-media-state-indicator-streaming-quality] > span"
    )
    linkElem = title?.closest("a")

    updateTrackDetails()
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error :", error.message)
    }
  }
}

function updateTrackDetails() {
  if (artists) {
    artistsName =
      artistsNameHandler(artists.childNodes) || "Artists name not found"
  }

  if (title) {
    songTitle = title.textContent || "Title not found"
  }

  if (qualityElem) {
    quality = qualityElem.textContent || "Quality not found"
  } else {
    quality = "Normal"
  }

  if (linkElem) {
    trackUrl = linkElem.getAttribute("href") || "Track URL not found"
  }

  if (albumImg) {
    albumImgUrl = albumImgUrlHandler(albumImg) || "Album image not found"
  }
}

function artistsNameHandler(artists: NodeListOf<ChildNode>) {
  if (artists) {
    return Array.from(artists)
      .map((artist) => artist.textContent)
      .join(", ")
  }
}

function mutationConsoleHandler() {
  clearTimeout(timer)
  timer = setTimeout(async () => {
    const data = await sendTrackDetails()
    console.log(
      `${songTitle} by ${artistsName} | album image src: ${albumImgUrl} | currently playing: ${playBtnState} | quality: ${quality} | track url: ${trackUrl}`
    )
  }, 1000)
}

function albumImgUrlHandler(element: Element) {
  const srcset = element.getAttribute("srcset")
  if (!element || !srcset) {
    return
  }

  const srcs = srcset.split(", ")
  let maxWidth = 0
  let maxUrl = ""

  for (const src of srcs) {
    let parts = src.split(" ")

    if (parseInt(parts[1]) > maxWidth) {
      maxUrl = parts[0]
    }
  }

  return maxUrl
}

async function sendTrackDetails() {
  try {
    const response = await fetch("http://localhost:3001/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        songTitle,
        artistsName,
        albumImgUrl,
        playBtnState,
        quality,
        trackUrl,
      }),
    })

    const data = await response.text()
    return data
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error :", error.message)
    }
  }
}
