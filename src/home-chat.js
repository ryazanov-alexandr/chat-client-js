import "./chat.html";
import "./style.css";

import { chat } from "./modules/chat/chat";
import { online } from "./modules/online/online";
import { user } from "./modules/user/user";


window.addEventListener("DOMContentLoaded", function () {
    user();
    chat();
    online();
  
});
