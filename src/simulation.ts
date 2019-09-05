// import uuid from "uuid"
// import {
//   IRegistry,
//   ISchematic,
//   IDeployment,
//   IMachine,
//   IProcedure,
//   IInput,
//   deploy
// } from "./lib"

// import * as engine from "./lib"

// // TODO: Make the simulator script use the HTTP interface (or CLI).

// // ----------------------------------------------------------------------------
// //
// //  Logger.
// //
// // ----------------------------------------------------------------------------

// const print = {
//   info: console.info,
//   debug: console.debug,
//   error: console.error
// }

// export type SimulateRegistryCommits = ({
//   registry
// }: {
//   registry: IRegistry
// }) => Promise<IRegistry>

// export type SimulateEditorUsage = ({
//   registry
// }: {
//   registry: IRegistry
// }) => Promise<ISchematic>

// export const simulateRemoteRegistryCommits: SimulateRegistryCommits = async ({
//   registry
// }) => {
//   print.info(`Simulating initial procedure commits to a registry.`)
//   for (const procedure of Object.values(registry.procedures)) {
//     register({
//       procedure,
//       registry
//     })
//   }
//   return registry
// }

// export const simulateEditorUsage: SimulateEditorUsage = async ({
//   registry
// }) => {
//   print.info(`Simulating editor usage to generate schematic.`)

//   // TODO: With machines constructed and allocated in memory, compose
//   //   a schematic from the procedures in the registry, accessed with the
//   //   explorer.

//   // TODO: Replicate procedures as they're inserted (and data-mapped) and
//   // composed into a schematic.

//   // Simulate selection of a procedure and editing its initial input (e.g.,
//   // through visual data structure editor, through CLI commands, etc.).
//   const inputTarget: IProcedure = Object.values(registry.procedures)[0]
//   const input: IInput[] = []

//   // Generate schematic after editing.
//   const schematic: ISchematic = {
//     registry,
//     id: uuid.v4(),
//     procedures: Object.values(registry.procedures), // replicate... TODO: Replace with reference to dependency + instnace lookup
//     input: {
//       [inputTarget.id]: [...input]
//     }
//   }
//   print.info(`Generated schema: ${JSON.stringify(schematic, null, 2)}`)

//   return schematic
// }

// // execute / tick / iterate
// // TODO: Start async loop running for each loaded procedure.
// export const start = async () => {
//   const registry: IRegistry = new Registry()

//   simulateRemoteRegistryCommits({ registry })

//   // Simulate editor usage.
//   const schematic: ISchematic = await simulateEditorUsage({ registry })
//   print.info(`Schematic: ${JSON.stringify(schematic, null, 2)}`)

//   print.info("Log:")
//   const deployment: IDeployment = await deploy({ schematic })

//   const machine: IMachine = deployment.machine
//   print.info(`Machine: ${JSON.stringify(machine, null, 2)}`)

//   // Set up host (this would be done as a prerequisite step before using the
//   // editor).
//   await index({ machine, schematic })
//   await initialize({ machine })

//   print.info(`Machine: ${JSON.stringify(machine, null, 2)}`)

//   // TODO: Replace with "tail recursion".
//   engine.start(machine)
// }
