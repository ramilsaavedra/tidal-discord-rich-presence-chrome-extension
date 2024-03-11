let keepAwakePort: chrome.runtime.Port

function connect() {
  keepAwakePort = chrome.runtime.connect({ name: "keep-alive" })
  keepAwakePort.postMessage("Tidal.com is detected")
  keepAwakePort.onDisconnect.addListener(connect)
  keepAwakePort.onMessage.addListener((msg) => {
    console.log("receieved", msg, "from service worker")
  })
}

chrome.runtime.onMessage.addListener(async (msg) => {
  await sendMessageToApp(msg)
})

async function sendMessageToApp(id: string) {
  console.log(id, "trackID")
  await fetch("http://localhost:3001/message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id }),
  })
    .then((response) => response.text())
    .then((data) => {
      console.log("Response from Node.js server:", data)
    })
    .catch((error) => {
      console.log("Error:", error.message)
    })

  await fetch("http://localhost:3001", {
    method: "GET",
  })
    .then((res) => console.log(res))
    .catch((err) => console.log("Error:", err.message))
}

connect()
console.log("Tidal Discord Rich Presence content script")
