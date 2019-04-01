import {Command, flags} from "@oclif/command"
import open from "open"

import api from "../api/azure-ad-api"

export default class Open extends Command {
  static description = "Open an webpage"

  static examples = [
    `$ transcribe open -a link_to_azure_ad
`,
  ]
  static flags = {
    help: flags.help({char: "h"}),
    // flag with a value (-n, --name=VALUE)
    adUri: flags.string({char: "a", description: "Azure Ad link to use for login"}),
  }

  async run() {
    const {flags} = this.parse(Open)

    const adUri = "https://login.microsoftonline.com/ssssss.onmicrosoft.com/oauth2/devicecode" //flags.adUri
    if (flags.adUri) {
      this.log(`open ${adUri} `)
      // await open("https://www.nrk.no", {wait: true})
      // this.log("The image viewer app closed")

      const params = new URLSearchParams()
      params.append("client_id", "ddddd")
      params.append("scope", "user.read openid profile")
      await api<{ title: string; message: string }>(adUri, params)
        .then(({user_code, device_code}) => {
          this.log(user_code, device_code)
        })
        .catch(error => {
          this.log(error)
        })
      await open("https://microsoft.com/devicelogin", {app: ["google chrome", "--incognito"]})
    } else {
      this.log("Missing required parameter -a link_to_azure_ad")
    }
  }
}
