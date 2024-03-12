let validURL = document.URL.includes("listen")

if (validURL) {
  console.log("Valid URL")

  const targetNode = document.getElementById("wimp")

  let title: Element
  let artists: Element
  let albumImg: Element
  let playBtn: Element
  let qualityElem: Element

  let once = 1
  let timer: ReturnType<typeof setTimeout>

  let songTitle: string
  let artistsName: string
  let albumImgUrl: string
  let playBtnState = false
  let quality: string

  // @ts-ignore
  // Callback function to execute when mutations are observed
  const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      // get the initial element
      if (once === 1) {
        if (mutation.type === "childList") {
          getTrackElements()
          once++
          mutationConsoleHandler()
          return
        }
      }

      if (mutation.type === "childList") {
        // check if there is a changed on artist
        if (mutation.target === artists) {
          artistsName = artistsNameHandler(Array.from(artists.childNodes))
        }

        // check if there si a changed on quality
        if (mutation.target === qualityElem) {
          quality = qualityElem.textContent
        }
      }

      // check if there si a changed on title
      if (mutation.type === "characterData") {
        songTitle = title.textContent
      }

      if (mutation.type === "attributes") {
        // check the if paused or playing
        if (mutation.target === playBtn) {
          playBtnState = !playBtn.getAttribute("href").includes("_play")
        }

        if (mutation.target === albumImg) {
          albumImgUrl = albumImg.getAttribute("src")
        }
      }

      mutationConsoleHandler()
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
      songTitle = title.textContent

      artists = document.querySelector("#footerPlayer .artist-link")
      artistsName = artistsNameHandler(Array.from(artists.childNodes))

      albumImg = document.querySelector("figure[data-test] img")
      albumImgUrl = albumImg.getAttribute("src")

      playBtn = document.querySelector(
        "#playbackControlBar > div > button > svg > use"
      )

      qualityElem = document.querySelector(
        "button[data-test-media-state-indicator-streaming-quality] > span"
      )

      quality = qualityElem.textContent

      observer.observe(title, { characterData: true, subtree: true })
      observer.observe(artists, { childList: true })
      observer.observe(albumImg, { attributes: true })
      observer.observe(playBtn, {
        attributes: true,
      })
      observer.observe(qualityElem, { characterData: true, subtree: true })
    } catch (error) {
      console.log(error.message)
    }
  }

  function artistsNameHandler(artists: ChildNode[]) {
    return artists.map((artist: Element) => artist.textContent).join(", ")
  }

  function mutationConsoleHandler() {
    clearTimeout(timer)
    timer = setTimeout(() => {
      console.log(
        `${songTitle} by ${artistsName} | album image src: ${albumImgUrl} | currently playing: ${playBtnState} | quality: ${quality}`
      )
    }, 500)
  }
}
