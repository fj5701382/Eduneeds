/* =========================================================
   Eduneeds — COMPONENTS
   Navbar and Sidebar builders
   ========================================================= */

// =========================================
// 1. NAVBAR HTML
// =========================================

function getNavbarHTML() {
    return `
        <nav class="top-navbar">
            <div class="top-navbar-inner">
                <div class="brand">
                    <button class="hamburger-btn" id="hamburgerBtn" aria-label="Toggle menu">
                        <span class="material-symbols-outlined">menu</span>
                    </button>
                    <span class="brand-name">Eduneeds</span>
                </div>

                <div class="search-wrapper">
                    <span class="material-symbols-outlined search-icon">search</span>
                    <input class="search-input" placeholder="Search services..." type="text" />
                </div>

                <div class="nav-actions">
                    <button class="icon-btn theme-toggle" aria-label="Toggle theme">
                        <span class="material-symbols-outlined theme-icon">dark_mode</span>
                    </button>
                    <button class="icon-btn" aria-label="Notifications">
                        <span class="material-symbols-outlined">notifications</span>
                        <span class="notification-dot"></span>
                    </button>
                    <button class="icon-btn hidden-mobile" aria-label="Help">
                        <span class="material-symbols-outlined">help</span>
                    </button>
                    <div class="user-menu" id="userMenu">
                        <button class="user-btn" id="userBtn">
                            <div class="user-info">
                                <span class="user-name">John Doe</span>
                                <span class="user-role">Profile</span>
                            </div>
                            <div class="user-avatar">JD</div>
                            <span class="material-symbols-outlined user-caret">expand_more</span>
                        </button>
                        <div class="user-dropdown" id="userDropdown">
                            <a href="../services/profile.html">
                                <span class="material-symbols-outlined">account_circle</span>
                                Profile
                            </a>
                            <a href="../services/wallet.html">
                                <span class="material-symbols-outlined">wallet</span>
                                Wallet
                            </a>
                            <hr />
                            <a href="../pages/login.html" class="logout">
                                <span class="material-symbols-outlined">logout</span>
                                Sign Out
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    `;
}

// =========================================
// 2. SIDEBAR HTML
// =========================================

