document.addEventListener("DOMContentLoaded", function() {
    // Footer is now embedded directly in HTML during build process
    // No dynamic loading needed

    // Navigation dropdown functionality
    const dropdownBtn = document.querySelector('.nav-dropdown-btn');
    const dropdownContent = document.querySelector('.nav-dropdown-content');

    if (dropdownBtn && dropdownContent) {
        dropdownBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            // Toggle dropdown
            this.setAttribute('aria-expanded', !isExpanded);
            dropdownContent.setAttribute('aria-hidden', isExpanded);

            // Close dropdown when clicking outside
            if (!isExpanded) {
                document.addEventListener('click', closeDropdownOnClickOutside);
            }
        });

        function closeDropdownOnClickOutside(e) {
            if (!dropdownBtn.contains(e.target) && !dropdownContent.contains(e.target)) {
                dropdownBtn.setAttribute('aria-expanded', 'false');
                dropdownContent.setAttribute('aria-hidden', 'true');
                document.removeEventListener('click', closeDropdownOnClickOutside);
            }
        }

        // Close dropdown on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && dropdownBtn.getAttribute('aria-expanded') === 'true') {
                dropdownBtn.setAttribute('aria-expanded', 'false');
                dropdownContent.setAttribute('aria-hidden', 'true');
                document.removeEventListener('click', closeDropdownOnClickOutside);
            }
        });
    }
});