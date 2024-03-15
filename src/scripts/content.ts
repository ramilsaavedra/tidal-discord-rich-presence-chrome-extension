// these are the element holds the state
let titleElem: Element | null
let artistsElem: Element | null
let albumImgElem: Element | null
let playBtnElem: Element | null
let qualityElem: Element | null
let linkElem: Element | null | undefined
let durationElem: Element | null

// this timer is used to avoild multiple invocations of sending a message to local server (updates the discord rich presence) and other parts of the extension
let timer: ReturnType<typeof setTimeout>

// these are the state
let title: string
let artists: string
let albumImgUrl: string
let isPlaying = false
let quality: string
let trackUrl: string

const validURL = document.URL.includes("listen")
// run the script on listen.tidal.com only
if (validURL) {
  // this is the main element of listen tidal page.
  // **It may change in the future that can break the whole script
  const targetNode = document.getElementById("wimp")

  const callback: MutationCallback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      // check if the mutation comes from the main element
      // also this the indication that the listen.tidal page is fully functional
      // *** It must run only once (as of March 15 it only run once)
      if (mutation.target === targetNode) {
        // these are the elements to observe
        // playbtnElem to check the isPlaying data
        // durationElem to check if the track / song / video is changed
        // qualityElem to check the quality data
        playBtnElem = document.querySelector(
          "#playbackControlBar > div > button > svg > use"
        )
        durationElem = document.querySelector("#footerPlayer time:last-of-type")
        qualityElem = document.querySelector(
          "button[data-test-media-state-indicator-streaming-quality] > span"
        )

        // intialize the observer on the 3 elements above
        initObserver(observer)
      }

      if (mutation.target === playBtnElem) {
        isPlaying = !playBtnElem.getAttribute("href")?.includes("_play")
      }

      getTrackElements()
      mutationConsoleHandler()
    }
  }

  const observer = new MutationObserver(callback)

  if (targetNode) {
    observer.observe(targetNode, { childList: true })
  }

  chrome.runtime.onMessage.addListener(
    (msg: any, sender: chrome.runtime.MessageSender, response: any) => {
      console.log(msg)
    }
  )
}

function initObserver(observer: MutationObserver) {
  if (durationElem && playBtnElem && qualityElem) {
    observer.observe(durationElem, { characterData: true, subtree: true })
    observer.observe(playBtnElem, {
      attributes: true,
    })
    observer.observe(qualityElem, { characterData: true, subtree: true })
  }
}

// everytime there is a change we need to update the elements
// since sometimes the listen tidal remove or replace the existing element (e.g when you are swithing video to a song or vice versa)
function getTrackElements() {
  try {
    titleElem = document.querySelector(
      "#footerPlayer .wave-text-description-demi"
    )
    artistsElem = document.querySelector("#footerPlayer .artist-link")
    albumImgElem = document.querySelector("#footerPlayer figure[data-test] img")
    linkElem = titleElem?.closest("a")
    qualityElem = document.querySelector(
      "button[data-test-media-state-indicator-streaming-quality] > span"
    )

    updateTrackDetails()
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error :", error.message)
    }
  }
}

function updateTrackDetails() {
  if (artistsElem) {
    artists =
      artistsNameHandler(artistsElem.childNodes) || "Artists name not found"
  }

  if (titleElem) {
    title = titleElem.textContent || "Title not found"
  }

  if (qualityElem) {
    quality = qualityElem.textContent || "Quality not found"
  } else {
    quality = "Normal"
  }

  if (linkElem) {
    trackUrl = linkElem.getAttribute("href") || "Track URL not found"
  }

  if (albumImgElem) {
    albumImgUrl = albumImgUrlHandler(albumImgElem) || "Album image not found"
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
    chrome.runtime.sendMessage({
      from: "content",
      subject: "track details",
      body: {
        title,
        artists,
        albumImgUrl,
        quality,
        isPlaying,
        trackUrl,
      },
    })
    console.log(
      `${title} by ${artists} | album image src: ${albumImgUrl} | currently playing: ${isPlaying} | quality: ${quality} | track url: ${trackUrl}`
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
        title,
        artists,
        albumImgUrl,
        isPlaying,
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
