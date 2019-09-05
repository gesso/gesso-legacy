import uuid from "uuid"
import { importProcedures, GESSO_REGISTRY_PATH } from "../registry/lib"
import { IProcedure } from "../procedure"
import { ISchematic } from "../schematic"
import { IRegistry } from "../registry"

// ----------------------------------------------------------------------------
//
//  Machine.
//
// ----------------------------------------------------------------------------

export interface IMachine {
  id: string
  version: number
  procedures: {
    [procedureId: string]: IProcedure
  }
  index: Index
  import: Import
}

export type Index = ({ registry }: { registry: IRegistry }) => void

export type Import = ({
  registry,
  id
}: {
  registry: IRegistry
  id: string
}) => Promise<IProcedure>

export class Machine implements IMachine {
  public id: string
  public version: number
  public procedures: {
    [procedureId: string]: IProcedure
  }

  constructor() {
    this.id = uuid.v4()
    this.version = 1
    this.procedures = {}
  }

  // Machine: Index procedures in a machine to make available for execution.
  public index: Index = ({ registry }) => {
    console.info(`Registering procedures in machine ${this.id}.`)
    const procedureIds = Object.keys(registry.procedures)
    for (const procedureId of procedureIds) {
      this.import({ registry, id: procedureId })
    }
  }

  public import: Import = async ({
    registry,
    id
  }: {
    registry: IRegistry
    id: string
  }) => {
    // const procedure: IProcedure = registry.procedures[id]

    // <REFACTOR>
    // Import, download, stream, etc. the module to a machine from a registry.
    const importedModules = await importProcedures(GESSO_REGISTRY_PATH)
    const procedures: IProcedure[] = importedModules
      .map(module => {
        return module.procedure
      })
      .filter(procedure => {
        return procedure.id === id
      })
    const procedure: IProcedure = procedures[0]
    // </REFACTOR>

    this.procedures[procedure.id] = procedure
    return this.procedures[procedure.id]
  }
}
