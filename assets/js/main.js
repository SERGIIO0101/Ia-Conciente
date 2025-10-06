
/* ----------------------------
   Scroll suave al hacer clic en el menú
   ---------------------------- */
document.querySelectorAll('.nav-menu a[href^="#"]').forEach(enlace => {
  enlace.addEventListener('click', e => {
    e.preventDefault();
    const destino = document.querySelector(enlace.getAttribute('href'));
    if (destino) {
      destino.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ----------------------------
   Resaltar menú activo según la sección visible
   ---------------------------- */
const secciones = document.querySelectorAll('section');
const enlaces = document.querySelectorAll('.nav-menu a');

// Función Debounce para no sobrecargar el evento de scroll
function debounce(func, wait = 20) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

const gestionarScroll = () => {
  let posicionActual = window.scrollY + 200;

  secciones.forEach(sec => {
    if (posicionActual >= sec.offsetTop && 
        posicionActual < sec.offsetTop + sec.offsetHeight) {
      enlaces.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sec.id}`) {
          link.classList.add('active');
        }
      });
    }
  });
};

window.addEventListener('scroll', debounce(gestionarScroll));
/* ----------------------------
   Animación de aparición suave (fade in)
   ---------------------------- */
const observador = new IntersectionObserver((entradas) => {
  entradas.forEach(entrada => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.section, .impacto-item, .steam-item').forEach(el => {
  el.classList.add('oculto');
  observador.observe(el);
});

/* ----------------------------
   Pequeña mejora visual para los botones
   ---------------------------- */
document.querySelectorAll('a.btn-hero, .impacto-item, .steam-item').forEach(el => {
  el.addEventListener('mouseenter', () => el.style.transition = 'transform 0.2s ease');
  el.addEventListener('mouseleave', () => el.style.transition = 'transform 0.2s ease');
});

/* ======================================================
   Fondo animado del hero (red de puntos y líneas)
   ====================================================== */

// Creamos el canvas
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.querySelector('.hero').appendChild(canvas);

// Ajuste de tamaño inicial
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = document.querySelector('.hero').offsetHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Generar puntos aleatorios
const puntos = [];
const totalPuntos = 40;

for (let i = 0; i < totalPuntos; i++) {
  puntos.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    dx: (Math.random() - 0.5) * 0.5,
    dy: (Math.random() - 0.5) * 0.5
  });
}

// Dibujar y animar
function animar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar líneas
  for (let i = 0; i < totalPuntos; i++) {
    for (let j = i + 1; j < totalPuntos; j++) {
      const dx = puntos[i].x - puntos[j].x;
      const dy = puntos[i].y - puntos[j].y;
      const distancia = Math.sqrt(dx * dx + dy * dy);

      if (distancia < 150) {
        ctx.strokeStyle = 'rgba(0, 200, 150, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(puntos[i].x, puntos[i].y);
        ctx.lineTo(puntos[j].x, puntos[j].y);
        ctx.stroke();
      }
    }
  }

  // Dibujar puntos
  puntos.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 255, 176, 0.4)';
    ctx.fill();

    p.x += p.dx;
    p.y += p.dy;

    // Rebote
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });

  requestAnimationFrame(animar);
}
animar();

/* ======================================================
   Lógica para el Menú de Hamburguesa
   ====================================================== */
const menuHamburguesa = document.querySelector('.menu-hamburguesa');
const navMenu = document.querySelector('.nav-menu');

// Al hacer clic en el botón, muestra u oculta el menú
menuHamburguesa.addEventListener('click', () => {
  menuHamburguesa.classList.toggle('activo'); // <-- Esta línea anima el icono
  navMenu.classList.toggle('activo');
});

// Opcional: Cierra el menú al hacer clic en un enlace
document.querySelectorAll('.nav-menu a').forEach(enlace => {
  enlace.addEventListener('click', () => {
    // Solo cerramos si el menú está activo (en vista móvil)
    if (navMenu.classList.contains('activo')) {
      navMenu.classList.remove('activo');
    }
  });
});
/* ======================================================
   ANIMACIÓN DEL GRÁFICO DE DATOS (VERSIÓN CORREGIDA)
   ====================================================== */

function animarNumero(elemento, final, duracion) {
  let inicio = 0;
  let tiempoInicio = null;
  const numeroSpan = elemento.querySelector('.dato-numero');

  function paso(tiempoActual) {
    if (!tiempoInicio) tiempoInicio = tiempoActual;
    let progreso = Math.min((tiempoActual - tiempoInicio) / duracion, 1);
    let valorActual = Math.floor(progreso * final);
    
    numeroSpan.textContent = valorActual;

    if (progreso < 1) {
      requestAnimationFrame(paso);
    }
  }
  requestAnimationFrame(paso);
}

const observadorGrafico = new IntersectionObserver((entradas) => {
  entradas.forEach(entrada => {
    if (entrada.isIntersecting) {
      animarNumero(entrada.target, parseInt(entrada.target.getAttribute('data-target')), 2000);
      observadorGrafico.unobserve(entrada.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.dato-item').forEach(item => {
  observadorGrafico.observe(item);
});