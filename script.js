document.addEventListener('DOMContentLoaded', () => {
	const menuToggle = document.getElementById('menuToggle');
	const mainMenu = document.getElementById('mainMenu');
	const menuItems = Array.from(document.querySelectorAll('.menu-item'));
	const sections = Array.from(document.querySelectorAll('.section'));

	// Typing animation function with human-like pauses
	function typeText(element, text, baseSpeed = 35) {
		return new Promise((resolve) => {
			element.textContent = '';
			let index = 0;
			
			function type() {
				if (index < text.length) {
					element.textContent += text[index];
					index++;
					
					// Random variation for natural feel
					let delay = baseSpeed;
					
					// Subtle pause at punctuation
					if (['.', ',', '!', '?'].includes(text[index - 1])) {
						delay = baseSpeed * 2.5; // 87ms pause at punctuation
					}
					// Random occasional pauses (human thinking) - less frequent
					else if (Math.random() < 0.02) { // 2% chance per character
						delay = baseSpeed * 4; // 140ms thinking pause
					}
					// Slight variation in regular typing speed
					else {
						delay = baseSpeed + Math.random() * 15 - 7.5; // ±7.5ms variation
					}
					
					setTimeout(type, delay);
				} else {
					resolve();
				}
			}
			type();
		});
	}

	// Apply typing animation to About section on load
	async function initializeTyping() {
		const aboutSection = document.getElementById('about');
		if (aboutSection) {
			// Get heading and paragraphs in order
			const heading = aboutSection.querySelector('h2');
			const paragraphs = Array.from(aboutSection.querySelectorAll('p'));
			
			// Store original text before clearing
			const headingText = heading ? heading.textContent : '';
			const paragraphTexts = paragraphs.map(p => p.textContent);
			
			// Clear all text immediately before animation starts
			if (heading) heading.textContent = '';
			paragraphs.forEach(p => p.textContent = '');
			
			// Small delay to ensure clear happened
			await new Promise(resolve => setTimeout(resolve, 50));
			
			
			// Type heading first
			if (heading) {
				await typeText(heading, headingText, 35);
				await new Promise(resolve => setTimeout(resolve, 200)); // brief pause
			}
			
			// Type each paragraph sequentially
			for (let i = 0; i < paragraphs.length; i++) {
				const p = paragraphs[i];
				const text = paragraphTexts[i];
				await typeText(p, text, 35);
				
				// Add pause between paragraphs (except after the last one)
				if (i < paragraphs.length - 1) {
					await new Promise(resolve => setTimeout(resolve, 300));
				}
			}

			// After typing completes, show tutorial overlay
			showTutorialOverlay();
		}
	}

	// Tutorial overlay function
	function showTutorialOverlay() {
		const tutorialOverlay = document.getElementById('tutorialOverlay');
		const tutorialSpotlight = document.getElementById('tutorialSpotlight');
		const tutorialText = document.getElementById('tutorialText');

		if (!tutorialOverlay || !menuToggle) return;

		// Add active class to show overlay
		tutorialOverlay.classList.add('active');

		// Get hamburger button position
		const rect = menuToggle.getBoundingClientRect();
		const circleSize = Math.max(rect.width, rect.height) + 20;
		const circleX = rect.left + rect.width / 2 - circleSize / 2;
		const circleY = rect.top + rect.height / 2 - circleSize / 2;

		// Create circle spotlight
		const circle = document.createElement('div');
		circle.className = 'tutorial-circle';
		circle.style.width = circleSize + 'px';
		circle.style.height = circleSize + 'px';
		circle.style.left = circleX + 'px';
		circle.style.top = circleY + 'px';
		tutorialSpotlight.appendChild(circle);

		// Position "Click Me!" text below circle
		tutorialText.style.position = 'fixed';
		tutorialText.style.top = (circleY + circleSize + 20) + 'px';
		tutorialText.style.left = (circleX + circleSize / 2) + 'px';
		tutorialText.style.right = 'auto';
		tutorialText.style.transform = 'translateX(-50%)';

		// Close tutorial when user clicks hamburger, overlay, or "Click Me!"
		function closeTutorial() {
			tutorialOverlay.classList.remove('active');
			tutorialOverlay.classList.add('hidden');
		}

		menuToggle.addEventListener('click', closeTutorial, { once: true });
		tutorialText.addEventListener('click', closeTutorial);
		tutorialOverlay.addEventListener('click', (e) => {
			if (e.target === tutorialOverlay) closeTutorial();
		});
	}

	// Hamburger menu toggle
	if (menuToggle) {
		menuToggle.addEventListener('click', () => {
			const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
			menuToggle.setAttribute('aria-expanded', !isOpen);
			mainMenu.classList.toggle('active');
		});
	}

	// Close menu when item is clicked
	menuItems.forEach(btn => {
		btn.addEventListener('click', () => {
			if (menuToggle) {
				menuToggle.setAttribute('aria-expanded', 'false');
				mainMenu.classList.remove('active');
			}
		});
	});

	function showSection(id) {
		sections.forEach(s => s.classList.toggle('active', s.id === id));
		const btn = document.querySelector(`.menu-item[data-target="${id}"]`);
		if (btn) btn.focus();
	}

	menuItems.forEach((btn, idx) => {
		btn.addEventListener('click', () => showSection(btn.dataset.target));
		btn.addEventListener('keyup', (e) => {
			if (e.key === 'Enter') showSection(btn.dataset.target);
		});
	});

	// Keyboard navigation: arrow keys
	let focused = 0;
	document.addEventListener('keydown', (e) => {
		if (['ArrowRight', 'ArrowDown'].includes(e.key)) {
			focused = (focused + 1) % menuItems.length;
			menuItems[focused].focus();
			e.preventDefault();
		} else if (['ArrowLeft', 'ArrowUp'].includes(e.key)) {
			focused = (focused - 1 + menuItems.length) % menuItems.length;
			menuItems[focused].focus();
			e.preventDefault();
		} else if (e.key === 'Enter') {
			if (document.activeElement && document.activeElement.classList.contains('menu-item')) {
				document.activeElement.click();
			}
		}
	});

	// Gallery lightbox functionality
	const lightbox = document.getElementById('lightbox');
	const lightboxImage = document.getElementById('lightboxImage');
	const lightboxClose = document.getElementById('lightboxClose');
	const lightboxPrev = document.getElementById('lightboxPrev');
	const lightboxNext = document.getElementById('lightboxNext');
	const galleryImages = Array.from(document.querySelectorAll('.gallery-image'));
	let currentImageIndex = 0;

	function openLightbox(index) {
		currentImageIndex = index;
		lightboxImage.src = galleryImages[index].src;
		lightbox.style.display = 'flex';
		document.body.style.overflow = 'hidden';
	}

	function closeLightbox() {
		lightbox.style.display = 'none';
		document.body.style.overflow = 'auto';
	}

	function showNextImage() {
		currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
		lightboxImage.src = galleryImages[currentImageIndex].src;
	}

	function showPrevImage() {
		currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
		lightboxImage.src = galleryImages[currentImageIndex].src;
	}

	// Gallery item click handlers
	galleryImages.forEach((img, index) => {
		img.parentElement.addEventListener('click', () => openLightbox(index));
	});

	// Lightbox controls
	lightboxClose.addEventListener('click', closeLightbox);
	lightboxPrev.addEventListener('click', showPrevImage);
	lightboxNext.addEventListener('click', showNextImage);

	// Close lightbox when clicking outside the image
	lightbox.addEventListener('click', (e) => {
		if (e.target === lightbox) {
			closeLightbox();
		}
	});

	// Copyright protection - prevent saving/screenshotting
	function protectLightboxImage() {
		// Disable right-click on lightbox
		lightbox.addEventListener('contextmenu', (e) => {
			if (lightbox.style.display === 'flex') {
				e.preventDefault();
				return false;
			}
		});

		// Disable keyboard shortcuts for saving/printing when lightbox is open
		document.addEventListener('keydown', (e) => {
			if (lightbox.style.display === 'flex') {
				// Ctrl+S (Save)
				if ((e.ctrlKey || e.metaKey) && e.key === 's') {
					e.preventDefault();
					return false;
				}
				// Ctrl+P (Print)
				if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
					e.preventDefault();
					return false;
				}
				// Ctrl+Shift+S (Screenshot)
				if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
					e.preventDefault();
					return false;
				}
			}
		});

		// Disable drag and drop on image
		lightboxImage.addEventListener('dragstart', (e) => {
			e.preventDefault();
			return false;
		});
	}

	protectLightboxImage();

	// Keyboard navigation
	document.addEventListener('keydown', (e) => {
		if (lightbox.style.display === 'flex') {
			if (e.key === 'ArrowLeft') showPrevImage();
			if (e.key === 'ArrowRight') showNextImage();
			if (e.key === 'Escape') closeLightbox();
		}
	});


	if (menuItems.length) {
		// default to 'about' as requested
		const aboutIndex = menuItems.findIndex(b => b.dataset.target === 'about');
		focused = aboutIndex >= 0 ? aboutIndex : 0;
		menuItems.forEach((b, i) => b.setAttribute('tabindex', i === focused ? '0' : '-1'));
		// show About section
		showSection(menuItems[focused].dataset.target);
		
		// Start typing animation
		initializeTyping();
	}

	// Optimize image loading with blur-up effect
	const images = document.querySelectorAll('.gallery-image');
	images.forEach(img => {
		// If image is already cached/loaded
		if (img.complete && img.naturalHeight !== 0) {
			img.classList.add('loaded');
		}
		
		// When image finishes loading
		img.addEventListener('load', () => {
			img.classList.add('loaded');
		});
		
		// Handle loading errors
		img.addEventListener('error', () => {
			img.classList.add('loaded'); // Still show placeholder
		});
	});
});