function getSidebarHTML() {
    return `
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <div class="sidebar-brand">
                    <div class="brand-icon">G</div>
                    <span class="brand-text">Solution</span>
                </div>
                <button class="sidebar-close" id="sidebarClose">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>

            <nav class="sidebar-nav">

                <!-- Dropdown 1: Scratch Cards / Result Services -->
                <div class="nav-dropdown">
                    <button class="nav-dropdown-toggle">
                        <div class="nav-dropdown-label">
                            <span class="material-symbols-outlined">credit_card</span>
                            <span>Scratch Cards / Result Services</span>
                        </div>
                        <span class="material-symbols-outlined dropdown-arrow">expand_more</span>
                    </button>
                    <div class="nav-dropdown-menu">
                        <a href="../services/product-detail.html?service=nabteb-alevel">NABTEB Nov/Dec A-Level</a>
                        <a href="../services/product-detail.html?service=nabteb-olevel">NABTEB Nov/Dec O-Level</a>
                        <a href="../services/product-detail.html?service=nabteb-scratch">NABTEB Scratch Card</a>
                        <a href="../services/product-detail.html?service=nbais-scratch">NBAIS Scratch Card</a>
                        <a href="../services/product-detail.html?service=neco-token">NECO Result Token</a>
                        <a href="../services/product-detail.html?service=neco-verification">NECO Result Verification PIN</a>
                        <a href="../services/product-detail.html?service=waec-gce">WAEC GCE Registration PIN</a>
                        <a href="../services/product-detail.html?service=waec-scratch">WAEC Scratch Card</a>
                        <a href="../services/product-detail.html?service=waec-verification">WAEC Verification PIN NYSC</a>
                    </div>
                </div>

                <!-- Dropdown 2: JAMB Services -->
                <div class="nav-dropdown">
                    <button class="nav-dropdown-toggle">
                        <div class="nav-dropdown-label">
                            <span class="material-symbols-outlined">school</span>
                            <span>JAMB Services</span>
                        </div>
                        <span class="material-symbols-outlined dropdown-arrow">expand_more</span>
                    </button>
                    <div class="nav-dropdown-menu">
                        <a href="../services/jamb-admission-picture.html">Admission Letter with Picture</a>
                        <a href="../services/jamb-admission-status.html">Check Admission Status</a>
                        <a href="../services/jamb-admission-letter.html">JAMB Admission Letter</a>
                        <a href="../services/jamb-change-course.html">JAMB Change of Course</a>
                        <a href="../services/jamb-original-result.html">JAMB Original Result</a>
                        <a href="../services/jamb-reprinting.html">JAMB Reprinting Services</a>
                        <a href="../services/jamb-olevel-confirmation.html">O'Level Confirmation</a>
                        <a href="../services/jamb-profile-code.html">Retrieve JAMB Profile Code</a>
                        <a href="../services/jamb-reg-number.html">Retrieve JAMB Registration Number</a>
                    </div>
                </div>

                <!-- Dropdown 3: JAMB PIN Vending -->
                <div class="nav-dropdown">
                    <button class="nav-dropdown-toggle">
                        <div class="nav-dropdown-label">
                            <span class="material-symbols-outlined">vpn_key</span>
                            <span>JAMB PIN Vending</span>
                        </div>
                        <span class="material-symbols-outlined dropdown-arrow">expand_more</span>
                    </button>
                    <div class="nav-dropdown-menu">
                        <a href="../services/jamb-pins.html">Buy DE PIN</a>
                        <a href="../services/jamb-pins.html">Buy Mock Only</a>
                        <a href="../services/jamb-pins.html">Buy UTME PIN Only</a>
                        <a href="../services/jamb-pins.html">Buy UTME With Mock</a>
                    </div>
                </div>

                <!-- Dropdown 4: NIN / BVN -->
                <div class="nav-dropdown">
                    <button class="nav-dropdown-toggle">
                        <div class="nav-dropdown-label">
                            <span class="material-symbols-outlined">badge</span>
                            <span>NIN / BVN</span>
                        </div>
                        <span class="material-symbols-outlined dropdown-arrow">expand_more</span>
                    </button>
                    <div class="nav-dropdown-menu">
                        <a href="../services/nin-bvn.html">NIN Verification</a>
                        <a href="../services/nin-bvn.html">BVN Verification</a>
                    </div>
                </div>

                <!-- Dropdown 5: Other Services -->
                <div class="nav-dropdown">
                    <button class="nav-dropdown-toggle">
                        <div class="nav-dropdown-label">
                            <span class="material-symbols-outlined">grid_view</span>
                            <span>Other Services</span>
                        </div>
                        <span class="material-symbols-outlined dropdown-arrow">expand_more</span>
                    </button>
                    <div class="nav-dropdown-menu">
                        <a href="../services/buy-airtime.html">Buy Airtime</a>
                        <a href="../services/buy-data.html">Buy Data Subscription</a>
                        <a href="../services/electricity.html">Electricity Bills</a>
                        <a href="../services/tv-subscription.html">TV Subscriptions</a>
                        <a href="../services/transaction-history.html">Transaction History</a>
                        <a href="../contact.html">Customer Support</a>
                    </div>
                </div>

            </nav>

            <div class="sidebar-footer">
                <a href="../contact.html">
                    <span class="material-symbols-outlined">support_agent</span>
                    <span>Support</span>
                </a>
            </div>
        </aside>

        <div class="mobile-overlay" id="mobileOverlay"></div>
    `;
}

// =========================================
// 3. LOAD COMPONENTS
// =========================================

function loadComponents() {
    // Load Navbar
    var navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
        navbarContainer.innerHTML = getNavbarHTML();
    }

    // Load Sidebar
    var sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        sidebarContainer.innerHTML = getSidebarHTML();
    }

    // Dispatch event to notify components are loaded
    var event = new Event('componentsLoaded');
    document.dispatchEvent(event);

    // Also call re-init directly as fallback
    if (typeof window.reInitEduneeds === 'function') {
        setTimeout(function() {
            window.reInitEduneeds();
        }, 50);
    }
}

// =========================================
// 4. AUTO-LOAD
// =========================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadComponents);
} else {
    loadComponents();
}