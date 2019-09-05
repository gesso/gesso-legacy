import { IProcedure, IInput } from "../procedure"
import uuid = require("uuid")
import { IRegistry } from "../registry"

export interface ISchematic {
  id: string
  registry: IRegistry
  procedures: IProcedure[]
  input: {
    [procedureId: string]: IInput[]
  }
  // TODO: Include dependencies and I/O mappings in schematic so it is portable.
}

export class Schematic implements ISchematic {
  public id: string = uuid.v4()
  public registry: IRegistry = null
  public procedures: IProcedure[] = []
  public input: {}
}
