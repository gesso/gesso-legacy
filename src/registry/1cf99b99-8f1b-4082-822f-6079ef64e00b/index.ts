import { IProcedure, IInput, IOutput } from "../../lib/procedure"

export interface IMyInput extends IInput {
  value: number
}

export interface IMyOutput extends IOutput {
  value: number
}

export const procedure: IProcedure = {
  id: "1cf99b99-8f1b-4082-822f-6079ef64e00b",
  dependencies: [],
  execute: (input: { value: number }) => {
    const output: IOutput = { value: input.value + 18 }
    return output
  }
}
