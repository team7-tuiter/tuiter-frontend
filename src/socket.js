import io from "socket.io-client"
import { getIdToken } from "./services/auth-service";
const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL
let socketConnection;
/**
 * Creates a socket connection using firebase auth token.
 * Sends the token to the server for the auth hanshake.
 * 
 * If handshake is successful then connection is granted else rejected.
 * @returns Socket object or null
 */
const getSocket = async () => {
  const token = await getIdToken();
  return io.connect(REACT_APP_BASE_URL, {
    query: { token }
  });
}


/**
 * A socket factory class that holds the socket object
 * using singleton pattern.
 */
class SocketFactory {

  static init = async () => {
    socketConnection = await getSocket();
    return socketConnection;
  }

  static disconnectSocket = async () => {
    socketConnection.disconnect()
  }

  static getConnection = () => {
    if (socketConnection) {
      return socketConnection;
    }
  }
}

export default SocketFactory;