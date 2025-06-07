function ttv() {
    window.location.href="";
}
function yt(){
    window.location.href="";
}
function openIpaLib(){
    window.location.href="https://ipa-apps.me/";
}
function openHakzuLib(){
    window.location.href="Hakzu-Ipalibrary.html";
}

function openHakzuGitHub(){
    window.location.href="https://github.com/Hakzu/ipa-library";
}

function tv() {
    window.location.href="https://twitch.tv/osutabletuser";
}

let ipaLibraryData = null;

// Load and display IPA library data
async function loadIPALibrary() {
    try {
        const response = await fetch('Hakzu-IPALibrary.json');
        ipaLibraryData = await response.json();
        displayCategories();
    } catch (error) {
        console.error('Error loading IPA library data:', error);
    }
}

function createAppCard(app) {
    return `
        <div class="app-card">
            <div class="app-icon-wrapper">
                <img src="${app.icon}" class="app-icon" alt="${app.name}">
            </div>
            <div class="app-info">
                <h4 class="app-name">${app.name}</h4>
                <p class="app-description">${app.description}</p>
                <div class="app-details">
                    <span class="app-version">v${app.version}</span>
                    <span class="app-size">${app.size}</span>
                </div>
            </div>
            <button onclick="downloadApp('${app.downloadUrl}')" class="app-button">
                <span>DOWNLOAD</span>
            </button>
        </div>
    `;
}



function displayCategories() {
    if (!ipaLibraryData) return;

    const categoriesContainer = document.getElementById('categoriesContainer');
    if (!categoriesContainer) return;

    let categoriesHTML = '';

    ipaLibraryData.categories.forEach(category => {
        categoriesHTML += `
            <section class="content-section">
                <h3 class="section-title">
                    <span class="title-icon">${category.icon}</span>
                    ${category.name}
                </h3>
                <div class="app-grid">
        `;

        category.apps.forEach(app => {
            categoriesHTML += createAppCard(app);
        });

        categoriesHTML += `
                </div>
            </section>
        `;
    });

    categoriesContainer.innerHTML = categoriesHTML;
}

function searchApps() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase();

    if (!ipaLibraryData) return;

    // Filter apps based on search term
    const filteredApps = [];
    ipaLibraryData.categories.forEach(category => {
        category.apps.forEach(app => {
            if (app.name.toLowerCase().includes(searchTerm) || 
                app.description.toLowerCase().includes(searchTerm)) {
                filteredApps.push(app);
            }
        });
    });

    // Display filtered results
    displaySearchResults(filteredApps);
}

function displaySearchResults(apps) {
    const categoriesContainer = document.getElementById('categoriesContainer');
    if (!categoriesContainer) return;

    let searchResultsHTML = `
        <section class="content-section">
            <h3 class="section-title">
                <span class="title-icon">ð</span>
                Search Results (${apps.length})
            </h3>
            <div class="app-grid">
    `;

    apps.forEach(app => {
        searchResultsHTML += createAppCard(app);
    });

    searchResultsHTML += `
            </div>
        </section>
    `;

    categoriesContainer.innerHTML = searchResultsHTML;
}

function downloadApp(downloadUrl) {
    if (downloadUrl) {
        window.open(downloadUrl, '_blank');
    } else {
        alert('Download link not available');
    }
}

// Add enhanced interactions and animations for v2.5
document.addEventListener('DOMContentLoaded', function() {
    // Load IPA library data on page load
    if (window.location.pathname.includes('Hakzu-Ipalibrary.html')) {
        loadIPALibrary();
    }

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchApps();
            }
        });

        // Real-time search as user types with debouncing
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchApps();
            }, 300);
        });
    }

    // Add parallax effect to hero section
    window.addEventListener('scroll', function() {
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            const scrolled = window.pageYOffset;
            heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Add loading animation for app cards
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            }
        });
    });

    // Observe all app cards
    setTimeout(() => {
        const appCards = document.querySelectorAll('.app-card');
        appCards.forEach(card => observer.observe(card));
    }, 100);

    // Add ripple effect to buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('app-button') || e.target.closest('.app-button')) {
            const button = e.target.classList.contains('app-button') ? e.target : e.target.closest('.app-button');
            createRipple(e, button);
        }
    });
});

function createRipple(event, button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    `;

    // Add ripple animation CSS if not exists
    if (!document.getElementById('ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
}
