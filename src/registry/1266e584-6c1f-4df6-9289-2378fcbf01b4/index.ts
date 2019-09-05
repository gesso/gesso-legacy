import { IProcedure, IInput, IOutput } from "../../lib/procedure"

export interface IMyInput extends IInput {
  value: number
}

export interface IMyOutput extends IOutput {
  value: number
}

export const procedure: IProcedure = {
  id: "1266e584-6c1f-4df6-9289-2378fcbf01b4",
  dependencies: ["2937ee6e-7b67-49c1-bd94-e27424ee0519"],
  execute: (input: { value: number }) => {
    const output: IOutput = { value: input.value * 10 }
    return output
  }
}
