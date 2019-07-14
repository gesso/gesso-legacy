import * as command from "./command"

const args: string[] = process.argv.slice(2)

interface IGessoOptions {
  __args: string[]
  command: string
}

const options: IGessoOptions = {
  __args: process.argv.slice(2),
  command: args[0]
}

// let host: Host = null

if (["initialize", "init"].includes(options.command)) {
  command.initialize()
} else if (["start"].includes(options.command)) {
  const optionStrings = args.slice(1)
  command.start({
    host: null,
    activity:
      optionStrings.length > 0
        ? {
            id: optionStrings[0]
          }
        : null
  })
} else if (["create"].includes(options.command)) {
  const optionStrings = args.slice(1)
  command.create({
    name: optionStrings[0]
  })
} else if (["list", "ls"].includes(options.command)) {
  command.list()
} else if (["delete", "rm"].includes(options.command)) {
  // Delete scripts in ~/.gesso/scripts.
  command.delete(args.slice(1))
} else if (["connect"].includes(options.command)) {
  // command.connect.validate(options)
  // command.connect.execute(options)
  const optionStrings = args.slice(1)
  command.connect({
    source: optionStrings[0],
    target: optionStrings[1]
  })
}
