import { ISubscribers, Subscribe, Dispatch, Publish, Execute } from "../../lib"

import uuid from "uuid"
import { Registry, IRegistry } from "../../lib/registry"
import { GESSO_REGISTRY_PATH } from "../../lib/registry/lib"
import { ISchematic, Schematic } from "../../lib/schematic"
import { IInput, IProcedure } from "../../lib/procedure"
import { IMachine } from "../../lib/machine"
import { IEnvironment, Environment } from "../../lib/environment"
import { Engine, IEngine } from "../../lib/engine"

export interface IService {
  registry: IRegistry
  schematic: ISchematic
  queues: { [procedureId: string]: IInput[] }
  environment: IEnvironment
  subscribers: ISubscribers
  engine: IEngine
}

export class Service implements IService {
  public registry: Registry = null
  public schematic: ISchematic = null
  public queues: { [procedureId: string]: IInput[] } = {}
  public environment: Environment = null

  // Refactor
  public subscribers: ISubscribers = {}
  public engine: Engine = null

  constructor() {
    console.info("Starting service")
    this.registry = new Registry()
    this.schematic = null
    this.queues = {}
    this.environment = new Environment({ queues: this.queues })

    // REFACTOR
    this.subscribers = {}
    this.engine = new Engine()
  }

  // Initialize the service.
  public initialize = async () => {
    // Initialize registry.
    await this.registry.initialize(GESSO_REGISTRY_PATH)
  }

  // public start = async () => {
  //   // Initialize input queues.
  //   // Simulate selection of a procedure and editing its initial input (e.g.,
  //   // through visual data structure editor, through CLI commands, etc.).
  //   // const inputTarget: IProcedure = Object.values(this.registry.procedures)[0]
  //   // const input: IInput[] = []
  //   console.info("Registry")
  //   console.info(this.registry)
  // }

  public saveSchematic = async () => {
    // TODO: Save current state as schematic.
  }

  public createSchematic = async () => {
    // Generate schematic after editing.
    this.schematic = {
      // TODO: Not needed until export.
      registry: this.registry,
      // TODO: Not needed until export.
      id: uuid.v4(),
      // TODO: Not needed until export (below).
      procedures: Object.values(this.registry.procedures), // replicate... TODO: Replace with reference to dependency + instnace lookup
      input: {
        // [inputTarget.id]: [...input]
      }
    }
    console.info(`Schematic:`)
    console.info(this.schematic)
  }

  public deploySchematic = async () => {
    await this.environment.deploy({
      schematic: this.schematic
    })

    // Subscribe machines' procedures to input sources.
    for (const machine of this.environment.machines) {
      console.info(`Initializing machine ${machine.id}.`)
      const procedures: IProcedure[] = Object.values(machine.procedures)
      // Initialize procedure subscribers.
      for await (const procedure of procedures) {
        console.info(`Loading procedure ${procedure.id}.`)
        this.subscribe({ machine, procedure })
      }
    }
  }

  public startEnvironment = async () => {
    // Specify the engine for the environment.
    const machine: IMachine = this.environment.machines[0]
    this.engine.start(this, machine, this.queues)
  }

  // REFACTOR

  // Machine: Subscribe procedures to the procedures that depend on their output.
  public subscribe: Subscribe = async ({ machine, procedure }) => {
    console.info(`${machine.id}: Loading procedure ${procedure.id}.`)
    // Replace referencing with re-allocation per machine.
    // Associate subscribers.
    if (!this.subscribers.hasOwnProperty(procedure.id)) {
      this.subscribers[procedure.id] = []
    }
    for (const procedureId of machine.procedures[procedure.id].dependencies) {
      if (!this.subscribers.hasOwnProperty(procedureId)) {
        this.subscribers[procedureId] = []
      }
      console.info(
        `${machine.id}: Subscribing ${procedure.id} to ${procedureId}.`
      )
      this.subscribers[procedureId].push(procedure.id)
    }
  }

  public dispatch: Dispatch = async ({
    machine,
    procedure,
    output,
    inputQueues
  }) => {
    return new Promise((resolve, reject) => {
      // Get list of all subscribers to the procedure
      // Send output to each of the subscribers
      console.info(output)

      for (const subscriberId of this.subscribers[procedure.id]) {
        // emit:
        // HACK? Look up procedure or replicate onto an available host.
        const subscriber: IProcedure = machine.procedures[subscriberId]
        console.info(`Queue ${JSON.stringify(output)} for ${subscriber.id}`)
        inputQueues[subscriber.id].push(output)
      }
    })
  }

  // Dispatch the output from the procedure to its subscribers as input.
  public publish: Publish = async ({
    machine,
    procedure,
    output,
    inputQueues
  }) => {
    return new Promise((resolve, reject) => {
      // run a procedure and get output
      // dispatch output to subscribers (i.e., over rabbit, 0mq, etc.)
      console.info(`${procedure.id}: ${JSON.stringify(output)}`)
      resolve(this.dispatch({ machine, procedure, output, inputQueues }))
    })
  }

  // Execute a procedure with the given input.
  public execute: Execute = async ({ machine, procedure, input, queues }) => {
    console.info(`Executing procedure ${procedure.id}.`)
    return new Promise((resolve, reject) => {
      const output = procedure.execute(input)
      if (output) {
        this.publish({ machine, procedure, output, inputQueues: queues })
      }
      const status = 0
      resolve(status)
    })
  }

  // public consume = (
  //   machine: IMachine,
  //   procedure: IProcedure,
  //   inputQueues: { [procedureId: string]: IInput[] } // HACK
  // ) => {
  //   const input = inputQueues[procedure.id].shift()
  //   return input
  // }
}
