import io from "socket.io-client";
const SOCKET_URL = "https://ovniobackend.azurewebsites.net/sockets";

class WSService {
  initializeSocket = async () => {
    try {
      this.socket = io(SOCKET_URL, {
        withCredentials: true,
        transports: ["websocket"],
      });
      //console.log("initializing socket:---", this.socket);

      this.socket.on("connect", (data) => {
        console.log("=== socket connected ====");
      });

      this.socket.on("disconnect", (data) => {
        console.log("=== socket disconnected ====");
      });

      this.socket.on("error", (data) => {
        console.log("socekt error", data);
      });
    } catch (error) {
      console.log("scoket is not inialized", error);
    }
  };
  emit(event, data = {}) {
    console.log("emit :-event ", event);
    // console.log("emit :-requestData ", JSON.stringify(data));
    this.socket.emit(event, data);
  }
  onEmitON(event, requestData, res) {
    console.log("onEmitON :-event ", event);
    console.log("onEmitON :-requestData ", JSON.stringify(requestData));
    this.socket.emit(event, requestData);
    this.socket.on(event, res);
  }
  on(event, cb) {
    this.socket.on(event, cb);
  }
  removeListener(listenerName) {
    this.socket.removeListener(listenerName);
  }
  disconnect() {
    this.socket.disconnect();
  }
}
const SocketServcies = new WSService();
export default SocketServcies;
