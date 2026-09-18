document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Navigation Scroll & Active Page Tracking
       ========================================================================== */
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');

    // Sticky Header effect on scroll across all pages
    if (header) {
        const handleHeaderScroll = () => {
            if (window.scrollY > 30) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleHeaderScroll, { passive: true });
        handleHeaderScroll(); // Initialize state immediately on page load
    }

    // Multi-page active link detection based on filename
    const currentPath = window.location.pathname;
    const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (currentPage === linkHref || (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Highlight Utilities dropdown trigger if child link is active
    const activeDropdownItem = document.querySelector('.nav-dropdown-menu a.active');
    const navDropdown = document.querySelector('.nav-dropdown');
    if (navDropdown) {
        if (activeDropdownItem) {
            navDropdown.classList.add('active');
        } else {
            navDropdown.classList.remove('active');
        }
    }

    /* ==========================================================================
       2. Mobile Navigation Toggle
       ========================================================================== */
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            mobileMenuToggle.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
        });

        // Close mobile menu when links are clicked
        document.querySelectorAll('.mobile-nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                mobileMenuToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Mobile Utilities Dropdown Accordion Toggle
        const mobileDropdownTriggers = document.querySelectorAll('.mobile-dropdown-trigger, .mobile-nav-group .mobile-nav-label');
        mobileDropdownTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const parentDropdown = trigger.closest('.mobile-dropdown, .mobile-nav-group');
                if (parentDropdown) {
                    const isOpen = parentDropdown.classList.toggle('open');
                    trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                }
            });
        });

        // Auto-expand mobile dropdown if currently on a utility subpage
        const activeSubLink = document.querySelector('.mobile-dropdown-menu a.active, .mobile-nav-group a.active');
        if (activeSubLink) {
            const parentDropdown = activeSubLink.closest('.mobile-dropdown, .mobile-nav-group');
            if (parentDropdown) {
                parentDropdown.classList.add('open');
                const trigger = parentDropdown.querySelector('.mobile-dropdown-trigger, .mobile-nav-label');
                if (trigger) trigger.setAttribute('aria-expanded', 'true');
            }
        }
    }

    /* ==========================================================================
       Back to Top Floating Action
       ========================================================================== */
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        const handleBackToTopScroll = () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        };

        window.addEventListener('scroll', handleBackToTopScroll, { passive: true });
        handleBackToTopScroll();

        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ==========================================================================
       3. Dynamic Product Catalog & Filtering System
       ========================================================================== */
    const catalogGrid = document.getElementById('catalogGrid');
    const resultsCounter = document.getElementById('resultsCounter');
    const clearAllFiltersBtn = document.getElementById('clearAllFilters');

    // 12 realistic products covering all other architectural categories
    const BASE_PRODUCTS = [];

    // Check if external MOSAIC_CATALOG_DATA is loaded (from mosaic-data.js), otherwise fall back to default list
    const mosaicItems = typeof MOSAIC_CATALOG_DATA !== 'undefined' ? MOSAIC_CATALOG_DATA : [
        {
            id: "mos-1",
            name: "Pixel Square Black Mosaic (G/M0149)",
            category: "mosaic",
            categoryLabel: "Mosaic Tiles",
            size: "300x300 mm",
            sizeLabel: "300x300 MM",
            color: "black",
            colorLabel: "Glossy & Matt Black",
            finish: "polished",
            finishLabel: "Glossy",
            look: "mosaic",
            lookLabel: "Mosaic / Artistic",
            pattern: "Square (23x23mm)",
            image: "assets/tile-slate.jpg",
            description: "Classic square mesh-backed mosaic sheet from our Modern Artistry series, featuring 23x23mm chips."
        },
        {
            id: "mos-2",
            name: "Pixel Square White Mosaic (G/M0151)",
            category: "mosaic",
            categoryLabel: "Mosaic Tiles",
            size: "300x300 mm",
            sizeLabel: "300x300 MM",
            color: "white",
            colorLabel: "Glossy & Matt White",
            finish: "polished",
            finishLabel: "Glossy",
            look: "mosaic",
            lookLabel: "Mosaic / Artistic",
            pattern: "Square (23x23mm)",
            image: "assets/tile-marble.jpg",
            description: "Minimalist pure white square glass mosaic sheets with clean lines for kitchen splashbacks."
        },
        {
            id: "mos-3",
            name: "Pixel Modular Checkerboard (G/MX055149)",
            category: "mosaic",
            categoryLabel: "Mosaic Tiles",
            size: "298x298 mm",
            sizeLabel: "298x298 MM",
            color: "mixed",
            colorLabel: "Checkerboard Black & White",
            finish: "polished",
            finishLabel: "Glossy",
            look: "mosaic",
            lookLabel: "Mosaic / Artistic",
            pattern: "Modular Square",
            image: "assets/tile-slate.jpg",
            description: "Modular square mosaic sheets combining 23x23mm and 48x48mm chips for an impressive checkerboard look."
        },
        {
            id: "mos-4",
            name: "Pixel Square Charcoal Mosaic (M0449)",
            category: "mosaic",
            categoryLabel: "Mosaic Tiles",
            size: "306x306 mm",
            sizeLabel: "306x306 MM",
            color: "black",
            colorLabel: "Matt Charcoal Black",
            finish: "matt",
            finishLabel: "Matt",
            look: "mosaic",
            lookLabel: "Mosaic / Artistic",
            pattern: "Square (100x100mm)",
            image: "assets/tile-slate.jpg",
            description: "Bold large-format square mosaic chips (100x100mm) on mesh sheets, delivering massive patterns in matt black."
        },
        {
            id: "mos-5",
            name: "Pixel Stack Bone Black (G/M0649)",
            category: "mosaic",
            categoryLabel: "Mosaic Tiles",
            size: "298x300 mm",
            sizeLabel: "298x300 MM",
            color: "black",
            colorLabel: "Glossy & Matt Stacked Black",
            finish: "matt",
            finishLabel: "Matt",
            look: "mosaic",
            lookLabel: "Mosaic / Artistic",
            pattern: "Stack Bone (23x48mm)",
            image: "assets/tile-slate.jpg",
            description: "Stacked rectangular brick patterns (23x48mm chips) on mesh-backed sheets, ideal for creative wall accents."
        },
        {
            id: "mos-6",
            name: "Pixel Brick Bone White (G/M0651)",
            category: "mosaic",
            categoryLabel: "Mosaic Tiles",
            size: "274x298 mm",
            sizeLabel: "274x298 MM",
            color: "white",
            colorLabel: "Glossy & Matt Brick White",
            finish: "polished",
            finishLabel: "Glossy",
            look: "mosaic",
            lookLabel: "Mosaic / Artistic",
            pattern: "Brick Bone (23x48mm)",
            image: "assets/tile-marble.jpg",
            description: "Elegant offset brick pattern mosaic tile sheets (23x48mm chips), perfect for bright kitchen backsplashes."
        },
        {
            id: "mos-7",
            name: "Pixel Herringbone White (G/M0751)",
            category: "mosaic",
            categoryLabel: "Mosaic Tiles",
            size: "282x315 mm",
            sizeLabel: "282x315 MM",
            color: "white",
            colorLabel: "Herringbone Glossy White",
            finish: "polished",
            finishLabel: "Glossy",
            look: "mosaic",
            lookLabel: "Mosaic / Artistic",
            pattern: "Herringbone (23x73mm)",
            image: "assets/tile-marble.jpg",
            description: "Masterfully crafted white herringbone patterned mosaic sheets (23x73mm chips) for a perfect architectural look."
        },
        {
            id: "mos-8",
            name: "Pixel Herringbone Black (G/M0749)",
            category: "mosaic",
            categoryLabel: "Mosaic Tiles",
            size: "282x315 mm",
            sizeLabel: "282x315 MM",
            color: "black",
            colorLabel: "Herringbone Matt Black",
            finish: "matt",
            finishLabel: "Matt",
            look: "mosaic",
            lookLabel: "Mosaic / Artistic",
            image: "assets/tile-slate.jpg",
            description: "High-contrast matt black herringbone patterned mosaic sheets (23x73mm chips) for classical walls."
        }
    ];

    function getVariantLabelFromPath(path, fallbackName) {
        if (!path) return fallbackName;
        let name = path.split('/').pop();
        name = name.substring(0, name.lastIndexOf('.'));
        name = name.replace(/30\s*X\s*90\s*CM/gi, '')
                  .replace(/30\s*X\s*90/gi, '')
                  .replace(/20\s*X\s*20\s*CM/gi, '')
                  .replace(/20\s*X\s*20/gi, '')
                  .replace(/GLOSSY FINISH/gi, '')
                  .replace(/SUPER GLOSSY FINISH/gi, '')
                  .replace(/SATIN FINISH/gi, '')
                  .replace(/RAIN DROP FINISH/gi, '')
                  .replace(/MATT FINISH/gi, '')
                  .replace(/GLUE FINISH/gi, '')
                  .replace(/FINISH/gi, '')
                  .replace(/\s+/g, ' ')
                  .trim();
        return name || fallbackName;
    }

    function deriveColorFromPath(path) {
        const p = path.toLowerCase();
        
        // 1. White / Cream
        if (p.includes('bianco') || p.includes('white') || p.includes('artic') || p.includes('polar') || 
            p.includes('snow') || p.includes('frost') || p.includes('carrara') || p.includes('statuary') || 
            p.includes('calacatta') || p.includes('light') || p.includes('soft') || p.includes('shine')) {
            return { color: 'white', colorCode: 'rgba(255, 255, 255, 0.9)' };
        }
        
        // 2. Grey / Charcoal (including cool grey tiles like Arizona Cool)
        if (p.includes('grey') || p.includes('gray') || p.includes('gris') || p.includes('ash') || 
            p.includes('smoke') || p.includes('silver') || p.includes('iron') || p.includes('welkin') || 
            p.includes('graphite') || p.includes('charcoal') || p.includes('anthracite') || p.includes('slate') || 
            p.includes('cemento') || p.includes('cement') || p.includes('basalt') || p.includes('stone') ||
            p.includes('fume') || p.includes('dusk') || p.includes('cool')) {
            return { color: 'grey', colorCode: '#8E9AA6' };
        }
        
        // 3. Black
        if (p.includes('black') || p.includes('nero') || p.includes('dark') || p.includes('obsidian')) {
            return { color: 'black', colorCode: '#1A1A1A' };
        }
        
        // 4. Beige / Brown (including warm tiles like Arizona Warn and Armani Glory)
        if (p.includes('crema') || p.includes('cream') || p.includes('beige') || p.includes('sand') || 
            p.includes('latte') || p.includes('almond') || p.includes('timber') || p.includes('gold') || 
            p.includes('choco') || p.includes('mocha') || p.includes('soil') || p.includes('brown') || 
            p.includes('rust') || p.includes('hazel') || p.includes('walnut') || p.includes('amber') || 
            p.includes('warn') || p.includes('warm') || p.includes('bronze') || p.includes('coffee') || 
            p.includes('desert') || p.includes('sandel') || p.includes('wood') || p.includes('travertine') ||
            p.includes('roast') || p.includes('glory') || p.includes('mink')) {
            return { color: 'beige', colorCode: '#D7C4A5' };
        }
        
        // 5. Blue / Green
        if (p.includes('blue') || p.includes('azul') || p.includes('teal') || p.includes('verde') || 
            p.includes('laurel') || p.includes('sky') || p.includes('lagoon') || p.includes('oceanic') || 
            p.includes('sea') || p.includes('amazonite') || p.includes('mint') || p.includes('emerald') || 
            p.includes('turquoise') || p.includes('aqua')) {
            return { color: 'blue-green', colorCode: '#4A7C7A' };
        }
        
        return { color: 'mixed', colorCode: '#BCB1A1' };
    }

    const rawPlank30x90Items = typeof PLANK_30X90_DATA !== 'undefined' ? PLANK_30X90_DATA : [];
    const plank30x90Items = rawPlank30x90Items.map(p => {
        const mappedVariants = (p.variants || []).map(v => {
            const derivedColor = deriveColorFromPath(v.image);
            return {
                ...v,
                color: derivedColor.color,
                colorCode: derivedColor.colorCode,
                label: getVariantLabelFromPath(v.image, p.name)
            };
        });

        let derivedFinish = 'polished';
        let derivedFinishLabel = 'Glossy';
        if (mappedVariants.length > 0) {
            const firstImg = mappedVariants[0].image.toLowerCase();
            if (firstImg.includes('satin')) {
                derivedFinish = 'satin';
                derivedFinishLabel = 'Satin Matt';
            } else if (firstImg.includes('rain drop')) {
                derivedFinish = 'textured';
                derivedFinishLabel = 'Rain Drop Finish';
            } else if (firstImg.includes('super glossy')) {
                derivedFinish = 'polished';
                derivedFinishLabel = 'Super Glossy';
            }
        }

        const firstVariantImage = mappedVariants.length > 0 ? mappedVariants[0].image : '';
        const previewImg = p.previewImage || p.image || firstVariantImage;
        const defaultCardImg = firstVariantImage || p.image || '';

        return {
            ...p,
            image: defaultCardImg,
            previewImage: previewImg,
            category: 'ceramic-wall',
            categoryLabel: 'Ceramic Wall',
            size: '30x90 cm',
            sizeLabel: '30X90 CM',
            look: p.name.toLowerCase().includes('timber') ? 'wood' : 
                  (p.name.toLowerCase().includes('cemento') ? 'cement' : 
                  (p.name.toLowerCase().includes('stone') || p.name.toLowerCase().includes('basalt') || p.name.toLowerCase().includes('lithic') ? 'stone' : 'marble')),
            lookLabel: p.name.toLowerCase().includes('timber') ? 'Wood Look' : 
                       (p.name.toLowerCase().includes('cemento') ? 'Cement Look' : 
                       (p.name.toLowerCase().includes('stone') || p.name.toLowerCase().includes('basalt') || p.name.toLowerCase().includes('lithic') ? 'Stone Look' : 'Marble Look')),
            finish: derivedFinish,
            finishLabel: derivedFinishLabel,
            variants: mappedVariants,
            description: p.description || `Premium ${derivedFinishLabel.toLowerCase()} finish vitrified wall plank tile in format 300x900 mm.`
        };
    });

    const rawPlank20x20Items = typeof PLANK_20X20_DATA !== 'undefined' ? PLANK_20X20_DATA : [];
    const plank20x20Items = rawPlank20x20Items.map(p => {
        const mappedVariants = (p.variants || []).map(v => {
            const derivedColor = deriveColorFromPath(v.image);
            return {
                ...v,
                color: derivedColor.color,
                colorCode: derivedColor.colorCode,
                label: getVariantLabelFromPath(v.image, p.name)
            };
        });

        let derivedFinish = 'matt';
        let derivedFinishLabel = 'Matt Finish';
        if (mappedVariants.length > 0) {
            const firstImg = mappedVariants[0].image.toLowerCase();
            if (firstImg.includes('glue')) {
                derivedFinish = 'textured';
                derivedFinishLabel = 'Glue Finish';
            } else if (firstImg.includes('glossy')) {
                derivedFinish = 'polished';
                derivedFinishLabel = 'Glossy';
            }
        }

        const nameLower = p.name.toLowerCase();
        let derivedLook = 'stone';
        let derivedLookLabel = 'Stone Look';
        if (nameLower.includes('zellige') || nameLower.includes('flore') || nameLower.includes('leaves') || nameLower.includes('nights') || nameLower.includes('star') || nameLower.includes('blog') || nameLower.includes('celestial') || nameLower.includes('fluid')) {
            derivedLook = 'subway';
            derivedLookLabel = 'Subway / Artistic';
        } else if (nameLower.includes('crystal') || nameLower.includes('glint') || nameLower.includes('martin') || nameLower.includes('fuji')) {
            derivedLook = 'marble';
            derivedLookLabel = 'Marble Look';
        }

        const firstVariantImage = mappedVariants.length > 0 ? mappedVariants[0].image : '';
        const previewImg = p.previewImage || p.image || firstVariantImage;
        const defaultCardImg = firstVariantImage || p.image || '';

        return {
            ...p,
            image: defaultCardImg,
            previewImage: previewImg,
            category: 'porcelain-subway',
            categoryLabel: 'Porcelain Subway',
            size: '20x20 cm',
            sizeLabel: '20X20 CM',
            look: derivedLook,
            lookLabel: derivedLookLabel,
            finish: derivedFinish,
            finishLabel: derivedFinishLabel,
            variants: mappedVariants,
            description: p.description || `Premium ${derivedFinishLabel.toLowerCase()} porcelain square tile in format 200x200 mm.`
        };
    });

    const woodItems = typeof WOOD_CATALOG_DATA !== 'undefined' ? WOOD_CATALOG_DATA : BASE_PRODUCTS.filter(p => p.category === 'wooden-planks');
    const baseFiltered = BASE_PRODUCTS.filter(p => p.category !== 'wooden-planks');
    const plank15x90Items = typeof PLANK_15X90_DATA !== 'undefined' ? PLANK_15X90_DATA : [];
    const plankSlabsItems = typeof PLANK_SLABS_DATA !== 'undefined' ? PLANK_SLABS_DATA : [];
    const plank25x50Items = typeof PLANK_25X50_DATA !== 'undefined' ? PLANK_25X50_DATA : [];
    const plank20x60Items = typeof PLANK_20X60_DATA !== 'undefined' ? PLANK_20X60_DATA : [];
    const plank60x120Items = typeof PLANK_60X120_DATA !== 'undefined' ? PLANK_60X120_DATA : [];
    const porcelainDualItems = typeof PORCELAIN_60X60_60X120_DATA !== 'undefined' ? PORCELAIN_60X60_60X120_DATA : [];
    const subwayItems = typeof SUBWAY_CATALOG_DATA !== 'undefined' ? SUBWAY_CATALOG_DATA : [];
    const rawProducts = baseFiltered.concat(woodItems).concat(mosaicItems).concat(plank30x90Items).concat(plank20x20Items).concat(plank15x90Items).concat(plankSlabsItems).concat(plank25x50Items).concat(plank20x60Items).concat(plank60x120Items).concat(porcelainDualItems).concat(subwayItems);

    function convertSizeToCm(sizeStr) {
        if (!sizeStr) return "";
        if (sizeStr.includes("/")) {
            const parts = sizeStr.split("/").map(s => s.toLowerCase().replace(/cm/g, "").replace(/mm/g, "").replace(/\s+/g, "").trim());
            return parts.map(p => p.toUpperCase()).join(" / ") + " CM";
        }
        let clean = sizeStr.toLowerCase().trim();
        if (clean.includes("cm")) {
            return clean.replace(/cm/g, "").replace(/\s+/g, "").toUpperCase() + " CM";
        }
        clean = clean.replace(/mm/g, "").replace(/\s+/g, "");
        const parts = clean.split('x');
        if (parts.length === 2) {
            const w = parseFloat(parts[0]);
            const h = parseFloat(parts[1]);
            if (!isNaN(w) && !isNaN(h)) {
                const wCm = w / 10;
                const hCm = h / 10;
                return `${wCm}x${hCm} CM`;
            }
        }
        return sizeStr.toUpperCase();
    }

    function getSizeBucket(sizeStr) {
        const s = (sizeStr || '').toLowerCase();
        if (s.includes('60x120') || s.includes('60x60')) return '60x120';
        if (s.includes('30x90')) return '30x90';
        if (s.includes('120x120') || s.includes('100x100') || s.includes('120x240') || s.includes('80x160') || s.includes('slab')) return 'slabs';
        if (s.includes('20x20')) return '20x20';
        if (s.includes('7.5x30') || s.includes('10x30') || s.includes('7.5x15') || s.includes('10x20')) return 'subway';
        if (s.includes('15x90') || s.includes('20x100') || s.includes('20x120') || s.includes('wood')) return 'wood-planks';
        if (s.includes('mosaic') || s.includes('30x30') || s.includes('300x300')) return 'mosaic';
        if (s.includes('20x60')) return '20x60';
        if (s.includes('25x50')) return '25x50';
        return 'other';
    }

    const COLORFUL_KEYWORDS = [
        'azul', 'aqua', 'blue', 'green', 'verde', 'teal', 'emerald', 'gold', 'golden', 
        'onyx', 'botanic', 'ocean', 'flore', 'leaves', 'autumn', 'celestial', 'zellige', 
        'amber', 'bronze', 'copper', 'rose', 'decor', 'decore', 'artistic', 'rain drop', 
        'sugar', 'carving', 'high glossy', 'lux', 'digi matt', 'atrovel', 'satin'
    ];

    function getProductPriorityScore(p) {
        let score = 0;
        const nameLower = (p.name || '').toLowerCase();
        const finishLower = (p.finish || '').toLowerCase() + ' ' + (p.finishLabel || '').toLowerCase();
        const sizeStr = (p.size || '').toLowerCase();

        // Finish uniqueness bonus
        if (finishLower.includes('lux') || finishLower.includes('high glossy') || finishLower.includes('high-glossy')) {
            score += 35;
        } else if (finishLower.includes('carving') || finishLower.includes('textured') || finishLower.includes('rain drop')) {
            score += 30;
        } else if (finishLower.includes('digi-matt') || finishLower.includes('digi matt') || finishLower.includes('baby satin') || finishLower.includes('shape') || finishLower.includes('glue')) {
            score += 28;
        } else if (finishLower.includes('satin') || finishLower.includes('punch')) {
            score += 20;
        } else if (finishLower.includes('polished') || finishLower.includes('glossy')) {
            score += 15;
        }

        // Colorfulness & decor bonus in name or finish
        for (const kw of COLORFUL_KEYWORDS) {
            if (nameLower.includes(kw) || finishLower.includes(kw)) {
                score += 15;
                break;
            }
        }

        // Check variant image names for decor / rich colors
        const variants = p.variants || [];
        for (const v of variants) {
            const imgStr = (v.image || '').toLowerCase();
            if (imgStr.includes('decor') || imgStr.includes('decore') || imgStr.includes('blue') || imgStr.includes('green') || imgStr.includes('teal') || imgStr.includes('gold') || imgStr.includes('aqua') || imgStr.includes('verde')) {
                score += 10;
                break;
            }
        }

        // Format priority boost for 60x120, 30x90, 20x20
        if (sizeStr.includes('60x120') || sizeStr.includes('60x60')) {
            score += 25;
        } else if (sizeStr.includes('30x90')) {
            score += 25;
        } else if (sizeStr.includes('20x20')) {
            score += 22;
        } else if (sizeStr.includes('120x120') || sizeStr.includes('100x100') || sizeStr.includes('slab')) {
            score += 12;
        }

        return score;
    }

    function sortBucketItems(items) {
        return items.slice().sort((a, b) => getProductPriorityScore(b) - getProductPriorityScore(a));
    }

    function balanceProducts(items, isSizeFiltered) {
        if (!items || items.length <= 1) return items;

        if (isSizeFiltered) {
            // Group by primary finish and round-robin across finishes
            const finishBuckets = {};
            items.forEach(p => {
                const f = (p.finish || 'other').split('/')[0].trim().toLowerCase();
                if (!finishBuckets[f]) finishBuckets[f] = [];
                finishBuckets[f].push(p);
            });

            // Sort items inside each finish bucket by priority score
            for (const f in finishBuckets) {
                finishBuckets[f] = sortBucketItems(finishBuckets[f]);
            }

            function finishOrderWeight(fk) {
                const fkL = fk.toLowerCase();
                if (fkL.includes('lux') || fkL.includes('high')) return 1;
                if (fkL.includes('carving') || fkL.includes('textured')) return 2;
                if (fkL.includes('digi') || fkL.includes('satin')) return 3;
                if (fkL.includes('glossy') || fkL.includes('polished')) return 4;
                if (fkL.includes('matt')) return 5;
                return 6;
            }

            const finishKeys = Object.keys(finishBuckets).sort((a, b) => finishOrderWeight(a) - finishOrderWeight(b));
            if (finishKeys.length <= 1) return finishKeys.length === 1 ? finishBuckets[finishKeys[0]] : items;

            const maxLen = Math.max(...finishKeys.map(k => finishBuckets[k].length));
            const balanced = [];
            for (let i = 0; i < maxLen; i++) {
                for (const k of finishKeys) {
                    if (i < finishBuckets[k].length) {
                        balanced.push(finishBuckets[k][i]);
                    }
                }
            }
            return balanced;
        } else {
            // General unfiltered view: group by size buckets
            const sizeBuckets = {};
            items.forEach(p => {
                const sb = getSizeBucket(p.size);
                const f = (p.finish || 'other').split('/')[0].trim().toLowerCase();
                if (!sizeBuckets[sb]) sizeBuckets[sb] = {};
                if (!sizeBuckets[sb][f]) sizeBuckets[sb][f] = [];
                sizeBuckets[sb][f].push(p);
            });

            // In each size bucket, sort by score and interleave finishes
            const interleavedSizeBuckets = {};
            for (const sb in sizeBuckets) {
                for (const f in sizeBuckets[sb]) {
                    sizeBuckets[sb][f] = sortBucketItems(sizeBuckets[sb][f]);
                }

                function finishSortKey(fk) {
                    const fkL = fk.toLowerCase();
                    if (fkL.includes('lux') || fkL.includes('high')) return 1;
                    if (fkL.includes('carving') || fkL.includes('textured')) return 2;
                    if (fkL.includes('digi') || fkL.includes('satin')) return 3;
                    if (fkL.includes('glossy') || fkL.includes('polished')) return 4;
                    if (fkL.includes('matt')) return 5;
                    return 6;
                }

                const fKeys = Object.keys(sizeBuckets[sb]).sort((a, b) => finishSortKey(a) - finishSortKey(b));
                const maxF = Math.max(...fKeys.map(k => sizeBuckets[sb][k].length));
                const list = [];
                for (let i = 0; i < maxF; i++) {
                    for (const k of fKeys) {
                        if (i < sizeBuckets[sb][k].length) {
                            list.push(sizeBuckets[sb][k][i]);
                        }
                    }
                }
                interleavedSizeBuckets[sb] = list;
            }

            // Weighted sequence pattern prioritizing 60x120, 30x90, 20x20 while featuring slabs, subway, wood, mosaic
            const sequencePattern = [
                '60x120', '30x90', '20x20', '60x120', 'slabs', 
                '30x90', '60x120', '20x20', 'subway', '60x120', 
                '30x90', 'wood-planks', '20x20', '60x120', 'mosaic', 
                'slabs', '30x90', '60x120', '20x60', '25x50'
            ];

            const pointers = {};
            for (const sb in interleavedSizeBuckets) {
                pointers[sb] = 0;
            }

            const balanced = [];
            const totalItems = Object.values(interleavedSizeBuckets).reduce((acc, curr) => acc + curr.length, 0);

            while (balanced.length < totalItems) {
                let progress = false;
                for (const sb of sequencePattern) {
                    if (interleavedSizeBuckets[sb] && pointers[sb] < interleavedSizeBuckets[sb].length) {
                        balanced.push(interleavedSizeBuckets[sb][pointers[sb]]);
                        pointers[sb]++;
                        progress = true;
                    }
                }
                if (!progress) {
                    for (const sb in interleavedSizeBuckets) {
                        while (pointers[sb] < interleavedSizeBuckets[sb].length) {
                            balanced.push(interleavedSizeBuckets[sb][pointers[sb]]);
                            pointers[sb]++;
                        }
                    }
                    break;
                }
            }

            return balanced;
        }
    }

    const PRODUCTS = balanceProducts(rawProducts.map(p => {
        const normalizedSize = convertSizeToCm(p.size);
        return {
            ...p,
            size: normalizedSize.toLowerCase(),
            sizeLabel: normalizedSize
        };
    }), false);

    if (catalogGrid) {
        // Track checked state of filter checkboxes
        const activeFilters = {
            category: [],
            size: [],
            look: [],
            color: [],
            finish: []
        };

        let currentPage = 1;
        let itemsPerPage = 20;

        // Lightbox Preview Modal Elements
        const imageModal = document.getElementById('image-preview-modal');
        const modalImg = document.getElementById('modal-img');
        const modalCaption = document.getElementById('preview-modal-caption');
        const modalClose = document.querySelector('.preview-modal-close');
        const modalPrevBtn = document.getElementById('modal-prev-btn');
        const modalNextBtn = document.getElementById('modal-next-btn');

        let currentProductForModal = null;
        let currentVariantIdxForModal = 0;
        let currentCardForModal = null;

        function openImageModal(product, activeVarIdx, cardElement) {
            if (!imageModal || !modalImg) return;
            currentProductForModal = product;
            currentVariantIdxForModal = activeVarIdx;
            currentCardForModal = cardElement;

            updateModalContent();
            imageModal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Lock scrolling
        }

        function updateModalContent() {
            if (!currentProductForModal) return;

            // Collect unique room previews (if any) that are not identical to variant design images
            const uniquePreviews = [];
            if (currentProductForModal.previewImage) {
                const isTileImage = currentProductForModal.variants && currentProductForModal.variants.some(v => v.image === currentProductForModal.previewImage);
                if (!isTileImage && currentProductForModal.previewImage !== currentProductForModal.image) {
                    uniquePreviews.push(currentProductForModal.previewImage);
                }
            }
            if (currentProductForModal.previews) {
                currentProductForModal.previews.forEach(pr => {
                    const isTileImage = currentProductForModal.variants && currentProductForModal.variants.some(v => v.image === pr);
                    if (!isTileImage && pr !== currentProductForModal.image && !uniquePreviews.includes(pr)) {
                        uniquePreviews.push(pr);
                    }
                });
            }
            if (currentProductForModal.variants) {
                currentProductForModal.variants.forEach(v => {
                    if (v.previewImage && v.previewImage !== v.image && !uniquePreviews.includes(v.previewImage)) {
                        uniquePreviews.push(v.previewImage);
                    }
                });
            }

            // Build all interactive items in the scroll view (variants first, then previews)
            const allItems = [];
            if (currentProductForModal.variants && currentProductForModal.variants.length > 0) {
                currentProductForModal.variants.forEach((v, idx) => {
                    allItems.push({
                        type: 'variant',
                        image: v.image,
                        label: v.label,
                        displayImg: v.image,
                        index: idx
                    });
                });
            } else {
                allItems.push({
                    type: 'product',
                    image: currentProductForModal.image,
                    label: currentProductForModal.name,
                    displayImg: currentProductForModal.image,
                    index: 0
                });
            }

            // Add preview files at the end of the scroll view list
            uniquePreviews.forEach((prevImg, prevIdx) => {
                const previewNum = uniquePreviews.length > 1 ? ` ${prevIdx + 1}` : '';
                const isCarving = (currentProductForModal.finish && currentProductForModal.finish.toLowerCase().includes('carving')) ||
                                  (currentProductForModal.finishLabel && currentProductForModal.finishLabel.toLowerCase().includes('carving')) ||
                                  (currentProductForModal.name && currentProductForModal.name.toLowerCase().includes('carving')) ||
                                  (prevImg && prevImg.toLowerCase().includes('carving'));
                const previewLabelType = isCarving ? 'Carving Effect' : 'Room Preview';
                allItems.push({
                    type: 'preview',
                    image: prevImg,
                    label: `${currentProductForModal.name} ${previewLabelType}${previewNum}`,
                    displayImg: prevImg,
                    index: (currentProductForModal.variants ? currentProductForModal.variants.length : 1) + prevIdx
                });
            });

            // Ensure index is within boundaries
            if (currentVariantIdxForModal >= allItems.length) {
                currentVariantIdxForModal = 0;
            }

            const activeItem = allItems[currentVariantIdxForModal];
            const hasMultipleItems = allItems.length > 1;

            // Show/hide navigation arrows based on total items (variants + previews)
            if (hasMultipleItems) {
                if (modalPrevBtn) modalPrevBtn.classList.remove('hidden');
                if (modalNextBtn) modalNextBtn.classList.remove('hidden');
            } else {
                if (modalPrevBtn) modalPrevBtn.classList.add('hidden');
                if (modalNextBtn) modalNextBtn.classList.add('hidden');
            }

            modalImg.src = activeItem.displayImg;
            if (modalCaption) {
                modalCaption.textContent = activeItem.label;
            }

            // Render thumbnails inside modal-variants-slider
            const sliderContainer = document.getElementById('modal-variants-slider');
            if (sliderContainer) {
                sliderContainer.innerHTML = '';
                if (hasMultipleItems) {
                    allItems.forEach((item, itemIdx) => {
                        const thumb = document.createElement('div');
                        thumb.className = `modal-variant-thumb ${itemIdx === currentVariantIdxForModal ? 'active' : ''}`;
                        thumb.title = item.label;
                        thumb.style.position = 'relative';

                        let badgeHtml = '';
                        if (item.type === 'preview') {
                            badgeHtml = `<div class="preview-badge" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.45); display: flex; align-items: center; justify-content: center; color: var(--accent); font-size: 1.1rem; transition: background 0.2s ease;"><i class="fa-solid fa-eye"></i></div>`;
                        }

                        thumb.innerHTML = `<img src="${item.image}" alt="${item.label}">${badgeHtml}`;
                        thumb.addEventListener('click', (e) => {
                            e.stopPropagation();
                            currentVariantIdxForModal = itemIdx;
                            updateModalContent();
                        });
                        sliderContainer.appendChild(thumb);
                    });
                }
            }

            // Synchronize color selection back to card ONLY if we are viewing a variant
            if (activeItem.type === 'variant' && currentCardForModal) {
                const dots = currentCardForModal.querySelectorAll('.color-dot');
                if (dots.length > currentVariantIdxForModal) {
                    const activeDot = dots[currentVariantIdxForModal];
                    currentCardForModal.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
                    activeDot.classList.add('active');

                    // Update main images and names on the card
                    const cardImg = currentCardForModal.querySelector('.tile-img-wrapper img');
                    const cardTitle = currentCardForModal.querySelector('.tile-name');
                    const cardInquire = currentCardForModal.querySelector('.tile-card-actions a');

                    if (cardImg) cardImg.src = activeItem.displayImg;
                    if (cardTitle) cardTitle.textContent = activeItem.label;
                    if (cardInquire) cardInquire.href = `contact.html?product=${encodeURIComponent(activeItem.label)}`;

                    // Update data-color attribute for search filters alignment
                    currentCardForModal.setAttribute('data-color', activeDot.getAttribute('data-color'));
                }
            }
        }

        function navigateModal(direction) {
            if (!currentProductForModal) return;

            // Collect unique previews count
            const uniquePreviews = [];
            if (currentProductForModal.previewImage) {
                const isTileImage = currentProductForModal.variants && currentProductForModal.variants.some(v => v.image === currentProductForModal.previewImage);
                if (!isTileImage && currentProductForModal.previewImage !== currentProductForModal.image) {
                    uniquePreviews.push(currentProductForModal.previewImage);
                }
            }
            if (currentProductForModal.previews) {
                currentProductForModal.previews.forEach(pr => {
                    const isTileImage = currentProductForModal.variants && currentProductForModal.variants.some(v => v.image === pr);
                    if (!isTileImage && pr !== currentProductForModal.image && !uniquePreviews.includes(pr)) {
                        uniquePreviews.push(pr);
                    }
                });
            }
            if (currentProductForModal.variants) {
                currentProductForModal.variants.forEach(v => {
                    if (v.previewImage && v.previewImage !== v.image && !uniquePreviews.includes(v.previewImage)) {
                        uniquePreviews.push(v.previewImage);
                    }
                });
            }

            const varLength = currentProductForModal.variants ? currentProductForModal.variants.length : 1;
            const total = varLength + uniquePreviews.length;

            if (total <= 1) return;
            
            if (direction === 'next') {
                currentVariantIdxForModal = (currentVariantIdxForModal + 1) % total;
            } else {
                currentVariantIdxForModal = (currentVariantIdxForModal - 1 + total) % total;
            }
            updateModalContent();
        }

        function closeImageModal() {
            if (!imageModal) return;
            imageModal.classList.remove('show');
            document.body.style.overflow = ''; // Unlock scrolling
            currentProductForModal = null;
            currentCardForModal = null;
        }

        if (modalClose) {
            modalClose.addEventListener('click', closeImageModal);
        }

        if (modalPrevBtn) {
            modalPrevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                navigateModal('prev');
            });
        }

        if (modalNextBtn) {
            modalNextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                navigateModal('next');
            });
        }

        if (imageModal) {
            imageModal.addEventListener('click', (e) => {
                if (e.target === imageModal || e.target.classList.contains('preview-modal-wrapper')) {
                    closeImageModal();
                }
            });
        }

        // Keyboard shortcuts (Escape to close, Left/Right arrow keys to navigate colors)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeImageModal();
            } else if (e.key === 'ArrowRight') {
                navigateModal('next');
            } else if (e.key === 'ArrowLeft') {
                navigateModal('prev');
            }
        });

        // Render matching products dynamically
        function renderCatalog() {
            catalogGrid.innerHTML = '';
            
            // Intersection logic: OR within groups, AND between groups
            const filteredProducts = PRODUCTS.filter(product => {
                for (const group in activeFilters) {
                    const selectedValues = activeFilters[group];
                    if (selectedValues.length > 0) {
                        if (group === 'color' && product.variants && product.variants.length > 0) {
                            const hasMatchingVariant = product.variants.some(v => selectedValues.includes(v.color.toLowerCase()));
                            if (!hasMatchingVariant) {
                                return false;
                            }
                        } else if (group === 'size') {
                            const cleanFilterSizes = selectedValues.map(v => v.toLowerCase().replace(/cm/g, "").replace(/mm/g, "").replace(/\s+/g, "").trim());
                            const productSizes = product.size ? product.size.split('/').map(s => s.toLowerCase().replace(/cm/g, "").replace(/mm/g, "").replace(/\s+/g, "").trim()) : [];
                            const hasMatchingSize = productSizes.some(s => cleanFilterSizes.includes(s));
                            if (!hasMatchingSize) {
                                return false;
                            }
                        } else if (group === 'finish') {
                            const productFinishes = product.finish ? product.finish.split('/').map(f => f.trim().toLowerCase()) : [];
                            const hasMatchingFinish = productFinishes.some(f => selectedValues.includes(f));
                            if (!hasMatchingFinish) {
                                return false;
                            }
                        } else {
                            const productVal = product[group] ? product[group].toLowerCase() : '';
                            if (!selectedValues.includes(productVal)) {
                                return false;
                            }
                        }
                    }
                }
                return true;
            });

            // Balance products dynamically based on whether size filter is active or general view
            const isSizeFiltered = activeFilters.size && activeFilters.size.length > 0;
            const displayProducts = balanceProducts(filteredProducts, isSizeFiltered);

            // Update result counter
            const totalItems = displayProducts.length;
            const totalPages = Math.ceil(totalItems / itemsPerPage);
            if (currentPage > totalPages) currentPage = Math.max(1, totalPages);

            if (resultsCounter) {
                if (totalItems === 0) {
                    resultsCounter.textContent = 'Showing 0 products';
                } else {
                    const startItem = (currentPage - 1) * itemsPerPage + 1;
                    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
                    resultsCounter.textContent = `Showing ${startItem}-${endItem} of ${totalItems} product${totalItems === 1 ? '' : 's'}`;
                }
            }

            // If empty, display clean reset layout
            if (totalItems === 0) {
                catalogGrid.innerHTML = `
                    <div class="empty-catalog-state">
                        <i class="fa-solid fa-layer-group"></i>
                        <h3>No Products Found</h3>
                        <p>No products match your current filtering selections. Try clearing filters or tweaking criteria.</p>
                        <button id="resetAllFilters" class="btn btn-teal">Reset All Filters</button>
                    </div>
                `;
                
                // Bind trigger to the reset button inside empty state
                document.getElementById('resetAllFilters').addEventListener('click', clearAll);
                const paginationContainer = document.getElementById('paginationContainer');
                if (paginationContainer) {
                    paginationContainer.innerHTML = '';
                }
                return;
            }

            // Slice matching products for pagination
            const paginatedProducts = displayProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

            // Inject matching cards
            paginatedProducts.forEach(product => {
                const card = document.createElement('div');
                card.className = 'tile-card';
                card.setAttribute('data-category', product.category);
                card.setAttribute('data-look', product.look);
                card.setAttribute('data-finish', product.finish);
                
                // Determine which variant is active (match current color filter if any)
                let activeVarIdx = 0;
                if (product.variants && product.variants.length > 0) {
                    const colorFilters = activeFilters.color || [];
                    if (colorFilters.length > 0) {
                        const matchIdx = product.variants.findIndex(v => colorFilters.includes(v.color.toLowerCase()));
                        if (matchIdx !== -1) {
                            activeVarIdx = matchIdx;
                        }
                    }
                }
                
                const activeProductImage = (product.variants && product.variants.length > 0) ? product.variants[activeVarIdx].image : product.image;
                const activeProductName = (product.variants && product.variants.length > 0) ? product.variants[activeVarIdx].label : product.name;

                const showPatternTag = product.category === 'mosaic' && product.pattern;
                const patternTagHtml = showPatternTag ? `<span class="pattern-overlay"><i class="fa-solid fa-circle-nodes mr-4"></i>${product.pattern.split(' ')[0]}</span>` : '';

                // Build color swatches bubbles
                let colorBubblesHtml = '';
                if (product.variants && product.variants.length > 0) {
                    colorBubblesHtml = `
                        <div class="color-options-wrapper">
                            ${product.variants.map((v, vIdx) => `
                                <span class="color-dot ${vIdx === activeVarIdx ? 'active' : ''}" 
                                      style="background-image: url('${v.image}');" 
                                      title="${v.label}"
                                      data-image="${v.image}"
                                      data-name="${v.label}"
                                      data-color="${v.color}"
                                      ${product.category === 'mosaic' ? `
                                      data-chip-size="${v.chipSizeLabel || ''}"
                                      data-sheet-size="${v.sheetSizeLabel || ''}"
                                      data-thickness="${v.thicknessLabel || ''}"
                                      data-finish="${v.finishLabel || ''}"
                                      ` : ''}>
                                </span>
                            `).join('')}
                        </div>
                    `;
                }

                function formatFinishLabel(finishStr) {
                    if (!finishStr) return '';
                    return finishStr.split(' / ').map(f => `<span style="white-space: nowrap;">${f.trim()}</span>`).join(' / ');
                }

                let detailsHtml = '';
                if (product.category === 'mosaic') {
                    const activeVariant = (product.variants && product.variants.length > 0) ? product.variants[activeVarIdx] : null;
                    const activeChipSize = activeVariant ? activeVariant.chipSizeLabel : product.chipSizeLabel;
                    const activeSheetSize = activeVariant ? activeVariant.sheetSizeLabel : product.sheetSizeLabel;
                    const activeThickness = activeVariant ? activeVariant.thicknessLabel : product.thicknessLabel;
                    const activeFinish = activeVariant ? activeVariant.finishLabel : product.finishLabel;

                    detailsHtml = `
                        <div class="tile-details mt-10">
                            <span class="tile-chip-size-row"><strong>Chip Size:</strong> <span>${activeChipSize}</span></span>
                            <span class="tile-sheet-size-row"><strong>Sheet Size:</strong> <span>${activeSheetSize}</span></span>
                            <span class="tile-thickness-row"><strong>Thickness:</strong> <span>${activeThickness}</span></span>
                            <span><strong>${product.pattern ? 'Pattern' : 'Look'}:</strong> <span>${product.pattern ? product.pattern : product.lookLabel}</span></span>
                            <span class="tile-finish-row"><strong>Finish:</strong> <span>${formatFinishLabel(activeFinish)}</span></span>
                        </div>
                    `;
                } else {
                    detailsHtml = `
                        <div class="tile-details mt-10">
                            <span><strong>Size:</strong> <span>${product.sizeLabel}</span></span>
                            <span><strong>${product.pattern ? 'Pattern' : 'Look'}:</strong> <span>${product.pattern ? product.pattern : product.lookLabel}</span></span>
                            <span class="tile-finish-row"><strong>Finish:</strong> <span>${formatFinishLabel(product.finishLabel)}</span></span>
                        </div>
                    `;
                }

                card.innerHTML = `
                    <div class="tile-img-wrapper">
                        <img src="${activeProductImage}" alt="${activeProductName}">
                        ${patternTagHtml}
                        <div class="tile-card-actions">
                            <a href="contact.html?product=${encodeURIComponent(activeProductName)}" class="btn btn-white btn-sm">
                                <i class="fa-solid fa-paper-plane mr-6"></i>Inquire Now
                            </a>
                        </div>
                    </div>
                    <div class="tile-info">
                        <span class="tile-cat">${product.categoryLabel}</span>
                        <h3 class="tile-name">${activeProductName}</h3>
                        ${colorBubblesHtml}
                        ${detailsHtml}
                    </div>
                `;

                // Attach click handlers to color options
                if (product.variants && product.variants.length > 0) {
                    card.querySelectorAll('.color-dot').forEach(dot => {
                        dot.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            card.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
                            dot.classList.add('active');

                            const newImage = dot.getAttribute('data-image');
                            const newName = dot.getAttribute('data-name');
                            const newColor = dot.getAttribute('data-color');

                            card.querySelector('.tile-img-wrapper img').src = newImage;
                            card.querySelector('.tile-name').textContent = newName;
                            card.querySelector('.tile-card-actions a').href = `contact.html?product=${encodeURIComponent(newName)}`;
                            
                            // Dynamically update card's color state so details/actions stay consistent
                            card.setAttribute('data-color', newColor);

                            // Mosaic specific details updates
                            const newChipSize = dot.getAttribute('data-chip-size');
                            const newSheetSize = dot.getAttribute('data-sheet-size');
                            const newThickness = dot.getAttribute('data-thickness');
                            const newFinish = dot.getAttribute('data-finish');

                            if (newChipSize) {
                                const chipRow = card.querySelector('.tile-chip-size-row');
                                if (chipRow) chipRow.innerHTML = `<strong>Chip Size:</strong> <span>${newChipSize}</span>`;
                            }
                            if (newSheetSize) {
                                const sheetRow = card.querySelector('.tile-sheet-size-row');
                                if (sheetRow) sheetRow.innerHTML = `<strong>Sheet Size:</strong> <span>${newSheetSize}</span>`;
                            }
                            if (newThickness) {
                                const thickRow = card.querySelector('.tile-thickness-row');
                                if (thickRow) thickRow.innerHTML = `<strong>Thickness:</strong> <span>${newThickness}</span>`;
                            }
                            if (newFinish) {
                                const finishRow = card.querySelector('.tile-finish-row');
                                if (finishRow) finishRow.innerHTML = `<strong>Finish:</strong> <span>${formatFinishLabel(newFinish)}</span>`;
                            }
                        });
                    });
                }
                // Open lightbox on image wrapper click
                const imgWrapper = card.querySelector('.tile-img-wrapper');
                if (imgWrapper) {
                    imgWrapper.style.cursor = 'zoom-in';
                    imgWrapper.addEventListener('click', (e) => {
                        // Prevent modal if clicking internal link buttons
                        if (e.target.closest('a') || e.target.closest('button')) {
                            return;
                        }
                        e.preventDefault();
                        
                        // Find current active variant index
                        const activeDot = card.querySelector('.color-dot.active');
                        let activeVarIdx = 0;
                        if (activeDot) {
                            const dots = Array.from(card.querySelectorAll('.color-dot'));
                            activeVarIdx = dots.indexOf(activeDot);
                        }
                        
                        openImageModal(product, activeVarIdx, card);
                    });
                }

                catalogGrid.appendChild(card);
            });

            // Render pagination controls
            renderPagination(totalPages);
            
            // Update availability of sidebar filter options dynamically
            updateFilterAvailability();
        }

        function renderPagination(totalPages) {
            const paginationContainer = document.getElementById('paginationContainer');
            if (!paginationContainer) return;
            paginationContainer.innerHTML = '';
            
            if (totalPages <= 1) return;
            
            // Previous button
            const prevBtn = document.createElement('button');
            prevBtn.className = `pagination-btn ${currentPage === 1 ? 'disabled' : ''}`;
            prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
            if (currentPage > 1) {
                prevBtn.addEventListener('click', () => {
                    currentPage--;
                    renderCatalog();
                    window.scrollTo({ top: catalogGrid.offsetTop - 120, behavior: 'smooth' });
                });
            }
            paginationContainer.appendChild(prevBtn);
            
            // Page numbers list
            const pages = [];
            pages.push(1);
            
            if (currentPage > 3) {
                pages.push('...');
            }
            
            const startRange = Math.max(2, currentPage - 1);
            const endRange = Math.min(totalPages - 1, currentPage + 1);
            
            for (let i = startRange; i <= endRange; i++) {
                pages.push(i);
            }
            
            if (currentPage < totalPages - 2) {
                pages.push('...');
            }
            
            if (totalPages > 1) {
                pages.push(totalPages);
            }
            
            pages.forEach(p => {
                if (p === '...') {
                    const span = document.createElement('span');
                    span.className = 'pagination-ellipsis';
                    span.textContent = '...';
                    paginationContainer.appendChild(span);
                } else {
                    const btn = document.createElement('button');
                    btn.className = `pagination-btn ${currentPage === p ? 'active' : ''}`;
                    btn.textContent = p;
                    btn.addEventListener('click', () => {
                        currentPage = p;
                        renderCatalog();
                        window.scrollTo({ top: catalogGrid.offsetTop - 120, behavior: 'smooth' });
                    });
                    paginationContainer.appendChild(btn);
                }
            });
            
            // Next button
            const nextBtn = document.createElement('button');
            nextBtn.className = `pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`;
            nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
            if (currentPage < totalPages) {
                nextBtn.addEventListener('click', () => {
                    currentPage++;
                    renderCatalog();
                    window.scrollTo({ top: catalogGrid.offsetTop - 120, behavior: 'smooth' });
                });
            }
            paginationContainer.appendChild(nextBtn);
        }

        function updateFilterAvailability() {
            const groups = ['category', 'size', 'look', 'color', 'finish'];
            
            groups.forEach(currentGroup => {
                const otherFilters = {};
                groups.forEach(g => {
                    if (g !== currentGroup && activeFilters[g] && activeFilters[g].length > 0) {
                        otherFilters[g] = activeFilters[g];
                    }
                });
                
                const matchingProducts = PRODUCTS.filter(product => {
                    for (const group in otherFilters) {
                        const selectedValues = otherFilters[group];
                        if (group === 'color' && product.variants && product.variants.length > 0) {
                            const hasMatchingVariant = product.variants.some(v => selectedValues.includes(v.color.toLowerCase()));
                            if (!hasMatchingVariant) {
                                return false;
                            }
                        } else if (group === 'size') {
                            const cleanFilterSizes = selectedValues.map(v => v.toLowerCase().replace(/cm/g, "").replace(/mm/g, "").replace(/\s+/g, "").trim());
                            const productSizes = product.size ? product.size.split('/').map(s => s.toLowerCase().replace(/cm/g, "").replace(/mm/g, "").replace(/\s+/g, "").trim()) : [];
                            const hasMatchingSize = productSizes.some(s => cleanFilterSizes.includes(s));
                            if (!hasMatchingSize) {
                                return false;
                            }
                        } else if (group === 'finish') {
                            const productFinishes = product.finish ? product.finish.split('/').map(f => f.trim().toLowerCase()) : [];
                            const hasMatchingFinish = productFinishes.some(f => selectedValues.includes(f));
                            if (!hasMatchingFinish) {
                                return false;
                            }
                        } else {
                            const productVal = product[group] ? product[group].toLowerCase() : '';
                            if (!selectedValues.includes(productVal)) {
                                return false;
                            }
                        }
                    }
                    return true;
                });
                
                const validValues = new Set();
                matchingProducts.forEach(p => {
                    if (currentGroup === 'color') {
                        if (p.variants) {
                            p.variants.forEach(v => {
                                if (v.color) validValues.add(v.color.toLowerCase());
                            });
                        }
                    } else if (currentGroup === 'size') {
                        if (p.size) {
                            p.size.split('/').forEach(s => {
                                validValues.add(s.toLowerCase().replace(/cm/g, "").replace(/mm/g, "").replace(/\s+/g, "").trim());
                            });
                        }
                    } else if (currentGroup === 'finish') {
                        if (p.finish) {
                            p.finish.split('/').forEach(f => {
                                validValues.add(f.trim().toLowerCase());
                            });
                        }
                    } else {
                        const val = p[currentGroup];
                        if (val) {
                            validValues.add(val.toLowerCase());
                        }
                    }
                });
                
                const checkboxes = document.querySelectorAll(`.catalog-sidebar input[name="${currentGroup}"]`);
                checkboxes.forEach(chk => {
                    const chkVal = chk.value.toLowerCase();
                    let isValid = false;
                    
                    if (currentGroup === 'size') {
                        const cleanChkVal = chkVal.replace(/cm/g, "").replace(/mm/g, "").replace(/\s+/g, "").trim();
                        isValid = validValues.has(cleanChkVal);
                    } else {
                        isValid = validValues.has(chkVal);
                    }
                    
                    const label = chk.closest('.filter-checkbox');
                    if (isValid) {
                        chk.disabled = false;
                        if (label) label.classList.remove('disabled-option');
                    } else {
                        if (chk.checked) {
                            chk.disabled = false;
                            if (label) label.classList.remove('disabled-option');
                        } else {
                            chk.disabled = true;
                            if (label) label.classList.add('disabled-option');
                        }
                    }
                });
            });
        }

        // Toggle checkbox filters and reload catalog
        function handleFilterChange(e) {
            const checkbox = e.target;
            const groupName = checkbox.name; // category, size, look, color, finish
            const val = checkbox.value.toLowerCase();

            if (checkbox.checked) {
                if (!activeFilters[groupName].includes(val)) {
                    activeFilters[groupName].push(val);
                }
            } else {
                activeFilters[groupName] = activeFilters[groupName].filter(v => v !== val);
            }
            currentPage = 1; // Reset to first page
            renderCatalog();
        }

        // Reset all checkboxes and re-render
        function clearAll() {
            document.querySelectorAll('.catalog-sidebar input[type="checkbox"]').forEach(cb => {
                cb.checked = false;
            });
            for (const group in activeFilters) {
                activeFilters[group] = [];
            }
            currentPage = 1; // Reset to first page
            renderCatalog();
        }

        // Attach change listeners to all checkboxes
        document.querySelectorAll('.catalog-sidebar input[type="checkbox"]').forEach(cb => {
            cb.addEventListener('change', handleFilterChange);
        });

        if (clearAllFiltersBtn) {
            clearAllFiltersBtn.addEventListener('click', clearAll);
        }

        const itemsPerPageSelect = document.getElementById('itemsPerPageSelect');
        if (itemsPerPageSelect) {
            itemsPerPageSelect.addEventListener('change', (e) => {
                itemsPerPage = parseInt(e.target.value);
                currentPage = 1;
                renderCatalog();
            });
        }

        // Collapsible Accordion logic for sidebar filter headers
        const filterTitles = document.querySelectorAll('.filter-title');
        filterTitles.forEach(title => {
            title.addEventListener('click', () => {
                title.classList.toggle('active');
                const options = title.nextElementSibling;
                if (options && options.classList.contains('filter-options')) {
                    options.classList.toggle('active');
                }
            });
        });

        // Category alias mapping for URL query params and external links
        const CATEGORY_ALIASES = {
            'porcelain': ['porcelain'],
            'gvt': ['porcelain'],
            'pgvt': ['porcelain'],
            'glazed-porcelain': ['porcelain'],
            'subway': ['ceramic-subway', 'porcelain-subway'],
            'subway-tiles': ['ceramic-subway', 'porcelain-subway'],
            'porcelain-subway': ['porcelain-subway'],
            'ceramic-subway': ['ceramic-subway'],
            'wall': ['ceramic-wall'],
            'wall-surfaces': ['ceramic-wall'],
            'ceramic-wall': ['ceramic-wall'],
            'architectural-wall': ['ceramic-wall'],
            'wood': ['wooden-planks'],
            'wood-planks': ['wooden-planks'],
            'wooden-planks': ['wooden-planks'],
            'wooden': ['wooden-planks'],
            'slab': ['porcelain-slab'],
            'slabs': ['porcelain-slab'],
            'porcelain-slab': ['porcelain-slab'],
            'porcelain-slabs': ['porcelain-slab'],
            'sintered-slab': ['porcelain-slab'],
            'mosaic': ['mosaic'],
            'mosaic-decor': ['mosaic'],
            'mosaics': ['mosaic']
        };

        // URL parameter pre-selector with alias resolution & auto-scroll
        function applyUrlFilters() {
            const urlParams = new URLSearchParams(window.location.search);
            let hasUrlFilters = false;

            // Reset active filters
            for (const group in activeFilters) {
                activeFilters[group] = [];
            }
            document.querySelectorAll('.catalog-sidebar input[type="checkbox"]').forEach(cb => {
                cb.checked = false;
            });

            // 1. Process category param with alias resolution
            const catParam = urlParams.get('category');
            if (catParam) {
                const cleanCat = catParam.toLowerCase().trim();
                const mappedCats = CATEGORY_ALIASES[cleanCat] || [cleanCat];

                mappedCats.forEach(catVal => {
                    if (!activeFilters.category.includes(catVal)) {
                        activeFilters.category.push(catVal);
                    }
                    const checkbox = document.querySelector(`.catalog-sidebar input[name="category"][value="${catVal}"]`);
                    if (checkbox) {
                        checkbox.checked = true;
                        hasUrlFilters = true;

                        const optionsContainer = checkbox.closest('.filter-options');
                        const titleHeader = optionsContainer ? optionsContainer.previousElementSibling : null;
                        if (optionsContainer && titleHeader) {
                            optionsContainer.classList.add('active');
                            titleHeader.classList.add('active');
                        }
                    }
                });
            }

            // 2. Process other filter parameters: size, look, color, finish
            ['size', 'look', 'color', 'finish'].forEach(group => {
                const paramValue = urlParams.get(group);
                if (paramValue) {
                    const cleanVal = paramValue.toLowerCase().trim();
                    const checkbox = document.querySelector(`.catalog-sidebar input[name="${group}"][value="${cleanVal}"]`);
                    if (checkbox) {
                        checkbox.checked = true;
                        if (!activeFilters[group].includes(cleanVal)) {
                            activeFilters[group].push(cleanVal);
                        }
                        hasUrlFilters = true;

                        const optionsContainer = checkbox.closest('.filter-options');
                        const titleHeader = optionsContainer ? optionsContainer.previousElementSibling : null;
                        if (optionsContainer && titleHeader) {
                            optionsContainer.classList.add('active');
                            titleHeader.classList.add('active');
                        }
                    }
                }
            });

            currentPage = 1;
            renderCatalog();

            // 3. Smooth scroll to catalog grid if URL filters were applied
            if (hasUrlFilters) {
                setTimeout(() => {
                    const targetElem = document.querySelector('.collections-layout') || catalogGrid;
                    if (targetElem) {
                        const topPos = targetElem.getBoundingClientRect().top + window.pageYOffset - 90;
                        window.scrollTo({ top: topPos, behavior: 'smooth' });
                    }
                }, 120);
            }
        }

        // Run initial catalog filter application
        applyUrlFilters();

        // Listen for history popstate / back-forward navigation
        window.addEventListener('popstate', applyUrlFilters);

        // Intercept in-page collections link clicks (e.g. from footer when already on collections.html)
        document.querySelectorAll('a[href*="collections.html?"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.includes('collections.html?')) {
                    const isCollectionsPage = window.location.pathname.endsWith('collections.html') || 
                                              window.location.pathname.endsWith('/collections') ||
                                              window.location.pathname.endsWith('/collections.html');
                    if (isCollectionsPage) {
                        e.preventDefault();
                        const queryPart = href.substring(href.indexOf('?'));
                        window.history.pushState({}, '', queryPart);
                        applyUrlFilters();
                    }
                }
            });
        });
    }


    /* ==========================================================================
       5. Tile Quantity Calculator
       ========================================================================== */
    const calcUnitRadios = document.querySelectorAll('input[name="calcUnit"]');
    const calcLength = document.getElementById('calcLength');
    const calcWidth = document.getElementById('calcWidth');
    const calcTileSize = document.getElementById('calcTileSize');
    const calcWastage = document.getElementById('calcWastage');
    
    const resArea = document.getElementById('resArea');
    const resTiles = document.getElementById('resTiles');
    const resBoxes = document.getElementById('resBoxes');

    function calculateTiles() {
        if (!calcLength || !calcWidth || !calcTileSize || !resArea || !resTiles || !resBoxes) return;

        const length = parseFloat(calcLength.value) || 0;
        const width = parseFloat(calcWidth.value) || 0;
        
        let selectedUnit = 'ft';
        calcUnitRadios.forEach(radio => {
            if (radio.checked) selectedUnit = radio.value;
        });

        // 1. Calculate raw surface area
        let areaSqFt = 0;
        let areaSqM = 0;

        if (selectedUnit === 'ft') {
            areaSqFt = length * width;
            areaSqM = areaSqFt * 0.092903; // convert ft to m
        } else {
            areaSqM = length * width;
            areaSqFt = areaSqM / 0.092903;
        }

        // 2. Add Wastage Buffer (+10%) if selected
        let finalAreaSqM = areaSqM;
        if (calcWastage && calcWastage.checked) {
            finalAreaSqM = areaSqM * 1.10;
        }

        // Get select option data
        const selectedOption = calcTileSize.options[calcTileSize.selectedIndex];
        const boxCoverageSqM = parseFloat(selectedOption.getAttribute('data-coverage'));
        const pcsPerBox = parseInt(selectedOption.getAttribute('data-packing'));

        // 3. Compute Boxes and Tiles
        const boxesNeeded = Math.ceil(finalAreaSqM / boxCoverageSqM);
        const tilesNeeded = boxesNeeded * pcsPerBox;

        // 4. Update UI results
        if (selectedUnit === 'ft') {
            resArea.textContent = `${areaSqFt.toFixed(2)} sq ft`;
        } else {
            resArea.textContent = `${areaSqM.toFixed(2)} sq m`;
        }

        resTiles.textContent = tilesNeeded.toLocaleString();
        resBoxes.textContent = boxesNeeded.toLocaleString();
    }

    // Attach event listeners to all calculator inputs
    if (calcLength) calcLength.addEventListener('input', calculateTiles);
    if (calcWidth) calcWidth.addEventListener('input', calculateTiles);
    if (calcTileSize) calcTileSize.addEventListener('change', calculateTiles);
    if (calcWastage) calcWastage.addEventListener('change', calculateTiles);
    calcUnitRadios.forEach(radio => {
        radio.addEventListener('change', calculateTiles);
    });

    // Run initial calculation on page load
    calculateTiles();

    /* ==========================================================================
       6. Inquiry Form Validation & Pill Selection Interactivity
       ========================================================================== */
    const inquiryForm = document.getElementById('inquiryForm');
    const formFeedback = document.getElementById('formFeedback');
    const pills = document.querySelectorAll('.interest-pill');
    const selectedInterestsInput = document.getElementById('selectedInterests');

    // Toggle active state on pills and serialize to hidden input field
    if (pills.length > 0 && selectedInterestsInput) {
        const selectedValues = new Set();
        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                pill.classList.toggle('active');
                const val = pill.getAttribute('data-value');
                if (pill.classList.contains('active')) {
                    selectedValues.add(val);
                } else {
                    selectedValues.delete(val);
                }
                selectedInterestsInput.value = Array.from(selectedValues).join(', ');
            });
        });
    }

    if (inquiryForm && formFeedback) {
        // Pre-fill query parameters (e.g. ?product=Emerald%20Glossy%20Porcelain%20Subway)
        const urlParams = new URLSearchParams(window.location.search);
        const urlProduct = urlParams.get('product');

        if (urlProduct) {
            const messageTextarea = document.getElementById('contactMessage');
            if (messageTextarea) {
                messageTextarea.value = `Hello, I am interested in getting a wholesale catalog, pricing details, and packing specifications for: ${decodeURIComponent(urlProduct)}.`;
            }

            // Map product category keywords to interest pills
            const lowerProduct = urlProduct.toLowerCase();
            let pillValueToSelect = '';

            if (lowerProduct.includes('subway')) {
                pillValueToSelect = 'Subway';
            } else if (lowerProduct.includes('slab')) {
                pillValueToSelect = 'Slabs';
            } else if (lowerProduct.includes('porcelain') || lowerProduct.includes('wall') || lowerProduct.includes('floor')) {
                pillValueToSelect = 'Porcelain';
            } else {
                pillValueToSelect = 'Wall Tiles';
            }

            if (pillValueToSelect) {
                const targetPill = Array.from(pills).find(p => p.getAttribute('data-value') === pillValueToSelect);
                if (targetPill) {
                    targetPill.classList.add('active');
                    if (selectedInterestsInput) {
                        selectedInterestsInput.value = pillValueToSelect;
                    }
                }
            }
        }

        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Disable button and show sending state
            const submitBtn = inquiryForm.querySelector('button[type="submit"]');
            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending Inquiry <i class="fa-solid fa-spinner fa-spin ml-6"></i>';

            // Gather inputs for simulation
            const name = document.getElementById('contactName').value;
            const company = document.getElementById('contactCompany') ? document.getElementById('contactCompany').value : '';
            const email = document.getElementById('contactEmail').value;
            const countryCode = document.getElementById('contactCountryCode') ? document.getElementById('contactCountryCode').value : '';
            const phone = document.getElementById('contactPhone').value;
            const country = document.getElementById('contactCountry').value;
            const volume = document.getElementById('contactVolume').value;
            const message = document.getElementById('contactMessage').value;
            const interests = selectedInterestsInput ? selectedInterestsInput.value : '';
            const fullPhone = countryCode ? `${countryCode} ${phone}` : phone;

            // Form validation
            if (!name || !email || !phone || !countryCode || !country || !volume || !message) {
                formFeedback.style.display = 'block';
                formFeedback.className = 'form-feedback error';
                formFeedback.textContent = 'Please fill out all required fields (including Country Code, Mobile Number, Destination Country, and expected cargo volume).';
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
                return;
            }

            // Simulate server request delay (1.2s latency)
            setTimeout(() => {
                formFeedback.style.display = 'block';
                formFeedback.className = 'form-feedback success';
                const companyText = company ? ` for ${company}` : '';
                formFeedback.textContent = `Thank you, ${name}! Your wholesale inquiry${companyText} regarding ${interests || 'our collections'} (${volume}) shipping to ${country} has been successfully sent. Our export team will contact you at ${email} shortly.`;
                
                // Reset form and pills
                inquiryForm.reset();
                pills.forEach(p => p.classList.remove('active'));
                if (selectedInterestsInput) selectedInterestsInput.value = '';
                
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;

                // Clear success message after 8 seconds
                setTimeout(() => {
                    formFeedback.style.display = 'none';
                }, 8000);

            }, 1200);
        });
    }

    /* ==========================================================================
       10. Global & Homepage FAQ Accordion Interactivity
       ========================================================================== */
    const faqQuestions = document.querySelectorAll('.faq-question');
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(btn => {
            btn.addEventListener('click', () => {
                const parentItem = btn.closest('.faq-item');
                const isCurrentlyActive = parentItem.classList.contains('active');
                
                // Close other items in the same container
                const container = parentItem.parentElement;
                container.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                    const qBtn = item.querySelector('.faq-question');
                    if (qBtn) qBtn.setAttribute('aria-expanded', 'false');
                });
                
                if (!isCurrentlyActive) {
                    parentItem.classList.add('active');
                    btn.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }

    /* ==========================================================================
       10B. Technical Specifications Tab Interactivity
       ========================================================================== */
    const specTabBtns = document.querySelectorAll('.specs-tabs-container .spec-tab-btn[data-tab]');
    if (specTabBtns.length > 0) {
        specTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-tab');
                if (!targetId) return;

                // Deactivate all sibling buttons
                specTabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Hide all panels and activate target panel
                const tabPanels = document.querySelectorAll('.specs-tabs-content .spec-tab-content');
                tabPanels.forEach(panel => {
                    panel.classList.remove('active');
                });

                const targetPanel = document.getElementById(targetId);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        });

        // URL parameter support (e.g. ?tab=tab-1 or ?tab=matt)
        const specUrlParams = new URLSearchParams(window.location.search);
        const reqTab = specUrlParams.get('tab') || specUrlParams.get('finish');
        if (reqTab) {
            const matchBtn = Array.from(specTabBtns).find(b => 
                b.getAttribute('data-tab') === reqTab || 
                b.textContent.toLowerCase().includes(reqTab.toLowerCase())
            );
            if (matchBtn) matchBtn.click();
        }
    }

    /* ==========================================================================
       10C. FAQ Category Filter Tabs Interactivity
       ========================================================================== */
    const faqFilterBtns = document.querySelectorAll('.specs-tabs-container .spec-tab-btn[data-filter]');
    const faqAccordionItems = document.querySelectorAll('.faq-accordion .faq-item');
    if (faqFilterBtns.length > 0 && faqAccordionItems.length > 0) {
        faqFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                faqFilterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');
                faqAccordionItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }


    /* ==========================================================================
       11. Interactive Product Category Accordion (Autoplay & Click Interactions)
       ========================================================================== */
    const categoryAccordion = document.getElementById('categoryAccordion');
    if (categoryAccordion) {
        const panels = categoryAccordion.querySelectorAll('.accordion-panel');
        const dots = document.querySelectorAll('.accordion-dot-btn');
        let activeIndex = 0;
        let autoplayTimer = null;
        const AUTOPLAY_INTERVAL = 4500; // 4.5 seconds rotation

        function setActiveCategory(index) {
            if (index < 0 || index >= panels.length) return;
            activeIndex = index;

            panels.forEach((panel, i) => {
                const isActive = (i === index);
                panel.classList.toggle('active', isActive);
                panel.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }

        function startAutoplay() {
            stopAutoplay();
            autoplayTimer = setInterval(() => {
                const nextIndex = (activeIndex + 1) % panels.length;
                setActiveCategory(nextIndex);
            }, AUTOPLAY_INTERVAL);
        }

        function stopAutoplay() {
            if (autoplayTimer) {
                clearInterval(autoplayTimer);
                autoplayTimer = null;
            }
        }

        // Panel click interactions
        panels.forEach((panel, index) => {
            panel.addEventListener('click', (e) => {
                // If user clicks a link inside the expanded card, allow standard navigation
                if (e.target.closest('a') || e.target.closest('button')) {
                    return;
                }
                setActiveCategory(index);
                startAutoplay(); // Reset timer on interaction
            });

            // Keyboard accessibility
            panel.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveCategory(index);
                    startAutoplay();
                }
            });
        });

        // Indicator dot clicks
        dots.forEach((dot) => {
            dot.addEventListener('click', () => {
                const targetIdx = parseInt(dot.getAttribute('data-target'), 10);
                if (!isNaN(targetIdx)) {
                    setActiveCategory(targetIdx);
                    startAutoplay();
                }
            });
        });

        // Pause autoplay on hover, resume on mouse leave
        const accordionWrapper = categoryAccordion.closest('.categories-accordion-wrapper') || categoryAccordion;
        accordionWrapper.addEventListener('mouseenter', stopAutoplay);
        accordionWrapper.addEventListener('mouseleave', startAutoplay);
        accordionWrapper.addEventListener('touchstart', stopAutoplay, { passive: true });

        // Start autoplay on initialization
        startAutoplay();
    }



    
    /* ==========================================================================
       EXPORT DESTINATIONS MAP & PACKING SPECIFICATIONS SYSTEM (Encapsulated)
       ========================================================================== */
    (() => {
        const exportMapContainer = document.getElementById('svgMapContainer');
        const worldSvg = exportMapContainer ? exportMapContainer.querySelector('.world-svg') : null;
        if (!exportMapContainer || !worldSvg) return;
        
        // Comprehensive Global Destinations Database (Calibrated for 1000x666 Brand Vector World Map)
        const exportDestinations = [
            { id: "usa-ny", name: "United States (East Coast)", port: "Port of New York & New Jersey", country: "United States", region: "north-america", x: 278, y: 268, transit: "28-32 Days", sizes: "600x1200mm, 1200x2400mm Slabs, Subway 75x300mm", flag: "🇺🇸" },
            { id: "usa-tx", name: "United States (Gulf Coast)", port: "Port of Houston", country: "United States", region: "north-america", x: 222, y: 322, transit: "30-34 Days", sizes: "600x600mm, 600x1200mm GVT, Wooden Planks", flag: "🇺🇸" },
            { id: "usa-ca", name: "United States (West Coast)", port: "Port of Los Angeles / Long Beach", country: "United States", region: "north-america", x: 152, y: 275, transit: "32-38 Days", sizes: "800x1600mm Slabs, 600x1200mm Porcelain", flag: "🇺🇸" },
            { id: "can-east", name: "Canada (East)", port: "Port of Montreal / Toronto", country: "Canada", region: "north-america", x: 275, y: 245, transit: "30-35 Days", sizes: "600x1200mm, 800x800mm, Frost-Proof Porcelain", flag: "🇨🇦" },
            { id: "can-west", name: "Canada (West)", port: "Port of Vancouver", country: "Canada", region: "north-america", x: 138, y: 225, transit: "34-40 Days", sizes: "600x1200mm Porcelain, Sintered Slabs", flag: "🇨🇦" },
            { id: "mex", name: "Mexico", port: "Port of Veracruz & Manzanillo", country: "Mexico", region: "north-america", x: 205, y: 345, transit: "32-36 Days", sizes: "600x600mm, 600x1200mm, Ceramic Wall Tiles", flag: "🇲🇽" },
            { id: "uk", name: "United Kingdom", port: "Port of Felixstowe & London Gateway", country: "United Kingdom", region: "europe", x: 450, y: 238, transit: "22-26 Days", sizes: "600x600mm, 600x1200mm, Subway Tiles 100x300mm", flag: "🇬🇧" },
            { id: "ger", name: "Germany", port: "Port of Hamburg & Bremerhaven", country: "Germany", region: "europe", x: 485, y: 230, transit: "24-28 Days", sizes: "600x1200mm, 20mm Outdoor Pavers, R11 Anti-Slip", flag: "🇩🇪" },
            { id: "spain", name: "Spain", port: "Port of Valencia & Barcelona", country: "Spain", region: "europe", x: 456, y: 294, transit: "18-22 Days", sizes: "1200x2400mm Slabs, 600x1200mm Carving Finish", flag: "🇪🇸" },
            { id: "italy", name: "Italy", port: "Port of Genoa & Salerno", country: "Italy", region: "europe", x: 488, y: 285, transit: "18-22 Days", sizes: "Large Sintered Slabs, Marble Bookmatched", flag: "🇮🇹" },
            { id: "france", name: "France", port: "Port of Le Havre & Marseille", country: "France", region: "europe", x: 460, y: 262, transit: "20-25 Days", sizes: "600x1200mm, Subway Decor, Satin Matte", flag: "🇫🇷" },
            { id: "neth", name: "Netherlands & Belgium", port: "Port of Rotterdam & Antwerp", country: "Netherlands", region: "europe", x: 472, y: 238, transit: "22-26 Days", sizes: "600x600mm, 600x1200mm, 20mm Outdoor Tiles", flag: "🇳🇱" },
            { id: "poland", name: "Poland", port: "Port of Gdansk", country: "Poland", region: "europe", x: 504, y: 226, transit: "26-30 Days", sizes: "600x600mm, 600x1200mm Porcelain", flag: "🇵🇱" },
            { id: "greece", name: "Greece", port: "Port of Piraeus", country: "Greece", region: "europe", x: 510, y: 298, transit: "16-20 Days", sizes: "600x1200mm, 300x600mm Wall Tiles", flag: "🇬🇷" },
            { id: "portugal", name: "Portugal", port: "Port of Lisbon & Leixoes", country: "Portugal", region: "europe", x: 442, y: 290, transit: "20-24 Days", sizes: "Glazed Porcelain, Subway Tiles", flag: "🇵🇹" },
            { id: "uae", name: "United Arab Emirates", port: "Port of Jebel Ali (Dubai) & Abu Dhabi", country: "United Arab Emirates", region: "middle-east", x: 596, y: 350, transit: "3-5 Days (Express)", sizes: "600x1200mm, 800x1600mm, 1200x2400mm Slabs", flag: "🇦🇪" },
            { id: "ksa-jed", name: "Saudi Arabia (Western)", port: "Jeddah Islamic Port", country: "Saudi Arabia", region: "middle-east", x: 562, y: 358, transit: "7-10 Days", sizes: "600x600mm, 600x1200mm, SASO Certified", flag: "🇸🇦" },
            { id: "ksa-dam", name: "Saudi Arabia (Eastern)", port: "King Abdulaziz Port (Dammam)", country: "Saudi Arabia", region: "middle-east", x: 582, y: 340, transit: "6-8 Days", sizes: "600x1200mm, 800x800mm Full Body / GVT", flag: "🇸🇦" },
            { id: "oman", name: "Oman", port: "Port of Sohar & Muscat", country: "Oman", region: "middle-east", x: 608, y: 360, transit: "3-5 Days", sizes: "600x600mm, 300x600mm Ceramic Wall", flag: "🇴🇲" },
            { id: "kuwait", name: "Kuwait", port: "Shuwaikh Port & Shuaiba", country: "Kuwait", region: "middle-east", x: 574, y: 330, transit: "6-9 Days", sizes: "600x1200mm, 1200x1200mm High Gloss Porcelain", flag: "🇰🇼" },
            { id: "qatar", name: "Qatar", port: "Hamad Port (Doha)", country: "Qatar", region: "middle-east", x: 588, y: 344, transit: "5-7 Days", sizes: "600x1200mm, 800x1600mm Slabs", flag: "🇶🇦" },
            { id: "bahrain", name: "Bahrain", port: "Khalifa Bin Salman Port", country: "Bahrain", region: "middle-east", x: 585, y: 341, transit: "5-8 Days", sizes: "600x600mm, 600x1200mm GVT", flag: "🇧🇭" },
            { id: "israel", name: "Israel", port: "Port of Ashdod & Haifa", country: "Israel", region: "middle-east", x: 545, y: 318, transit: "14-18 Days", sizes: "600x600mm, 600x1200mm, Anti-Slip R10/R11", flag: "🇮🇱" },
            { id: "aus-syd", name: "Australia (East Coast)", port: "Port of Sydney & Brisbane", country: "Australia", region: "asia-pacific", x: 832, y: 492, transit: "18-22 Days", sizes: "600x600mm, 600x1200mm, R10/R11 P4 Slip Rated", flag: "🇦🇺" },
            { id: "aus-mel", name: "Australia (South Coast)", port: "Port of Melbourne & Adelaide", country: "Australia", region: "asia-pacific", x: 812, y: 510, transit: "20-24 Days", sizes: "600x1200mm, 800x1600mm Slabs", flag: "🇦🇺" },
            { id: "nz", name: "New Zealand", port: "Port of Auckland & Tauranga", country: "New Zealand", region: "asia-pacific", x: 886, y: 522, transit: "24-28 Days", sizes: "600x600mm, 600x1200mm Porcelain", flag: "🇳🇿" },
            { id: "thai", name: "Thailand", port: "Laem Chabang Port & Bangkok", country: "Thailand", region: "asia-pacific", x: 726, y: 395, transit: "10-14 Days", sizes: "600x600mm, 600x1200mm, 200x1200mm Wood Planks", flag: "🇹🇭" },
            { id: "indo", name: "Indonesia", port: "Port of Tanjung Priok (Jakarta) & Surabaya", country: "Indonesia", region: "asia-pacific", x: 745, y: 442, transit: "12-16 Days", sizes: "600x600mm, 600x1200mm GVT", flag: "🇮🇩" },
            { id: "viet", name: "Vietnam", port: "Cat Lai Port (Ho Chi Minh) & Hai Phong", country: "Vietnam", region: "asia-pacific", x: 742, y: 400, transit: "12-15 Days", sizes: "600x600mm, 600x1200mm, Ceramic Wall", flag: "🇻🇳" },
            { id: "korea", name: "South Korea", port: "Port of Busan & Incheon", country: "South Korea", region: "asia-pacific", x: 794, y: 305, transit: "14-18 Days", sizes: "600x1200mm, 800x1600mm, Sintered Slabs", flag: "🇰🇷" },
            { id: "taiwan", name: "Taiwan", port: "Port of Kaohsiung & Keelung", country: "Taiwan", region: "asia-pacific", x: 778, y: 348, transit: "12-16 Days", sizes: "600x1200mm, 800x800mm Porcelain", flag: "🇹🇼" },
            { id: "sa", name: "South Africa", port: "Port of Durban & Cape Town", country: "South Africa", region: "latam-africa", x: 538, y: 500, transit: "16-20 Days", sizes: "600x600mm, 600x1200mm, Ceramic Wall Tiles", flag: "🇿🇦" },
            { id: "mau", name: "Mauritius", port: "Port Louis", country: "Mauritius", region: "latam-africa", x: 632, y: 470, transit: "12-15 Days", sizes: "600x600mm, 600x1200mm, Mosaics", flag: "🇲🇺" },
            { id: "brazil", name: "Brazil", port: "Port of Santos & Paranagua", country: "Brazil", region: "latam-africa", x: 348, y: 475, transit: "28-35 Days", sizes: "600x1200mm, 1200x2400mm Slabs", flag: "🇧🇷" },
            { id: "colombia", name: "Colombia", port: "Port of Cartagena & Buenaventura", country: "Colombia", region: "latam-africa", x: 260, y: 395, transit: "30-36 Days", sizes: "600x600mm, 600x1200mm, Wall Tiles", flag: "🇨🇴" },
            { id: "arg", name: "Argentina", port: "Port of Buenos Aires", country: "Argentina", region: "latam-africa", x: 310, y: 515, transit: "32-38 Days", sizes: "600x1200mm, 800x800mm Porcelain", flag: "🇦🇷" },
            { id: "morocco", name: "Morocco", port: "Tanger Med Port & Casablanca", country: "Morocco", region: "latam-africa", x: 448, y: 318, transit: "18-22 Days", sizes: "600x600mm, 600x1200mm GVT", flag: "🇲🇦" },
        ];

        const origin = { x: 650, y: 355 };
        const routeLinesGroup = document.getElementById('routeLinesGroup');
        const destMarkersGroup = document.getElementById('destMarkersGroup');
        const activeRoutesCount = document.getElementById('activeRoutesCount');
        const tooltip = document.getElementById('mapTooltipCard');
        const ttFlag = document.getElementById('ttFlag');
        const ttCountry = document.getElementById('ttCountry');
        const ttPort = document.getElementById('ttPort');
        const ttTransit = document.getElementById('ttTransit');
        const ttSizes = document.getElementById('ttSizes');
        const ttClose = document.getElementById('ttClose');

        // ViewBox Management (Stable Full Global Perspective)
        const baseViewBox = { x: 0, y: 0, w: 1000, h: 666 };
        let currentViewBox = { ...baseViewBox };

        function applyViewBox(vb) {
            worldSvg.setAttribute('viewBox', `${vb.x.toFixed(2)} ${vb.y.toFixed(2)} ${vb.w.toFixed(2)} ${vb.h.toFixed(2)}`);
        }

        // Render SVG Map Routes & Interactive Markers
        function renderMapElements(destinationsList) {
            if (!routeLinesGroup || !destMarkersGroup) return;
            
            routeLinesGroup.innerHTML = '';
            destMarkersGroup.innerHTML = '';

            destinationsList.forEach(dest => {
                // Calculate Curved Control Point for Great-Circle Arcs
                const dx = dest.x - origin.x;
                const dy = dest.y - origin.y;
                let midX = origin.x + dx * 0.5;
                let midY = origin.y + dy * 0.5;
                
                const dist = Math.sqrt(dx * dx + dy * dy);
                const curvature = Math.min(dist * 0.22, 45);
                const cy = midY - curvature;
                const cx = midX;

                // 1. Create Route Line Path
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('class', 'route-line');
                path.setAttribute('id', `route-${dest.id}`);
                path.setAttribute('data-id', dest.id);
                path.setAttribute('data-region', dest.region);
                path.setAttribute('d', `M ${origin.x},${origin.y} Q ${cx},${cy} ${dest.x},${dest.y}`);
                
                path.addEventListener('mouseenter', () => {
                    highlightDestination(dest.id);
                    showTooltip(dest, null, dest.x, dest.y);
                });

                routeLinesGroup.appendChild(path);

                // 2. Create Destination Marker Group
                const markerGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                markerGroup.setAttribute('class', 'dest-marker');
                markerGroup.setAttribute('id', `marker-${dest.id}`);
                markerGroup.setAttribute('data-id', dest.id);
                markerGroup.setAttribute('data-region', dest.region);
                markerGroup.setAttribute('transform', `translate(${dest.x}, ${dest.y})`);

                const pulseRing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                pulseRing.setAttribute('r', '8');
                pulseRing.setAttribute('class', 'dest-pulse-ring');

                const outerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                outerCircle.setAttribute('r', '5.5');
                outerCircle.setAttribute('class', 'dest-dot-outer');

                const innerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                innerCircle.setAttribute('r', '2.5');
                innerCircle.setAttribute('class', 'dest-dot-inner');

                markerGroup.appendChild(pulseRing);
                markerGroup.appendChild(outerCircle);
                markerGroup.appendChild(innerCircle);
                destMarkersGroup.appendChild(markerGroup);

                // Marker Interaction Handlers
                markerGroup.addEventListener('mouseenter', (e) => {
                    highlightDestination(dest.id);
                    showTooltip(dest, e);
                });
                markerGroup.addEventListener('click', (e) => {
                    e.stopPropagation();
                    highlightDestination(dest.id);
                    showTooltip(dest, e);
                });
            });

            if (activeRoutesCount) {
                activeRoutesCount.textContent = destinationsList.length;
            }
        }

        // Show Tooltip Card Inside SVG Map Canvas
        function showTooltip(dest, event, customX, customY) {
            if (!tooltip) return;
            if (ttFlag) ttFlag.textContent = dest.flag;
            if (ttCountry) ttCountry.textContent = dest.country;
            if (ttPort) ttPort.textContent = dest.port;
            if (ttTransit) ttTransit.textContent = dest.transit;
            if (ttSizes) ttSizes.textContent = dest.sizes;

            tooltip.style.display = 'block';

            // Calculate position inside svg container using current viewBox
            const containerRect = exportMapContainer.getBoundingClientRect();
            let svgX = (customX !== undefined) ? customX : dest.x;
            let svgY = (customY !== undefined) ? customY : dest.y;

            let posX = ((svgX - currentViewBox.x) / currentViewBox.w) * containerRect.width + 12;
            let posY = ((svgY - currentViewBox.y) / currentViewBox.h) * containerRect.height - 10;

            // Keep tooltip within bounds
            if (posX + 330 > containerRect.width) {
                posX = posX - 345;
            }
            if (posY + 230 > containerRect.height) {
                posY = posY - 200;
            }
            if (posX < 15) posX = 15;
            if (posY < 15) posY = 15;

            tooltip.style.left = `${posX}px`;
            tooltip.style.top = `${posY}px`;
        }

        if (ttClose) {
            ttClose.addEventListener('click', (e) => {
                e.stopPropagation();
                tooltip.style.display = 'none';
            });
        }

        // Highlight specific destination route & marker
        function highlightDestination(destId) {
            document.querySelectorAll('.route-line').forEach(line => {
                if (line.getAttribute('data-id') === destId) {
                    line.classList.add('highlighted');
                } else {
                    line.classList.remove('highlighted');
                }
            });
            document.querySelectorAll('.dest-marker').forEach(marker => {
                if (marker.getAttribute('data-id') === destId) {
                    marker.classList.add('active');
                } else {
                    marker.classList.remove('active');
                }
            });
        }

        // Region Filtering Logic (Filters Pins & Routes)
        const regionPills = document.querySelectorAll('#mapRegionFilters .region-pill');
        regionPills.forEach(pill => {
            pill.addEventListener('click', () => {
                regionPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                const region = pill.getAttribute('data-region');

                if (region === 'all') {
                    renderMapElements(exportDestinations);
                } else {
                    const filtered = exportDestinations.filter(d => d.region === region);
                    renderMapElements(filtered);
                }
                if (tooltip) tooltip.style.display = 'none';
            });
        });

        // Search Filter for Country / Port
        const mapSearch = document.getElementById('mapCountrySearch');
        if (mapSearch) {
            mapSearch.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase().trim();
                if (!term) {
                    renderMapElements(exportDestinations);
                    if (tooltip) tooltip.style.display = 'none';
                    return;
                }
                const matches = exportDestinations.filter(d => 
                    d.country.toLowerCase().includes(term) || 
                    d.port.toLowerCase().includes(term) ||
                    d.name.toLowerCase().includes(term)
                );
                renderMapElements(matches);
                if (matches.length >= 1) {
                    const target = matches[0];
                    highlightDestination(target.id);
                    showTooltip(target, null, target.x, target.y);
                }
            });
        }

        // Initial Map Rendering
        renderMapElements(exportDestinations);
    })();

    /* ==========================================================================
       EXPORT PACKING DETAILS TABLE ENGINE (Encapsulated)
       ========================================================================== */
    (() => {
        const packingTableBody = document.getElementById('packingTableBody');
        if (!packingTableBody) return;
        
        // Comprehensive Packaging Specifications Dataset (from Lavish & Standard Morbi Export)
        const packingData = [
            // Glazed Porcelain (GVT / PGVT)
            { cat: "porcelain", name: "Glazed Porcelain (GVT / PGVT)", size_mm: "600 x 600", size_cm: "60 x 60", thick: "9 mm", pcs_box: 4, sqm_box: 1.44, sqft_box: 15.50, kg_box_euro: 28.5, kg_box_std: 28.5, plt_boxes_euro: 40, plt_boxes_std: 40, plts_fcl_euro: 24, plts_fcl_std: 24, total_boxes_euro: 960, total_boxes_std: 960, total_sqm_euro: 1382.40, total_sqm_std: 1382.40 },
            { cat: "porcelain", name: "Glazed Porcelain (GVT / PGVT)", size_mm: "600 x 1200", size_cm: "60 x 120", thick: "9 mm", pcs_box: 2, sqm_box: 1.44, sqft_box: 15.50, kg_box_euro: 29.5, kg_box_std: 29.3, plt_boxes_euro: 32, plt_boxes_std: 64, plts_fcl_euro: 29, plts_fcl_std: 15, total_boxes_euro: 928, total_boxes_std: 948, total_sqm_euro: 1336.32, total_sqm_std: 1365.12 },
            { cat: "porcelain", name: "Glazed Porcelain (GVT / PGVT)", size_mm: "800 x 800", size_cm: "80 x 80", thick: "9 mm", pcs_box: 2, sqm_box: 1.28, sqft_box: 13.78, kg_box_euro: 26.3, kg_box_std: 39.2, plt_boxes_euro: 50, plt_boxes_std: 36, plts_fcl_euro: 21, plts_fcl_std: 20, total_boxes_euro: 1050, total_boxes_std: 720, total_sqm_euro: 1344.00, total_sqm_std: 1382.40 },
            { cat: "porcelain", name: "Glazed Porcelain (GVT / PGVT)", size_mm: "300 x 600", size_cm: "30 x 60", thick: "9 mm", pcs_box: 5, sqm_box: 0.90, sqft_box: 9.69, kg_box_euro: 17.8, kg_box_std: 17.6, plt_boxes_euro: 64, plt_boxes_std: 72, plts_fcl_euro: 24, plts_fcl_std: 21, total_boxes_euro: 1536, total_boxes_std: 1512, total_sqm_euro: 1382.40, total_sqm_std: 1874.88 },
            { cat: "porcelain", name: "Glazed Porcelain (GVT / PGVT)", size_mm: "1200 x 1200", size_cm: "120 x 120", thick: "9 mm", pcs_box: 2, sqm_box: 2.88, sqft_box: 31.00, kg_box_euro: 59.0, kg_box_std: 59.0, plt_boxes_euro: 28, plt_boxes_std: 28, plts_fcl_euro: 16, plts_fcl_std: 16, total_boxes_euro: 444, total_boxes_std: 444, total_sqm_euro: 1278.72, total_sqm_std: 1278.72 },
            { cat: "porcelain", name: "Glazed Porcelain (GVT / PGVT)", size_mm: "300 x 1200", size_cm: "30 x 120", thick: "9 mm", pcs_box: 4, sqm_box: 1.44, sqft_box: 15.50, kg_box_euro: 30.8, kg_box_std: 30.8, plt_boxes_euro: 36, plt_boxes_std: 36, plts_fcl_euro: 24, plts_fcl_std: 24, total_boxes_euro: 864, total_boxes_std: 864, total_sqm_euro: 1244.16, total_sqm_std: 1244.16 },

            // Monumental Sintered Slabs
            { cat: "slabs", name: "Sintered Porcelain Stone Slabs", size_mm: "1200 x 2400", size_cm: "120 x 240", thick: "9 mm", pcs_box: 1, sqm_box: 2.88, sqft_box: 31.00, kg_box_euro: 62.0, kg_box_std: 62.0, plt_boxes_euro: 20, plt_boxes_std: 20, plts_fcl_euro: 6, plts_fcl_std: 6, total_boxes_euro: 120, total_boxes_std: 120, total_sqm_euro: 345.60, total_sqm_std: 345.60 },
            { cat: "slabs", name: "Sintered Porcelain Stone Slabs", size_mm: "800 x 1600", size_cm: "80 x 160", thick: "9 mm", pcs_box: 2, sqm_box: 2.56, sqft_box: 27.56, kg_box_euro: 54.0, kg_box_std: 54.0, plt_boxes_euro: 28, plt_boxes_std: 28, plts_fcl_euro: 18, plts_fcl_std: 18, total_boxes_euro: 504, total_boxes_std: 504, total_sqm_euro: 1290.24, total_sqm_std: 1290.24 },
            { cat: "slabs", name: "Sintered Porcelain Stone Slabs", size_mm: "1200 x 1800", size_cm: "120 x 180", thick: "9 mm", pcs_box: 1, sqm_box: 2.16, sqft_box: 23.25, kg_box_euro: 46.5, kg_box_std: 46.5, plt_boxes_euro: 30, plt_boxes_std: 30, plts_fcl_euro: 14, plts_fcl_std: 14, total_boxes_euro: 420, total_boxes_std: 420, total_sqm_euro: 907.20, total_sqm_std: 907.20 },

            // Wooden Planks
            { cat: "wood", name: "Wooden Plank Porcelain", size_mm: "200 x 1200", size_cm: "20 x 120", thick: "9 mm", pcs_box: 5, sqm_box: 1.20, sqft_box: 12.92, kg_box_euro: 24.7, kg_box_std: 24.7, plt_boxes_euro: 42, plt_boxes_std: 42, plts_fcl_euro: 26, plts_fcl_std: 26, total_boxes_euro: 1092, total_boxes_std: 1092, total_sqm_euro: 1310.40, total_sqm_std: 1310.40 },
            { cat: "wood", name: "Wooden Plank Porcelain", size_mm: "150 x 900", size_cm: "15 x 90", thick: "9 mm", pcs_box: 8, sqm_box: 1.08, sqft_box: 11.63, kg_box_euro: 21.5, kg_box_std: 21.5, plt_boxes_euro: 48, plt_boxes_std: 48, plts_fcl_euro: 26, plts_fcl_std: 26, total_boxes_euro: 1248, total_boxes_std: 1248, total_sqm_euro: 1347.84, total_sqm_std: 1347.84 },

            // Ceramic Wall & Subway Tiles
            { cat: "wall", name: "Ceramic Architectural Wall Tiles", size_mm: "300 x 600", size_cm: "30 x 60", thick: "9 mm", pcs_box: 8, sqm_box: 1.44, sqft_box: 15.50, kg_box_euro: 23.0, kg_box_std: 14.3, plt_boxes_euro: 40, plt_boxes_std: 96, plts_fcl_euro: 29, plts_fcl_std: 20, total_boxes_euro: 1160, total_boxes_std: 1920, total_sqm_euro: 1670.40, total_sqm_std: 1728.00 },
            { cat: "wall", name: "Ceramic Architectural Wall Tiles", size_mm: "300 x 900", size_cm: "30 x 90", thick: "9 mm", pcs_box: 4, sqm_box: 1.08, sqft_box: 11.63, kg_box_euro: 18.5, kg_box_std: 18.5, plt_boxes_euro: 48, plt_boxes_std: 48, plts_fcl_euro: 26, plts_fcl_std: 26, total_boxes_euro: 1248, total_boxes_std: 1248, total_sqm_euro: 1347.84, total_sqm_std: 1347.84 },
            { cat: "wall", name: "Ceramic Wall Surfaces", size_mm: "250 x 500", size_cm: "25 x 50", thick: "8.5 mm", pcs_box: 8, sqm_box: 1.00, sqft_box: 10.76, kg_box_euro: 15.0, kg_box_std: 15.0, plt_boxes_euro: 64, plt_boxes_std: 64, plts_fcl_euro: 26, plts_fcl_std: 26, total_boxes_euro: 1664, total_boxes_std: 1664, total_sqm_euro: 1664.00, total_sqm_std: 1664.00 },
            { cat: "wall", name: "Artisanal Subway Tiles", size_mm: "75 x 300", size_cm: "7.5 x 30", thick: "8 mm", pcs_box: 44, sqm_box: 0.99, sqft_box: 10.65, kg_box_euro: 12.5, kg_box_std: 12.5, plt_boxes_euro: 96, plt_boxes_std: 96, plts_fcl_euro: 24, plts_fcl_std: 24, total_boxes_euro: 2304, total_boxes_std: 2304, total_sqm_euro: 2280.96, total_sqm_std: 2280.96 },
            { cat: "wall", name: "Artisanal Subway Tiles", size_mm: "100 x 300", size_cm: "10 x 30", thick: "8 mm", pcs_box: 33, sqm_box: 0.99, sqft_box: 10.65, kg_box_euro: 12.5, kg_box_std: 12.5, plt_boxes_euro: 96, plt_boxes_std: 96, plts_fcl_euro: 24, plts_fcl_std: 24, total_boxes_euro: 2304, total_boxes_std: 2304, total_sqm_euro: 2280.96, total_sqm_std: 2280.96 },

            // Outdoor Pavers (20mm Heavy Duty)
            { cat: "outdoor", name: "Heavy Duty 20mm Outdoor Paver", size_mm: "600 x 1200", size_cm: "60 x 120", thick: "20 mm", pcs_box: 1, sqm_box: 0.72, sqft_box: 7.75, kg_box_euro: 32.5, kg_box_std: 32.5, plt_boxes_euro: 32, plt_boxes_std: 32, plts_fcl_euro: 26, plts_fcl_std: 26, total_boxes_euro: 832, total_boxes_std: 832, total_sqm_euro: 599.04, total_sqm_std: 599.04 },

            // Double Charge & Soluble Salt
            { cat: "double-charge", name: "Double Charge Vitrified Tiles", size_mm: "600 x 600", size_cm: "60 x 60", thick: "9 mm", pcs_box: 4, sqm_box: 1.44, sqft_box: 15.50, kg_box_euro: 26.5, kg_box_std: 26.0, plt_boxes_euro: 40, plt_boxes_std: 44, plts_fcl_euro: 26, plts_fcl_std: 24, total_boxes_euro: 1040, total_boxes_std: 1056, total_sqm_euro: 1497.60, total_sqm_std: 1520.64 },
            { cat: "double-charge", name: "Soluble Salt Polished Tiles", size_mm: "600 x 600", size_cm: "60 x 60", thick: "8.5 mm", pcs_box: 4, sqm_box: 1.44, sqft_box: 15.50, kg_box_euro: 24.5, kg_box_std: 23.3, plt_boxes_euro: 42, plt_boxes_std: 44, plts_fcl_euro: 26, plts_fcl_std: 26, total_boxes_euro: 1092, total_boxes_std: 1144, total_sqm_euro: 1572.48, total_sqm_std: 1647.36 }
        ];

        let currentPalletType = 'euro'; // 'euro' or 'standard'
        let currentCategory = 'all';
        let searchQuery = '';

        function renderPackingTable() {
            packingTableBody.innerHTML = '';

            const filtered = packingData.filter(item => {
                const matchesCat = (currentCategory === 'all' || item.cat === currentCategory);
                const matchesSearch = (!searchQuery || 
                    item.name.toLowerCase().includes(searchQuery) ||
                    item.size_mm.includes(searchQuery) ||
                    item.size_cm.includes(searchQuery)
                );
                return matchesCat && matchesSearch;
            });

            if (filtered.length === 0) {
                packingTableBody.innerHTML = `<tr><td colspan="12" style="text-align:center; padding:30px; color:#888;">No packaging specifications matching your search criteria.</td></tr>`;
                return;
            }

            filtered.forEach(item => {
                const isEuro = (currentPalletType === 'euro');
                const kgBox = isEuro ? item.kg_box_euro : item.kg_box_std;
                const pltBoxes = isEuro ? item.plt_boxes_euro : item.plt_boxes_std;
                const pltsFcl = isEuro ? item.plts_fcl_euro : item.plts_fcl_std;
                const totalBoxes = isEuro ? item.total_boxes_euro : item.total_boxes_std;
                const totalSqm = isEuro ? item.total_sqm_euro : item.total_sqm_std;

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${item.name}</strong></td>
                    <td><span class="spec-badge-dark">${item.size_mm}</span></td>
                    <td>${item.size_cm}</td>
                    <td>${item.thick}</td>
                    <td><strong>${item.pcs_box}</strong></td>
                    <td>${item.sqm_box.toFixed(2)}</td>
                    <td>${item.sqft_box.toFixed(2)}</td>
                    <td>${kgBox.toFixed(1)}</td>
                    <td><span class="badge-accent">${pltBoxes}</span></td>
                    <td>${pltsFcl}</td>
                    <td><strong>${totalBoxes}</strong></td>
                    <td><strong class="text-gold">${totalSqm.toFixed(2)}</strong></td>
                `;
                packingTableBody.appendChild(tr);
            });
        }

        // Switcher Buttons Handlers
        const btnEuro = document.getElementById('btnEuroPallet');
        const btnStd = document.getElementById('btnStdPallet');
        if (btnEuro && btnStd) {
            btnEuro.addEventListener('click', () => {
                btnEuro.classList.add('active');
                btnStd.classList.remove('active');
                currentPalletType = 'euro';
                renderPackingTable();
            });
            btnStd.addEventListener('click', () => {
                btnStd.classList.add('active');
                btnEuro.classList.remove('active');
                currentPalletType = 'standard';
                renderPackingTable();
            });
        }

        // Category Tabs
        const pTabs = document.querySelectorAll('.packing-category-tabs .p-tab');
        pTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                pTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentCategory = tab.getAttribute('data-cat');
                renderPackingTable();
            });
        });

        // Search in Packing Table
        const searchInput = document.getElementById('packingTableSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value.toLowerCase().trim();
                renderPackingTable();
            });
        }

        // Initial Render
        renderPackingTable();
    })();

    /* ==========================================================================
       CONTAINER ESTIMATOR CALCULATOR (Encapsulated)
       ========================================================================== */
    (() => {
        const calcTileSelect = document.getElementById('calcTileSelect');
        const calcTargetRegion = document.getElementById('calcTargetRegion');
        const calcAreaInput = document.getElementById('calcAreaInput');
        const calcUnitSelect = document.getElementById('calcUnitSelect');

        const cntResContainers = document.getElementById('cntResContainers');
        const cntResBoxes = document.getElementById('cntResBoxes');
        const cntResPcs = document.getElementById('cntResPcs');
        const cntResPallets = document.getElementById('cntResPallets');
        const cntResWeight = document.getElementById('cntResWeight');
        const cntResBoxesPerPlt = document.getElementById('cntResBoxesPerPlt');
        const cntResWtPerCnt = document.getElementById('cntResWtPerCnt');
        const btnQuoteWithEstimate = document.getElementById('btnQuoteWithEstimate');

        if (!calcTileSelect || !calcAreaInput) return;
        
        const tileConfig = {
            "600x1200_gvt": { label: "600x1200mm Porcelain GVT", sqmBox: 1.44, pcsBox: 2, kgBox: 29.5, boxesPlt: 32, maxBoxesFcl: 928 },
            "600x600_gvt": { label: "600x600mm Porcelain GVT", sqmBox: 1.44, pcsBox: 4, kgBox: 28.5, boxesPlt: 40, maxBoxesFcl: 960 },
            "800x1600_slab": { label: "800x1600mm Sintered Slab", sqmBox: 2.56, pcsBox: 2, kgBox: 54.0, boxesPlt: 28, maxBoxesFcl: 504 },
            "1200x2400_slab": { label: "1200x2400mm Sintered Slab", sqmBox: 2.88, pcsBox: 1, kgBox: 62.0, boxesPlt: 20, maxBoxesFcl: 120 },
            "800x800_gvt": { label: "800x800mm Porcelain GVT", sqmBox: 1.28, pcsBox: 2, kgBox: 26.3, boxesPlt: 50, maxBoxesFcl: 1050 },
            "1200x1200_gvt": { label: "1200x1200mm Porcelain GVT", sqmBox: 2.88, pcsBox: 2, kgBox: 59.0, boxesPlt: 28, maxBoxesFcl: 444 },
            "200x1200_wood": { label: "200x1200mm Wood Planks", sqmBox: 1.20, pcsBox: 5, kgBox: 24.7, boxesPlt: 42, maxBoxesFcl: 1092 },
            "300x600_wall": { label: "300x600mm Ceramic Wall", sqmBox: 1.44, pcsBox: 8, kgBox: 23.0, boxesPlt: 40, maxBoxesFcl: 1160 },
            "75x300_subway": { label: "75x300mm Subway Tiles", sqmBox: 0.99, pcsBox: 44, kgBox: 12.5, boxesPlt: 96, maxBoxesFcl: 2304 },
            "600x1200_outdoor20": { label: "600x1200x20mm Outdoor Paver", sqmBox: 0.72, pcsBox: 1, kgBox: 32.5, boxesPlt: 32, maxBoxesFcl: 832 }
        };

        function recalculateContainerLoad() {
            const tileKey = calcTileSelect.value;
            const regionMaxTon = parseFloat(calcTargetRegion ? calcTargetRegion.value : "28");
            let area = parseFloat(calcAreaInput.value) || 0;
            const unit = calcUnitSelect ? calcUnitSelect.value : 'sqm';

            let areaInSqm = area;
            if (unit === 'sqft') {
                areaInSqm = area / 10.7639; // convert sqft to sqm
            }

            const cfg = tileConfig[tileKey] || tileConfig["600x1200_gvt"];

            // Calculations
            const totalBoxes = Math.ceil(areaInSqm / cfg.sqmBox);
            const totalPieces = totalBoxes * cfg.pcsBox;
            const totalPallets = Math.ceil(totalBoxes / cfg.boxesPlt);
            const totalGrossWeightKg = totalBoxes * cfg.kgBox;
            const totalGrossWeightMT = totalGrossWeightKg / 1000;

            // Maximum boxes per container constrained by regional road weight
            const maxBoxesByWeight = Math.floor((regionMaxTon * 1000) / cfg.kgBox);
            const effectiveBoxesPerFCL = Math.min(cfg.maxBoxesFcl, maxBoxesByWeight);
            const fclCount = Math.max(1, Math.ceil(totalBoxes / effectiveBoxesPerFCL));
            const avgWtPerCnt = (totalGrossWeightMT / fclCount).toFixed(1);

            // Update UI elements
            if (cntResContainers) cntResContainers.textContent = `${fclCount} x 20' FCL`;
            if (cntResBoxes) cntResBoxes.textContent = totalBoxes.toLocaleString();
            if (cntResPcs) cntResPcs.textContent = `${totalPieces.toLocaleString()} Total Pieces`;
            if (cntResPallets) cntResPallets.textContent = `${totalPallets} Pallets`;
            if (cntResBoxesPerPlt) cntResBoxesPerPlt.textContent = `${cfg.boxesPlt} Boxes / Pallet`;
            if (cntResWeight) cntResWeight.textContent = `${totalGrossWeightMT.toFixed(1)} MT`;
            if (cntResWtPerCnt) cntResWtPerCnt.textContent = `~${avgWtPerCnt} MT / Container`;

            // Auto-populate inquiry message when clicking request quote
            if (btnQuoteWithEstimate) {
                btnQuoteWithEstimate.addEventListener('click', (e) => {
                    const expMessage = document.getElementById('expMessage');
                    const expVolume = document.getElementById('expVolume');
                    if (expMessage) {
                        expMessage.value = `Export Inquiry Details:
- Product: ${cfg.label}
- Required Area: ${area} ${unit.toUpperCase()} (${areaInSqm.toFixed(2)} SQ.M)
- Total Boxes: ${totalBoxes}
- Total Pallets: ${totalPallets}
- Estimated Load: ${fclCount} x 20' FCL (~${totalGrossWeightMT.toFixed(1)} MT)`;
                    }
                    if (expVolume) {
                        if (fclCount === 1) expVolume.value = "1_fcl";
                        else if (fclCount <= 5) expVolume.value = "2_5_fcl";
                        else expVolume.value = "6_10_fcl";
                    }
                });
            }
        }

        calcTileSelect.addEventListener('change', recalculateContainerLoad);
        if (calcTargetRegion) calcTargetRegion.addEventListener('change', recalculateContainerLoad);
        calcAreaInput.addEventListener('input', recalculateContainerLoad);
        if (calcUnitSelect) calcUnitSelect.addEventListener('change', recalculateContainerLoad);

        recalculateContainerLoad();
    })();

});


