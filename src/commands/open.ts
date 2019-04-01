import {Command, flags} from "@oclif/command"
import open from "open"

import api from "../api/azure-ad-api"

export default class Open extends Command {
  static description = "Open an webpage"

  static examples = [
    `$ transcribe open -c azure_ad_client_id
`,
  ]
  static flags = {
    help: flags.help({char: "h"}),
    // flag with a value (-n, --name=VALUE)
    clientId: flags.string({char: "c", description: "Azure Ad clientId"}),
    orgname: flags.string({char: "o", description: "Azure Ad tennand organization name"})
  }

  async run() {
    const {flags} = this.parse(Open)

    if (flags.clientId && flags.orgname) {
      const adUri = "https://login.microsoftonline.com/" + flags.orgname + ".onmicrosoft.com/oauth2/devicecode" //flags.adUri

      const params = new URLSearchParams()
      params.append("client_id", "ddddd")
      params.append("scope", "user.read openid profile")
      const devicecode = await api<{ title: string; message: string }>(adUri, params)
        .then(({user_code, device_code}) => {
          this.log("Pleas add this code to the Chrome window popping up: ", user_code)
          // this.log(user_code, device_code)
          return device_code
        })
        .catch(error => {
          this.log(error)
        })
      if (devicecode) {
        await open("https://microsoft.com/devicelogin")
      }
    } else {
      this.log("Missing required parameters -c azure_ad_client_id and -o azure_ad_organization_name")
    }
  }
}
