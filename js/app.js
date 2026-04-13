// --- Imports ---
import markdownit from 'https://cdn.jsdelivr.net/npm/markdown-it@14.1.1/+esm';

// --- Initialize Markdown-It with Highlight.js ---
const md = markdownit({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
        if (lang && window.hljs.getLanguage(lang)) {
            try {
                return '<pre><code class="hljs">' +
                       window.hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                       '</code></pre>';
            } catch (__) {}
        }
        return '<pre><code class="hljs">' + md.utils.escapeHtml(str) + '</code></pre>';
    }
});

// --- DOM Elements ---
const sidebarList       = document.getElementById('sidebar-list');
const wrapper           = document.getElementById('svg-wrapper');
const markdownContent   = document.getElementById('markdown-content');

// Mobile sidebar
const mobileMenuBtn     = document.getElementById('mobile-menu-btn');
const closeSidebarBtn   = document.getElementById('close-sidebar-btn');
const sidebar           = document.getElementById('sidebar');
const sidebarOverlay    = document.getElementById('sidebar-overlay');

// Dropdown switcher
const diagramSwitcher   = document.getElementById('diagram-switcher');
const switcherPrev      = document.getElementById('switcher-prev');
const switcherNext      = document.getElementById('switcher-next');

// --- Mobile Sidebar Controls ---
function toggleSidebar() {
    const isClosed = sidebar.classList.contains('-translate-x-full');
    if (isClosed) {
        sidebar.classList.remove('-translate-x-full');
        sidebarOverlay.classList.remove('hidden');
    } else {
        sidebar.classList.add('-translate-x-full');
        sidebarOverlay.classList.add('hidden');
    }
}

if (mobileMenuBtn)   mobileMenuBtn.addEventListener('click', toggleSidebar);
if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', toggleSidebar);
if (sidebarOverlay)  sidebarOverlay.addEventListener('click', toggleSidebar);

// --- State ---
let diagramData     = [];
let activeId        = null;
let panZoomInstance = null;

// --- Initialize App ---
async function init() {
    try {
        const response  = await fetch('data/data.json');
        const jsonData  = await response.json();
        diagramData     = jsonData.projects;

        renderSidebar();
        renderDropdown();
        window.lucide.createIcons();

        if (diagramData && diagramData.length > 0) {
            loadDiagram(diagramData[0].id);
        }
    } catch (error) {
        sidebarList.innerHTML = `<div class="text-red-500 text-sm p-4">Failed to load data.json.</div>`;
        console.error("Error loading data:", error);
    }
}

// --- Sidebar Rendering ---
function renderSidebar() {
    sidebarList.innerHTML = '';
    diagramData.forEach(item => {
        const btn = document.createElement('button');
        btn.id        = `btn-${item.id}`;
        btn.className = `w-full text-left p-4 rounded-xl border border-transparent hover:bg-muted/50 transition-colors flex flex-col gap-1`;

        const displayName = item.name || item.title || item.id;
        const date        = item.date;

        btn.innerHTML = `
            <span class="font-bold text-sm">${displayName}</span>
            <span class="text-xs text-muted-foreground flex items-center mt-1">
                <i data-lucide="file-text" class="size-3 mr-1"></i> ${date}
            </span>
        `;
        btn.onclick = () => loadDiagram(item.id);
        sidebarList.appendChild(btn);
    });
}

function updateActiveSidebarItem(id) {
    diagramData.forEach(item => {
        const btn = document.getElementById(`btn-${item.id}`);
        if (!btn) return;
        if (item.id === id) {
            btn.classList.add('bg-primary/10', 'border-primary/50');
            btn.classList.remove('border-transparent', 'hover:bg-muted/50');
        } else {
            btn.classList.remove('bg-primary/10', 'border-primary/50');
            btn.classList.add('border-transparent', 'hover:bg-muted/50');
        }
    });
}

// --- Dropdown Rendering ---
function renderDropdown() {
    if (!diagramSwitcher) return;
    diagramSwitcher.innerHTML = '';
    diagramData.forEach(item => {
        const opt   = document.createElement('option');
        opt.value   = item.id;
        opt.textContent = item.name || item.title || item.id;
        diagramSwitcher.appendChild(opt);
    });
}

