interface Message<T = string> {
  type: string
  content?: T
}

export default Message
