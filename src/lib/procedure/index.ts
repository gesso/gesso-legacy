export interface IInput {
  [key: string]: any
}

export interface IOutput {
  [key: string]: any
}

export interface IProcedure {
  id: string
  dependencies: string[] // Subscribe to these procedures' outputs.
  execute: (input: IInput) => IOutput
}

export class Procedure implements IProcedure {
  public id: string
  public dependencies: string[] // Subscribe to these procedures' outputs.
  public execute: (input: IInput) => IOutput
}
