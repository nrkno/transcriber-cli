import {Command, flags} from "@oclif/command"
import open from "open"

import api from "../api/azure-ad-api"

export default class Azure extends Command {
  static description = "Login using Azure Ad"

  static examples = [
    `$ transcribe azure -c client_id -o tennant_organization_name`,
  ]
  static flags = {
    help: flags.help({char: "h"}),
    // flag with a value (-n, --name=VALUE)
    clientId: flags.string({char: "c", description: "Azure Ad clientId"}),
    orgname: flags.string({char: "o", description: "Azure Ad tennant organization name"})
  }

  async run() {
    const {flags} = this.parse(Azure)

    if (flags.clientId && flags.orgname) {
      const adUri = "https://login.microsoftonline.com/" + flags.orgname + ".onmicrosoft.com/oauth2/devicecode" //flags.adUri

      const params = new URLSearchParams()
      params.append("client_id", flags.clientId)
      params.append("scope", "user.read openid profile")
      const devicecode = await api<{ user_code: string; device_code: string }>(adUri, params)
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
