import { IMachine, Machine } from "../machine"
import uuid = require("uuid")
import { ISchematic } from "../schematic"
import { IInput } from "../procedure"

export interface IEnvironment {
  id: string
  version: number
  machines: IMachine[]
}

// This should return a way to reference the deployment, manage it, etc.
export type Deploy = ({ schematic }: { schematic: ISchematic }) => Promise<void>

export class Environment implements IEnvironment {
  public id: string
  public version: number
  public machines: IMachine[]

  // Refactor into Context?
  public queues: { [procedureId: string]: IInput[] }

  constructor({ queues }: { queues: { [procedureId: string]: IInput[] } }) {
    this.id = uuid.v4()
    this.version = 1
    this.machines = []

    // Refactor
    this.queues = queues
  }

  public deploy: Deploy = async ({ schematic }) => {
    const machine = new Machine()

    // Replicate procedures from registries.
    for (const procedure of schematic.procedures) {
      machine.procedures[procedure.id] = procedure // Construct procedure (load into memory).
    }

    // Initialize input queues for procedures.
    for (const procedure of schematic.procedures) {
      this.queues[procedure.id] = []
    }

    // Queue initial inputs for procedures.
    for (const [procedureId, inputs] of Object.entries(schematic.input)) {
      this.queues[procedureId].push(...inputs)
    }
    // print.info(`inputs: ${JSON.stringify(inputQueues, null, 2)}`)

    this.machines.push(machine)

    // Create procedure instances for each machine.
    // Loads procedures into machine memory.
    for await (const machine of this.machines) {
      machine.index({ registry: schematic.registry })
    }
  }
}
