import { IProcedure, IInput, IOutput } from "../../lib/procedure"

export interface IMyInput extends IInput {
  value: number
}

export interface IMyOutput extends IOutput {
  value: number
}

export const procedure: IProcedure = {
  id: "2937ee6e-7b67-49c1-bd94-e27424ee0519",
  dependencies: [
    "1cf99b99-8f1b-4082-822f-6079ef64e00b",
    "8588a508-d0f9-4f4c-b2b5-2bf211cb3000"
  ],
  execute: (input: { value: number }) => {
    const output: IOutput = { value: input.value * 1.5 }
    return output
  }
}
