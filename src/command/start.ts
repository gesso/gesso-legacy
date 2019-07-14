// TODO(@mgub): Start Gesso host and make available to host an activity (i.e., run a script) with pubsub, etc. interfaces.

import configuration from "../configuration"
import * as gesso from "../host"
import { IStartActivityInput } from "../host"
import amqp from "amqplib/callback_api"

import { getDirectories } from "../lib/fs"
import path from "path"
import os from "os"
import { IActivity } from "../lib/queue/initialize"

const GESSO_ACTIVITY_ROOT_PATH = path.join(os.homedir(), ".gesso", "activity")

// let connection: amqp.Connection | null = null

// type Connection<T> = T

// export type QueueConnection<T> = Connection<T>

// type ConnectionProtocol<T> = T

type QueueProtocol = "amqp"

interface IQueue {
  protocol: QueueProtocol
}

export interface IRabbitQueue extends IQueue {
  protocol: "amqp"
  connection: amqp.Connection | null
  channel: amqp.Channel | null
  name: string | null
}

export type Queue<TQueueProvider extends IQueue> = TQueueProvider

export interface IHost<TQueue extends IQueue> {
  id: string
  registry: IActivityRegistry
  queue: {
    [key: string]: Queue<TQueue>
  }
  // {
  //   // TODO: Rename to "input"? i.e., Host-level input, then internally assigned as input to the target activity.
  //   protocol: ConnectionProtocol<TProtocol>
  //   connection: QueueConnection<TConnection> | null
  //   channel: amqp.Channel | null
  //   name: string | null
  // }
  // os: {
  //   ip: string
  // }
}

export interface IActivityRegistry {
  [key: string]: ActivityRegister
}

export type ActivityRegister = IActivity

// Can get list of available activity instances per hosed.
// TODO: Move this to Redis? Or put second-order cache on Redis (activity -> <list of activity host instances>)
// const activityRegistry: IActivityRegistry = {}

let host: IHost<Queue<IRabbitQueue>> = null

/**
 * @name init
 * @description Creates new project in `~/.gesso/scripts`.
 */
const start = async (input: IStartActivityInput) => {
  // If `input.host` is specified and is another host, relay the message to that host. If `null`, use localhost.
  // Create connection.
  if (!host) {
    host = await gesso.initialize(configuration) // rename to gesso.create(configuration): Host<IDockerHost | IBoardHost>
    console.log(`Initialized ${host.id}.`)
  }
  if (host.queue[host.id].connection) {
    // Update activity registry. Later, maybe only do this if a non-null
    // activity is specified.
    console.log(`Initializing activity registry.`)
    const activityIds: string[] = await getDirectories(GESSO_ACTIVITY_ROOT_PATH)
    activityIds.forEach(activityId => {
      // console.log(`Starting activity ${activity}`)

      console.log(`Initializing activity ${activityId}.`)
      // connection = host.provider.connection
      // TODO: Activities should be preloaded in primary memory and cache.
      if (activityId && !host.registry.hasOwnProperty(activityId)) {
        console.log(`Registering activity ${activityId}.`)
        host.registry[activityId] = {
          id: activityId
          // TODO: Load function in primary memory.
        } as ActivityRegister

        console.log(`Starting activity: ${host.registry[activityId].id}.`)
      }
    })
  }

  // TODO: Start all activities here!

  if (input && input.activity && input.activity.id) {
    // Pass in connection; find or clone and checkout activity-version, dry run the activity to ensure it works, create channel, queue, add to local registry, and enable consumption.
    return gesso.start({
      host,
      activity: input.activity // TODO: Convert to array.
    })
  } else {
    Object.values(host.registry).forEach((activity: IActivity) => {
      // Pass in connection; find or clone and checkout activity-version, dry run the activity to ensure it works, create channel, queue, add to local registry, and enable consumption.
      return gesso.start({
        host,
        activity // input.activity // TODO: Convert to array.
      })
    })
  }
}

export default start
