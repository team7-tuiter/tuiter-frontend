import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { sendMessage, receiveMessage } from "../../redux/messageSlice";
import { socket } from "../../socket";
import { storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Messages = () => {
  const messageList = useSelector((state) => state.messages.messages);
  const dispatch = useDispatch();
  const [currentMessage, setCurrentMessage] = useState("");
  const from = useState("");
  const to = useState("");
  const room = useSelector((state) => state.room.room);

  const [file, setFile] = useState(null);

  const send = async () => {
    if (file !== null) {
      const messageData = {
        room,
        message: currentMessage,
        sentOn:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      const fileref = ref(storage, `static/${Date.now()}`);
      uploadBytes(fileref, file).then((res) => {
        getDownloadURL(res.ref).then((url) => {
          console.log(url);
          messageData.message = "img- " + url;
          dispatch(sendMessage(messageData));
          setFile(null);
        });
      });
    }
    if (currentMessage !== "") {
      const messageData = {
        room,
        message: currentMessage,
        sentOn:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      dispatch(sendMessage(messageData));
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      dispatch(receiveMessage(data));
    });
  }, [dispatch]);

  return (
    <div>
      <h1>Messages</h1>

      {messageList?.message}

      <span>
        <label for="fileInput">
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
        value={currentMessage}
        placeholder="type..."
        onChange={(event) => {
          setCurrentMessage(event.target.value);
        }}
        onKeyPress={(event) => {
          event.key === "Enter" && send();
        }}
      />
      <button onClick={send}> Send Message </button>
    </div>
  );
};

export default Messages;
