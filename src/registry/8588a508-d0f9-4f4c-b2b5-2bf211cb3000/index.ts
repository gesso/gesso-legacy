import { IProcedure, IInput, IOutput } from "../../lib/procedure"

export interface IMyInput extends IInput {
  value: number
}

export interface IMyOutput extends IOutput {
  value: number
}

export const procedure: IProcedure = {
  id: "8588a508-d0f9-4f4c-b2b5-2bf211cb3000",
  dependencies: ["2937ee6e-7b67-49c1-bd94-e27424ee0519"],
  execute: (input: { value: number }) => {
    const output: IOutput = { value: input.value }
    return output
  }
}
