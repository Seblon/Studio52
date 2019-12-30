class MobileMenu {
   constructor() {
      this.menuIcon = document.querySelector('.menu-icon')
      this.menuContent = document.querySelector('.navigation')
      this.events()
   }

   events() {
      this.menuIcon.addEventListener('click', () => this.toggleMenu())
   }

   toggleMenu() {
      this.menuContent.classList.toggle('navigation--is-visible')
      this.menuIcon.classList.toggle('menu-icon--close-x')
   }
}

export default MobileMenu