/* ==========================================================================
   MEDIA & BLOG MODULE (INTERACTIVE SEARCH, FILTERING, MODAL READER & NEWSLETTER)
   ========================================================================== */

const BLOG_ARTICLES_DATA = {
    "article-1": {
        title: "The 2026 Architectural Guide to Sintered Porcelain Slabs: Engineering, Facades & High-Traffic Performance",
        category: "Architecture & Design",
        categoryClass: "pill-arch",
        date: "September 2026",
        readTime: "6 min read",
        author: "Pixel Ceramic Technical Editorial (Morbi R&D)",
        image: "assets/slider/1. Architectural surfaces engineered for spaces.jpg",
        lead: "Sintered porcelain slabs represent the pinnacle of modern ceramic engineering, bridging the gap between natural stone aesthetics and indestructible architectural performance.",
        content: `
            <h3>1. The Metallurgy & Firing Science of Sintered Stone</h3>
            <p>Unlike conventional ceramics pressed at 3,000 to 5,000 tonnes, Pixel Ceramic's monumental slabs are formed using continuous compaction systems exerting over 16,000 tonnes of hydraulic pressure. The atomized mineral body—comprising high-purity kaolin clay, feldspar, quartz, and zirconium opacifiers—is fired in computer-controlled roller kilns exceeding 1,220°C.</p>
            <p>This thermal transformation fuses the mineral particles at a microscopic level, producing a virtually impermeable matrix with a water absorption rate under <strong>0.05% (ISO 10545-3)</strong>.</p>
            
            <div class="modal-quote-box">
                "By eliminating macroscopic pore structures, sintered slabs achieve complete resistance to frost, thermal shock, UV degradation, and chemical staining."
            </div>

            <h3>2. Key Engineering Specifications</h3>
            <table class="modal-spec-table">
                <thead>
                    <tr>
                        <th>Technical Parameter</th>
                        <th>Standard Method</th>
                        <th>Pixel Sintered Slab Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Water Absorption</td>
                        <td>ISO 10545-3</td>
                        <td>&le; 0.05% (Group BIa)</td>
                    </tr>
                    <tr>
                        <td>Modulus of Rupture</td>
                        <td>ISO 10545-4</td>
                        <td>&ge; 48 N/mm&sup2;</td>
                    </tr>
                    <tr>
                        <td>Mohs Surface Hardness</td>
                        <td>EN 101</td>
                        <td>Grade 7 &ndash; 8</td>
                    </tr>
                    <tr>
                        <td>Thermal Shock Resistance</td>
                        <td>ISO 10545-9</td>
                        <td>Fully Resistant (&Delta;T = 150&deg;C)</td>
                    </tr>
                    <tr>
                        <td>UV & Color Fastness</td>
                        <td>DIN 51094</td>
                        <td>100% Unaffected by UV Radiation</td>
                    </tr>
                </tbody>
            </table>

            <h3>3. Ventilated Facades & Exterior Cladding Applications</h3>
            <p>For large-scale commercial buildings and hospitality towers, our 6mm and 9mm sintered slabs reduce structural dead load by up to 60% compared to 20mm granite or marble cladding. When paired with open-joint aluminum subframe anchors, these surfaces provide superior thermal insulation and acoustic dampening while resisting high wind loads.</p>

            <h3>4. Zero-Stain Kitchen Countertops & Wet Areas</h3>
            <p>Because sintered stone is non-porous, hot pans, oils, acidic citrus juices, and cleaning chemicals cannot penetrate or etch the surface. Seamless 1200x2400 mm installations eliminate unsanitary grout lines in luxury culinary spaces.</p>
        `,
        ctaTitle: "Specifying Sintered Slabs for Your Project?",
        ctaDesc: "Request factory-direct samples or CAD installation details for your architectural studio."
    },
    "article-2": {
        title: "Vitrified vs. Porcelain Tiles: The Technical Benchmark for Commercial Specifiers",
        category: "Technical & Installation",
        categoryClass: "pill-tech",
        date: "August 28, 2026",
        readTime: "5 min read",
        author: "Quality Engineering Bureau",
        image: "assets/slider/2. Subtle geometric motifs engineered to elevate quiet spaces.jpg",
        lead: "Understanding the technical distinctions between soluble salt vitrified tiles, glazed vitrified tiles (GVT), and full-body porcelain stoneware is essential for lifetime structural compliance.",
        content: `
            <h3>1. The Core Differences in Body Composition</h3>
            <p>While the terms are often used interchangeably in commercial trade, porcelain tiles meet strict international standards defined by <strong>ISO 13006 / EN 14411 Group BIa</strong>, requiring water absorption &le; 0.5% (and &le; 0.05% for premium vitrified lines). Standard ceramic tiles (Group BIIa/BIII) exhibit absorption rates between 3% and 10%.</p>

            <h3>2. Surface Wear and PEI Abrasion Classes</h3>
            <p>Pixel Ceramic's Glazed Vitrified Tiles (GVT/PGVT) feature multi-layer digital glaze coats tested up to <strong>PEI IV and PEI V</strong>, making them capable of handling millions of foot traffic cycles in airports, corporate headquarters, and retail concourses without surface dulling.</p>

            <div class="modal-quote-box">
                "Specifying Group BIa fully vitrified porcelain ensures high flexural strength (&gt;35 N/mm&sup2;) and complete immunity to moisture-induced warping."
            </div>

            <h3>3. Technical Selection Checklist for Architects</h3>
            <p>When selecting surfaces for commercial projects, always verify:</p>
            <ul>
                <li><strong>Breaking Strength:</strong> Ensure &ge; 1,500 N for floor loads.</li>
                <li><strong>Frost Resistance:</strong> Mandatory for outdoor patios in cold climate zones.</li>
                <li><strong>Chemical Resistance:</strong> Class GA/GLA under ISO 10545-13 for commercial sanitization.</li>
            </ul>
        `,
        ctaTitle: "Need Full Testing Data Sheets?",
        ctaDesc: "Download our complete ISO 13006 / ASTM test reports for engineering submissions."
    },
    "article-3": {
        title: "2026 Tile Design Forecast: Tactile Carving Finishes, Fluted Surfaces & Earth Tones",
        category: "Tile Trends & Finishes",
        categoryClass: "pill-trend",
        date: "August 15, 2026",
        readTime: "4 min read",
        author: "Pixel Ceramic Design Studio",
        image: "assets/slider/3. Rich marble textures crafted for bold kitchen walls.jpg",
        lead: "Modern interior architecture is pivoting towards rich, multi-sensory surfaces where tactile micro-textures and organic earth minerals create serene, grounded atmospheres.",
        content: `
            <h3>1. Synchro-Carving & Digital Vein Inking</h3>
            <p>The newest breakthrough in ceramic printing is synchronous digital carving. High-precision inkjet glaze nozzles deposit reactive inks along the marble veining patterns before entering the kiln, producing realistic tactile depressions that mirror authentic Italian quarry marble.</p>

            <h3>2. Fluted and 3D Micro-Reliefs</h3>
            <p>Commercial lobby walls and bathroom vanities are embracing fluted vertical geometries. These 3D surfaces interact dynamically with architectural lighting, casting soft shadows that lend depth and movement to interior spaces.</p>

            <h3>3. The Warm Minimalist Palette</h3>
            <p>Cool sterile grays are giving way to warm travertine, almond limestone, clay terracotta, and olive sage tones. These warm earthy palettes foster biophilic wellness in wellness spas and luxury residences.</p>
        `,
        ctaTitle: "Explore the 2026 Design Collection",
        ctaDesc: "Browse our latest high-definition carving and fluted porcelain series."
    },
    "article-4": {
        title: "Optimizing Container Freight & Breakage Prevention for Oceanic Tile Exports",
        category: "Export & Logistics",
        categoryClass: "pill-export",
        date: "August 02, 2026",
        readTime: "7 min read",
        author: "Global Maritime Logistics Team",
        image: "assets/calculator-header-bg.jpg",
        lead: "Maritime shipping of ceramic tiles requires meticulous weight optimization, heavy-duty packing engineering, and strategic port proximity to guarantee zero-breakage container delivery.",
        content: `
            <h3>1. Pixel Ceramic's 4-Tier Export Packing Architecture</h3>
            <p>To withstand intense ocean transit harmonics and multi-modal handling, every consignment follows a strict 4-tier packaging protocol:</p>
            <ol>
                <li><strong>Foam Corner Edge Protectors:</strong> High-density EVA cushioning on all tile corners.</li>
                <li><strong>Heavy-Duty 3-Ply Corrugated Cartons:</strong> Moisture-resistant outer boxes with automated barcode labeling.</li>
                <li><strong>ISPM-15 Heat-Treated & Fumigated Pallets:</strong> Certified solid hardwood skids built to European and American logistics dimensions.</li>
                <li><strong>Thermal Shrink-Wrap & High-Tensile PET Strapping:</strong> Multi-layer waterproof wrapping with airtight strapping anchors.</li>
            </ol>

            <h3>2. Port Proximity Advantage: Mundra Port (180 km)</h3>
            <p>Located just 180 km from Mundra Port—India's largest deep-water commercial container port—our factory achieves same-day gate-in, minimizing inland haulage costs and road vibration risk.</p>
        `,
        ctaTitle: "Calculate Container Pallet Capacities",
        ctaDesc: "Use our interactive export calculator to determine optimal 20ft FCL container loads."
    },
    "article-5": {
        title: "Biophilic Architecture: Integrating Natural Wood-Look Porcelain Planks in Modern Facades",
        category: "Architecture & Design",
        categoryClass: "pill-arch",
        date: "July 21, 2026",
        readTime: "5 min read",
        author: "Sustainable Architecture Advisory",
        image: "assets/slider/5. Artisan tile textures crafted for fresh interior accents.jpg",
        lead: "Wooden plank porcelain combines the restorative emotional warmth of authentic Scandinavian oak with the zero-maintenance, fire-rated resilience of vitrified stoneware.",
        content: `
            <h3>1. Natural Aesthetics Without Ecological Depletion</h3>
            <p>Harvesting old-growth hardwood forests for commercial siding poses severe environmental and fire risks. Pixel Ceramic's 20x120 cm and 20x100 cm wood-look porcelain planks replicate genuine grain patterns, knots, and saw-mark textures using eco-friendly digital scanning.</p>

            <h3>2. Class A1 Fire Performance & Zero Moisture Decay</h3>
            <p>Unlike real wood which rots, swells in humid zones, and requires annual toxic chemical sealing, vitrified wood planks are 100% fireproof (Class A1), termite-proof, and impervious to rain or pool splashes.</p>
        `,
        ctaTitle: "Request Wood Plank Swatches",
        ctaDesc: "Get a sample presentation box of our Teakwood, Pine, and Walnut series."
    },
    "article-6": {
        title: "Slip Resistance & Pendulum Test (PTV) Ratings for Commercial Hospitality",
        category: "Technical & Installation",
        categoryClass: "pill-tech",
        date: "July 10, 2026",
        readTime: "6 min read",
        author: "Engineering Compliance Division",
        image: "assets/slider/6. Layered earthy surfaces designed for balanced living spaces.jpg",
        lead: "A technical guide to specifying DIN 51130 R-ratings and wet pendulum test values (PTV &ge; 36) for hotel entrances, public concourses, and wet amenity decks.",
        content: `
            <h3>1. Understanding DIN 51130 R-Values and Pendulum BS 7976-2</h3>
            <p>Commercial specifiers must ensure public safety compliance across high-risk slip zones:</p>
            <ul>
                <li><strong>R9 / PTV 24-35:</strong> Suitable for dry internal areas such as hotel lobbies, corporate suites, and bedrooms.</li>
                <li><strong>R10 / PTV 36+:</strong> Recommended for restaurant dining areas, shopping malls, and public restrooms.</li>
                <li><strong>R11 / PTV 45+:</strong> Essential for exterior ramps, wet pool copings, commercial kitchens, and showers.</li>
            </ul>

            <h3>2. Micro-Grip Glaze Formulation</h3>
            <p>Pixel Ceramic utilizes specialized corundum and crystalline mineral topcoats that generate high wet friction without creating rough, hard-to-clean microscopic valleys.</p>
        `,
        ctaTitle: "Review Full Slip Resistance Certificates",
        ctaDesc: "Download PTV and DIN 51130 test certificates for your project submittals."
    },
    "article-7": {
        title: "Pixel Ceramic Commissions New 16,000-Tonne Automated Continuous Press Line",
        category: "Media & Press",
        categoryClass: "pill-media",
        date: "June 30, 2026",
        readTime: "3 min read",
        author: "Corporate Communications",
        image: "assets/about/factory-exterior.jpg",
        lead: "Expanding our advanced manufacturing infrastructure in Morbi, Gujarat, to meet accelerating global demand for large-format sintered porcelain architectural slabs.",
        content: `
            <h3>1. Infrastructure Expansion Overview</h3>
            <p>Pixel Ceramic Pvt. Ltd. has officially commissioned its second continuous hydraulic compaction line, increasing total manufacturing capacity beyond 1.4 million square meters annually. The state-of-the-art facility integrates Italian continuous compaction technology with automated robotic palletizers.</p>

            <h3>2. Sustainability & Heat Recovery Kilns</h3>
            <p>The new line features intelligent heat-recuperation kilns that channel exhaust thermal energy back into the atomized spray-drying chambers, cutting natural gas consumption by 22% and reducing carbon emissions per square meter.</p>
        `,
        ctaTitle: "Explore Manufacturing Capabilities",
        ctaDesc: "Learn more about our factory heritage, kiln capacities, and quality control systems."
    },
    "article-8": {
        title: "Why Global Importers & Contractors Source Sintered Surfaces from Morbi",
        category: "Export & Logistics",
        categoryClass: "pill-export",
        date: "June 12, 2026",
        readTime: "5 min read",
        author: "International Trade Desk",
        image: "assets/export-header-bg.jpg",
        lead: "How Morbi's consolidated raw material ecosystem, direct gas grid, and scale economics deliver European quality at exceptional cost advantages.",
        content: `
            <h3>1. The World's Premier Ceramic Cluster</h3>
            <p>Producing over 80% of India's total ceramic output, the Morbi industrial cluster benefits from a vertically integrated supply chain encompassing high-grade ball clays from Rajasthan, feldspar refineries, and digital glaze laboratories.</p>

            <h3>2. Quality Parity with Western European Manufacturers</h3>
            <p>With Italian and Spanish machinery, high-tonnage presses, and ISO 13006 / CE testing compliance, Pixel Ceramic provides tier-1 commercial porcelain at competitive factory-gate pricing.</p>
        `,
        ctaTitle: "Inquire for Direct B2B Pricing",
        ctaDesc: "Connect with our export sales team for CIF and FOB pricing across major global ports."
    },
    "article-9": {
        title: "Subway & Artisanal Wall Tiles: Revitalizing Boutique Retail & Luxury Bathrooms",
        category: "Architecture & Design",
        categoryClass: "pill-arch",
        date: "May 25, 2026",
        readTime: "4 min read",
        author: "Interior Design Advisory",
        image: "assets/slider/4. Timeless patterned surfaces tailored for elegant accent walls.jpg",
        lead: "Handcrafted edge profiles, deep crystalline glazes, and versatile herringbone patterns bring bespoke tactile luxury to commercial accent walls.",
        content: `
            <h3>1. The Return of Artisanal Micro-Formats</h3>
            <p>While large slabs dominate flooring, smaller artisanal tiles (7.5x30 cm and 10x30 cm) are leading feature wall aesthetics. Our high-gloss and semi-matte crystalline glazes reflect ambient light with depth and character.</p>

            <h3>2. Layout Variations: Herringbone, Stacked & Brick Bond</h3>
            <p>Artisanal subway tiles allow architects to create unique architectural signatures in cocktail lounges, restaurant backsplashes, and boutique hotel bathrooms.</p>
        `,
        ctaTitle: "Explore Subway & Wall Collections",
        ctaDesc: "View high-gloss and matte finishes across our handcrafted wall tile series."
    },
    "article-10": {
        title: "Pixel Ceramic Unveils Sintered Stone Collections at Global Architecture Expos",
        category: "Media & Press",
        categoryClass: "pill-media",
        date: "May 05, 2026",
        readTime: "3 min read",
        author: "Press Relations",
        image: "assets/home-about-surface.jpg",
        lead: "Presenting our newly certified ultra-slim 6mm ventilated facade slabs and bookmatched Statuario marble series to international architects and distributors.",
        content: `
            <h3>1. International Trade Showcase</h3>
            <p>Pixel Ceramic showcased its 2026-2027 collection at leading international architectural exhibitions. Highlights included bookmatched 1200x2400 mm Statuario slabs, non-slip outdoor pavers, and sustainable recycled-content vitrified surfaces.</p>

            <h3>2. Positive Reception Across Global Distribution Networks</h3>
            <p>Over 120 new distribution partnerships were established across North America, Europe, the Middle East, and Southeast Asia, affirming Pixel Ceramic's reputation as a reliable global manufacturing partner.</p>
        `,
        ctaTitle: "Schedule a Consultation",
        ctaDesc: "Book a meeting with our corporate representatives or request private label manufacturing details."
    }
};

