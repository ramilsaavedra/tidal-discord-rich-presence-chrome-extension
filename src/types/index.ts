export type TrackProps = {
  title: string
  artist: string
  album: string
  albumImg: string
  tidalUrl: string
}

export interface KeepAlivePort extends chrome.runtime.Port {
  _timer?: ReturnType<typeof setTimeout>
}
