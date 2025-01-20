// COD LOGOS


var copy = document.querySelector(".class-slide").cloneNode(true);
document.querySelector(".class-logo-carousel").appendChild(copy);

// FIM COD LOGOS


// COD CARROUSEL

let slideIndex = 0;
const slides = document.querySelectorAll('.carousel-item');
const totalSlides = slides.length;
const carouselInner = document.querySelector('.carousel-inner');

function moveSlide(step) {

    slides[slideIndex].classList.remove('active');
    slides[slideIndex].style.opacity = '0';


    slideIndex += step;


    if (slideIndex >= totalSlides) {
        slideIndex = 0;
        carouselInner.style.transition = 'none';
        carouselInner.style.transform = `translateX(0)`;
        setTimeout(() => {
            carouselInner.style.transition = 'transform 1s ease';
        }, 50);
    } else if (slideIndex < 0) {
        slideIndex = totalSlides - 1;
    }


    carouselInner.style.transform = `translateX(-${slideIndex * 100}%)`;


    slides[slideIndex].classList.add('active');
    slides[slideIndex].style.opacity = '1';
}


document.querySelector('.carousel-control.prev').addEventListener('click', () => {
    moveSlide(-1);
});

document.querySelector('.carousel-control.next').addEventListener('click', () => {
    moveSlide(1);
});


function startAutoplay() {
    setInterval(() => {
        moveSlide(1);
    }, 4000);
}


window.onload = () => {
    slides[0].classList.add('active');
    slides[0].style.opacity = '1';
    startAutoplay();
};

// FIM COD CARROUSEL

// PERGUNTAS FREQUENTES


document.querySelectorAll('.class-accord').forEach(item => {
    item.addEventListener('click', event => {
        const extraContent = item.querySelector('.extra-content');
        if (extraContent.style.display === "none" || extraContent.style.display === "") {
            extraContent.style.display = "block";
            item.classList.add('closed');
        } else {
            extraContent.style.display = "none";
            item.classList.remove('closed');
        }
    });
});



// FIM PERGUNTAS FREQUENTES