function initBlogPage() {
    const categoryTabs = document.querySelectorAll('#blogCategoryTabs .category-tab-btn');
    const searchInput = document.getElementById('blogSearchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const cardsGrid = document.getElementById('blogCardsGrid');
    const blogCards = document.querySelectorAll('.blog-card');
    const filterStatus = document.getElementById('filterStatus');
    const filterCategoryLabel = document.getElementById('filterCategoryLabel');
    const searchKeywordLabel = document.getElementById('searchKeywordLabel');
    const resetFilterBtn = document.getElementById('resetFilterBtn');
    const noResultsMsg = document.getElementById('noResultsMsg');
    
    // Modal elements
    const modalBackdrop = document.getElementById('articleModalBackdrop');
    const modalBody = document.getElementById('articleModalBody');
    const closeBtn = document.getElementById('closeArticleModal');

    if (!cardsGrid && !modalBackdrop) return; // Not on blog page

    let currentCategory = 'all';
    let currentSearchTerm = '';

    function filterArticles() {
        let visibleCount = 0;

        blogCards.forEach(card => {
            const cardCat = card.getAttribute('data-category');
            const cardTitle = (card.querySelector('.card-title')?.textContent || '').toLowerCase();
            const cardExcerpt = (card.querySelector('.card-excerpt')?.textContent || '').toLowerCase();
            const cardKeywords = (card.getAttribute('data-keywords') || '').toLowerCase();
            const textToSearch = `${cardTitle} ${cardExcerpt} ${cardKeywords}`;

            const matchesCategory = (currentCategory === 'all' || cardCat === currentCategory);
            const matchesSearch = !currentSearchTerm || textToSearch.includes(currentSearchTerm);

            if (matchesCategory && matchesSearch) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Update status info
        const isFiltering = currentCategory !== 'all' || currentSearchTerm.length > 0;
        if (filterStatus) {
            if (isFiltering) {
                filterStatus.style.display = 'flex';
                if (filterCategoryLabel) {
                    const activeTab = document.querySelector('#blogCategoryTabs .category-tab-btn.active');
                    filterCategoryLabel.textContent = activeTab ? activeTab.textContent.replace(/\d+/g, '').trim() : 'All';
                }
                if (searchKeywordLabel) {
                    searchKeywordLabel.textContent = currentSearchTerm ? `| Keyword: "${currentSearchTerm}"` : '';
                }
            } else {
                filterStatus.style.display = 'none';
            }
        }

        // Show/hide no results
        if (noResultsMsg) {
            noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }

    // Category click listener
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentCategory = tab.getAttribute('data-category');
            filterArticles();
        });
    });

    // Search input listener
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearchTerm = e.target.value.trim().toLowerCase();
            if (clearSearchBtn) {
                clearSearchBtn.style.display = currentSearchTerm ? 'block' : 'none';
            }
            filterArticles();
        });
    }

    // Clear search button
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            currentSearchTerm = '';
            clearSearchBtn.style.display = 'none';
            filterArticles();
            if (searchInput) searchInput.focus();
        });
    }

    // Reset filter button
    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', () => {
            window.resetBlogSearch();
        });
    }

    window.resetBlogSearch = function() {
        currentCategory = 'all';
        currentSearchTerm = '';
        if (searchInput) searchInput.value = '';
        if (clearSearchBtn) clearSearchBtn.style.display = 'none';
        categoryTabs.forEach(t => {
            if (t.getAttribute('data-category') === 'all') {
                t.classList.add('active');
            } else {
                t.classList.remove('active');
            }
        });
        filterArticles();
    };

    // Article Modal Reader Logic
    function openArticleModal(articleId) {
        const data = BLOG_ARTICLES_DATA[articleId];
        if (!data || !modalBody || !modalBackdrop) return;

        modalBody.innerHTML = `
            <img src="${data.image}" alt="${data.title}" class="modal-hero-img">
            <div class="article-meta-top">
                <span class="category-pill ${data.categoryClass}">${data.category}</span>
                <span class="read-time"><i class="fa-regular fa-clock mr-4"></i> ${data.readTime}</span>
                <span class="publish-date"><i class="fa-regular fa-calendar mr-4"></i> ${data.date}</span>
            </div>
            <h1 class="modal-article-title" id="modalArticleTitle">${data.title}</h1>
            <div class="modal-article-meta">
                <span><i class="fa-solid fa-user-pen mr-6 text-gold"></i> By ${data.author}</span>
                <span><i class="fa-solid fa-industry mr-6 text-gold"></i> Pixel Ceramic Morbi Complex</span>
            </div>
            <p class="modal-lead">${data.lead}</p>
            <div class="modal-body-text">
                ${data.content}
            </div>
            <div class="modal-cta-box">
                <div>
                    <h4>${data.ctaTitle}</h4>
                    <p>${data.ctaDesc}</p>
                </div>
                <a href="contact.html?type=sample" class="btn btn-primary btn-sm" style="white-space: nowrap;">
                    <i class="fa-solid fa-box-open mr-6"></i> Request Sample Kit
                </a>
            </div>
        `;

        modalBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeArticleModal() {
        if (!modalBackdrop) return;
        modalBackdrop.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Attach click triggers for modals
    document.querySelectorAll('.open-article-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const articleId = btn.getAttribute('data-article-id');
            if (articleId) openArticleModal(articleId);
        });
    });

    // Also clicking anywhere on the card opens the article
    document.querySelectorAll('.blog-card, .blog-featured-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('button') || e.target.closest('a')) return; // Allow button clicks
            const articleId = card.getAttribute('data-article-id');
            if (articleId) openArticleModal(articleId);
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeArticleModal);
    }

    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) {
                closeArticleModal();
            }
        });
    }

    // ESC key close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('active')) {
            closeArticleModal();
        }
    });
}

