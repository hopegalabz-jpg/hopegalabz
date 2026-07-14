/* The Belize Project — shared header, footer, and contact modal.
   Injects into any page with <div id="site-header"></div>,
   <div id="site-footer"></div>, and <div id="site-modal"></div>. */

/* ---------- EmailJS configuration ---------- */
const EMAILJS_SERVICE_ID = 'service_6f2ujxo';
const EMAILJS_PUBLIC_KEY = 'Ynw4v3pMwaJjIgZkT';
const EMAILJS_TEMPLATE_ID = 'template_jnqat86';

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
				<li><a href="gala.html">Gala</a></li>
				<li><a href="ministries.html">Ministries</a></li>
				<li><a href="gallery.html">Gallery</a></li>
				<li><a href="resources.html">Resources</a></li>
			</ul>
		</nav>
	</header>
`;

const SITE_FOOTER = `
	<footer>
		<div class="footer-contact">
			<button type="button" class="footer-contact-trigger" id="open-contact-modal" aria-haspopup="dialog" aria-expanded="false">Contact Us</button>
			<div class="footer-contact-divider" aria-hidden="true"></div>
			<button type="button" class="footer-contact-trigger" id="open-give-modal" aria-haspopup="dialog" aria-expanded="false">Make a Donation</button>
		</div>
		<div class="foot">
			<img src="assets/images/logos/hplogo.png" alt="Hope Gala">
		</div>
		<div class="footer-text">
			© The Belize Project Hope Gala
		</div>
		<div class="footer-social">
			<a href="https://www.facebook.com/profile.php?id=100083154105759" target="_blank" rel="noopener" aria-label="The Belize Project on Facebook">
				<img src="assets/images/logos/fb.png" alt="Facebook">
			</a>
		</div>
	</footer>
`;

const SITE_MODAL = `
	<div class="modal-overlay" id="contact-overlay">
		<div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
			<button type="button" class="modal-close" aria-label="Close">&times;</button>

			<div class="modal-body">
				<div id="modal-initial-view">
					<h3 id="contact-modal-title">Contact & Pledges</h3>
					<p class="drop-cap">We appreciate your support. Please reach out with any inquiries, pledges, or partnership opportunities.</p>

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
							<label for="contact-reason">Reason for Contact</label>
							<select id="contact-reason" name="contact_reason" required>
								<option value="" disabled selected>Select an option...</option>
								<option value="Pledge">Make a Pledge</option>
								<option value="General Inquiry">General Inquiry</option>
								<option value="Sponsorship">Sponsorship</option>
							</select>
						</div>
						<div class="form-field">
							<label for="contact-message">Message</label>
							<textarea id="contact-message" name="message" rows="4" required></textarea>
						</div>

						<input type="text" name="website" class="hp-field" tabindex="-1" autocomplete="off" aria-hidden="true">

						<button type="submit" class="modal-submit">Send Message</button>
						<p class="form-status" role="status" aria-live="polite"></p>
					</form>

					<div class="modal-contact-info">
						<p><strong>Telephone:</strong> 501-610-9345 | 501-636-8147</p>
						<p><strong>Email:</strong> thebelizeproject2@gmail.com</p>
					</div>
				</div>

				<div class="success-message" hidden>
					<h4 tabindex="-1">Message Sent</h4>
					<p>Thank you for reaching out. We have received your message and will be in touch shortly.</p>
				</div>
			</div>
		</div>
	</div>
`;

const SITE_GIVE_MODAL = `
	<div class="modal-overlay" id="give-modal-overlay">
		<div class="donation-card" role="dialog" aria-modal="true" aria-labelledby="give-modal-title">
			<button type="button" class="donation-card-close" id="close-give-modal" aria-label="Close">&times;</button>

			<h3 id="give-modal-title">Make a Donation</h3>
			<p class="donation-intro">Your generosity helps us bring hope and restoration to communities in Belize. Below are the two easiest ways to give.</p>

			<p class="donation-method-label">Electronic Transfer</p>
			<div class="bank-details-card">
				<h5>Atlantic Bank Electronic Transfer</h5>
				<p>Account Name: <strong>The Belize Project</strong></p>
				<p>Account Number: <strong>100279146</strong></p>
			</div>

			<p class="donation-method-label">By Check or Mail</p>
			<p class="check-instruction">Checks can be made payable to <strong>The Belize Project</strong> and mailed to:</p>
			<div class="mailing-address-card">
				<p>The Belize Project</p>
				<p>PO Box 119</p>
				<p>Corozal Town, Belize</p>
			</div>

			<div class="donation-contact-footer">
				<p class="contact-title">Thank you for your generosity. To confirm your gift or arrange another way to give, please contact:</p>
				<div class="contact-grid">
					<p><strong>Mr. Mario Castellanos</strong><br>+501-610-9345</p>
					<p><strong>Mrs. Ruth Williams</strong><br>+501-636-8147</p>
				</div>
				<p class="email-line"><strong>Email:</strong> thebelizeproject2@gmail.com</p>
			</div>
		</div>
	</div>
