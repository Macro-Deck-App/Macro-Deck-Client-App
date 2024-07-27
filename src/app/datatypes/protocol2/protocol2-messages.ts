import {environment} from "../../../environments/environment";

export class Protocol2Messages {
  public static getConnectedMessage(clientId: string, token: string | undefined) {
    let obj: any = {
      "Method": "CONNECTED",
      "Client-Id": clientId,
      "API": "20",
      "Device-Type": environment.carThing ? "CarThing" : "Web"
    }

    if (token) {
      obj.Token = token;
    }

    return obj;
  }

  public static getGetButtonsMessage() {
    return {
      "Method": "GET_BUTTONS"
    }
  }
}