// Newsletter submit handler
window.handleNewsletterSubmit = function(event) {
    event.preventDefault();
    const emailInput = document.getElementById('newsletterEmailInput');
    const toast = document.getElementById('blogToast');
    
    if (!emailInput || !emailInput.value) return;

    const email = emailInput.value.trim();
    if (toast) {
        toast.innerHTML = `<i class="fa-solid fa-circle-check mr-8 text-gold"></i> Thank you! <strong>${email}</strong> is subscribed to the Architecture &amp; Trade Digest.`;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4500);
    }

    emailInput.value = '';
};

// Initialize on DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlogPage);
} else {
    initBlogPage();
}


/* ==========================================================================
   DOWNLOADS PAGE INTERACTIVE SEARCH & CATEGORY FILTER MODULE
   ========================================================================== */

function initDownloadsPage() {
    const categoryTabs = document.querySelectorAll('#downloadCategoryTabs .cat-tab-btn');
    const searchInput = document.getElementById('downloadSearchInput');
    const clearSearchBtn = document.getElementById('clearDownloadSearch');
    const cardsGrid = document.getElementById('cataloguesGrid');
    const catalogueCards = document.querySelectorAll('.catalogue-card');
    const filterStatus = document.getElementById('downloadFilterStatus');
    const filterCatLabel = document.getElementById('filterCatLabel');
    const searchKwLabel = document.getElementById('searchKwLabel');
    const resetFilterBtn = document.getElementById('resetDownloadFilter');
    const noResultsMsg = document.getElementById('noDownloadResults');

    if (!cardsGrid) return; // Not on downloads page

    let currentCategory = 'all';
    let currentSearchTerm = '';

    function filterCatalogues() {
        let visibleCount = 0;

        catalogueCards.forEach(card => {
            const cardCat = card.getAttribute('data-category');
            const cardTitle = (card.querySelector('.cat-title')?.textContent || '').toLowerCase();
            const cardDesc = (card.querySelector('.cat-desc')?.textContent || '').toLowerCase();
            const cardKeywords = (card.getAttribute('data-keywords') || '').toLowerCase();
            const textToSearch = `${cardTitle} ${cardDesc} ${cardKeywords}`;

            const matchesCategory = (currentCategory === 'all' || cardCat === currentCategory);
            const matchesSearch = !currentSearchTerm || textToSearch.includes(currentSearchTerm);

            if (matchesCategory && matchesSearch) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Update status info
        const isFiltering = currentCategory !== 'all' || currentSearchTerm.length > 0;
        if (filterStatus) {
            if (isFiltering) {
                filterStatus.style.display = 'flex';
                if (filterCatLabel) {
                    const activeTab = document.querySelector('#downloadCategoryTabs .cat-tab-btn.active');
                    filterCatLabel.textContent = activeTab ? activeTab.textContent.replace(/\d+/g, '').trim() : 'All';
                }
                if (searchKwLabel) {
                    searchKwLabel.textContent = currentSearchTerm ? `| Search: "${currentSearchTerm}"` : '';
                }
            } else {
                filterStatus.style.display = 'none';
            }
        }

        // Show/hide no results
        if (noResultsMsg) {
            noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }

    // Category click listener
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentCategory = tab.getAttribute('data-category');
            filterCatalogues();
        });
    });

    // Search input listener
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearchTerm = e.target.value.trim().toLowerCase();
            if (clearSearchBtn) {
                clearSearchBtn.style.display = currentSearchTerm ? 'block' : 'none';
            }
            filterCatalogues();
        });
    }

    // Clear search button
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            currentSearchTerm = '';
            clearSearchBtn.style.display = 'none';
            filterCatalogues();
            if (searchInput) searchInput.focus();
        });
    }

    // Reset filter button
    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', () => {
            window.resetDownloadFilters();
        });
    }

    window.resetDownloadFilters = function() {
        currentCategory = 'all';
        currentSearchTerm = '';
        if (searchInput) searchInput.value = '';
        if (clearSearchBtn) clearSearchBtn.style.display = 'none';
        categoryTabs.forEach(t => {
            if (t.getAttribute('data-category') === 'all') {
                t.classList.add('active');
            } else {
                t.classList.remove('active');
            }
        });
        filterCatalogues();
    };
}

