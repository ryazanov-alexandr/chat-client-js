import { nouns } from "../dictionaries/nouns.js";
import { adjectives } from "../dictionaries/adjectives.js";

export const user = () => {
  const userName = document.getElementById("user-name");
  const userAvatar = document.getElementById("user-avatar");

  const name = getName();
  userName.textContent = name;
  userAvatar.src = getAvatar(name);

  function getName() {
    if (sessionStorage.key("username")) {
      return sessionStorage.getItem("username");
    }

    const userName = createUserName();

    return userName;
  }

  function getAvatar(text) {
    return `https://robohash.org/${text}.jpg?size=64x64`;
  }

  function createUserName() {
    let adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    let noun = nouns[Math.floor(Math.random() * nouns.length)];

    adjective =
      adjective.charAt(0).toUpperCase() +
      adjective.slice(1).toLocaleLowerCase();
    noun = noun.toLocaleLowerCase();

    const userName = adjective + " " + noun;
    sessionStorage.setItem("username", userName);

    return userName;
  }
};
