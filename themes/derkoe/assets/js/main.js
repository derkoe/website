/**
 * Utils
 */

// Throttle
//
const throttle = (callback, limit) => {
  let timeoutHandler = null;
  return () => {
    if (timeoutHandler == null) {
      timeoutHandler = setTimeout(() => {
        callback();
        timeoutHandler = null;
      }, limit);
    }
  };
};

/**
 * Functions
 */

 // Mobile Menu Toggle
//
let mobileMenu = document.getElementById('mobile-menu');
let mobileMenuVisible = false;

const mobileMenuToggle = () => {
  if (mobileMenuVisible == false) {
    mobileMenu.style.animationName = 'bounceInRight';
    mobileMenu.style.webkitAnimationName = 'bounceInRight';
    mobileMenu.style.display = 'block';
    mobileMenuVisible = true;
  } else {
    mobileMenu.style.animationName = 'bounceOutRight';
    mobileMenu.style.webkitAnimationName = 'bounceOutRight'
    mobileMenuVisible = false;
  }
}

// Show Featured Image
//
const showFeaturedImg = () => {
  document.getElementById('bg-img').classList.add('show-bg-img');
}

const showContent = () => {
  document.getElementById('bg-img').classList.remove('show-bg-img');
}

if (haveHeader == true) {
  document.getElementById('menu-btn').addEventListener('click', mobileMenuToggle);

  window.addEventListener('scroll', throttle(() => {

    if (mobileMenuVisible == true) {
      mobileMenuToggle();
    }
  }, 250));
}
