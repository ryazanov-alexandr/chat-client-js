import moment from "moment";

import { socket } from "../socket/socket.js";
import { fileToBase64, getImageFromBase64 } from "../utils"

export const chat = () => {
  const userName = document.getElementById("user-name");
  const messageForm = document.getElementById("message-form");
  const messageInput = document.getElementById("message-input");
  const messageContainer = document.getElementById("message-container");
  const imageInput = document.getElementById("image-input");
  const imagePreviewWrapper = document.getElementById("preview-wrapper");

  let imageBase64 = "";

  socket.on('disconnect', () => {
    console.log('client disconnect');
  })

  socket.on("chat message", (message) => {
    addMessageToChat(message, false);
  });

  socket.on("feedback", async (feedback) => {
    clearFeedback();
    console.log(feedback);
    if (!feedback) return;

    const element = `
                <li class="message-feedback">
                    <p class="feedback">${feedback}</p>
                </li>
            `;
    messageContainer.innerHTML += element;
  });

  imagePreviewWrapper.addEventListener("click", (e) => {
    if (e.target.classList.contains("image-preview-close")) {
      imagePreviewWrapper.removeChild(e.target.parentNode);
    }

    if(!imagePreviewWrapper.children.length) removeImagePreview();

  });

  function removeImagePreview() {
    imagePreviewWrapper.classList.remove("active");
    imagePreviewWrapper.innerHTML = '';
    imageBase64 = "";
  }

  function addImagePreview(imageBase64) {
    const element = `
      <div class="image-preview__item">
        <img src=${imageBase64} class="image-preview">
        <div class="image-preview-close"></div>
      </div>
    `;
    imagePreviewWrapper.innerHTML = element;
    imagePreviewWrapper.classList.add("active");
    scrollToBottom();
  }

  messageInput.addEventListener('keypress', () => {
    sendFeedback(`${userName.textContent} набирает сообщение...`);
  }, true);

  messageInput.addEventListener("blur", () => {
    sendFeedback('') 
  });

  function sendFeedback(text) {
    socket.emit("feedback", text);
  }  

  imageInput.addEventListener("change", async (e) => {
    scrollToBottom();
    setDisabledForm(true);

    try {
      imageBase64 = await fileToBase64(e.target.files[0]);
      addImagePreview(imageBase64);
    } catch(error) {
      console.log(error.message);
    } finally{
      setDisabledForm(false);
    }
    
  });

  messageForm.addEventListener("submit", function (e) {
    e.preventDefault();

    sendMessage();
  });

  messageInput.addEventListener("keydown", function (e) {
    if(!e.shiftKey && e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    };
  });

  async function sendMessage() {
    messageInput.textContent = messageInput.textContent.trim();
    if (!messageInput.textContent && !imageBase64) return

    const data = {
      author: userName.textContent,
      text: messageInput.textContent,
      dateTime: new Date(),
      imageBase64
    };

    socket.emit("chat message", data);
    setDisabledForm(true);
    await addMessageToChat(data, true);
    setDisabledForm(false);
    messageInput.focus();

    messageInput.textContent = "";
    if(imageBase64) removeImagePreview()
  }

  async function addMessageToChat(data, isOwnMessage) {
    clearFeedback();
    
    const messageElement = createMessageElement(data, isOwnMessage);

    if(data.imageBase64) {
      try {
        const image = await getImageFromBase64(data.imageBase64);
        messageElement.querySelector('.message-text').insertAdjacentElement("beforebegin", image);

      } catch(error) {
        console.log(error.message);
      }
    } 

    messageContainer.append(messageElement);
    scrollToBottom();
  }

  function createMessageElement(message, isOwnMessage) {
    const messageElement = document.createElement('li');
    const className = `message ${isOwnMessage ? "message-right" : "message-left"}`;
    messageElement.className = className;

    messageElement.innerHTML += `
        <div class="message-inner">
            ${!isOwnMessage ? '<span class="message-author">'+message.author+'</span>': ''}
            <p class="message-text__wrapper">
              <span class="message-text">${message.text}</span>
              <span class="message-date">
                ${moment(message.dateTime).locale('ru').format('HH:mm')}
              </span>
            </p>
        </div>
    `;

    return messageElement;
  }

  function scrollToBottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight);
  } 

  function setDisabledForm(disabled) {
    Array.from(messageForm.elements).forEach((elem) => elem.disabled = disabled);
  }

  function clearFeedback() {
    document.querySelectorAll("li.message-feedback").forEach((element) => {
      element.parentNode.removeChild(element);
    });
  }    
};
