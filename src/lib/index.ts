import { IMachine } from "./machine"
import { IProcedure, IInput, IOutput } from "./procedure"
import { IRegistry } from "./registry"

export type Initialize = ({ machine }: { machine: IMachine }) => Promise<void>

export type Subscribe = ({
  machine,
  procedure
}: {
  machine: IMachine
  procedure: IProcedure
}) => Promise<void>

export type Dispatch = ({
  machine,
  procedure,
  output,
  inputQueues // HACK
}: {
  machine: IMachine
  procedure: IProcedure
  output: IOutput
  inputQueues: { [procedureId: string]: IInput[] } // HACK
}) => Promise<void>

export type Publish = ({
  machine,
  procedure,
  output,
  inputQueues // HACK
}: {
  machine: IMachine
  procedure: IProcedure
  output: IOutput
  inputQueues: { [procedureId: string]: IInput[] } // HACK
}) => void

export type Execute = ({
  machine,
  procedure,
  input,
  queues // HACK
}: {
  machine: IMachine
  procedure: IProcedure
  input: IInput
  queues: { [procedureId: string]: IInput[] } // HACK
}) => Promise<any>

export type Register = ({
  procedure,
  registry
}: {
  procedure: IProcedure
  registry: IRegistry
}) => Promise<void>

export type InitializeRegistry = () => Promise<IRegistry>

export interface ISubscribers {
  [procedureId: string]: string[]
}
