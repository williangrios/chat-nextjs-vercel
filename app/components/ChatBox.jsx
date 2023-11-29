import React, { useEffect, useState } from 'react';
import { useChannel } from "ably/react";
import styles from './ChatBox.module.css';

export default function ChatBox() {
    const [messageText, setMessageText] = useState("");
    const [receivedMessages, setMessages] = useState([]);     
    const messageTextIsEmpty = messageText.trim().length === 0;
    const { channel, ably } = useChannel("chat-demo", (message) => {
        const history = receivedMessages.slice(-199);
        setMessages([...history, message]);
      });
      
    let inputBox = null;
    let messageEnd = null;

    useEffect(() => {
        messageEnd.scrollIntoView({ behaviour: "smooth" });
        });

    const sendChatMessage = (messageText) => {
        channel.publish({ name: "chat-message", data: messageText });
        setMessageText("");
        inputBox.focus();
      }
      const handleFormSubmission = (e) => {
        e.preventDefault();
        sendChatMessage(messageText);
      }
      const handleKeyPress = (e) => {
        if (e.charCode !== 13 || messageTextIsEmpty) {
          return;
        }
        sendChatMessage(messageText);
        e.preventDefault();
      }
      const messages = receivedMessages.map((message, index) => {
        const author = message.connectionId === ably.connection.id ? "me" : "other";
        return <span key={index} className={styles.message} data-author={author}>{message.data}</span>;
      });
    return (
        <div className={styles.chatHolder}>
    <div className={styles.chatText}>
      {messages}
      <div ref={(element) => { messageEnd = element; }}></div>
    </div>
    <form onSubmit={handleFormSubmission} className={styles.form}>
      <textarea
        ref={(element) => { inputBox = element; }}
        value={messageText}
        placeholder="Type a message..."
        onChange={e => setMessageText(e.target.value)}
        onKeyPress={handleKeyPress}
        className={styles.textarea}
      ></textarea>
      <button type="submit" className={styles.button} disabled={messageTextIsEmpty}>Send</button>
    </form>
  </div>
    )
  }