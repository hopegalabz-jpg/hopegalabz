/* The Belize Project — shared header, footer, and contact modal.
   Injects into any page with <div id="site-header"></div>,
   <div id="site-footer"></div>, and <div id="site-modal"></div>.
   Slider logic stays out of here — it's homepage-only, in index.html. */

/* ---------- EmailJS configuration ---------- */
const EMAILJS_SERVICE_ID = 'service_6f2ujxo';
const EMAILJS_PUBLIC_KEY = 'Ynw4v3pMwaJjIgZkT';
// NOTE: this is currently identical to EMAILJS_PUBLIC_KEY above. Public Key
// and Template ID come from two different places on the EmailJS dashboard
// and shouldn't match — double check this value before testing the form.
const EMAILJS_TEMPLATE_ID = 'Ynw4v3pMwaJjIgZkT';

if (typeof emailjs !== 'undefined') {
	emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
} else {
	console.warn('EmailJS SDK not loaded — the contact form will not be able to send.');
}

/* ---------- Shared markup ---------- */
const SITE_HEADER = `
	<header>
		<nav class="navegacion">
			<div class="nav-spacer"></div>
			<a href="index.html" class="nav-logo">
				<img src="assets/images/logos/bplogo.png" alt="The Belize Project">
			</a>
			<ul class="nav-menu">
				<li><a href="index.html">Home</a></li>
				<li><a href="gala.html">Hope Gala</a></li>
				<li><a href="ministries.html">Ministries</a></li>
				<li><a href="gallery.html">Gallery</a></li>
			</ul>
		</nav>
	</header>
`;

const SITE_FOOTER = `
	<footer>
		<div class="footer-contact">
			<button type="button" class="footer-contact-trigger" id="open-contact-modal" aria-haspopup="dialog" aria-expanded="false">Contact Us</button>
		</div>
		<div class="foot">
			<img src="assets/images/logos/hplogo.png" alt="Hope Gala">
		</div>
		<div class="footer-text">
			© The Belize Project Hope Gala
		</div>
	</footer>
`;

const SITE_MODAL = `
	<div class="modal-overlay" id="contact-overlay">
		<div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
			<button type="button" class="modal-close" aria-label="Close">&times;</button>

			<div class="modal-body">
				<h3 id="contact-modal-title">Get in Touch</h3>
				<p class="drop-cap">Tell us what's on your mind — we read every message.</p>

				<form id="contact-form">
					<div class="form-field">
						<label for="contact-name">Name</label>
						<input type="text" id="contact-name" name="from_name" autocomplete="name" required>
					</div>
					<div class="form-field">
						<label for="contact-email">Email</label>
						<input type="email" id="contact-email" name="reply_to" autocomplete="email" required>
					</div>
					<div class="form-field">
						<label for="contact-phone">Phone</label>
						<input type="tel" id="contact-phone" name="phone_number" autocomplete="tel" required>
					</div>
					<div class="form-field">
						<label for="contact-message">Message</label>
						<textarea id="contact-message" name="message" rows="4" required></textarea>
					</div>

					<input type="text" name="website" class="hp-field" tabindex="-1" autocomplete="off" aria-hidden="true">

					<button type="submit" class="modal-submit">Send Message</button>
					<p class="form-status" role="status" aria-live="polite"></p>
				</form>

				<div class="success-message" hidden>
					<h4 tabindex="-1">Message Sent</h4>
					<p>Thank you for reaching out — we'll be in touch soon.</p>
				</div>
			</div>
		</div>
	</div>
`;

/* ---------- Inject shared markup, then wire up the modal ---------- */
document.addEventListener('DOMContentLoaded', () => {
	const headerSlot = document.getElementById('site-header');
	const footerSlot = document.getElementById('site-footer');
	const modalSlot = document.getElementById('site-modal');

	if (headerSlot) headerSlot.innerHTML = SITE_HEADER;
	if (footerSlot) footerSlot.innerHTML = SITE_FOOTER;
	if (modalSlot) {
		modalSlot.innerHTML = SITE_MODAL;
		initContactModal();
	}
});

function initContactModal() {
	const overlay = document.getElementById('contact-overlay');
	const modalCard = overlay.querySelector('.modal-card');
	const openBtn = document.getElementById('open-contact-modal');
	const closeBtn = overlay.querySelector('.modal-close');
	const form = document.getElementById('contact-form');
	const successMessage = overlay.querySelector('.success-message');
	const submitBtn = form.querySelector('.modal-submit');
	const statusEl = form.querySelector('.form-status');
	const firstField = document.getElementById('contact-name');

	if (!openBtn) return;

	let lastFocusedEl = null;

	function openModal() {
		lastFocusedEl = document.activeElement;

		// Reset to a fresh state every time it opens, in case a delayed
		// response from a previous submission arrived after it was closed.
		form.hidden = false;
		successMessage.hidden = true;
		submitBtn.disabled = false;
		submitBtn.textContent = 'Send Message';
		statusEl.textContent = '';
		statusEl.classList.remove('is-error');

		overlay.classList.add('is-visible');
		void overlay.offsetHeight; // force reflow so the fade-in actually transitions
		overlay.classList.add('is-open');
		document.body.classList.add('modal-open');
		openBtn.setAttribute('aria-expanded', 'true');
		document.addEventListener('keydown', onKeydown);
		firstField.focus();
	}

	function closeModal() {
		overlay.classList.remove('is-open');
		document.body.classList.remove('modal-open');
		openBtn.setAttribute('aria-expanded', 'false');
		document.removeEventListener('keydown', onKeydown);
		setTimeout(() => {
			overlay.classList.remove('is-visible');
		}, 250);
		if (lastFocusedEl) lastFocusedEl.focus();
	}

	function onKeydown(e) {
		if (e.key === 'Escape') {
			closeModal();
			return;
		}
		if (e.key === 'Tab') {
			const focusable = Array.from(modalCard.querySelectorAll('input, textarea, button'))
				.filter((el) => el.tabIndex !== -1 && !el.disabled && el.offsetParent !== null);
			if (!focusable.length) return;
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		}
	}

	openBtn.addEventListener('click', openModal);
	closeBtn.addEventListener('click', closeModal);
	overlay.addEventListener('click', (e) => {
		if (e.target === overlay) closeModal();
	});

	form.addEventListener('submit', (e) => {
		e.preventDefault();
		if (!form.reportValidity()) return;
		if (form.website.value) return; // honeypot tripped — silently ignore

		if (typeof emailjs === 'undefined') {
			statusEl.textContent = 'Something went wrong loading the contact form. Please email us directly.';
			statusEl.classList.add('is-error');
			return;
		}

		submitBtn.disabled = true;
		submitBtn.textContent = 'Sending…';
		statusEl.textContent = '';
		statusEl.classList.remove('is-error');

		emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
			.then(() => {
				form.reset();
				form.hidden = true;
				successMessage.hidden = false;
				successMessage.querySelector('h4').focus();
			})
			.catch((err) => {
				submitBtn.disabled = false;
				submitBtn.textContent = 'Send Message';
				statusEl.textContent = 'Something went wrong — please try again, or email us directly.';
				statusEl.classList.add('is-error');
				console.error('EmailJS error:', err);
			});
	});
}