// Initialize on DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDownloadsPage);
} else {
    initDownloadsPage();
}


/* ==========================================================================
   DOWNLOADS PAGE: REQUEST PDF MODAL CONTROLLER
   ========================================================================== */
function initRequestPdfModal() {
    const modal = document.getElementById('requestPdfModal');
    if (!modal) return;

    const requestBtns = document.querySelectorAll('.request-pdf-btn');
    const closeBtn = document.getElementById('closeReqPdfModal');
    const closeSuccessBtn = document.getElementById('closeReqSuccessBtn');
    const formView = document.getElementById('reqModalFormView');
    const successView = document.getElementById('reqModalSuccessView');
    const form = document.getElementById('requestPdfForm');

    const catNameDisplay = document.getElementById('reqModalCatName');
    const hiddenCatInput = document.getElementById('reqHiddenCatalogue');

    const personNameInput = document.getElementById('reqPersonName');
    const companyNameInput = document.getElementById('reqCompanyName');
    const companyEmailInput = document.getElementById('reqCompanyEmail');
    const countryCodeInput = document.getElementById('reqCountryCode');
    const mobileNumberInput = document.getElementById('reqMobileNumber');
    const countryNameInput = document.getElementById('reqCountryName');
    const messageInput = document.getElementById('reqMessageBox');

    let currentDirectPdf = '';

    function openModal(catName, directPdf = '', customMsg = '') {
        catNameDisplay.textContent = catName;
        hiddenCatInput.value = catName;
        currentDirectPdf = directPdf;
        if (customMsg && messageInput) {
            messageInput.value = customMsg;
        }

        // Reset errors
        document.querySelectorAll('.form-group.has-error').forEach(el => el.classList.remove('has-error'));

        // Show form view
        formView.style.display = 'block';
        successView.style.display = 'none';

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        if (personNameInput) {
            setTimeout(() => personNameInput.focus(), 100);
        }
    }

    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Attach click to all Request PDF buttons
    requestBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const cat = btn.getAttribute('data-catalogue') || 'Pixel Ceramic Catalogue';
            const pdf = btn.getAttribute('data-pdf') || '';
            openModal(cat, pdf);
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeModal);

    // Click outside backdrop
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Form submission validation
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;

            const nameVal = personNameInput ? personNameInput.value.trim() : '';
            const companyVal = companyNameInput ? companyNameInput.value.trim() : '';
            const emailVal = companyEmailInput ? companyEmailInput.value.trim() : '';
            const countryCodeVal = countryCodeInput ? countryCodeInput.value.trim() : '';
            const mobileVal = mobileNumberInput ? mobileNumberInput.value.trim() : '';
            const countryVal = countryNameInput ? countryNameInput.value.trim() : '';
            const msgVal = messageInput ? messageInput.value.trim() : '';
            const catVal = hiddenCatInput ? hiddenCatInput.value.trim() : 'Catalogue';
            const fullPhone = countryCodeVal ? `${countryCodeVal} ${mobileVal}` : mobileVal;

            // Validate Person Name
            const grpName = document.getElementById('groupReqPersonName');
            if (!nameVal) {
                if (grpName) grpName.classList.add('has-error');
                isValid = false;
            } else {
                if (grpName) grpName.classList.remove('has-error');
            }

            // Validate Company Name
            const grpCompany = document.getElementById('groupReqCompanyName');
            if (!companyVal) {
                if (grpCompany) grpCompany.classList.add('has-error');
                isValid = false;
            } else {
                if (grpCompany) grpCompany.classList.remove('has-error');
            }

            // Validate Email
            const grpEmail = document.getElementById('groupReqCompanyEmail');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailVal || !emailRegex.test(emailVal)) {
                if (grpEmail) grpEmail.classList.add('has-error');
                isValid = false;
            } else {
                if (grpEmail) grpEmail.classList.remove('has-error');
            }

            // Validate Country Code and Mobile
            const grpMobile = document.getElementById('groupReqMobileNumber');
            if (!countryCodeVal || !mobileVal || mobileVal.length < 5) {
                if (grpMobile) grpMobile.classList.add('has-error');
                isValid = false;
            } else {
                if (grpMobile) grpMobile.classList.remove('has-error');
            }

            // Validate Country
            const grpCountry = document.getElementById('groupReqCountryName');
            if (!countryVal) {
                if (grpCountry) grpCountry.classList.add('has-error');
                isValid = false;
            } else {
                if (grpCountry) grpCountry.classList.remove('has-error');
            }

            if (!isValid) return;

            // Submit success state
            const submitBtn = document.getElementById('submitReqPdfBtn');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-8"></i> Submitting Request...';
            }

            setTimeout(() => {
                // Populate success view
                const sName = document.getElementById('successPersonName');
                const sCat = document.getElementById('successCatalogueName');
                const sEmail = document.getElementById('successCompanyEmail');
                const sComp = document.getElementById('successCompanyDisplay');
                const sCountry = document.getElementById('successCountryDisplay');

                if (sName) sName.textContent = nameVal;
                if (sCat) sCat.textContent = catVal;
                if (sEmail) sEmail.textContent = emailVal;
                if (sComp) sComp.textContent = companyVal;
                if (sCountry) sCountry.textContent = countryVal;

                // Direct download if available
                const dlNowBtn = document.getElementById('successDownloadNowBtn');
                if (dlNowBtn) {
                    if (currentDirectPdf) {
                        dlNowBtn.href = currentDirectPdf;
                        dlNowBtn.style.display = 'inline-flex';
                    } else {
                        dlNowBtn.style.display = 'none';
                    }
                }

                // WhatsApp prefilled message
                const waBtn = document.getElementById('successWhatsAppBtn');
                if (waBtn) {
                    const waText = encodeURIComponent(`Hello Pixel Ceramic, I have requested the PDF catalogue for "${catVal}".\nName: ${nameVal}\nCompany: ${companyVal}\nCountry: ${countryVal}\nEmail: ${emailVal}\nPhone: ${fullPhone}`);
                    waBtn.href = `https://wa.me/919727974535?text=${waText}`;
                }

                // Show success view
                formView.style.display = 'none';
                successView.style.display = 'block';

                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane mr-8"></i> Submit PDF Request';
                }

                form.reset();
            }, 600);
        });
    }
    window.openRequestPdfModal = openModal;

}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRequestPdfModal);
} else {
    initRequestPdfModal();
}


