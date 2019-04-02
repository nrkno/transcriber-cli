import {Command, flags} from "@oclif/command"
import open from "open"
import {__await} from "tslib"

import api from "../api/azure-ad-api"

export default class Azure extends Command {
  static description = "Login using Azure Ad"

  static examples = [
    "$ transcribe azure -c client_id -o tennant_organization_name",
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
          this.log("Please add this code to the Chrome window popping up: ", user_code)
          // this.log(user_code, device_code)
          return device_code
        })
        .catch(error => {
          this.log(error)
        })
      if (devicecode) {
        await open("https://microsoft.com/devicelogin")
        this.log("Waiting 60 seconds for You to enter the code, and accept connection request.")
        setTimeout(() => {
          this.log("Try to fetch the Azure Ad Id token.")
          const tokens = this.fetchIdToken(flags, devicecode)
          tokens.then(values => {
            this.log("Tokens: ", values)
          })
        }, 60000)
      }
    } else {
      this.log("Missing required parameters -c azure_ad_client_id and -o azure_ad_organization_name")
    }
  }
  private async fetchIdToken(flags: any, devicecode: any) {
    const validateTokenParams = new URLSearchParams()
    validateTokenParams.append("grant_type", "urn:ietf:params:oauth:grant-type:device_code")
    validateTokenParams.append("client_id", flags.clientId)
    validateTokenParams.append("device_code", devicecode)
    const tokenUri = "https://login.microsoftonline.com/" + flags.orgname + ".onmicrosoft.com/oauth2/v2.0/token"
    const tokens = await api<{ id_token: string; access_token: string; refresh_token: string }>(tokenUri, validateTokenParams)
      .then(({id_token, access_token, refresh_token}) => {
        // this.log("IdToken: ", id_token, " at: ", access_token, " rt: ", refresh_token)
        const tokens = {
          azureIdToken: id_token,
          azureAccessToken: access_token,
          azureRefreshToken: refresh_token
        }
        return tokens
      })
      .catch(error => {
        this.log(error)
        return {}
      })
    this.log("Received azureIdTooken: ", tokens.azureIdToken)
    return tokens
  }
}
