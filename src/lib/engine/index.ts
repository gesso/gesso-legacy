import { Service } from "../../bin/server/service"
import { IMachine } from "../machine"
import { IInput } from "../procedure"

export interface IEngine {}

export class Engine implements IEngine {
  constructor() {
    //
  }
  public start = async (
    service: Service,
    machine: IMachine,
    queues: { [procedureId: string]: IInput[] } // HACK
  ) => {
    return new Promise((resolve, reject) => {
      try {
        for (const procedure of Object.values(machine.procedures)) {
          if (queues[procedure.id].length > 0) {
            // const input = service.consume(machine, procedure, inputQueues)
            const input = queues[procedure.id].shift()
            service.execute({ machine, procedure, input, queues }) // optional async? async from within procedure should be possible.
          }
        }
        return resolve()
      } catch (err) {
        return err
      }
    }).then(() => {
      setTimeout(() => {
        this.start(service, machine, queues)
      })
    })
  }
}
