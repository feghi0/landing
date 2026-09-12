const paths = {
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  external: '<path d="M7 17 17 7M7 7h10v10"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  settings: '<path d="m9 3-.6 2.2-2 .9-2-.7-2 3.4 1.6 1.6v2.4L2.4 14l2 3.4 2-.6 2 .9L9 20h4l.6-2.3 2-.9 2 .6 2-3.4-1.6-1.2v-2.4l1.6-1.6-2-3.4-2 .7-2-.9L13 3Z"/><circle cx="11" cy="11.5" r="3"/>',
  file: '<path d="M14 3H5v18h14V8ZM14 3v5h5M8 12h8M8 16h6"/>',
  receipt: '<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M8 7h8M8 11h8M8 15h4"/>',
  'check-circle': '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  sliders: '<path d="M4 7h4m5 0h7M4 17h9m5 0h2"/><circle cx="10.5" cy="7" r="2.5"/><circle cx="15.5" cy="17" r="2.5"/>',
  database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/>',
  users: '<circle cx="9" cy="7" r="4"/><path d="M2 21v-3a7 7 0 0 1 14 0v3ZM16 3a4 4 0 0 1 0 8M19 15a6 6 0 0 1 3 6"/>',
  box: '<path d="m12 3 9 5v9l-9 5-9-5V8Zm0 10L3 8m9 5 9-5m-9 5v9M8 5l9 5"/>',
  chart: '<path d="M4 3v17h17M8 16v-4m5 4V8m5 8V5"/>',
  code: '<path d="m7 6-6 6 6 6m10-12 6 6-6 6M14 3l-4 18"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
  copy: '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>',
  mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  whatsapp: '<path d="M20.4 3.7a11 11 0 0 0-17.7 13L1 23l6.5-1.7A11 11 0 0 0 20.4 3.7Z"/><path d="M8 6.5c-3 2.5 2 9.5 7 10.5l2-2.5-3-1.5-1.3 1.2c-1.5-.8-3-2.3-3.7-3.8L10 9Z"/>'
};
const renderIcons = (container = document) => {
  container.querySelectorAll('[data-icon]').forEach(el => {
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">${paths[el.dataset.icon] || paths.code}</svg>`;
  });
};
renderIcons();

// --- MENÚ MÓVIL ---

// --- MENÚ MÓVIL ---
const menu = document.querySelector('#mobile-menu');
const menuToggle = document.querySelector('.menu-toggle');
const closeMenu = () => { menu.hidden = true; menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', 'Abrir menú'); };
if (menuToggle && menu) {
  menuToggle.addEventListener('click', () => {
    menu.hidden = !menu.hidden;
    menuToggle.setAttribute('aria-expanded', String(!menu.hidden));
    menuToggle.setAttribute('aria-label', menu.hidden ? 'Abrir menú' : 'Cerrar menú');
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
}

// --- 1. GESTIÓN DE CONTACTO POR EMAIL ---
const dialog = document.querySelector('#contact-dialog');
const form = document.querySelector('#contact-form');
const result = document.querySelector('#message-result');
const message = document.querySelector('#prepared-message');
const status = document.querySelector('#contact-status');
const contactBadge = document.querySelector('#contact-badge');
const contactTitle = document.querySelector('#contact-title');
const contactNote = document.querySelector('#contact-note');
const submitBtn = document.querySelector('#submit-contact-btn');
const openEmailBtn = document.querySelector('#open-email-btn');

const config = window.LANDING_CONTACT || {};
let contactMode = 'agenda';

const openContactDialog = (mode) => {
  contactMode = mode;
  if (contactMode === 'agenda' && /^https:\/\//.test(config.calendarUrl || '')) {
    window.open(config.calendarUrl, '_blank', 'noopener,noreferrer');
    return;
  }

  if (contactBadge && contactTitle && contactNote && submitBtn) {
    if (contactMode === 'email') {
      contactBadge.textContent = 'CONTACTO DIRECTO · EMAIL';
      contactTitle.textContent = 'Escribinos tu consulta.';
      contactNote.textContent = 'Dejanos los detalles de tu operación y te respondemos en menos de 24 horas.';
      submitBtn.innerHTML = '<i data-icon="mail"></i> Enviar consulta por correo';
    } else {
      contactBadge.textContent = 'DIAGNÓSTICO TÉCNICO · 15 MIN';
      contactTitle.textContent = 'Empecemos por el problema.';
      contactNote.textContent = 'Contanos qué parte de tu operación querés optimizar y te contactamos para coordinar la reunión.';
      submitBtn.innerHTML = '<i data-icon="mail"></i> Solicitar diagnóstico';
    }
    renderIcons(dialog);
  }

  form.hidden = false;
  result.hidden = true;
  status.textContent = '';
  dialog.showModal();
  document.body.classList.add('dialog-open');
  const firstInput = form.querySelector('#company');
  if (firstInput) setTimeout(() => firstInput.focus(), 50);
};

document.querySelectorAll('[data-contact]').forEach(button => {
  button.addEventListener('click', () => {
    openContactDialog(button.dataset.contact);
  });
});

document.querySelector('.close-dialog')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('close', () => document.body.classList.remove('dialog-open'));
dialog?.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) {
    dialog.close();
  }
});

form?.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const company = form.elements.company.value.trim();
  const emailVal = form.elements.email ? form.elements.email.value.trim() : '';
  const service = form.elements.service.value;
  const challenge = form.elements.challenge.value.trim();
  
  if (!company || !challenge) {
    status.textContent = 'Por favor completá tu nombre/empresa y el proceso a mejorar.';
    return;
  }

  const generatedMsg = `Hola, soy ${company} (${emailVal || 'sin email especificado'}).\n\nQuiero consultar por un desarrollo de software a medida.\n\nNecesidad: ${service}\nSituación actual de la operación: ${challenge}\n\nQuedo a la espera de su respuesta para evaluar el proyecto.`;
  message.value = generatedMsg;

  const emailSubject = `Consulta de software a medida - ${company}`;
  const targetEmail = config.email || '';
  const mailtoUrl = `mailto:${encodeURIComponent(targetEmail)}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(generatedMsg)}`;

  if (openEmailBtn) {
    openEmailBtn.href = mailtoUrl;
    renderIcons(openEmailBtn);
  }

  // Intentar abrir el cliente de correo predeterminado
  try {
    window.location.href = mailtoUrl;
  } catch {
    // Si no se abre de forma automática, el usuario tiene el botón directo
  }

  form.hidden = true;
  result.hidden = false;
  status.textContent = targetEmail
    ? `Preparamos el correo para ${targetEmail}. Si tu gestor no se abrió automáticamente, hacé clic en "Abrir en tu correo" o copiá el mensaje.`
    : 'Tu consulta está lista. Hacé clic en "Abrir en tu correo" o copiá el texto para enviarlo.';
  document.querySelector('#copy-message')?.focus();
});

document.querySelector('#copy-message')?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(message.value);
    status.textContent = '✓ Consulta copiada al portapapeles con éxito.';
  } catch {
    message.focus(); 
    message.select();
    status.textContent = 'Seleccionamos tu consulta. Copiala con Ctrl+C o desde el menú de tu dispositivo.';
  }
});

document.querySelector('#edit-message')?.addEventListener('click', () => {
  result.hidden = true;
  form.hidden = false;
  status.textContent = '';
  document.querySelector('#company')?.focus();
});
