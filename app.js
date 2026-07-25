// Interactive JavaScript functionality for EcoSocietyAI Landing Page

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Theme Toggle ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Check saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
        updateThemeIcon('light');
    }

    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        const currentTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
        localStorage.setItem('theme', currentTheme);
        updateThemeIcon(currentTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'light') {
            themeToggleBtn.innerHTML = `
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
            `;
        } else {
            themeToggleBtn.innerHTML = `
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="5"></circle>
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
                </svg>
            `;
        }
    }

    // --- 2. Mobile Navigation Toggle ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    mobileNavToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });


    // --- 3. Hero Stats Counter Animation ---
    const stats = [
        { id: 'stat-co2', target: 1245000, suffix: ' kg', speed: 40 },
        { id: 'stat-societies', target: 140, suffix: '+', speed: 15 },
        { id: 'stat-saving', target: 45, suffix: '%', speed: 20 }
    ];

    stats.forEach(stat => {
        const el = document.getElementById(stat.id);
        if (!el) return;
        
        let current = 0;
        const increment = stat.target / stat.speed;
        
        const updateCounter = () => {
            current += increment;
            if (current >= stat.target) {
                el.innerText = formatNumber(stat.target) + stat.suffix;
            } else {
                el.innerText = formatNumber(Math.floor(current)) + stat.suffix;
                requestAnimationFrame(updateCounter);
            }
        };
        
        // Use IntersectionObserver to animate when visible
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                updateCounter();
                observer.unobserve(el);
            }
        }, { threshold: 0.1 });
        
        observer.observe(el);
    });

    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return num.toLocaleString('en-IN');
        }
        return num.toString();
    }


    // --- 4. Interactive Sustainability Calculator ---
    const roofInput = document.getElementById('input-roof');
    const groundInput = document.getElementById('input-ground');
    const billInput = document.getElementById('input-bill');

    const displayRoof = document.getElementById('display-roof');
    const displayGround = document.getElementById('display-ground');
    const displayBill = document.getElementById('display-bill');

    const outSolarCap = document.getElementById('out-solar-cap');
    const outSolarDesc = document.getElementById('out-solar-desc');
    const outSavings = document.getElementById('out-savings');
    const outSavingPercent = document.getElementById('out-saving-percent');
    const outRainwater = document.getElementById('out-rainwater');
    const outRainDesc = document.getElementById('out-rain-desc');
    const outCo2 = document.getElementById('out-co2');
    const outTrees = document.getElementById('out-trees');
    const outPayback = document.getElementById('out-payback');
    const paybackProgress = document.getElementById('payback-progress');

    function calculateImpact() {
        const roofArea = parseInt(roofInput.value);
        const groundArea = parseInt(groundInput.value);
        const monthlyBill = parseInt(billInput.value);

        // Update UI value displays
        displayRoof.innerText = roofArea.toLocaleString('en-IN') + ' sq.ft.';
        displayGround.innerText = groundArea.toLocaleString('en-IN') + ' sq.ft.';
        displayBill.innerText = '₹' + monthlyBill.toLocaleString('en-IN');

        // 1. Solar Capacity Estimate (1 kWp per ~100 sq.ft, capped at 500 kWp for design)
        const solarCap = Math.min(Math.round(roofArea / 110), 500);
        outSolarCap.innerText = solarCap;
        outSolarDesc.innerText = `Optimal setup for ${roofArea.toLocaleString('en-IN')} sq.ft.`;

        // 2. Solar Generation & Monthly Savings
        // 1 kWp yields approx 4 kWh/day.
        const dailyGen = solarCap * 4;
        const monthlyGen = dailyGen * 30;
        const solarCostPerKwh = 10; // ₹10 per unit grid price
        const maxOffset = 0.75; // max 75% bill offset
        
        const theoreticalSavings = monthlyGen * solarCostPerKwh;
        const actualMonthlySavings = Math.min(monthlyBill * maxOffset, theoreticalSavings);
        const annualSavings = actualMonthlySavings * 12;

        if (annualSavings >= 100000) {
            outSavings.innerText = '₹' + (annualSavings / 100000).toFixed(1) + ' Lakhs';
        } else {
            outSavings.innerText = '₹' + Math.round(annualSavings).toLocaleString('en-IN');
        }
        
        const savingPercVal = Math.round((actualMonthlySavings / monthlyBill) * 100);
        outSavingPercent.innerText = `Reduces power bill by ${savingPercVal}%`;

        // 3. Rainwater Harvesting Potential (Litres per year)
        // Rainwater Litres = Ground Area (sq.ft) * 0.0929 (sq.m) * Average Rainfall (900mm) * Run-off coefficient (0.8)
        // Litres = Ground Area * 66.8
        const annualRainwaterLitres = Math.round(groundArea * 66.8);
        if (annualRainwaterLitres >= 100000) {
            outRainwater.innerText = (annualRainwaterLitres / 100000).toFixed(1) + 'L';
            outRainDesc.innerText = `Recharges local borewells`;
        } else {
            outRainwater.innerText = Math.round(annualRainwaterLitres / 1000) + 'K';
            outRainDesc.innerText = `Saves local supply water`;
        }

        // 4. CO2 Offset (Tons per year)
        // 1 kWh solar offsets ~0.8kg CO2.
        const annualKwhSolar = solarCap * 4 * 365;
        const co2OffsetKg = annualKwhSolar * 0.8;
        const co2OffsetTons = Math.round((co2OffsetKg / 1000) * 10) / 10;
        outCo2.innerText = co2OffsetTons;
        
        // 1 mature tree absorbs ~22kg of CO2 per year
        const treesEquivalent = Math.round(co2OffsetKg / 22);
        outTrees.innerText = `≈ ${treesEquivalent.toLocaleString('en-IN')} trees planted`;

        // 5. Payback Period Estimation
        // Solar installation cost ~ ₹50,000 per kWp.
        // Rainwater setup cost ~ ₹25 per sq.ft.
        const capExSolar = solarCap * 45000;
        const capExRain = groundArea * 25;
        const totalCapEx = capExSolar + capExRain;

        let paybackYears = 3.0; // default minimum
        if (annualSavings > 0) {
            paybackYears = totalCapEx / annualSavings;
        }
        
        // Bound payback for realistic visual presentation
        paybackYears = Math.max(2.5, Math.min(8.5, paybackYears));
        outPayback.innerText = paybackYears.toFixed(1) + ' Years';

        // Update progress bar (shorter payback = fuller bar, since it is a better ROI score)
        // Let's say 2.5 years = 100% progress, 8.5 years = 20% progress
        const roiProgress = 100 - ((paybackYears - 2.5) / (8.5 - 2.5)) * 80;
        paybackProgress.style.width = roiProgress + '%';
    }

    // Attach listeners
    [roofInput, groundInput, billInput].forEach(input => {
        input.addEventListener('input', calculateImpact);
    });

    // Run initial calculation
    calculateImpact();


    // --- 5. Dashboard Interactive Tab Selector ---
    const sidebarButtons = document.querySelectorAll('.sidebar-menu-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    sidebarButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all sidebar buttons
            sidebarButtons.forEach(b => b.classList.remove('active'));
            // Add active to current
            btn.classList.add('active');

            // Hide all tab panes
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Show corresponding tab pane
            const targetTab = btn.getAttribute('data-tab');
            const targetPane = document.getElementById(targetTab);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });


    // --- 6. Vendor Marketplace Filter ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const marketCards = document.querySelectorAll('.market-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all filter buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active to current
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            marketCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});
