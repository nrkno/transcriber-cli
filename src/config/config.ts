import Configstore from "configstore"

import {Constants} from "../config/constants"


function saveTokenToLocalConfig(tokenName: string, token: string) {
  const conf = new Configstore(Constants.PACKAGE_NAME)
  conf.set(tokenName, token)
}

function setParameter(key: string, value: string) {
  const conf = new Configstore(Constants.PACKAGE_NAME)
  return conf.set(key, value)
}

function getParameter(key: string) {
  const conf = new Configstore(Constants.PACKAGE_NAME)
  return conf.get(key)
}

export {saveTokenToLocalConfig, getParameter, setParameter}
