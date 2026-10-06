// ==========================================
// 1. REFERENCIAS A ELEMENTOS DEL HTML
// ==========================================
const selectRuta = document.getElementById('selectRuta');
const estadoTexto = document.getElementById('estadoTexto');
const badgeEstado = document.getElementById('badgeEstado');

const formReserva = document.getElementById('formReserva');
const inputMatricula = document.getElementById('inputMatricula');
const selectHora = document.getElementById('selectHora');

const errMatricula = document.getElementById('errMatricula');
const errHora = document.getElementById('errHora');

const ticketPass = document.getElementById('ticketPass');
const noPassText = document.getElementById('noPassText');
const detallesPase = document.getElementById('detallesPase');
const qrCodeImage = document.getElementById('qrCodeImage'); // Imagen del QR

// ==========================================
// 2. CAMBIO DE ESTADO AL ELEGIR RUTA
// ==========================================
selectRuta.addEventListener('change', () => {
  const val = selectRuta.value;
  if (val === 'r1') {
    estadoTexto.textContent = 'Autobús #04 en camino. Tiempo estimado: 5 minutos.';
    badgeEstado.textContent = 'A tiempo (Capacidad 80%)';
    badgeEstado.style.backgroundColor = '#d4edda';
    badgeEstado.style.color = '#155724';
  } else if (val === 'r2') {
    estadoTexto.textContent = 'Autobús #09 en origen. Sale en 12 minutos.';
    badgeEstado.textContent = 'Disponible (Capacidad 30%)';
    badgeEstado.style.backgroundColor = '#d1ecf1';
    badgeEstado.style.color = '#0c5460';
  } else if (val === 'r3') {
    estadoTexto.textContent = 'Unidad demorada. Tiempo estimado: 18 minutos.';
    badgeEstado.textContent = 'Retrasado';
    badgeEstado.style.backgroundColor = '#fff3cd';
    badgeEstado.style.color = '#856404';
  } else {
    estadoTexto.textContent = 'Selecciona una ruta para consultar.';
    badgeEstado.textContent = 'En espera';
    badgeEstado.style.backgroundColor = '#e2e3e5';
    badgeEstado.style.color = '#383d41';
  }
});

// ==========================================
// 3. FILTRO EN TIEMPO REAL (SOLO NÚMEROS)
// ==========================================
inputMatricula.addEventListener('input', (e) => {
  // Elimina cualquier carácter que NO sea un número mientras el usuario escribe
  e.target.value = e.target.value.replace(/\D/g, '');
});

// ==========================================
// 4. VALIDACIÓN Y GENERACIÓN DEL PASE CON QR
// ==========================================
formReserva.addEventListener('submit', (e) => {
  e.preventDefault();
  let isValid = true;

  // Validar si eligió ruta
  if (!selectRuta.value) {
    alert('Por favor selecciona primero una ruta en la sección 1.');
    selectRuta.focus();
    return;
  }

  // Validar exactamente 9 dígitos
  const regexCodigo = /^\d{9}$/;
  if (!regexCodigo.test(inputMatricula.value.trim())) {
    errMatricula.style.display = 'block';
    inputMatricula.setAttribute('aria-invalid', 'true');
    isValid = false;
  } else {
    errMatricula.style.display = 'none';
    inputMatricula.removeAttribute('aria-invalid');
  }

  // Validar selección de hora
  if (!selectHora.value) {
    errHora.style.display = 'block';
    selectHora.setAttribute('aria-invalid', 'true');
    isValid = false;
  } else {
    errHora.style.display = 'none';
    selectHora.removeAttribute('aria-invalid');
  }

  // Si todo está correcto, generamos el boleto y el QR
  if (isValid) {
    const rutaNom = selectRuta.options[selectRuta.selectedIndex].text;
    const horaNom = selectHora.options[selectHora.selectedIndex].text;
    const mat = inputMatricula.value.trim();

    // Texto dinámico que contendrá el QR
    const textoQR = `UNIMOVE | Matrícula: ${mat} | Ruta: ${rutaNom} | Hora: ${horaNom}`;

    // Generar la URL del código QR mediante API
    qrCodeImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(textoQR)}`;
    qrCodeImage.style.display = 'block';

    // Mostrar sección del pase de abordaje
    noPassText.style.display = 'none';
    ticketPass.style.display = 'block';
    detallesPase.innerHTML = `<strong>Pasajero:</strong> ${mat} <br> <strong>Ruta:</strong> ${rutaNom} <br> <strong>Hora:</strong> ${horaNom}`;
    ticketPass.scrollIntoView({ behavior: 'smooth' });
  }
});