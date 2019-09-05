import { IProcedure, IInput, IOutput } from "../../lib/procedure"

export interface IMyInput extends IInput {
  value: number
}

export interface IMyOutput extends IOutput {
  value: number
}

export const procedure: IProcedure = {
  id: "cb551aea-15c1-48ce-86f7-6ed96642d004",
  dependencies: ["2937ee6e-7b67-49c1-bd94-e27424ee0519"],
  execute: (input: { value: number }) => {
    const output: IOutput = { value: input.value + 1 }
    return output
  }
}
