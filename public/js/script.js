
let navbar = document.querySelector('.header .navbar');
let contactInfo = document.querySelector('.contact-info');
let alltogether = document.querySelector('.navbar-contact');

window.onscroll = () =>{
  navbar.classList.remove('active');
  contactInfo.classList.remove('active');
}

document.querySelector('#info-btn').onclick = () =>{
   contactInfo.classList.add('active');
}

document.querySelector('#menu-btn').onclick = () =>{
  alltogether.classList.toggle('active');
}

document.querySelector('#close-contact-info').onclick = () =>{
   contactInfo.classList.remove('active');
}

document.querySelector('#menu-btn').onclick = () =>{
   navbar.classList.toggle('active');
}

document.querySelector('#close-navbar-contact').onclick = () =>{
  alltogether.classList.remove('active');
}

document.querySelectorAll('.navbar a').forEach(link => {
  link.addEventListener('click', () => {
    navbar.classList.remove('active');
  });
});

let preveiwContainer = document.querySelector('.products-preview');
let previewBox = preveiwContainer.querySelectorAll('.preview');

document.querySelectorAll('.type-services .box').forEach(product =>{
  product.onclick = () =>{
    preveiwContainer.style.display = 'flex';
    let name = product.getAttribute('data-name');
    previewBox.forEach(preview =>{
      let target = preview.getAttribute('data-target');
      if(name == target){
        preview.classList.add('active');
      }
    });
  };
});

previewBox.forEach(close =>{
  close.querySelector('.fa-times').onclick = () =>{
    close.classList.remove('active');
    preveiwContainer.style.display = 'none';
  };
});


