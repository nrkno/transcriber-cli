import {Command, flags} from "@oclif/command"

import firebaseApi from "../api/firebase-api"
import {getParameter, setParameter} from "../config/config"
import {Constants} from "../config/constants"

export default class Upload extends Command {
  static description = "describe the command here"

  static examples = [
    `$ transcribe upload -f filename -p firebase_project
`,
  ]

  static flags = {
    help: flags.help({char: "h"}),
    filename: flags.string({char: "f", description: "filename"}),
    projectname: flags.string({char: "p", description: "name of firebase project"})
  }

  static args = [{filename: "file"}]

  async run() {
    const {args, flags} = this.parse(Upload)

    // Read token from config
    // Create upload url
    // Upload file https://stackoverflow.com/questions/44021538/how-to-send-a-file-in-request-node-fetch-or-nodejs
    const filename = flags.filename
    if (!filename) {
      this.log("Missing filename. Please run `transcribe upload -f filename`")
    }
    let projectName = flags.projectname
    if (projectName) {
      setParameter(Constants.FIREBASE_PROJECT_NAME, projectName)
    } else {
      projectName = getParameter(Constants.FIREBASE_PROJECT_NAME)
      if (!projectName) {
        this.log("Missing the Firebase projectname. Please run `transcribe upload -p firebase_project_name")
        return
      }
    }
    const firebaseCustomToken = getParameter(Constants.FIREBASE_CUSTOM_TOKEN)
    if (firebaseCustomToken) {
      this.log("FirebaseCustomToken: ", firebaseCustomToken)
      const bodyParams = new URLSearchParams()
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + firebaseCustomToken
      }
      const transcriberApiUri = "https://europe-west1-" + flags.projectname + ".cloudfunctions.net/api/"
      const transcriptId = await firebaseApi<{ transcriptId: string }>(transcriberApiUri + "transcriptId", bodyParams, headers)
        .then(({transcriptId}) => {
          return transcriptId
        })
        .catch(error => {
          this.log(error)
          throw error
        })
      this.log("Received transcriptId: ", transcriptId)
      // return transcriptId
    } else {
      this.log("You need to run `transcriber login` before running `transcriber upload`")
    }
  }
}
