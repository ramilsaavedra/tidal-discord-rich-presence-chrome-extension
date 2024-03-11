const targetNode = document.getElementById("wimp")
let title: Element
let artists: Element
let albumImg: Element
let playBtn: Element
let once = 1

// @ts-ignore
// Callback function to execute when mutations are observed
const callback = (mutationList, observer) => {
  for (const mutation of mutationList) {
    if (title === mutation.target) {
      console.log("im the title")
    }
    if (mutation.type === "childList") {
      if (once === 1) {
        getTrackElements()
        once++
        return
      }
    }

    mutationConsoleHandler(mutation)
  }
}

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback)

// Options for the observer (which mutations to observe)
const config = { childList: true }

// Start observing the target node for configured mutations
observer.observe(targetNode, config)

function getTrackElements() {
  try {
    title = document.querySelector(".wave-text-description-demi")

    artists = document.querySelector("#footerPlayer .artist-link")

    albumImg = document.querySelector("figure[data-test] img")

    playBtn = document.querySelector("#playbackControlBar > div > button")

    observer.observe(title, { characterData: true, subtree: true })
    observer.observe(artists, { childList: true })
    observer.observe(albumImg, { attributes: true })
    // observer.observe(playBtn, { childList: true })
  } catch (error) {
    console.log(error.Message)
  }
}

function mutationConsoleHandler(mutation: any) {
  switch (mutation.type) {
    case "attributes":
      console.log(`Album Image Source: ${mutation.target.src}`)
      return
    case "childList":
      let artistsName = Array.from(mutation.target.childNodes)
        .map((artist: Element) => artist.textContent)
        .join(", ")
      console.log(`Artists: ${artistsName}`)
      return
    case "characterData":
      console.log(`Title: ${mutation.target.textContent}`)
  }
}
