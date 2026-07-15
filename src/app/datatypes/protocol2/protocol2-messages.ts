export class Protocol2Messages {
  public static getConnectedMessage(clientId: string, token: string | undefined) {
    let obj: any = {
      "Method": "CONNECTED",
      "Client-Id": clientId,
      "API": "20",
      "Device-Type": "Web"
    }

    if (token !== undefined) {
      obj.Token = token;
    }

    return obj;
  }

  public static getGetButtonsMessage() {
    return {
      "Method": "GET_BUTTONS"
    }
  }

  public static getTouchpadMoveMessage(deltaX: number, deltaY: number) {
    return {
      Method: "TOUCHPAD_MOVE",
      DeltaX: Math.trunc(deltaX),
      DeltaY: Math.trunc(deltaY)
    }
  }

  public static getMouseClickMessage(button: "LEFT" | "RIGHT" | "MIDDLE" | "DOUBLE" | "LEFT_DOWN" | "LEFT_UP") {
    return {
      Method: "MOUSE_CLICK",
      Button: button
    }
  }

  public static getMouseScrollMessage(delta: number) {
    return {
      Method: "MOUSE_SCROLL",
      Delta: Math.trunc(delta)
    }
  }
}
