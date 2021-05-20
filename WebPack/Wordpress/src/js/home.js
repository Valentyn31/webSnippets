import "@scss/home.scss";

import Burger from "./components/_burger";

document.addEventListener("DOMContentLoaded", function () {
  const headerMenu = new Burger("burger", "nav");
  headerMenu.run();
});
