document.addEventListener('DOMContentLoaded', () => {
	const menuToggle = document.getElementById('menuToggle');
	const mainMenu = document.getElementById('mainMenu');
	const menuItems = Array.from(document.querySelectorAll('.menu-item'));
	const sections = Array.from(document.querySelectorAll('.section'));

	// Typing animation function
	function typeText(element, text, speed = 50) {
		return new Promise((resolve) => {
			element.textContent = '';
			let index = 0;
			
			function type() {
				if (index < text.length) {
					element.textContent += text[index];
					index++;
					setTimeout(type, speed);
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
			const paragraphs = aboutSection.querySelectorAll('p');
			for (let p of paragraphs) {
				const text = p.textContent;
				await typeText(p, text, 30);
			}
		}
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

	// Expose a default (about) on load
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
});