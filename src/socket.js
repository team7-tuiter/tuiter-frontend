import io from "socket.io-client"
import { getIdToken } from "./services/auth-service";

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
  return io.connect('http://localhost:4000', {
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
  static getConnection = () => {
    if (socketConnection) {
      return socketConnection;
    }
  }
}

export default SocketFactory;