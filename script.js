document.addEventListener('DOMContentLoaded', () => {
	const menuItems = Array.from(document.querySelectorAll('.menu-item'));
	const sections = Array.from(document.querySelectorAll('.section'));

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

	// Expose a default (home) on load
	if (menuItems.length) {
		focused = 0;
		menuItems[0].setAttribute('tabindex', '0');
	}
});
