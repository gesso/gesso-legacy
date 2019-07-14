type Channel = {
  id: string
  protocol: "object" | "http" | "websockets" | "tcp" | "udp" | "file"
} | void

export default Channel
