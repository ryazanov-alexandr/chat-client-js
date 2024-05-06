import { socket } from "../socket/socket.js";

export const online = () => {
  const userName = document.getElementById("user-name");
  const userAvatar = document.getElementById("user-avatar");
  const onlineTotal = document.getElementById("online__total-title");
  const onlineList = document.getElementById("online__list");
  const online = document.querySelector(".online");
  socket.emit("connect user", {
    name: userName.textContent,
    avatar: userAvatar.src
  });

  socket.on("connect user", (data) => {
    onlineList.innerHTML = "";

    data.map((user) => {
      addUserToOnlineList(user);
    });
    
    onlineTotal.innerText = `Онлайн: ${data.length}`;
  });

  document.querySelector(".kebab-online").addEventListener('click', toggleOnlineShow)

  document.querySelector(".online-close").addEventListener('click', toggleOnlineShow)

  function toggleOnlineShow() {
    online.classList.toggle('show');
  }

  function addUserToOnlineList(user) {
    const element = `
            <li class="online__user">
            <img src="${user.avatar}" alt="Avatar" class="online__user-img" />
                <div class="online__user-name">${user.name}</div>
            </li>

        `;
    onlineList.insertAdjacentHTML("beforeend", element);
  }
};
