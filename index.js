'use strict';

// ====================
// CÓDIGO ORIGINAL INTACTO
// ====================
const elementToggleFunc = function (elem) {
    elem.classList.toggle("active");
};

const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

sidebarBtn.addEventListener("click", function () {
    elementToggleFunc(sidebar);
});

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
};

for (const element of testimonialsItem) {
    element.addEventListener('click', function () {
        modalImg.src = this.querySelector('[data-testimonials-avatar]').src;
        modalImg.alt = this.querySelector('[data-testimonials-avatar]').alt;
        modalTitle.innerHTML = this.querySelector('[data-testimonials-title]').innerHTML;
        modalText.innerHTML = this.querySelector('[data-testimonials-text]').innerHTML;

        testimonialsModalFunc();
    });
}

modalCloseBtn.addEventListener('click', testimonialsModalFunc);
overlay.addEventListener('click', testimonialsModalFunc);

const select = document.querySelector('[data-select]');
const selectItems = document.querySelectorAll('[data-select-item]');
const selectValue = document.querySelector('[data-select-value]');
const filterBtn = document.querySelectorAll('[data-filter-btn]');

select.addEventListener('click', function () {
    elementToggleFunc(this);
});

const filterItems = document.querySelectorAll('[data-filter-item]');

const filterFunc = function (selectedValue) {
    for (const element of filterItems) {
        if (selectedValue === "all") {
            element.classList.add('active');
        } else if (selectedValue === element.dataset.category) {
            element.classList.add('active');
        } else {
            element.classList.remove('active');
        }
    }
};

for (const element of selectItems) {
    element.addEventListener('click', function () {
        const selectedValue = this.innerText.toLowerCase();
        selectValue.innerText = this.innerText;
        elementToggleFunc(select);
        filterFunc(selectedValue);
    });
}

let lastClickedBtn = filterBtn[0];

for (const element of filterBtn) {
    element.addEventListener('click', function () {
        const selectedValue = this.innerText.toLowerCase();
        selectValue.innerText = this.innerText;
        filterFunc(selectedValue);

        lastClickedBtn.classList.remove('active');
        this.classList.add('active');
        lastClickedBtn = this;
    });
}

const formInputs = document.querySelectorAll('[data-form-input]');
const formBtn = document.querySelector('[data-form-btn]');
const form = document.querySelector('[data-form]');

for (const element of formInputs) {
    element.addEventListener('input', function () {
        if (form.checkValidity()) {
            formBtn.removeAttribute('disabled');
        } else {
            formBtn.setAttribute('disabled', '');
        }
    });
}

const navigationLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('[data-page]');

for (const element of navigationLinks) {
    element.addEventListener('click', function () {
        for (let i = 0; i < pages.length; i++) {
            if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
                pages[i].classList.add('active');
                navigationLinks[i].classList.add('active');
                window.scrollTo(0, 0);
            } else {
                pages[i].classList.remove('active');
                navigationLinks[i].classList.remove('active');
            }
        }
    });
}

// ====================
// INTEGRACIÓN DE ENVÍO DE CORREO CON EmailJS
// ====================
// Inicializar EmailJS con tu Public Key
(function () {
    emailjs.init("3qa5UytXx0PVYVQ2E");
})();

// Seleccionar el formulario y el botón de envío
const contactForm = document.querySelector("#contact-form");
const contactBtn = document.querySelector("#formBtn");

// Evento de envío del formulario
contactForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

    // Desactivar el botón para evitar múltiples envíos
    contactBtn.setAttribute("disabled", "true");
    contactBtn.innerHTML = "Enviando...";

    // Enviar el formulario a través de EmailJS
    emailjs
        .sendForm("service_lwd21lg", "template_3dc1f3v", contactForm)
        .then(() => {
            // Resetear el formulario y activar el botón nuevamente
            contactForm.reset();
            contactBtn.removeAttribute("disabled");
            contactBtn.innerHTML =
                '<ion-icon name="paper-plane"></ion-icon><span>Enviar Mensaje</span>';
            alert("Mensaje enviado exitosamente.");
        })
        .catch((error) => {
            console.error("Error al enviar el mensaje:", error);
            contactBtn.removeAttribute("disabled");
            contactBtn.innerHTML =
                '<ion-icon name="paper-plane"></ion-icon><span>Enviar Mensaje</span>';
            alert("Hubo un error al enviar el mensaje. Inténtalo nuevamente.");
        });
});