/* ==========================================================================
   FULL SCREEN SIZE FINISHES POP-UP MODAL CONTROLLER
   ========================================================================== */
function initSizeFinishesModal() {
    const modal = document.getElementById('sizeFinishesModal');
    if (!modal) return;

    const modalBadge = document.getElementById('sfModalBadge');
    const modalFormat = document.getElementById('sfModalFormat');
    const modalTitle = document.getElementById('sfModalTitle');
    const modalSubtitle = document.getElementById('sfModalSubtitle');
    const gridContainer = document.getElementById('sfFinishesGrid');

    const closeBtn = document.getElementById('closeSizeFinishesModal');
    const closeBottomBtn = document.getElementById('closeSizeFinishesModalBtn');

    // Lightbox modal for swatch zoom
    const lightboxModal = document.getElementById('image-preview-modal');
    const lightboxImg = document.getElementById('modal-img');
    const lightboxCaption = document.getElementById('preview-modal-caption');
    const lightboxClose = lightboxModal ? lightboxModal.querySelector('.preview-modal-close') : null;

    let currentSizeData = null;

    function openSizeFinishesModal(sizeId) {
        if (!window.SIZE_FINISHES_DATA) {
            console.warn('SIZE_FINISHES_DATA not loaded');
            return;
        }

        const data = window.SIZE_FINISHES_DATA[sizeId];
        if (!data) {
            console.warn('No finishes data found for sizeId:', sizeId);
            return;
        }

        currentSizeData = data;

        // Set Header
        if (modalBadge) {
            modalBadge.innerHTML = `<i class="fa-solid fa-shapes mr-6"></i> ${data.categoryLabel}`;
        }
        if (modalFormat) {
            modalFormat.textContent = data.sizeLabel;
        }
        if (modalTitle) {
            modalTitle.innerHTML = `${data.sizeLabel} <span style="font-weight: 500; color: #b45309;">— Surface Finishes</span>`;
        }
        if (modalSubtitle) {
            modalSubtitle.textContent = data.description;
        }

        // Render Grid directly without filters
        renderFinishesGrid();

        // Open modal
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeSizeFinishesModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function renderFinishesGrid() {
        if (!gridContainer || !currentSizeData) return;

        const finishes = currentSizeData.finishes || [];
        let cardsHtml = '';

        if (finishes.length === 1) {
            gridContainer.classList.add('single-card');
        } else {
            gridContainer.classList.remove('single-card');
        }

        finishes.forEach(fin => {
            // Build swatches markup
            let swatchesHtml = '';
            if (fin.swatches && fin.swatches.length > 0) {
                const swatchClass = fin.swatches.length === 1 ? 'single-swatch' : 'two-swatches';
                swatchesHtml = `
                    <div class="sf-swatches-section">
                        <div class="sf-swatches-title">
                            <span><i class="fa-solid fa-images mr-6"></i> Production Design Preview</span>
                            <span>Click to enlarge</span>
                        </div>
                        <div class="sf-swatches-grid ${swatchClass}">
                `;
                fin.swatches.forEach(sw => {
                    const posStyle = sw.position ? ` style="object-position: ${sw.position} !important;"` : (sw.name === 'Riva Frost' || sw.name === 'Bali Lux' ? ' style="object-position: top center !important;"' : '');
                    swatchesHtml += `
                        <div class="sf-swatch-item" data-swatch-img="${sw.image}" data-swatch-name="${sw.name}" title="${sw.name} - Click to enlarge">
                            <img src="${sw.image}" alt="${sw.name}" class="sf-swatch-img" loading="lazy"${posStyle}>
                            <div class="sf-swatch-overlay">
                                <span class="sf-swatch-name">${sw.name}</span>
                            </div>
                            <span class="sf-swatch-zoom-badge"><i class="fa-solid fa-magnifying-glass-plus"></i></span>
                        </div>
                    `;
                });
                swatchesHtml += `</div></div>`;
            }

            cardsHtml += `
                <div class="sf-finish-card">
                    <div class="sf-card-header">
                        <div class="sf-card-icon-box">
                            <i class="${fin.icon || 'fa-solid fa-gem'}"></i>
                        </div>
                        <div class="sf-card-title-group">
                            <h3 class="sf-card-finish-name">${fin.name}</h3>
                            <div style="display:flex; flex-wrap:wrap; gap:6px; align-items:center;">
                                <span class="sf-card-gloss-pill"><i class="fa-solid fa-circle-check"></i> ${fin.glossLevel}</span>
                                ${fin.finishBadge ? `<span style="display:inline-flex; align-items:center; gap:4px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:6px; padding:3px 8px; font-size:0.73rem; color:#166534; font-weight:600;"><i class="fa-solid fa-tag"></i> ${fin.finishBadge}</span>` : ''}
                                ${fin.folderName ? `<span style="display:inline-flex; align-items:center; gap:5px; background:#fef9c3; border:1px solid #fef08a; border-radius:6px; padding:3px 8px; font-size:0.73rem; color:#854d0e; font-weight:700;"><i class="fa-solid fa-folder-open"></i> ${fin.folderName}</span>` : ''}
                            </div>
                        </div>
                    </div>

                    <div class="sf-card-specs-table">
                        <div class="sf-card-spec-item">
                            <span class="sf-card-spec-label">Surface Texture</span>
                            <span class="sf-card-spec-value">${fin.texture}</span>
                        </div>
                        <div class="sf-card-spec-item">
                            <span class="sf-card-spec-label">Slip Rating</span>
                            <span class="sf-card-spec-value">${fin.slipRating}</span>
                        </div>
                        <div class="sf-card-spec-item">
                            <span class="sf-card-spec-label">Traffic Class</span>
                            <span class="sf-card-spec-value">${fin.trafficRating}</span>
                        </div>
                        <div class="sf-card-spec-item">
                            <span class="sf-card-spec-label">Stain Resistance</span>
                            <span class="sf-card-spec-value">${fin.stainResistance}</span>
                        </div>
                    </div>

                    <p class="sf-card-desc">${fin.summary}</p>

                    <div class="sf-card-bestfor">
                        <strong>Recommended Spaces:</strong> ${fin.bestFor}
                    </div>

                    ${swatchesHtml}

                    <div class="sf-card-footer">
                        <button type="button" class="btn btn-primary btn-sm sf-finish-request-btn"
                                data-catalogue="${currentSizeData.catalogueName}"
                                data-size-label="${currentSizeData.sizeLabel}"
                                data-finish-name="${fin.name}">
                            <i class="fa-solid fa-file-invoice mr-6"></i> Request PDF &amp; Swatch for this Finish
                        </button>
                        <a href="collections.html?size=${encodeURIComponent(currentSizeData.sizeLabel.split(' ')[0])}" class="btn btn-outline btn-sm">
                            <i class="fa-solid fa-compass mr-6"></i> Explore Range
                        </a>
                    </div>
                </div>
            `;
        });

        gridContainer.innerHTML = cardsHtml;

        // Attach Swatch Zoom Click Listeners
        gridContainer.querySelectorAll('.sf-swatch-item').forEach(item => {
            item.addEventListener('click', () => {
                const imgSrc = item.getAttribute('data-swatch-img');
                const imgName = item.getAttribute('data-swatch-name');
                openLightbox(imgSrc, `${currentSizeData.sizeLabel} — ${imgName}`);
            });
        });

        // Attach "Request PDF for this Finish" Click Listeners
        gridContainer.querySelectorAll('.sf-finish-request-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const catName = btn.getAttribute('data-catalogue');
                const sizeLabel = btn.getAttribute('data-size-label');
                const finishName = btn.getAttribute('data-finish-name');

                const customMsg = `Inquiry for ${sizeLabel} in "${finishName}" finish. Please send high-resolution PDF catalogue, technical specifications, and physical sample availability.`;

                // Close finishes modal first
                closeSizeFinishesModal();

                // Open Request PDF modal with pre-filled details
                if (typeof window.openRequestPdfModal === 'function') {
                    window.openRequestPdfModal(catName, '', customMsg);
                } else {
                    const fallbackBtn = document.querySelector(`.request-pdf-btn[data-catalogue="${catName}"]`);
                    if (fallbackBtn) fallbackBtn.click();
                }
            });
        });
    }

    function openLightbox(src, caption) {
        if (!lightboxModal || !lightboxImg) return;
        lightboxImg.src = src;
        if (lightboxCaption) lightboxCaption.textContent = caption;
        lightboxModal.style.display = 'flex';
        lightboxModal.classList.add('active');
    }

    function closeLightbox() {
        if (!lightboxModal) return;
        lightboxModal.style.display = 'none';
        lightboxModal.classList.remove('active');
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) closeLightbox();
        });
    }

    // Modal Close Triggers
    if (closeBtn) closeBtn.addEventListener('click', closeSizeFinishesModal);
    if (closeBottomBtn) closeBottomBtn.addEventListener('click', closeSizeFinishesModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeSizeFinishesModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (lightboxModal && lightboxModal.classList.contains('active')) {
                closeLightbox();
            } else if (modal.classList.contains('is-open')) {
                closeSizeFinishesModal();
            }
        }
    });

    // Attach click listeners to all .view-range-btn
    document.querySelectorAll('.view-range-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const sizeId = btn.getAttribute('data-size-id');
            if (sizeId) {
                openSizeFinishesModal(sizeId);
            }
        });
    });

    // Expose for external calls
    window.openSizeFinishesModal = openSizeFinishesModal;
}


// Auto-initialize Size Finishes Modal
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSizeFinishesModal);
} else {
    initSizeFinishesModal();
}
