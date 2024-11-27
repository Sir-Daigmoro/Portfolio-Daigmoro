'use strict';

// Opening or closing side bar
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

sidebarBtn.addEventListener("click", function() { elementToggleFunc(sidebar); })

// Activating Modal-testimonial
const testimonialsItem = document.querySelectorAll('[data-testimonials-item]');
const modalContainer = document.querySelector('[data-modal-container]');
const modalCloseBtn = document.querySelector('[data-modal-close-btn]');
const overlay = document.querySelector('[data-overlay]');

const modalImg = document.querySelector('[data-modal-img]');
const modalTitle = document.querySelector('[data-modal-title]');
const modalText = document.querySelector('[data-modal-text]');

const testimonialsModalFunc = function () {
    modalContainer.classList.toggle('active');
    overlay.classList.toggle('active');
}

for (const element of testimonialsItem) {
    element.addEventListener('click', function () {
        modalImg.src = this.querySelector('[data-testimonials-avatar]').src;
        modalImg.alt = this.querySelector('[data-testimonials-avatar]').alt;
        modalTitle.innerHTML = this.querySelector('[data-testimonials-title]').innerHTML;
        modalText.innerHTML = this.querySelector('[data-testimonials-text]').innerHTML;

        testimonialsModalFunc();
    })
}

// Activating close button in modal-testimonial
modalCloseBtn.addEventListener('click', testimonialsModalFunc);
overlay.addEventListener('click', testimonialsModalFunc);

// Activating Filter Select and filtering options
const select = document.querySelector('[data-select]');
const selectItems = document.querySelectorAll('[data-select-item]');
const selectValue = document.querySelector('[data-select-value]');
const filterBtn = document.querySelectorAll('[data-filter-btn]');

select.addEventListener('click', function () { elementToggleFunc(this); });

for (const element of selectItems) {
    element.addEventListener('click', function () {
        let selectedValue = this.innerText.toLowerCase();
        selectValue.innerText = this.innerText;
        elementToggleFunc(select);
        filterFunc(selectedValue);
    });
}

const filterItems = document.querySelectorAll('[data-filter-item]');

const filterFunc = function (selectedValue) {
    for (const element of filterItems) {
        if (selectedValue == "all") {
            element.classList.add('active');
        } else if (selectedValue == element.dataset.category) {
            element.classList.add('active');
        } else {
            element.classList.remove('active');
        }
    }
}

// Enabling filter button for larger screens
let lastClickedBtn = filterBtn[0];

for (const element of filterBtn) {
    element.addEventListener('click', function () {
        let selectedValue = this.innerText.toLowerCase();
        selectValue.innerText = this.innerText;
        filterFunc(selectedValue);

        lastClickedBtn.classList.remove('active');
        this.classList.add('active');
        lastClickedBtn = this;
    })
}

// Enabling Contact Form
const form = document.querySelector('[data-form]');
const formInputs = document.querySelectorAll('[data-form-input]');
const formBtn = document.querySelector('[data-form-btn]');

for (const element of formInputs) {
    element.addEventListener('input', function () {
        if (form.checkValidity()) {
            formBtn.removeAttribute('disabled');
        } else {
            formBtn.setAttribute('disabled', '');
        }
    })
}

// Enabling Page Navigation
const navigationLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('[data-page]');

for (const element of navigationLinks) {
    element.addEventListener('click', function () {
        const targetPage = this.innerHTML.toLowerCase();

        // Navegar entre páginas
        for (let i = 0; i < pages.length; i++) {
            if (targetPage === pages[i].dataset.page) {
                pages[i].classList.add('active');
                navigationLinks[i].classList.add('active');
                window.scrollTo(0, 0);  // Desplazamiento a la parte superior de la página
            } else {
                pages[i].classList.remove('active');
                navigationLinks[i].classList.remove('active');
            }
        }
    });
}

// Agregando funcionalidad de EmailJS para el formulario de contacto

(function() {
    emailjs.init("user_YOUR_USER_ID"); // Reemplaza "YOUR_USER_ID" con tu User ID de EmailJS
})();

form.addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto

    // Enviar el formulario usando EmailJS
    emailjs.sendForm('service_m5ivu47', 'template_YOUR_TEMPLATE_ID', this) // Reemplaza "YOUR_TEMPLATE_ID" con tu ID de plantilla
        .then(function() {
            alert('Mensaje enviado con éxito!');
            form.reset(); // Reiniciar el formulario
            formBtn.setAttribute('disabled', ' '); // Deshabilitar el botón nuevamente
        }, function(error) {
            alert('Error al enviar el mensaje: ' + JSON.stringify(error));
        });
});
