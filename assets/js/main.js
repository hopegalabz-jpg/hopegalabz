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

const gala2025 = [ "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg" ];
const gala2024 = [ "1.jpg", "IMG-20241020-WA0017.jpg", "20241019_163342.jpg", "20241019_210912.jpg", "IMG-20241020-WA0009.jpg", "20241019_163312.jpg", "IMG-20241020-WA0014.jpg", "IMG-20241020-WA0002.jpg", "IMG-20241020-WA0019.jpg", "20241019_185200.jpg", "20241019_210925.jpg", "IMG-20241020-WA0012.jpg", "20241019_163306.jpg", "20241019_210822.jpg", "IMG-20241020-WA0024.jpg", "IMG-20241020-WA0010.jpg", "IMG-20241020-WA0007.jpg", "2.jpg", "IMG-20241020-WA0004.jpg", "IMG-20241020-WA0018.jpg", "20241019_185219.jpg", "IMG-20241020-WA0011.jpg", "IMG-20241020-WA0005.jpg" ];
const gala2023 = [ "3 (1).png", "3 (2).png", "3 (3).png", "3 (4).png", "3 (5).png", "3 (6).png", "3 (7).png", "3 (8).png", "3 (9).png", "3 (10).png", "3 (11).png", "3 (12).png", "3 (13).png", "3 (14).png", "3 (15).png", "3 (16).png", "3 (17).png", "3 (18).png", "3 (19).png", "3 (20).png", "3 (21).png", "3 (22).png", "3 (23).png", "3 (24).png", "3 (25).png", "3 (26).png", "3 (27).png", "3 (28).png", "3 (29).png", "3 (30).png", "3 (31).png", "3 (32).png", "3 (33).png", "3 (34).png", "3 (35).png", "3 (36).png", "3 (37).png", "3 (38).png", "3 (39).png", "3 (40).png", "3 (41).png", "3 (42).png", "3 (43).png", "3 (44).png", "3 (45).png", "3 (46).png", "3 (47).png", "3 (48).png", "3 (49).png", "3 (50).png", "3 (51).png", "3 (52).png", "3 (53).png", "3 (54).png", "3 (55).png", "3 (56).png", "3 (57).png", "3 (58).png", "3 (59).png", "3 (60).png", "3 (61).png", "3 (62).png", "3 (63).png", "3 (64).png", "3 (65).png", "3 (66).png", "3 (67).png", "3 (68).png", "3 (69).png", "3 (70).png", "3 (71).png", "3 (72).png", "3 (73).png", "3 (74).png", "3 (75).png", "3 (76).png", "3 (77).png", "3 (78).png", "3 (79).png", "3 (80).png" ];
const gala2022 = [ "HopeGala22-1.png", "HopeGala22-10.png", "HopeGala22-15.png", "HopeGala22-16.png", "HopeGala22-17.png", "HopeGala22-19.png", "HopeGala22-20.png", "HopeGala22-21.png", "HopeGala22-22.png", "HopeGala22-24.png", "HopeGala22-25.png", "HopeGala22-28.png", "HopeGala22-29.png", "HopeGala22-3.png", "HopeGala22-30.png", "HopeGala22-31.png", "HopeGala22-32.jpg", "HopeGala22-33.png", "HopeGala22-35.png", "HopeGala22-36.png", "HopeGala22-37.jpg", "HopeGala22-38.png", "HopeGala22-4.png", "HopeGala22-40.png", "HopeGala22-41.png", "HopeGala22-42.png", "HopeGala22-43.png", "HopeGala22-44.png", "HopeGala22-45.png", "HopeGala22-46.png", "HopeGala22-47.png", "HopeGala22-48.png", "HopeGala22-49.png", "HopeGala22-5.png", "HopeGala22-50.png", "HopeGala22-51.png", "HopeGala22-52.png", "HopeGala22-53.png", "HopeGala22-54.png", "HopeGala22-55.png", "HopeGala22-57.png", "HopeGala22-58.png", "HopeGala22-59.png", "HopeGala22-6.png", "HopeGala22-60.png", "HopeGala22-61.png", "HopeGala22-63.png", "HopeGala22-64.png", "HopeGala22-65.png", "HopeGala22-67.png", "HopeGala22-68.png", "HopeGala22-69.png", "HopeGala22-7.png", "HopeGala22-70.png", "HopeGala22-71.png", "HopeGala22-72.png", "HopeGala22-73.png", "HopeGala22-74.png", "HopeGala22-75.png", "HopeGala22-76.png", "HopeGala22-78.png", "HopeGala22-79.png", "HopeGala22-8.png", "HopeGala22-80.png", "HopeGala22-81.png", "HopeGala22-82.png", "HopeGala22-83.png", "HopeGala22-84.png", "HopeGala22-85.png", "HopeGala22-86.png", "HopeGala22-87.jpg", "HopeGala22-89.jpg", "HopeGala22-9.png", "HopeGala22-90.jpg" ];
const jacobsFarm = [ "1000037511.jpg", "1000037513.jpg", "IMG-20250701-WA0036.jpg", "IMG-20250701-WA0037.jpg", "IMG-20250701-WA0040.jpg", "IMG-20250701-WA0041.jpg", "IMG-20250701-WA0042.jpg" ];
const dorcas = [ "1.jpg", "2.jpg", "3.png", "IMG-20250701-WA0038.jpg", "IMG-20250701-WA0039.jpg" ];
const restore = [ "4.jpg", "5.jpg", "6.jpg", "1000037531.jpg", "1000000215.jpg", "1000000356.jpg", "1000037529.jpg", "IMG-20250701-WA0043.jpg", "IMG-20250701-WA0044.jpg" ];
const bit = [ "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "7.jpg", "11.jpg", "33.jpg", "55.jpg", "77.jpg" ];

// State memory for Gallery Navigation
let currentAlbumList = [];
let currentFolderPath = '';
let currentImageIndex = 0;

function openAlbum(titleFirst, titleGold, folderPath, imageList) {
	currentAlbumList = imageList;
	currentFolderPath = folderPath;
	
	const overlay = document.getElementById('sidebarOverlay');
	const titleContainer = document.getElementById('sidebarTitle');
	const galleryContainer = document.getElementById('sidebarGalleryItems');
	
	titleContainer.innerHTML = `${titleFirst} <span>${titleGold}</span>`;
	galleryContainer.innerHTML = '';
	
	imageList.forEach((filename, index) => {
		const img = document.createElement('img');
		img.src = `${folderPath}/${filename}`;
		img.loading = "lazy";
		img.alt = "Gala Media File";
		
		img.onclick = function() {
			openLightbox(index);
		};
		
		galleryContainer.appendChild(img);
	});
	
	overlay.classList.add('active');
	document.body.style.overflow = 'hidden'; 
}

function openLightbox(index) {
	currentImageIndex = index;
	const lightboxImg = document.getElementById('lightboxImg');
	
	// Set the initial image immediately upon opening without fade
	lightboxImg.src = `${currentFolderPath}/${currentAlbumList[currentImageIndex]}`;
	lightboxImg.classList.remove('fade-out');
	
	document.getElementById('lightbox').classList.add('active');
}

function updateLightboxImage() {
	const lightboxImg = document.getElementById('lightboxImg');
	
	lightboxImg.classList.add('fade-out');
	
	setTimeout(() => {
		lightboxImg.src = `${currentFolderPath}/${currentAlbumList[currentImageIndex]}`;
		lightboxImg.classList.remove('fade-out');
	}, 200);
}

function changeImage(direction, event) {
	if (event) event.stopPropagation(); 
	
	currentImageIndex += direction;
	
	if (currentImageIndex < 0) {
		currentImageIndex = currentAlbumList.length - 1;
	} else if (currentImageIndex >= currentAlbumList.length) {
		currentImageIndex = 0;
	}
	
	updateLightboxImage();
}

// Closes ONLY via the explicit close button or Escape. The lightbox div's
// onclick in gallery.html still calls this function on every click inside
// it (backdrop, photo, everywhere) — so this function refuses to act
// unless it was called with no event at all (Escape key) or an event
// whose target is exactly the close button itself.
function closeLightbox(event) {
	if (event && event.target.className !== 'lightbox-close') return;
	document.getElementById('lightbox').classList.remove('active');
}

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

// Touch swipe navigation for the lightbox (mobile only in practice, since
// desktop pointers don't fire touch events). Reuses changeImage() — the
// same function the desktop prev/next arrows call — so swiping and
// clicking always stay in sync with no separate navigation logic to
// maintain.
let swipeStartX = 0;
const SWIPE_MIN_DISTANCE = 50; // px — below this, treat it as a tap, not a swipe

const lightboxEl = document.getElementById('lightbox');
if (lightboxEl) {
	lightboxEl.addEventListener('touchstart', function(event) {
		swipeStartX = event.changedTouches[0].clientX;
	}, { passive: true });

	lightboxEl.addEventListener('touchend', function(event) {
		const swipeEndX = event.changedTouches[0].clientX;
		const distance = swipeEndX - swipeStartX;

		if (Math.abs(distance) < SWIPE_MIN_DISTANCE) return; // was a tap, not a swipe

		if (distance < 0) {
			changeImage(1); // swiped left → next photo
		} else {
			changeImage(-1); // swiped right → previous photo
		}
	}, { passive: true });
}

// Keyboard Navigation for Lightbox & Album
document.addEventListener('keydown', function(event) {
	const lightbox = document.getElementById('lightbox');
	const sidebarOverlay = document.getElementById('sidebarOverlay');
	
	if (lightbox && lightbox.classList.contains('active')) {
		if (event.key === 'ArrowRight') {
			changeImage(1);
		} else if (event.key === 'ArrowLeft') {
			changeImage(-1);
		} else if (event.key === 'Escape') {
			closeLightbox();
		}
	} else if (sidebarOverlay && sidebarOverlay.classList.contains('active')) {
	    if (event.key === 'Escape') closeAlbum();
	}
});