function updateActiveDropdown(id) {
    if (!diagramSwitcher) return;
    diagramSwitcher.value = id;
}

// --- Dropdown Event Listeners ---
if (diagramSwitcher) {
    diagramSwitcher.addEventListener('change', () => {
        loadDiagram(diagramSwitcher.value);
    });
}

if (switcherPrev) {
    switcherPrev.addEventListener('click', () => {
        const currentIndex = diagramData.findIndex(d => d.id === activeId);
        const prevIndex    = (currentIndex - 1 + diagramData.length) % diagramData.length;
        loadDiagram(diagramData[prevIndex].id);
    });
}

if (switcherNext) {
    switcherNext.addEventListener('click', () => {
        const currentIndex = diagramData.findIndex(d => d.id === activeId);
        const nextIndex    = (currentIndex + 1) % diagramData.length;
        loadDiagram(diagramData[nextIndex].id);
    });
}

// --- Load Content ---
async function loadDiagram(id) {
    const data = diagramData.find(d => d.id === id);
    if (!data) return;

    activeId = id;
    updateActiveSidebarItem(id);
    updateActiveDropdown(id);

    // Close mobile sidebar on selection
    if (window.innerWidth < 768 && sidebar && !sidebar.classList.contains('-translate-x-full')) {
        toggleSidebar();
    }

    // 1. Fetch and render Markdown
    try {
        markdownContent.innerHTML = `<div class="text-muted-foreground text-sm">Loading documentation...</div>`;
        const mdResponse = await fetch(data.markdown);
        if (!mdResponse.ok) throw new Error(`HTTP ${mdResponse.status}`);
        const mdText = await mdResponse.text();
        markdownContent.innerHTML = md.render(mdText);
    } catch (error) {
        markdownContent.innerHTML = `<div class="text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20 text-sm">Failed to load markdown from <code>${data.markdown}</code>.</div>`;
    }

    // 2. Load SVG via <object> tag
    try {
        if (panZoomInstance) {
            panZoomInstance.destroy();
            panZoomInstance = null;
        }

        wrapper.innerHTML       = `<div class="text-muted-foreground mt-20 text-center">Loading diagram...</div>`;
        wrapper.style.transform = '';
        wrapper.className       = 'w-full h-full';

        const obj     = document.createElement('object');
        obj.type      = 'image/svg+xml';
        obj.data      = data.svgPath;
        obj.className = 'w-full h-full';

        obj.onload = function () {
            try {
                const svgDoc  = obj.contentDocument || obj.contentWindow.document;
                const svgNode = svgDoc.querySelector('svg');
                if (!svgNode) throw new Error('Could not find <svg> inside the <object>.');

                svgNode.style.width  = '100%';
                svgNode.style.height = '100%';

                panZoomInstance = window.svgPanZoom(svgNode, {
                    zoomEnabled:              true,
                    controlIconsEnabled:      false,
                    fit:                      true,
                    center:                   true,
                    minZoom:                  0.1,
                    maxZoom:                  15,
                    zoomScaleSensitivity:     0.2,
                    dblClickZoomEnabled:      true,
                    mouseWheelZoomEnabled:    true,
                    preventMouseEventsDefault: true
                });
            } catch (err) {
                console.error('PanZoom Init Error:', err);
                wrapper.innerHTML = `<div class="text-red-400 mt-20 text-center text-sm">Error initializing zoom.<br><span class="text-xs opacity-50">${err.message}</span></div>`;
            }
        };

        obj.onerror = function () {
            wrapper.innerHTML = `<div class="text-red-400 mt-20 text-center text-sm">Failed to load SVG from <br><code>${data.svgPath}</code></div>`;
        };

        wrapper.innerHTML = '';
        wrapper.appendChild(obj);

    } catch (error) {
        console.error('SVG Load Error:', error);
    }
}

// --- Global Actions ---
window.fitToPage = function () {
    if (panZoomInstance) {
        panZoomInstance.fit();
        panZoomInstance.center();
    }
};

// Start
init();