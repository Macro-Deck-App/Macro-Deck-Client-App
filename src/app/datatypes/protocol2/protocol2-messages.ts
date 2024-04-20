export class Protocol2Messages {
  public static getConnectedMessage(clientId: string) {
    return {
      "Method": "CONNECTED",
      "Client-Id": clientId,
      "API": "20",
      "Device-Type": "Web"
    }
  }

  public static getGetButtonsMessage() {
    return {
      "Method": "GET_BUTTONS"
    }
  }
}
