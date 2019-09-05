import { importProcedures } from "./lib"

import uuid from "uuid"
import { IProcedure } from "../procedure"

// ----------------------------------------------------------------------------
//
//  Registry.
//
// ----------------------------------------------------------------------------

// Represents a public registry or index of procedures available for replicating
// into a machine's procedure index and loading into memory to make available
// for execution (as a service).
export interface IRegistry {
  id: string
  version: number
  procedures: {
    [procedureId: string]: IProcedure
  }
}

export class Registry implements IRegistry {
  public id: string
  public version: number
  public procedures: {
    [procedureId: string]: IProcedure
  }

  constructor() {
    // this.id = id || uuid.v4()
    this.id = uuid.v4()
    this.version = 1
    this.procedures = {}
  }

  public async initialize(procedureModulePaths: string) {
    // <REFACTOR>
    const modules = await importProcedures(procedureModulePaths)
    const procedures: IProcedure[] = modules.map(module => {
      return module.procedure
    })
    // </REFACTOR>

    // TODO: Don't load these into memory. Optionally, lazy load?
    for (const procedure of procedures) {
      this.procedures[procedure.id] = procedure
    }
  }

  public register = async ({ procedure }: { procedure: IProcedure }) => {
    this.procedures[procedure.id] = procedure
    // TODO: Return metadata with info about how to access the registered
    //   procedure.
  }
}
