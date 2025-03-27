import { onValue, push, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../../tools/firebase.config";
import { IoSend } from "react-icons/io5";

const Chat = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setCurrentUser(parsedUser);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      getContacts();
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && selectedUser) {
      getMessages();
    }
  }, [selectedUser]);

  function getContacts() {
    const dataRef = ref(database, "users");
    onValue(dataRef, (snapshot) => {
      const fetchedData = snapshot.val();
      if (fetchedData) {
        const usersArray = Object.keys(fetchedData).map((key) => ({
          id: key,
          ...fetchedData[key],
        }));

        const filteredUsers = usersArray.filter(
          (user) => user.email !== currentUser?.email
        );
        setContacts(filteredUsers);
      }
    });
  }

  function getMessages() {
    if (!selectedUser || !currentUser) {
      return;
    }

    const chatPath1 = `users/${currentUser.id}/messages/${selectedUser.id}`;
    const chatPath2 = `users/${selectedUser.id}/messages/${currentUser.id}`;

    const messagesRef1 = ref(database, chatPath1);
    const messagesRef2 = ref(database, chatPath2);

    let messages = [];

    onValue(messagesRef1, (snapshot1) => {
      const data1 = snapshot1.val() || {};

      const chat1 = Object.values(data1).map((msg: any) => ({
        ...msg,
        sender: currentUser.id,
      }));

      onValue(messagesRef2, (snapshot2) => {
        const data2 = snapshot2.val() || {};

        const chat2 = Object.values(data2).map((msg: any) => ({
          ...msg,
          sender: selectedUser.id,
        }));

        messages = [...chat1, ...chat2];
        setMessages(messages.sort((a, b) => a.timestamp - b.timestamp));
      });
    });
  }

  const sendMessage = () => {
    if (message.trim() === "" || !selectedUser || !currentUser) return;

    const chatPath = `users/${currentUser.id}/messages/${selectedUser.id}`;

    const newMessage = {
      text: message,
      sender: currentUser.id,
      timestamp: Date.now(),
    };

    const messagesRef = ref(database, chatPath);
    push(messagesRef, newMessage);

    setMessage("");
  };

  return (
    <div className="d-flex vh-100 bg-light">
      <div
        style={{ borderRadius: "20px" }}
        className="w-25 bg-white shadow p-3 m-2"
      >
        <h4 className="text-center border-bottom pb-2">Chats</h4>
        <div className="list-group">
          {contacts.length > 0 ? (
            contacts.map((user) => (
              <button
                onClick={() => setSelectedUser(user)}
                key={user.id}
                className={`list-group-item list-group-item-action d-flex align-items-center ${
                  selectedUser?.id === user.id ? "active" : ""
                }`}
              >
                <div
                  className="rounded-circle bg-secondary me-2"
                  style={{ width: 30, height: 30 }}
                ></div>
                <span>{user.name}</span>
              </button>
            ))
          ) : (
            <p className="text-center">No contacts found</p>
          )}
        </div>
      </div>

      {selectedUser && (
        <div
          style={{
            borderRadius: "50px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            border: "1px solid )",
          }}
          className="m-2 w-75 d-flex flex-column"
        >
          <div
            style={{ borderRadius: "50px" }}
            className="p-2 bg-white border-bottom d-flex align-items-center mb-5"
          >
            <div
              className="rounded-circle bg-secondary me-2"
              style={{ width: 30, height: 30 }}
            ></div>
            <span>{selectedUser.name}</span>
          </div>

          <div className="flex-grow-1 p-3 d-flex flex-column justify-content-end">
            <div className="d-flex flex-column gap-2">
              {messages
                .sort((a, b) => a.timestamp - b.timestamp)
                .map((msg, index) => (
                  <div
                    key={index}
                    className={`d-flex mb-2 ${
                      msg.sender === currentUser.id ? "justify-content-end" : ""
                    }`}
                  >
                    <div
                      className={`p-2 rounded shadow-sm ${
                        msg.sender === currentUser.id
                          ? "bg-primary text-white"
                          : "bg-light"
                      }`}
                      style={{ maxWidth: "75%" }}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="p-2 border-top d-flex position-sticky bottom-0 bg-white">
            <input
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              type="text"
              className="form-control"
              placeholder="Type a message..."
            />
            <button onClick={sendMessage} className="btn ms-2">
              <IoSend color="#0866ff" size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
