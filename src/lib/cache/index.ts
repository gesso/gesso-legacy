import ioredis from "ioredis"
import configuration from "../../configuration"

const CACHE_PREFIX: string = "gesso"

interface ICacheRegister {}

type CacheRegister<TCacheRegister extends ICacheRegister> = TCacheRegister

type CacheProtocol = "redis"

interface ICache {
  type: CacheProtocol
}

export interface IRedisCache extends ICache {
  protocol: "redis"
  db: number
  family: number
  host: string
  password: string
  port: number
}

export type Queue<TQueueProvider extends ICache> = TQueueProvider

let cache: ioredis.Redis = null

export const create = async () => {
  cache = new ioredis({
    db: configuration.host.cache.db,
    family: configuration.host.cache.family,
    host: configuration.host.cache.host,
    password: configuration.host.cache.password,
    port: configuration.host.cache.port
  })
  return cache
}

export const get = async (id: number): Promise<CacheRegister<{}>> => {
  const cacheKey = `${CACHE_PREFIX}:${id}`
  const register = await cache.get(cacheKey)
  return JSON.parse(register)
}

export const getAll = async (
  ids: number[] | null
): Promise<Array<CacheRegister<{}>>> => {
  if (ids === null || (Array.isArray(ids) && ids.length === 0)) {
    const cacheKeys: string[] = await cache.keys(`${CACHE_PREFIX}:*`)
    const registers = await cache.mget(...cacheKeys)
    return registers.map(JSON.parse).filter((register: CacheRegister<{}>) => {
      return true
    })
  } else {
    const cacheKeys: string[] = ids.map(id => `${CACHE_PREFIX}:${id}`)
    const registers = await cache.mget(...cacheKeys)
    return registers.map(JSON.parse).filter((register: CacheRegister<{}>) => {
      return true
    })
  }
}

export const set = async (id: number, register: CacheRegister<{}>) => {
  const cacheKey = `${CACHE_PREFIX}::${id}`
  const registerString = JSON.stringify({ register }, null, 2)
  return await cache.set(cacheKey, registerString)
}
