import {Command, flags} from "@oclif/command"

import {getParameter, setParameter} from "../config/config"

export default class Hello extends Command {
  static description = "describe the command here"

  static examples = [
    `$ transcribe hello
hello world from ./src/hello.ts!
`,
  ]

  static flags = {
    help: flags.help({char: "h"}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: "n", description: "name to print"}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: "f"}),
    config: flags.string({char: "c", description: "name of config parameter"})
  }

  static args = [{name: "file"}]

  async run() {
    const {args, flags} = this.parse(Hello)

    const name = flags.name || "world"
    const paramName = flags.config || "foo"
    const value = getParameter(paramName)
    this.log(`hello ${name} from ./src/commands/hello.ts`)
    this.log(`paramer ${paramName} has value ${value}`)
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
  }
}
