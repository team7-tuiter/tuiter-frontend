/**
 * @file implements Messages Component
 */

import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { sendMessage, receiveMessage } from "../../redux/messageSlice";
import { getLastMessagesFromAllChats } from "../../redux/chatSlice";
import { storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import SocketFactory from "../../socket";
import uuid from "react-uuid";
import './index.css'

const getDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
}

const Messages = () => {
  const messageList = useSelector((state) => state.messages.messages);
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const room = useSelector((state) => state.room.room);
  const [file, setFile] = useState(null);
  const user = useSelector((state) => state.user.user);
  const [dimen, setDimen] = useState(getDimensions());
  const sendWrap = useRef();
  const scrollWrap = useRef();

  const updateDimens = () => {
    let dimensions = getDimensions();
    if (sendWrap.current) {
      const height = sendWrap.current.offsetHeight;
      dimensions = {
        height: dimensions.height - height - 25, //-10 is buffer
        width: dimensions.width,
      }
    }
    setDimen(dimensions);
  }

  const scrollDown = () => {
    setTimeout(() => {
      if (scrollWrap.current) {
        scrollWrap.current.scrollTop = scrollWrap.current.scrollHeight;
      }
    }, 100);
  }

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
        sentOn: new Date().toISOString(),
      },
    };

    if (file) {
      const fileref = ref(storage, `static/${Date.now()}`);
      const upload = await uploadBytes(fileref, file);
      payload.messages.message = await getDownloadURL(upload.ref);
      payload.messages.type = file.type.split("/")[0].toUpperCase();
      dispatch(sendMessage(payload));
      setFile(null);
      scrollDown();
    } else if (message) {
      dispatch(sendMessage(payload));
      scrollDown();
      setMessage("");
    }
    if (messageList.length === 1) {
      dispatch(getLastMessagesFromAllChats(user._id));
    }
  };

  useEffect(() => {
    SocketFactory.getConnection().on("receive_message", (message) => {
      dispatch(receiveMessage(message));
      scrollDown();
    });
    updateDimens();
    window.addEventListener('resize', updateDimens);
    return () => window.removeEventListener('resize', updateDimens);
  }, [dispatch]);

  const formatDate = (sentOn) => {
    const postedOn = new Date(sentOn);
    const formattedDate = `${postedOn.getFullYear()}/${postedOn.getMonth()}/${postedOn.getDate()} ${postedOn.getHours()}:${postedOn.getMinutes()}`;
    return formattedDate;
  }

  return (
    <div>
      <div ref={scrollWrap} className="chat-box" style={{ maxHeight: dimen.height, height: dimen.height, overflowY: "scroll" }}>
        {messageList.map((message, i) => {
          if (i === 0) return;
          const isMe = message.from === user._id;
          const alignment = isMe ? 'text-start' : 'text-end';
          console.log(message);
          return (
            <div key={`chats-${i}`} className="ms-wrap">
              <div className={`ms-cell ${alignment}`}>
                <span className={`rounded-3 ${isMe ? 'bg-light' : 'bg-edark'}`}>
                  {message.type === "STRING" && message.message}
                  {message.type === "IMAGE" && (
                    <img
                      src={message.message}
                      alt={message.id}
                      height="150"
                    />
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
                  <br />
                  <span className="p-0 pt-1 pb-1 text-muted text-vsmall">{formatDate(message.sentOn)}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="bg-light mt-2 mb-2" ref={sendWrap}>
        <div className="input-group p-2">
          <input
            type="file"
            placeholder="Select"
            className="form-control"
            onChange={(event) => {
              setFile(event.target.files[0]);
            }}
            style={{ maxWidth: 200 }}
          />
          <input
            type="text"
            className="form-control"
            value={message}
            placeholder="type..."
            onChange={(event) => {
              setMessage(event.target.value);
            }}
            onKeyPress={(event) => {
              event.key === "Enter" && send();
            }}
          />
          <button className="btn btn-primary" type="button" onClick={send}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Messages;
