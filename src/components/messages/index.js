/**
 * @file implements Messages Component
 */

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { sendMessage, receiveMessage } from "../../redux/messageSlice";
import { getLastMessagesFromAllChats } from "../../redux/chatSlice";
import { storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import SocketFactory from "../../socket";
import uuid from "react-uuid";

const Messages = () => {
  const messageList = useSelector((state) => state.messages.messages);
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const room = useSelector((state) => state.room.room);
  const [file, setFile] = useState(null);
  const user = useSelector((state) => state.user.user);

  const send = async () => {
    if (!room) return;
    const [userId1, userId2] = room.split(" -- ");
    const to = [userId1, userId2].filter((uid) => uid !== user._id)[0];
    const payload = {
      room,
      userId1,
      userId2,
      messages: {
        id: uuid().slice(0, 8),
        from: user._id,
        to: to,
        type: "STRING",
        message,
        sentOn: Date.now(),
      },
    };
    if (file) {
      const fileref = ref(storage, `static/${Date.now()}`);
      const upload = await uploadBytes(fileref, file);
      payload.messages.message = await getDownloadURL(upload.ref);
      payload.messages.type = file.type.split("/")[0].toUpperCase();
      dispatch(sendMessage(payload));
      setFile(null);
    } else if (message) {
      dispatch(sendMessage(payload));
      setMessage("");
    }
    if (messageList.length === 1) {
      dispatch(getLastMessagesFromAllChats(user._id));
    }
  };

  useEffect(() => {
    SocketFactory.getConnection().on("receive_message", (message) => {
      dispatch(receiveMessage(message));
    });
  }, [dispatch]);

  return (
    <div>
      <h4>Messages {user?.username} </h4>

      <span>
        <label htmlFor="fileInput">
          <i className="fa-solid fa-upload"></i>
        </label>
        <input
          type="file"
          onChange={(event) => {
            setFile(event.target.files[0]);
          }}
        />
      </span>

      <input
        type="text"
        value={message}
        placeholder="type..."
        onChange={(event) => {
          setMessage(event.target.value);
        }}
        onKeyPress={(event) => {
          event.key === "Enter" && send();
        }}
      />
      <button onClick={send}> Send Message </button>

      {messageList.map((message, i) => {
        if (i === 0) return;
        const isMe = message.from === user._id;
        if (isMe) {
          return (
            <div key={i.toString()} className="text-primary float-right">
              <p>
                {" "}
                {message.type === "STRING" && (
                  <>
                    {message.message} {message.sentOn}{" "}
                  </>
                )}
                {message.type === "IMAGE" && (
                  <img
                    src={message.message}
                    alt={message.id}
                    style={{ maxWidth: "320px", maxHeight: "240px" }}
                  ></img>
                )}
                {message.type === "VIDEO" && (
                  <video
                    src={message.message}
                    width="320"
                    height="240"
                    controls
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </p>
            </div>
          );
        }
        return (
          <div key={i.toString()} className="text-secondary float-left">
            <p>
              {" "}
              {message.type === "STRING" && (
                <>
                  {message.message} {message.sentOn}{" "}
                </>
              )}
              {message.type === "IMAGE" && (
                <img
                  src={message.message}
                  alt={message.id}
                  style={{ maxWidth: "320px", maxHeight: "240px" }}
                ></img>
              )}
              {message.type === "VIDEO" && (
                <video src={message.message} width="320" height="240" controls>
                  Your browser does not support the video tag.
                </video>
              )}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
