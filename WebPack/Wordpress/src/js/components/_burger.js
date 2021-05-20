class Burger {
  constructor(burgerId, menuId) {
    this.$burger = document.getElementById(burgerId);
    this.$menu = document.getElementById(menuId);
  }

  changeMenuStatus() {
    this.$burger.classList.toggle("active");
    this.$menu.classList.toggle("active");
  }

  runListeners() {
    this.$burger.addEventListener("click", this.changeMenuStatus.bind(this));
  }

  run() {
    this.runListeners();
  }
}

export default Burger;