`;

/* ---------- Inject shared markup and Global Head Elements ---------- */
document.addEventListener('DOMContentLoaded', () => {
	// 1. Inject UI Elements (Header, Footer, Modal)
	const headerSlot = document.getElementById('site-header');
	const footerSlot = document.getElementById('site-footer');
	const modalSlot = document.getElementById('site-modal');

	if (headerSlot) headerSlot.innerHTML = SITE_HEADER;
	if (footerSlot) footerSlot.innerHTML = SITE_FOOTER;
	if (modalSlot) {
		modalSlot.innerHTML = SITE_MODAL + SITE_GIVE_MODAL;
		initContactModal();
		initGiveModal();
	}

	// 2. Inject Favicon Globally
	const favicon = document.createElement('link');
	favicon.rel = 'icon';
	favicon.href = 'assets/images/logos/favicon.ico';
	document.head.appendChild(favicon);

	// 3. Inject Google Fonts Globally
	const preconnect1 = document.createElement('link');
	preconnect1.rel = 'preconnect';
	preconnect1.href = 'https://fonts.googleapis.com';

	const preconnect2 = document.createElement('link');
	preconnect2.rel = 'preconnect';
	preconnect2.href = 'https://fonts.gstatic.com';
	preconnect2.crossOrigin = 'anonymous';

	const fontLink = document.createElement('link');
	fontLink.rel = 'stylesheet';
	fontLink.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Work+Sans:wght@300;400;500;600&display=swap';

	document.head.append(preconnect1, preconnect2, fontLink);

	// 4. Inject and Initialize EmailJS Globally
	const emailJsScript = document.createElement('script');
	emailJsScript.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
	emailJsScript.onload = () => {
		emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
	};
	document.head.appendChild(emailJsScript);
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
	const initialView = document.getElementById('modal-initial-view');

	if (!openBtn) return;

	let lastFocusedEl = null;

	function openModal() {
		lastFocusedEl = document.activeElement;
		initialView.hidden = false;
		successMessage.hidden = true;
		submitBtn.disabled = false;
		submitBtn.textContent = 'Send Message';
		statusEl.textContent = '';
		statusEl.classList.remove('is-error');

		overlay.classList.add('is-visible');
		void overlay.offsetHeight; 
		overlay.classList.add('is-open');
		document.body.classList.add('modal-open');
		openBtn.setAttribute('aria-expanded', 'true');
		document.addEventListener('keydown', onKeydownContact);
		firstField.focus();
	}

	function closeModal() {
		overlay.classList.remove('is-open');
		document.body.classList.remove('modal-open');
		openBtn.setAttribute('aria-expanded', 'false');
		document.removeEventListener('keydown', onKeydownContact);
		setTimeout(() => {
			overlay.classList.remove('is-visible');
		}, 250);
		if (lastFocusedEl) lastFocusedEl.focus();
	}

	function onKeydownContact(e) {
		if (e.key === 'Escape') {
			closeModal();
			return;
		}
		if (e.key === 'Tab') {
			const focusable = Array.from(modalCard.querySelectorAll('input, textarea, select, button'))
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
		if (form.website.value) return; 

		if (typeof emailjs === 'undefined') {
			statusEl.textContent = 'Contact system is still loading. Please wait a moment and try again.';
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
				initialView.hidden = true;
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

function initGiveModal() {
	const overlay = document.getElementById('give-modal-overlay');
	const openBtn = document.getElementById('open-give-modal');
	const closeBtn = document.getElementById('close-give-modal');

	if (!overlay || !openBtn) return;

	let lastFocusedEl = null;

	function openModal() {
		lastFocusedEl = document.activeElement;
		overlay.classList.add('is-visible');
		void overlay.offsetHeight;
		overlay.classList.add('is-open');
		document.body.classList.add('modal-open');
		openBtn.setAttribute('aria-expanded', 'true');
		document.addEventListener('keydown', onKeydownGive);
		closeBtn.focus();
	}

	function closeModal() {
		overlay.classList.remove('is-open');
		document.body.classList.remove('modal-open');
		openBtn.setAttribute('aria-expanded', 'false');
		document.removeEventListener('keydown', onKeydownGive);
		setTimeout(() => {
			overlay.classList.remove('is-visible');
		}, 250);
		if (lastFocusedEl) lastFocusedEl.focus();
	}

	function onKeydownGive(e) {
		if (e.key === 'Escape') closeModal();
	}

	openBtn.addEventListener('click', openModal);
	closeBtn.addEventListener('click', closeModal);
	overlay.addEventListener('click', (e) => {
		if (e.target === overlay) closeModal();
	});
}

/* =====================================================================
   GALLERY LOGIC & DATA
   ===================================================================== */

function closeAlbum() {
	document.getElementById('sidebarOverlay').classList.remove('active');
	document.body.style.overflow = ''; 
}

// Click-outside-to-close for the sidebar (shared by Gallery and Resources,
// since both use the same #sidebarOverlay element and closeAlbum()).
// Only closes when the click lands on the backdrop itself — e.target is
// the overlay element, not something nested inside .premium-sidebar —
// so clicking a photo, a resource link, or anything else inside the panel
// does not trigger this.
const sidebarOverlayEl = document.getElementById('sidebarOverlay');
if (sidebarOverlayEl) {
	sidebarOverlayEl.addEventListener('click', function(e) {
		if (e.target === sidebarOverlayEl) closeAlbum();
	});
}

// Keyboard Escape for the sidebar. Gallery's own lightbox keyboard
// handling (arrow keys, its own Escape) lives in gallery.html now, since
// only that page has a lightbox — this listener only ever needs to know
// about the shared sidebar.
document.addEventListener('keydown', function(event) {
	const sidebarOverlay = document.getElementById('sidebarOverlay');
	if (sidebarOverlay && sidebarOverlay.classList.contains('active')) {
		if (event.key === 'Escape') closeAlbum();
	}
});
