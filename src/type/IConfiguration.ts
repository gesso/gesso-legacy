interface IConfiguration {
  host: {
    queue?: {
      heartbeat: number
      host: string
      password: string
      port: number
      protocol: string
      username: string
    }
    cache?: {
      db: number
      family: number
      host: string
      password: string
      port: number
    }
  }
}

export default IConfiguration
