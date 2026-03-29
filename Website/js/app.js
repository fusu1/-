document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------------
       1. Theme Toggle (Light / Dark)
    ----------------------------------- */
    const themeBtn = document.getElementById('theme-toggle');
    const moonIcon = document.getElementById('moon-icon');
    const sunIcon = document.getElementById('sun-icon');
    
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'block';
    } else {
        document.body.classList.add('light-mode');
    }

    themeBtn.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-mode');
        
        if (isDark) {
            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
            moonIcon.style.display = 'block';
            sunIcon.style.display = 'none';
        } else {
            document.body.classList.remove('light-mode');
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'block';
        }
    });

    /* ----------------------------------
       2. Split-Layout Hover Logic 
    ----------------------------------- */
    const hoverItems = document.querySelectorAll('.hover-item');
    const contentLayers = document.querySelectorAll('.content-layer');

    hoverItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            // Remove active from all titles
            hoverItems.forEach(h => h.classList.remove('active'));
            // Remove active from all layers
            contentLayers.forEach(c => c.classList.remove('active'));

            // Add active to current
            item.classList.add('active');
            const targetId = item.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    /* ----------------------------------
       3. Blog Tabs Switching
    ----------------------------------- */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    /* ----------------------------------
       4. Wiki Tree Accordion
    ----------------------------------- */
    const folderNodes = document.querySelectorAll('.tree-node.folder');
    
    folderNodes.forEach(folder => {
        folder.addEventListener('click', function() {
            const submenu = this.nextElementSibling;
            if (submenu && submenu.tagName === 'UL') {
                submenu.classList.toggle('collapsed');
            }
        });
    });

    /* ----------------------------------
       5. Sub-Tabs Switching (Blog Details)
    ----------------------------------- */
    const subTabBtns = document.querySelectorAll('.sub-tab-btn');
    
    subTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Isolate container scope
            const subTabsContainer = btn.closest('.sub-tabs');
            const targetId = btn.getAttribute('data-subtarget');
            
            // Reset siblings
            subTabsContainer.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Find and swap panes
            const contentsContainer = subTabsContainer.nextElementSibling; // .sub-tab-contents
            contentsContainer.querySelectorAll('.sub-tab-pane').forEach(p => p.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');
        });
    });

    /* ----------------------------------
       6. Accordion (Fluid Height Expansion)
    ----------------------------------- */
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const body = item.querySelector('.accordion-body');
            
            // Toggle visual classes
            item.classList.toggle('expanded');
            
            // Recalculate and push max-height dynamically
            if (item.classList.contains('expanded')) {
                body.style.maxHeight = body.scrollHeight + "px";
            } else {
                body.style.maxHeight = null;
            }
        });
    });
});
