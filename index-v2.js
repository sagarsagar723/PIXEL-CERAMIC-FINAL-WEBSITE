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
    const plank120x240Items = typeof PLANK_120X240_DATA !== 'undefined' ? PLANK_120X240_DATA : [];
    const rawProducts = baseFiltered.concat(woodItems).concat(mosaicItems).concat(plank30x90Items).concat(plank20x20Items).concat(plank15x90Items).concat(plankSlabsItems).concat(plank25x50Items).concat(plank20x60Items).concat(plank60x120Items).concat(porcelainDualItems).concat(subwayItems).concat(plank120x240Items);

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

        // Normalized finish matching helper
        function checkFinishMatch(productFinishStr, selectedFinishValues) {
            if (!productFinishStr || !selectedFinishValues || selectedFinishValues.length === 0) return false;
            const prodFinishes = productFinishStr.split('/').map(f => f.trim().toLowerCase());
            return selectedFinishValues.some(selected => {
                const sel = selected.toLowerCase().trim();
                return prodFinishes.some(pf => {
                    if (pf === sel) return true;
                    if (sel === 'satin' && pf.includes('satin')) return true;
                    if (sel === 'carving' && pf.includes('carving')) return true;
                    if (sel === 'punch-matt' && pf.includes('punch-matt')) return true;
                    if (sel === 'digi-matt' && pf.includes('digi-matt')) return true;
                    if (sel === 'lux-surface' && (pf.includes('lux') || pf.includes('high-gloss') || pf.includes('super-glossy') || pf.includes('super highgloss'))) return true;
                    if (sel === 'textured' && (pf.includes('textured') || pf.includes('rustic') || pf.includes('structure'))) return true;
                    if (sel === 'polished' && (pf.includes('polished') || pf.includes('glossy'))) return true;
                    if (sel === 'matt' && pf.includes('matt') && !pf.includes('punch-matt') && !pf.includes('digi-matt') && !pf.includes('satin')) return true;
                    return false;
                });
            });
        }

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
                            if (!checkFinishMatch(product.finish, selectedValues)) {
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
                            if (!checkFinishMatch(product.finish, selectedValues)) {
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
                                const cleanF = f.trim().toLowerCase();
                                validValues.add(cleanF);
                                if (cleanF.includes('satin')) validValues.add('satin');
                                if (cleanF.includes('carving')) validValues.add('carving');
                                if (cleanF.includes('punch-matt')) validValues.add('punch-matt');
                                if (cleanF.includes('digi-matt')) validValues.add('digi-matt');
                                if (cleanF.includes('lux') || cleanF.includes('high-gloss') || cleanF.includes('super-glossy') || cleanF.includes('super highgloss')) validValues.add('lux-surface');
                                if (cleanF.includes('textured') || cleanF.includes('rustic') || cleanF.includes('structure')) validValues.add('textured');
                                if (cleanF.includes('polished') || cleanF.includes('glossy')) validValues.add('polished');
                                if (cleanF.includes('matt') && !cleanF.includes('punch-matt') && !cleanF.includes('digi-matt') && !cleanF.includes('satin')) validValues.add('matt');
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
                    let checkbox = document.querySelector(`.catalog-sidebar input[name="${group}"][value="${cleanVal}"]`);
                    if (!checkbox && group === 'size') {
                        checkbox = document.querySelector(`.catalog-sidebar input[name="size"][value="${cleanVal} cm"]`);
                    }
                    if (checkbox) {
                        checkbox.checked = true;
                        const actualVal = checkbox.value;
                        if (!activeFilters[group].includes(actualVal)) {
                            activeFilters[group].push(actualVal);
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
        const urlName = urlParams.get('name');
        const urlCompany = urlParams.get('company');
        const urlEmail = urlParams.get('email');
        const urlPhone = urlParams.get('phone');
        const urlCountry = urlParams.get('country');
        const urlCountryCode = urlParams.get('country_code');
        const urlMessage = urlParams.get('message');

        if (urlName && document.getElementById('contactName')) document.getElementById('contactName').value = urlName;
        if (urlCompany && document.getElementById('contactCompany')) document.getElementById('contactCompany').value = urlCompany;
        if (urlEmail && document.getElementById('contactEmail')) document.getElementById('contactEmail').value = urlEmail;
        if (urlPhone && document.getElementById('contactPhone')) document.getElementById('contactPhone').value = urlPhone;
        if (urlCountryCode && document.getElementById('contactCountryCode')) document.getElementById('contactCountryCode').value = urlCountryCode;
        if (urlCountry && document.getElementById('contactCountry')) document.getElementById('contactCountry').value = urlCountry;
        if (urlMessage && document.getElementById('contactMessage')) document.getElementById('contactMessage').value = urlMessage;

        if (urlProduct) {
            const messageTextarea = document.getElementById('contactMessage');
            if (messageTextarea && !urlMessage) {
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

        // Real-time error clearance on input/change
        inquiryForm.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('input', () => {
                const fg = input.closest('.form-group');
                if (fg) fg.classList.remove('has-error');
            });
            input.addEventListener('change', () => {
                const fg = input.closest('.form-group');
                if (fg) fg.classList.remove('has-error');
            });
        });

        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Clear previous errors
            inquiryForm.querySelectorAll('.form-group').forEach(fg => fg.classList.remove('has-error'));

            // Gather inputs for validation & simulation
            const nameEl = document.getElementById('contactName');
            const companyEl = document.getElementById('contactCompany');
            const emailEl = document.getElementById('contactEmail');
            const countryCodeEl = document.getElementById('contactCountryCode');
            const phoneEl = document.getElementById('contactPhone');
            const countryEl = document.getElementById('contactCountry');
            const volumeEl = document.getElementById('contactVolume');
            const messageEl = document.getElementById('contactMessage');

            const name = nameEl ? nameEl.value.trim() : '';
            const company = companyEl ? companyEl.value.trim() : '';
            const email = emailEl ? emailEl.value.trim() : '';
            const countryCode = countryCodeEl ? countryCodeEl.value.trim() : '';
            const phone = phoneEl ? phoneEl.value.trim() : '';
            const country = countryEl ? countryEl.value.trim() : '';
            const volume = volumeEl ? volumeEl.value.trim() : '';
            const message = messageEl ? messageEl.value.trim() : '';
            const interests = selectedInterestsInput ? selectedInterestsInput.value : '';

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            let hasError = false;

            if (!name) {
                if (nameEl) nameEl.closest('.form-group')?.classList.add('has-error');
                hasError = true;
            }
            if (!company) {
                if (companyEl) companyEl.closest('.form-group')?.classList.add('has-error');
                hasError = true;
            }
            if (!email || !emailRegex.test(email)) {
                if (emailEl) emailEl.closest('.form-group')?.classList.add('has-error');
                hasError = true;
            }
            if (!phone || !countryCode) {
                if (phoneEl) phoneEl.closest('.form-group')?.classList.add('has-error');
                hasError = true;
            }
            if (!country) {
                if (countryEl) countryEl.closest('.form-group')?.classList.add('has-error');
                hasError = true;
            }
            if (!volume) {
                if (volumeEl) volumeEl.closest('.form-group')?.classList.add('has-error');
                hasError = true;
            }
            if (!message) {
                if (messageEl) messageEl.closest('.form-group')?.classList.add('has-error');
                hasError = true;
            }

            if (hasError) {
                formFeedback.style.display = 'block';
                formFeedback.className = 'form-feedback error';
                if (email && !emailRegex.test(email)) {
                    formFeedback.textContent = 'Please enter a valid corporate email address (e.g., name@company.com).';
                } else {
                    formFeedback.textContent = 'Please fill out all required fields: Your Name, Company Name, Corporate Email, Phone / Mobile, Destination Country, and Expected Order Volume.';
                }
                return;
            }

            // Disable button and show sending state
            const submitBtn = inquiryForm.querySelector('button[type="submit"]');
            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending Inquiry <i class="fa-solid fa-spinner fa-spin ml-6"></i>';

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
        readTime: "12 min read",
        author: "Pixel Ceramic Technical Editorial (Morbi R&D Division)",
        image: "assets/blog/blog-sintered-slabs.jpg",
        lead: "Sintered porcelain slabs represent the vanguard of contemporary architectural surfaces—uniting the sublime aesthetics of monumental metamorphic marble with an impermeable, high-density mineral matrix engineered for ventilated rainscreens, extreme thermal cycling, and high-traffic commercial environments.",
        content: `
<h3>1. The Evolution of Mega-Format Architectural Sintered Stone</h3>
        <p>Over the past decade, architectural engineering has undergone a transformative paradigm shift. For centuries, specifiers seeking monumental luxury in corporate atriums, luxury hotels, and civic facades were constrained to natural dimensional stone—such as Carrara, Calacatta, and Statuario marbles, or crystalline granites. While natural stone provides peerless organic beauty, its inherent vulnerabilities—including irregular geological fissures, open micro-porosity (often exceeding 0.5% to 3.0%), susceptibility to acid etching, thermal expansion instability, and immense structural dead weight (50 to 80 kg/m² for 20mm to 30mm slabs)—have long posed engineering headaches for structural engineers and façade consultants.</p>
        <p>The advent of engineered sintered porcelain slabs has bridged the divide between sublime geological aesthetics and structural indestructibility. Unlike traditional ceramic tiles manufactured using intermittent toggle presses at 3,000 to 5,000 tonnes, Pixel Ceramic's monumental slabs (spanning formats up to 1200x2400 mm and 1200x1800 mm) are fabricated via continuous roll-compaction compaction systems exerting over <strong>16,000 to 25,000 tonnes</strong> of uniform hydraulic force across the moving atomized powder bed. This process, coupled with firing cycles exceeding 1,220°C in computer-monitored roller kilns, achieves total mineral vitrification and complete pore closure.</p>

        <div class="modal-quote-box">
            "Sintering is artificial metamorphism accelerated into minutes: by subjecting refined natural minerals to thousands of bars of pressure and thermal vitrification, we create a stone that nature takes millions of years to form, devoid of natural fissures or moisture channels."
        </div>

        <h3>2. The Physics of Sintering: Raw Materials & Pyrochemical Transformation</h3>
        <p>To understand the structural superiority of sintered porcelain slabs, one must examine the raw material geochemistry and thermal vitrification curve. Pixel Ceramic utilizes an ultra-refined, wet-milled mineral batch formulated to rigorous purity tolerances:</p>
        <ul>
            <li><strong>Kaolinitic Clays (40%–45%):</strong> Provide exceptional plasticity, high green strength prior to firing, and furnish the alumina (Al₂O₃) skeleton that ensures structural rigidity and high modulus of rupture under mechanical deflection.</li>
            <li><strong>Potassium & Sodium Feldspars (35%–40%):</strong> Act as powerful pyrochemical fluxing agents. At temperatures above 1,140°C, feldspars liquefy into a viscous glassy phase that flows into every interstitial space between quartz grains, pulling them together through capillary attraction.</li>
            <li><strong>High-Purity Silica Quartz (15%–20%):</strong> Functions as the structural structural aggregate, providing exceptional Mohs surface hardness (Grade 7 to 8) and resistance to scratching from diamond abrasives, footwear grit, and cutlery.</li>
            <li><strong>Zirconium Silicate & Micronized Mineral Pigments (2%–5%):</strong> Provide dense opacity, pristine white base coloration, and deep through-body chromatic stability that remains 100% unaffected by ultraviolet (UV) radiation or thermal oxidation.</li>
        </ul>
        <p>During the 70-minute firing cycle within our 240-meter energy-recuperating kilns, the mineral particles undergo liquid-phase sintering. As the feldspathic melt cools, primary and secondary mullite crystals (3Al₂O₃·2SiO₂) precipitate throughout the matrix. This interlocking crystalline needle network acts like microscopic structural rebar, yielding a material with practically zero open porosity (water absorption &le; 0.05% according to <strong>ISO 10545-3</strong>) and flexural strength exceeding <strong>48 to 55 N/mm²</strong>.</p>

        <h3>3. Comprehensive Technical Specification Matrix</h3>
        <p>When preparing architectural submittals, façade calculations, or interior performance schedules, mechanical properties must be validated against international testing standards. The table below delineates Pixel Ceramic's tested performance versus ISO 13006 / EN 14411 Group BIa benchmarks and natural marble:</p>

        <div class="table-responsive">
            <table class="modal-spec-table">
                <thead>
                    <tr>
                        <th>Technical Parameter</th>
                        <th>Standard Method</th>
                        <th>Pixel Sintered Slab (6mm & 9mm)</th>
                        <th>ISO 13006 Group BIa Standard</th>
                        <th>Natural Calacatta Marble (20mm)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Water Absorption</strong></td>
                        <td>ISO 10545-3 / ASTM C373</td>
                        <td>&le; 0.05% (Impermeable)</td>
                        <td>&le; 0.50%</td>
                        <td>0.30% &ndash; 1.50% (Porous)</td>
                    </tr>
                    <tr>
                        <td><strong>Modulus of Rupture (MOR)</strong></td>
                        <td>ISO 10545-4</td>
                        <td>&ge; 50 N/mm&sup2;</td>
                        <td>&ge; 35 N/mm&sup2;</td>
                        <td>9 &ndash; 14 N/mm&sup2;</td>
                    </tr>
                    <tr>
                        <td><strong>Breaking Strength</strong></td>
                        <td>ISO 10545-4 / ASTM C648</td>
                        <td>&ge; 2,400 N (9mm slab)</td>
                        <td>&ge; 1,300 N</td>
                        <td>1,200 &ndash; 1,800 N (Fragile)</td>
                    </tr>
                    <tr>
                        <td><strong>Mohs Surface Hardness</strong></td>
                        <td>EN 101 / Mohs Scale</td>
                        <td>Grade 7 &ndash; 8</td>
                        <td>Min Grade 5</td>
                        <td>Grade 3 &ndash; 4 (Easily scratched)</td>
                    </tr>
                    <tr>
                        <td><strong>Deep Abrasion Resistance</strong></td>
                        <td>ISO 10545-6</td>
                        <td>&le; 125 mm&sup3; volume loss</td>
                        <td>&le; 175 mm&sup3;</td>
                        <td>High wear / etching risk</td>
                    </tr>
                    <tr>
                        <td><strong>Thermal Shock Resistance</strong></td>
                        <td>ISO 10545-9</td>
                        <td>Fully Resistant (&Delta;T = 150&deg;C)</td>
                        <td>Passes test</td>
                        <td>Prone to spalling & micro-cracking</td>
                    </tr>
                    <tr>
                        <td><strong>Chemical & Stain Resistance</strong></td>
                        <td>ISO 10545-13 & 14</td>
                        <td>Class UHA / Class 5 (Stain-proof)</td>
                        <td>Min Class UB</td>
                        <td>Reacts instantly with acids (Etching)</td>
                    </tr>
                    <tr>
                        <td><strong>Linear Thermal Expansion</strong></td>
                        <td>ISO 10545-8</td>
                        <td>&le; 6.2 &times; 10&minus;&sup6; K&minus;&sup1;</td>
                        <td>Declared value</td>
                        <td>8.5 &ndash; 12.0 &times; 10&minus;&sup6; K&minus;&sup1;</td>
                    </tr>
                    <tr>
                        <td><strong>Fire Reaction Rating</strong></td>
                        <td>EN 13501-1 / ASTM E84</td>
                        <td>Class A1 / Flame Spread 0 (Non-combustible)</td>
                        <td>Class A1</td>
                        <td>Class A1 (calcines at high temp)</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>4. Ventilated Curtain Wall Façades: Structural Engineering & Subframe Anchoring</h3>
        <p>One of the most rapidly growing applications for 6mm and 9mm sintered porcelain slabs is in high-performance exterior ventilated curtain walls (rainscreens). A ventilated façade separates the exterior decorative cladding from the building's structural wall and thermal insulation via a continuous 30mm to 50mm air cavity. This chimney effect drives natural convective airflow upward, dissipating solar thermal gain during summer and removing interior condensation moisture during winter, cutting HVAC energy loads by up to 25% to 30%.</p>
        <p>However, securing mega-format panels against severe wind pressures (which can exceed 2.5 to 3.5 kPa on high-rise towers) requires precision structural anchoring. Three primary subframe anchoring systems are engineered for Pixel Ceramic slabs:</p>
        
        <h4>A. Concealed Undercut Mechanical Anchors (KEIL System)</h4>
        <p>The gold standard for luxury commercial towers, the KEIL undercut anchor utilizes computer-guided diamond router bits to drill a blind, conical undercut hole into the rear face of an 8mm or 9mm slab without piercing the front surface. An expanding stainless steel (A4 Grade 316) undercut anchor sleeve is inserted and tightened with calibrated torque. This creates a 100% stress-free, mechanical interlock with horizontal aluminum runner rails. This system supports high shear and pull-out loads (exceeding 1.8 to 2.4 kN per anchor point) while leaving the exterior façade clean, unbroken by visible clips.</p>

        <h4>B. Concealed Structural Chemical-Mechanical Bonding</h4>
        <p>For mid-rise buildings and residential envelopes, high-elasticity structural MS polymer or polyurethane bonding adhesives (such as SikaTack-Panel) are applied along vertical aluminum T-profiles in conjunction with high-tack temporary positioning tape. This system evenly distributes wind suction forces across continuous adhesive ribbons, absorbing structural building movements and building deflection without point stresses.</p>

        <h4>C. Visible Stainless Steel Retaining Clips</h4>
        <p>For budget-sensitive commercial projects or parking garage wraps, color-matched powder-coated stainless steel clips hook directly onto horizontal kerf channels or panel edges. While visible from close range, they provide cost-effective, rapid installation and individual panel demountability for maintenance.</p>

        <div class="modal-callout-info">
            <strong>Façade Engineering Note:</strong> When engineering ventilated facades with 1200x2400 mm slabs, always specify a minimum 6mm to 8mm open or baffled joint between adjacent panels. This accommodates building drift, seismic sway, and the slab's low linear thermal expansion (approximately 1.5mm per 2.4m length across a 50°C thermal delta).
        </div>

        <h3>5. Dead-Load Comparison: Sintered Slabs vs Dimensional Natural Stone</h3>
        <p>A critical consideration in modern high-rise and retrofit architecture is the structural dead load imposed on the building frame, foundations, and transfer slabs. Traditional 20mm to 30mm granite or marble cladding imposes crushing dead loads that require oversized steel columns and costly deep pile foundations.</p>
        <ul>
            <li><strong>Traditional 20mm Granite / Marble:</strong> Imposes a dead load of approximately <strong>55 to 60 kg/m²</strong> (excluding steel bracketry). In earthquake zones, this heavy mass drastically amplifies seismic shear forces.</li>
            <li><strong>Traditional 30mm Exterior Stone Cladding:</strong> Imposes <strong>82 to 90 kg/m²</strong> of dead load.</li>
            <li><strong>Pixel Ceramic 6mm Sintered Porcelain Slab:</strong> Weighs only <strong>14.5 kg/m²</strong>—a massive <strong>75% weight reduction</strong> compared to 20mm natural stone.</li>
            <li><strong>Pixel Ceramic 9mm Sintered Porcelain Slab:</strong> Weighs only <strong>21.5 kg/m²</strong>—a <strong>64% weight reduction</strong> while providing higher impact resistance for ground-level pedestrian splash zones.</li>
        </ul>
        <p>In building recladding and façade retrofits, substituting degraded exterior stone with 6mm sintered slabs allows developers to modernize building thermal envelopes without exceeding original structural load permits or requiring foundation reinforcement.</p>

        <h3>6. Zero-Stain Culinary Countertops & Heavy Commercial Wet Environments</h3>
        <p>In residential kitchens, Michelin-starred culinary workspaces, and luxury hotel bathroom suites, sintered porcelain has replaced engineered quartz and natural marble as the premier countertop surface. Engineered quartz slabs utilize petroleum-derived polyester resin binders (7% to 10% by weight), which yellow under sunlight and scorch permanently when exposed to cookware exceeding 150°C. Natural marble, comprised of calcium carbonate, dissolves instantly upon contact with lemon juice, vinegar, wine, or tomato sauce, leaving cloudy, unremovable etch marks.</p>
        <p>Because Pixel Ceramic sintered slabs are 100% mineral-based and fired at 1,220°C, they possess complete chemical inertness:</p>
        <ol>
            <li><strong>Direct Heat Immunity:</strong> Pots and hot baking trays straight from a 400°C oven can be placed directly on the countertop surface with zero risk of scorching, cracking, or discoloration.</li>
            <li><strong>Acid and Chemical Resistance (Class UHA):</strong> Hydrochloric acid, bleach, red wine, turmeric paste, and caustic degreasers wipe off effortlessly with warm water without etching or staining.</li>
            <li><strong>NSF / Food Contact Hygiene:</strong> With zero porosity and zero organic binders, bacteria, mold, and viruses cannot penetrate the surface. Pixel Ceramic sintered surfaces are certified hygienic for direct food preparation.</li>
            <li><strong>Scratch & Cut Resistance:</strong> Chefs can cut directly on the surface with high-carbon steel knives without gouging the finish (although wooden cutting boards are recommended to avoid dulling knife blades!).</li>
        </ol>

        <h3>7. On-Site Handling, Cutting & Fabrication Best Practices</h3>
        <p>Handling and fabricating 1200x2400 mm mega-slabs demands specialized stone fabrication tools and meticulous shop protocols to prevent breakage during transport, cutting, and installation:</p>
        <ul>
            <li><strong>Lifting & Transport:</strong> Mega-slabs must always be transported vertically on rubber-padded A-frame stillages. For manual handling, vacuum suction lifting frames equipped with pressure gauges and mechanical stabilizing bars must be utilized by a minimum of two to four certified handlers. Never carry slabs horizontally, as bending vibrations can induce fracture.</li>
            <li><strong>Diamond Saw Cutting:</strong> When wet-cutting sintered slabs on a bridge saw or 5-axis CNC router, fabricators must use continuous-rim diamond blades specifically engineered for ultra-hard porcelain. The bridge saw should operate at 1,800 to 2,200 RPM with a reduced feed rate of 1.0 to 1.5 meters/minute, accompanied by abundant coolant water flow targeted directly at the cutting point.</li>
            <li><strong>Stress-Relief Core Drilling for Cutouts:</strong> When creating interior cutouts for cooktops, sinks, or electrical boxes, <em>never</em> cut sharp 90-degree internal corners with a straight saw blade. Fabricators must first drill all inside corners with a diamond hole-saw bit (minimum radius of 6mm to 10mm). A rounded internal radius distributes mechanical tension and prevents stress fractures from propagating through the slab during transport or thermal cycling.</li>
            <li><strong>Edge Profiling & Mitered Aprons:</strong> For island waterfall edges, 45-degree miter cuts must be performed using dedicated chamfering blades, backed by two-component epoxy or color-matched methacrylate adhesives with fiberglass mesh backing ribbons for seismic reinforcement.</li>
        </ul>

        <h3>8. Long-Term Maintenance & Architectural Specifier Checklist</h3>
        <p>Maintaining sintered porcelain slabs in commercial airports, corporate lobbies, and retail malls is remarkably economical due to the surface's non-absorbent, high-density matrix. Routine cleaning requires only pH-neutral commercial detergents and microfiber flat mops. Unlike natural marble or granite, sintered porcelain <strong>never requires topical sealers, waxes, crystallization polishing, or impregnating chemical coatings</strong> over its entire lifecycle, eliminating ongoing facility maintenance costs.</p>
        <p>When drafting project architectural specifications (MasterFormat Section 09 30 13 - Ceramic Tiling / Section 07 42 13 - Metal and Porcelain Wall Panels), ensure the following criteria are explicitly mandated:</p>
        <ul>
            <li><strong>Compliance Standard:</strong> ISO 13006 / EN 14411 Group BIa, fully vitrified porcelain stoneware.</li>
            <li><strong>Water Absorption:</strong> Verified &le; 0.05% per ISO 10545-3 / ASTM C373.</li>
            <li><strong>Flexural Modulus:</strong> Minimum 48 N/mm² per ISO 10545-4.</li>
            <li><strong>Dimensional Rectification:</strong> Length and width tolerance &plusmn; 0.1%, squareness &plusmn; 0.2%, surface flatness (curvature) &plusmn; 0.2% to ensure seamless 1.5mm to 2.0mm grout joints.</li>
            <li><strong>Scratch Hardness:</strong> Mohs Grade 7 or higher per EN 101.</li>
            <li><strong>Fire Rating:</strong> Class A1 non-combustible per EN 13501-1 or ASTM E84 Class A.</li>
        </ul>
        `,
        ctaTitle: "Specifying Sintered Slabs for Your Architectural Project?",
        ctaDesc: "Request factory-direct samples, BIM/Revit families, and full CAD façade anchor submittal packs."
    },
    "article-2": {
        title: "Vitrified vs. Porcelain Tiles: The Technical Benchmark for Commercial Specifiers",
        category: "Technical & Installation",
        categoryClass: "pill-tech",
        date: "August 28, 2026",
        readTime: "11 min read",
        author: "Quality Engineering Bureau (Pixel Ceramic Morbi)",
        image: "assets/blog/blog-vitrified-porcelain.jpg",
        lead: "Navigating the subtle metallurgical and structural boundaries between standard ceramic, soluble salt vitrified, glazed vitrified tiles (GVT/PGVT), and technical full-body porcelain stoneware is vital for ensuring lifetime structural compliance across high-load commercial facilities.",
        content: `
<h3>1. Demystifying Ceramic Terminology: Ceramic, Vitrified & Porcelain</h3>
        <p>In global architectural specification and construction procurement, terminology is frequently conflated. Contractors, distributors, and specifiers often use the terms 'vitrified tile' and 'porcelain tile' interchangeably. However, from a metallurgical, mineralogical, and international standards perspective, precise structural distinctions dictate where each product can be safely installed without risking catastrophic flooring failures, hollow debonding, or premature surface wear.</p>
        <p>All ceramic tiles originate from clay, silica, and fluxing minerals fired in kilns. However, the exact mineral proportion, compaction pressure, firing temperature, and resulting vitreous (glassy) phase density separate porous ceramic bodies from impermeable technical porcelain stoneware. In standard red or white-body ceramic tiles (frequently used for residential bathroom walls), clay content is high, compaction pressures are relatively low (2,000 to 3,500 N/cm²), and firing occurs between 1,000°C and 1,120°C. This leaves an open microscopic capillary network with water absorption rates ranging from 3.0% to over 10.0%.</p>
        <p>Conversely, <strong>vitrified tiles and porcelain tiles</strong> are engineered with high percentages of refined feldspar and quartz, compacted at extreme pressures exceeding 4,000 to 6,000 N/cm², and fired between 1,200°C and 1,240°C. At this peak temperature, the feldspar melts into an amorphous glass that floods the pore spaces, transforming the loose mineral mixture into a solid, vitrified mass (from the Latin <em>vitrum</em>, meaning glass).</p>

        <div class="modal-quote-box">
            "Under international building codes, the definition of true porcelain is strictly quantitative: any tile dry-pressed under high pressure with a verified water absorption of &le; 0.5% (Group BIa) qualifies as porcelain stoneware."
        </div>

        <h3>2. The Regulatory Framework: ISO 13006 & EN 14411 Classifications</h3>
        <p>The International Organization for Standardization (ISO 13006) and the European Committee for Standardization (EN 14411) classify ceramic tiles using a two-dimensional grid based on <strong>Method of Shaping</strong> (Group A: Extruded, Group B: Dry-Pressed) and <strong>Water Absorption Percentage (Eb)</strong>:</p>

        <div class="table-responsive">
            <table class="modal-spec-table">
                <thead>
                    <tr>
                        <th>ISO / EN Group</th>
                        <th>Manufacturing Method</th>
                        <th>Water Absorption (Eb)</th>
                        <th>Industry Classification</th>
                        <th>Typical Application Realm</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Group BIa</strong></td>
                        <td>Dry-Pressed (B)</td>
                        <td><strong>Eb &le; 0.5%</strong> (Pixel achieves &le; 0.05%)</td>
                        <td>Fully Vitrified Porcelain Stoneware</td>
                        <td>High-traffic commercial, exteriors, facades, heavy industrial floors</td>
                    </tr>
                    <tr>
                        <td><strong>Group BIb</strong></td>
                        <td>Dry-Pressed (B)</td>
                        <td>0.5% &lt; Eb &le; 3.0%</td>
                        <td>Vitrified / Semi-Porcelain</td>
                        <td>Medium commercial interiors, residential floors</td>
                    </tr>
                    <tr>
                        <td><strong>Group BIIa</strong></td>
                        <td>Dry-Pressed (B)</td>
                        <td>3.0% &lt; Eb &le; 6.0%</td>
                        <td>Semi-Vitrified Ceramic</td>
                        <td>Residential light foot-traffic floors, protected balconies</td>
                    </tr>
                    <tr>
                        <td><strong>Group BIIb</strong></td>
                        <td>Dry-Pressed (B)</td>
                        <td>6.0% &lt; Eb &le; 10.0%</td>
                        <td>Standard Ceramic Floor Tile</td>
                        <td>Interior domestic bathrooms and bedrooms only</td>
                    </tr>
                    <tr>
                        <td><strong>Group BIII</strong></td>
                        <td>Dry-Pressed (B)</td>
                        <td>Eb &gt; 10.0%</td>
                        <td>Porous Ceramic Wall Tile</td>
                        <td>Interior wall cladding only (never floors or outdoors)</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>3. Microstructural Density & Water Absorption (ASTM C373 / ISO 10545-3)</h3>
        <p>Why is water absorption the single most critical engineering parameter for specifiers? Water absorption is not merely a measure of whether a tile will absorb liquid spilled on top of it; it is a direct proxy for the tile's internal void volume, bulk density, and structural integrity.</p>
        <p>When tiles are installed in exterior environments (patios, plazas, cladding, swimming pools) in temperate or continental climates, absorbed moisture inside porous tiles (Group BIIa or BIII) undergoes cyclic freezing and thawing. As water transitions to ice at 0°C, its volume expands by approximately 9%. In a porous tile body, this hydraulic freeze-thaw pressure generates micro-cracks that cause spalling, glaze delamination, and structural fracturing. Furthermore, in humid coastal environments, water vapor migration from sub-screeds through porous tiles carries dissolved mineral salts to the surface, causing permanent efflorescence and grout debonding.</p>
        <p>Pixel Ceramic's Group BIa vitrified porcelain tiles boast a certified water absorption of <strong>&le; 0.05%</strong> (tested under vacuum immersion per <strong>ISO 10545-3</strong> and <strong>ASTM C373</strong>). This total vitrification guarantees 100% frost immunity, zero moisture expansion, and complete prevention of sub-surface staining.</p>

        <h3>4. Surface Wear Resistance: PEI Ratings vs Deep Abrasion Volume Loss</h3>
        <p>For commercial flooring specifiers, evaluating abrasion resistance determines whether a tile will maintain its visual prestige over a 20-year design life or show unsightly traffic paths within 18 months of opening. Surface wear is evaluated differently depending on whether the tile is glazed or unglazed (full body):</p>

        <h4>A. Glazed Porcelain / Vitrified Tiles (GVT & PGVT) - ISO 10545-7 (PEI Rating)</h4>
        <p>Glazed Vitrified Tiles receive high-definition digital inkjet glazes protected by high-temperature transparent or matte crystalline protective coats. Abrasion resistance is tested using the PEI (Porcelain Enamel Institute) abrasion machine, which rotates abrasive steel bearings, corundum grit, and distilled water over the glazed surface at calibrated rotational cycles:</p>
        <ul>
            <li><strong>PEI Class I (150 revs):</strong> Barefoot residential bathrooms and en-suites.</li>
            <li><strong>PEI Class II (600 revs):</strong> Light residential bedrooms with soft footwear.</li>
            <li><strong>PEI Class III (750 & 1,500 revs):</strong> General residential living rooms, residential kitchens, and low-traffic hotel guest rooms.</li>
            <li><strong>PEI Class IV (2,100, 6,000 & 12,000 revs):</strong> High-traffic commercial interiors—hotel lobbies, corporate corridors, commercial restaurants, retail boutiques, and auto showrooms. Pixel Ceramic's standard commercial GVT lines meet or exceed PEI IV.</li>
            <li><strong>PEI Class V (&gt; 12,000 revs + stain test):</strong> Maximum severe commercial durability—airport terminals, railway stations, shopping mall public concourses, and supermarket aisles subject to constant abrasive foot traffic and rolling luggage wheels.</li>
        </ul>

        <h4>B. Unglazed Technical Full-Body Porcelain - ISO 10545-6 (Deep Abrasion)</h4>
        <p>In full-body technical porcelain, there is no separate surface glaze layer; the color and composition run through the entire cross-section of the tile. Therefore, the PEI test is irrelevant. Instead, tiles are tested under <strong>ISO 10545-6</strong>, where a calibrated steel wheel rotates against the tile face under a constant load with a continuous feed of white fused aluminum oxide abrasive. The volume of material scooped out is measured in cubic millimeters (mm³):</p>
        <p>While the ISO 13006 standard mandates a maximum allowable volume loss of <strong>175 mm³</strong>, Pixel Ceramic's technical full-body porcelain records an ultra-dense volume loss of only <strong>&le; 110 to 125 mm³</strong>, ensuring that even if decades of heavy foot traffic slowly wear down the microscopic top layer, the underlying exposed body is visually and structurally identical.</p>

        <h3>5. Mechanical Strength Benchmarks: Modulus of Rupture & Breaking Strength</h3>
        <p>In commercial facilities, floors must withstand heavy point loads, including motorized scissor lifts, heavy pallet jacks, hospital gurneys, and high-heel impact forces. Mechanical strength is quantified via two distinct parameters under <strong>ISO 10545-4</strong>:</p>
        <ol>
            <li><strong>Modulus of Rupture (MOR / Flexural Strength):</strong> Expressed in N/mm² (megapascals, MPa), MOR measures the material's intrinsic bending resistance regardless of thickness. While ISO Group BIa requires a minimum MOR of &ge; 35 N/mm², Pixel Ceramic vitrified porcelain achieves <strong>&ge; 45 to 52 N/mm²</strong>.</li>
            <li><strong>Breaking Strength (S):</strong> Expressed in Newtons (N), breaking strength represents the actual total force required to fracture the tile under a three-point center-load bar test. Breaking strength scales quadratically with tile thickness. Standard 9mm vitrified tiles achieve over <strong>2,200 N</strong> (well above the 1,300 N standard threshold), while our 20mm outdoor pavers achieve over <strong>11,000 N</strong>, enabling them to support vehicular traffic and dry-laid pedestal installations.</li>
        </ol>

        <div class="modal-callout-info">
            <strong>Specifier Warning on Point Loads:</strong> Even a tile with an MOR of 50 N/mm² will fracture if installed over hollow adhesive voids. In commercial environments, 100% adhesive mortar coverage (achieved via back-buttering and medium-bed troweling) is mandatory to eliminate subterranean air pockets.
        </div>

        <h3>6. Chemical, Acid & Alkali Resistance (ISO 10545-13 & 14)</h3>
        <p>Commercial healthcare facilities, laboratories, industrial food preparation plants, and public restrooms require daily chemical sanitization with aggressive agents, including sodium hypochlorite (bleach), quaternary ammonium compounds, diluted hydrochloric acid, and caustic soda. Tiles specified for these environments must hold high chemical resistance classifications under <strong>ISO 10545-13</strong>:</p>
        <ul>
            <li><strong>Class ULA / GLA:</strong> No visual effect when exposed to low-concentration acids and alkalis (hydrochloric acid 3%, citric acid 100g/L, potassium hydroxide 30g/L).</li>
            <li><strong>Class UHA / GHA:</strong> Completely resistant to high-concentration industrial acids and alkalis (hydrochloric acid 18%, lactic acid 5%, potassium hydroxide 100g/L). Pixel Ceramic unglazed technical porcelain achieves Class UHA certification.</li>
            <li><strong>Stain Resistance (ISO 10545-14):</strong> Tested with staining agents including methylene blue, green olive oil, and iodine solution. Classified from Class 1 (stain cannot be removed) to Class 5 (stain completely removed with warm running water). Pixel Ceramic polished and matte vitrified surfaces achieve Class 5 stain cleanability.</li>
        </ul>

        <h3>7. Specifier’s Commercial Decision Matrix</h3>
        <p>To assist architectural project teams in selecting the optimal tile classification, consult the decision matrix below:</p>

        <div class="table-responsive">
            <table class="modal-spec-table">
                <thead>
                    <tr>
                        <th>Commercial Environment</th>
                        <th>Recommended Tile Type</th>
                        <th>Key Technical Justification</th>
                        <th>Recommended Minimum Thickness</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Airport / Rail Terminal Concourse</strong></td>
                        <td>Full-Body Technical Porcelain or Heavy GVT (PEI V)</td>
                        <td>Extreme abrasive wear, continuous rolling luggage wheels, high impact resistance</td>
                        <td>10mm &ndash; 12mm</td>
                    </tr>
                    <tr>
                        <td><strong>Hospital & Healthcare Clinics</strong></td>
                        <td>Matte Glazed Porcelain (PEI IV / R10)</td>
                        <td>Class UHA chemical resistance to hospital disinfectants, low glare, slip safety</td>
                        <td>9mm &ndash; 10mm</td>
                    </tr>
                    <tr>
                        <td><strong>Commercial Kitchens & Food Prep</strong></td>
                        <td>Full-Body Anti-Slip R11 / R12 with V4 Displacement</td>
                        <td>Immunity to hot vegetable oils, animal fats, steam cleaning, and heavy pot impact</td>
                        <td>12mm &ndash; 15mm</td>
                    </tr>
                    <tr>
                        <td><strong>Corporate Headquarters Lobby</strong></td>
                        <td>Polished Glazed Vitrified (PGVT) or Sintered Mega-Slab</td>
                        <td>High-aesthetic marble visual prestige, zero porosity, low maintenance, PEI IV</td>
                        <td>9mm &ndash; 12mm</td>
                    </tr>
                    <tr>
                        <td><strong>Exterior Plaza / Rooftop Terrace</strong></td>
                        <td>20mm Outdoor Vitrified Porcelain Paver (R11)</td>
                        <td>100% frost-thaw immune, &gt;10,000 N breaking load on raised pedestals, UV stable</td>
                        <td>20mm</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>8. Substrate Preparation & Adhesive Mortar Selection</h3>
        <p>Because Group BIa vitrified porcelain tiles have a water absorption of &le; 0.05%, they cannot form a mechanical bond with traditional sand-cement mortars. Traditional cement pastes rely on the tile absorbing water from the slurry, drawing cement crystals into the tile's pores to form an interlocking grip. Attempting to install vitrified porcelain with traditional sand-cement mortar will result in complete debonding within 12 to 24 months as the tile expands and contracts.</p>
        <p>Specifiers must strictly mandate <strong>Polymer-Modified Thin-Bed Tile Adhesives</strong> conforming to <strong>EN 12004 / ISO 13007</strong>:</p>
        <ul>
            <li><strong>Class C2 (Improved Cementitious):</strong> Formulated with synthetic polymers that generate a powerful chemical bond with the impermeable vitrified porcelain back.</li>
            <li><strong>Class E (Extended Open Time):</strong> Provides 30+ minutes of open time, essential when setting large-format tiles to prevent skinning over before contact.</li>
            <li><strong>Class T (Slip Resistant):</strong> Thixotropic formulation preventing vertical slippage on wall installations.</li>
            <li><strong>Class S1 or S2 (Deformability):</strong> Highly flexible polymer modification. Class S1 (deflection 2.5mm to 5mm) is mandatory for large formats and heated screeds; Class S2 (deflection &gt; 5mm) is required for external facades, suspended wooden decks, and mega-slabs.</li>
        </ul>
        `,
        ctaTitle: "Need Complete ISO 13006 Laboratory Test Certificates?",
        ctaDesc: "Download our comprehensive technical submittal package with ASTM, CE, and ISO performance testing reports."
    },
    "article-3": {
        title: "2026 Tile Design Forecast: Tactile Carving Finishes, Fluted Surfaces & Earth Tones",
        category: "Tile Trends & Finishes",
        categoryClass: "pill-trend",
        date: "August 15, 2026",
        readTime: "10 min read",
        author: "Pixel Ceramic Design Studio (Cersaie Trend Observatory)",
        image: "assets/blog/blog-carving-trends.jpg",
        lead: "Contemporary interior architecture is experiencing a profound sensory renaissance: sterile high-gloss surfaces are surrendering to tactile micro-carved marble veining, fluted architectural reliefs, and restorative earth mineral palettes that re-establish human connection to nature.",
        content: `
<h3>1. The Multi-Sensory Shift in Architectural Surfaces</h3>
        <p>For more than fifteen years following the advent of digital inkjet printing in the ceramic tile sector, the industry was locked in a race for visual resolution. Manufacturers competed to print higher DPI photographs of Carrara marble, onyx, and travertine onto flat ceramic bodies, finishing them with mirror-like high-gloss glazes. While visually striking in photography, flat high-gloss surfaces frequently fall short in lived architectural experiences: they reflect harsh glare from artificial lighting, feel cold and clinical to the touch, and reveal every shoe scuff, smudge, and water droplet.</p>
        <p>As we enter 2026, leading interior designers, hospitality developers, and luxury architects are demanding surfaces that engage the sense of touch. Modern luxury is no longer defined by superficial gloss; it is defined by <em>tactility, organic depth, acoustic softness, and sensory resonance</em>. Sintered porcelain and vitrified surfaces are transitioning from two-dimensional graphic representations of stone to three-dimensional, multi-sensory materials with structural depth, relief, and natural mineral patinas.</p>

        <div class="modal-quote-box">
            "Design in 2026 is tactile-first. In an increasingly digital world dominated by smooth glass smartphone screens, human beings instinctively crave authentic, organic textures in physical architectural environments."
        </div>

        <h3>2. Synchro-Carving Technology: Reactive Digital Inks & Vein Deposition</h3>
        <p>The technical breakthrough driving this sensory revolution is <strong>Synchronous Digital Carving (Synchro-Carving)</strong>. In conventional textured tiles, surface relief was created using mechanical press mold punches. While this produced a textured surface, the texture was static and completely decoupled from the digital graphic printed on top—meaning a vein of marble would appear on the surface while the tactile depression would occur randomly an inch away, creating an unsettling visual discord.</p>
        <p>Pixel Ceramic's Synchro-Carving line synchronizes high-speed piezo-electric inkjet heads with specialized <strong>reactive sinking inks and ceramic glazes</strong>:</p>
        <ol>
            <li><strong>Digital Depth Mapping:</strong> High-resolution optical scans of rare Italian and Greek quarry stones are digitally processed to separate the mineral vein pathways, crystalline fissures, and soft matrix pockets into 3D height maps.</li>
            <li><strong>Reactive Sinking Glaze Application:</strong> Before the tile enters the kiln, a secondary digital print head deposits micronized droplets of chemical sinking agents specifically along the exact coordinates of the marble veins.</li>
            <li><strong>Pyrochemical Micro-Etching:</strong> Under 1,220°C kiln heat, these reactive agents depress the glaze along the vein pathways by 0.1mm to 0.4mm, while adjacent crystalline matte glazes raise the stone matrix.</li>
        </ol>
        <p>The result is a surface where every visible crack, quartz fissure, and sedimentary layer can be felt precisely with the fingertips, creating a tactile realism indistinguishable from natural hand-carved Roman travertine or honed Tuscan marble.</p>

        <h3>3. Fluted Geometries & 3D Micro-Reliefs: Architectural Acoustics & Grazing Light</h3>
        <p>Alongside carving finishes, the 2026 architectural landscape has seen an explosion of <strong>3D fluted, reeded, and ribbed porcelain wall surfaces</strong>. Originally popularized in bespoke woodworking and fluted architectural glass, ribbed geometries are now manufactured in vitrified porcelain formats (such as 300x600 mm, 600x1200 mm, and 1200x2400 mm wall slabs).</p>
        <p>Fluted porcelain wall cladding provides profound functional and aesthetic advantages in luxury hospitality and commercial environments:</p>
        <ul>
            <li><strong>Interplay with Architectural Grazing Light:</strong> When illuminated by recessed ceiling grazing LEDs or wall-wash lighting, fluted surfaces produce rhythmic gradients of shadow and highlight that change dynamically throughout the day as the sun traverses the building.</li>
            <li><strong>Acoustic Diffusion in Hard-Surface Spaces:</strong> Modern luxury interiors often suffer from harsh acoustic reverberation due to expansive glass windows and polished floors. The convex and concave ribs of fluted porcelain disrupt parallel sound reflections, scattering acoustic waves and reducing flutter echo in hotel lobbies and fine dining restaurants.</li>
            <li><strong>Vertical Monumentality:</strong> The crisp vertical fluting lines draw the human eye upward, visually accentuating ceiling height in spaces with restricted vertical clearance.</li>
            <li><strong>Imperviousness in Wet Zones:</strong> Unlike fluted timber or MDF wall paneling—which swells and rots in humid environments—fluted porcelain can be wrapped into wet shower enclosures, spa steam rooms, and behind luxury bathroom vanities with zero moisture vulnerability.</li>
        </ul>

        <h3>4. The 2026 Color Forecast: Earth Minerals, Warm Travertines & Biophilic Wellness</h3>
        <p>The visual color palette of commercial and residential surfaces is undergoing its most dramatic evolution in two decades. The sterile, cold grey-and-white minimalist palette that dominated corporate architecture from 2010 to 2022 is being replaced by <strong>warm, restorative earth tones grounded in geological authenticity</strong>:</p>

        <div class="table-responsive">
            <table class="modal-spec-table">
                <thead>
                    <tr>
                        <th>Color Palette Focus</th>
                        <th>Dominant Hex / Mineral Tones</th>
                        <th>Psychological & Architectural Mood</th>
                        <th>Ideal Project Typology</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Warm Roman Travertine</strong></td>
                        <td>Almond, Honey Cream, Warm Sandstone (#E8D8C8)</td>
                        <td>Warmth, classical timelessness, tactile comfort, Mediterranean heritage</td>
                        <td>Luxury hotel atriums, residential living pavilions, retail flagship boutiques</td>
                    </tr>
                    <tr>
                        <td><strong>Biophilic Earth Terracotta</strong></td>
                        <td>Sienna Clay, Burnt Umber, Rust Mineral (#A0522D)</td>
                        <td>Grounded stability, artisan warmth, connection to soil and craftsmanship</td>
                        <td>Artisan cafes, boutique wine cellars, wellness resort villas, spa suites</td>
                    </tr>
                    <tr>
                        <td><strong>Mineral Olive Sage</strong></td>
                        <td>Subdued Olive, Eucalyptus Green, Moss Gray (#6B8E23)</td>
                        <td>Stress reduction, restorative biophilic healing, organic serenity</td>
                        <td>Healthcare wellness centers, spa treatment rooms, luxury residential bathrooms</td>
                    </tr>
                    <tr>
                        <td><strong>Sedimentary Basalt & Charcoal</strong></td>
                        <td>Deep Graphite, Smoked Anthracite, Warm Slate (#2F4F4F)</td>
                        <td>Dramatic focal anchoring, quiet luxury, moody sophistication</td>
                        <td>Executive corporate boardrooms, cocktail lounges, modern exterior rainscreens</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>5. Material Juxtaposition: Pairing Tactile Porcelain with Contemporary Elements</h3>
        <p>Architects in 2026 rarely specify porcelain in isolation. The most acclaimed international projects achieve emotional resonance through <strong>material tension and juxtaposition</strong>—pairing the permanence of ceramic stone with complementary architectural elements:</p>
        <ul>
            <li><strong>Tactile Porcelain + Brushed Warm Metals:</strong> Pairing soft matte synchronous-carved travertine porcelain with brushed champagne bronze, raw brass, or warm copper trim creates a harmonious interplay of warm geological stone and refined metallurgy.</li>
            <li><strong>3D Fluted Tiles + Fluted Glass:</strong> Repeating vertical fluted motifs across wet shower porcelain walls and adjacent fluted tempered glass partition screens unifies bathroom suite architecture with clean geometric rhythm.</li>
            <li><strong>Porcelain Slabs + Biophilic Green Walls:</strong> Framing living preserved moss walls and indoor ficus trees with monumental 1200x2400 mm dark basalt porcelain creates striking contrast between vibrant organic foliage and timeless geological masonry.</li>
        </ul>

        <h3>6. Commercial Hospitality & Retail Applications</h3>
        <p>Tactile and micro-carved porcelain finishes are proving particularly successful in high-traffic commercial settings where surface longevity must coexist with bespoke interior styling:</p>
        <ol>
            <li><strong>Hotel Reception Desk Wraps:</strong> Sintered slabs with synchronous carving can be mitered seamlessly around curved or angular reception desks, resisting luggage scuffs and cleaning chemicals while providing guests with an immediate tactile impression of bespoke luxury upon check-in.</li>
            <li><strong>Luxury Retail Dressing Rooms & Cash Wraps:</strong> Luxury fashion flagships utilize warm travertine porcelain to create warm, flattering ambient lighting conditions that enhance customer comfort and dwell time.</li>
            <li><strong>Restaurant Bar Fronts & Back-Bar Niches:</strong> Fluted porcelain withstands the continuous impact of bar stools and spilled acidic cocktails, wiping clean with a damp microfiber cloth while adding dramatic three-dimensional shadow lines under integrated toe-kick LED lighting.</li>
        </ol>

        <h3>7. Maintenance Protocols for Textured & Carved Surfaces</h3>
        <p>A common apprehension among commercial facility managers when considering textured or carved surfaces is maintenance: will dust, shoe grime, or hard-water scale become trapped within the 3D relief? With Pixel Ceramic's micro-carved and fluted surfaces, cleanability is engineered into the glaze chemistry:</p>
        <div class="modal-callout-info">
            <strong>Maintenance Guideline:</strong> Pixel Ceramic utilizes non-porous crystalline surface seal glazes fired at 1,220°C. While the surface features 3D depth, the microscopic pore diameter remains closed (&le; 0.05% absorption). Grime cannot adhere chemically to the glass matrix.
        </div>
        <ul>
            <li><strong>Routine Maintenance:</strong> Daily flat microfiber mopping with pH-neutral multi-surface detergents (such as Fila Cleaner Pro or equivalent) is sufficient to remove surface dust and pedestrian soil.</li>
            <li><strong>Heavy Commercial Soil Removal:</strong> In commercial food zones, periodic cleaning with a low-pressure rotating cylindrical brush scrubber (using alkaline degreasers) effortlessly sweeps soil out of low-relief carving valleys without dulling the matte finish.</li>
            <li><strong>What to Avoid:</strong> Never apply topical acrylic waxes, solvent-based sealers, or crystallization polishes. These products create sticky surface residues that trap dirt inside the carved valleys and permanently ruin the sophisticated matte patina.</li>
        </ul>
        `,
        ctaTitle: "Request the 2026 Surface Design Lookbook",
        ctaDesc: "Explore our curated palette of synchronous carving finishes, fluted 3D wall panels, and warm earthy stone collections."
    },
    "article-4": {
        title: "Optimizing Container Freight & Breakage Prevention for Oceanic Tile Exports",
        category: "Export & Logistics",
        categoryClass: "pill-export",
        date: "August 02, 2026",
        readTime: "12 min read",
        author: "Global Maritime Logistics Team (Pixel Ceramic Export Desk)",
        image: "assets/blog/blog-ocean-logistics.jpg",
        lead: "Transporting thousands of metric tonnes of dense, brittle vitrified porcelain across global ocean lanes requires precision weight calculation, advanced packaging engineering, and rigorous dunnage stabilization to guarantee zero-breakage delivery at destination ports.",
        content: `
<h3>1. The Physics of Oceanic Tile Transport: Static Mass vs Dynamic G-Forces</h3>
        <p>Ceramic tiles and porcelain slabs represent one of the heaviest, densest, and most structurally demanding cargoes in global intermodal maritime commerce. A single 20-foot Full Container Load (FCL) packed with porcelain tiles carries between <strong>26,000 to 28,000 kilograms (26 to 28 metric tonnes)</strong> of dense, rigid mineral mass concentrated within an internal floor space measuring just 5.9 meters long by 2.35 meters wide.</p>
        <p>During oceanic voyages spanning 15 to 45 days across the Arabian Sea, the Atlantic, or the Pacific Ocean, container vessels encounter severe multi-axis dynamic forces. A cargo container at sea is continuously subjected to six degrees of freedom simultaneously: <strong>rolling, pitching, yawing, surging, swaying, and heaving</strong>. When a container ship rolls 20 degrees in rough seas, transverse acceleration forces exceeding 1.2G to 1.8G are exerted on the stacked pallets. Without sophisticated packaging architecture and container stowing engineering, these harmonic shockwaves can cause pallet deformation, carton crushing, tile-on-tile friction fractures, and catastrophic container floor rupture.</p>

        <div class="modal-quote-box">
            "In maritime tile logistics, zero breakage is achieved through structural physics: every millimeter of internal container void must be engineered out, transforming individual loose pallets into an immovable, shock-absorbing monolithic block."
        </div>

        <h3>2. Container Dynamics: Why Ceramic Tiles Are Strictly 20ft FCL Cargo</h3>
        <p>A frequent inquiry from international procurement officers and first-time importers is: <em>"Can we pack tiles into 40-foot or 40-foot High Cube (HC) containers to reduce ocean freight rates per square meter?"</em></p>
        <p>From an engineering and regulatory perspective, shipping heavy tiles in 40ft containers is virtually impossible due to international highway weight regulations and container structural payload caps:</p>
        <ul>
            <li><strong>Weight vs. Volume Density:</strong> Standard general cargo (such as electronics, furniture, or apparel) is volume-constrained ('cubes out' before it 'weighs out'). Conversely, ceramic tiles are extremely dense (specific gravity ~2.4 g/cm³), meaning they 'weigh out' long before filling the volumetric capacity of a container.</li>
            <li><strong>Payload Limits:</strong> A standard 20ft dry container has a maximum gross weight rating of 30,480 kg and a tare weight of ~2,200 kg, leaving a maximum net payload of approximately <strong>28,280 kg</strong>. A 40ft dry container has a maximum gross rating of 32,500 kg with a tare weight of ~3,800 kg, leaving a net payload of ~28,700 kg.</li>
            <li><strong>Economic Reality:</strong> Packing tiles into a 40ft container costs almost twice as much in ocean freight while providing less than 2% additional payload capacity! Furthermore, in destinations such as the United States, Europe, and the Middle East, federal road weight limits strictly cap container axle loads (typically 40,000 to 44,000 lbs in the USA), making overweight 40ft containers illegal to transport over road networks without costly specialized heavy-haul permits.</li>
        </ul>

        <h3>3. Pixel Ceramic's 4-Tier Export Packaging Architecture</h3>
        <p>To ensure that every tile carton arrives in pristine, factory-fresh condition regardless of destination port handling conditions, Pixel Ceramic has developed an industry-benchmarked 4-tier packaging protocol:</p>

        <div class="table-responsive">
            <table class="modal-spec-table">
                <thead>
                    <tr>
                        <th>Packaging Tier</th>
                        <th>Material Specification</th>
                        <th>Engineering Protective Function</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Tier 1: Tile Edge Cushioning</strong></td>
                        <td>High-density EVA foam corner protectors & plastic edge caps</td>
                        <td>Absorbs direct point impacts on tile corners (the most vulnerable fracture point during handling)</td>
                    </tr>
                    <tr>
                        <td><strong>Tier 2: Primary Outer Carton</strong></td>
                        <td>5-Ply heavy-duty corrugated cardboard (GSM &gt; 180g) with water-repellent coating</td>
                        <td>Prevents moisture penetration, provides stacking crush resistance (&gt; 450 kg compression strength)</td>
                    </tr>
                    <tr>
                        <td><strong>Tier 3: Solid Wood Palletization</strong></td>
                        <td>ISPM-15 heat-treated solid hardwood skids with bottom deck runner boards</td>
                        <td>Distributes 1,000+ kg pallet weight evenly, facilitates 4-way forklift and pallet jack entry</td>
                    </tr>
                    <tr>
                        <td><strong>Tier 4: Unitized Load Securing</strong></td>
                        <td>High-tensile PET strapping (16mm &times; 0.8mm) + 50-micron LLDPE thermal stretch wrap</td>
                        <td>Binds the palletized stack into a single rigid unit, protects against maritime salt-air humidity</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>4. ISPM-15 Heat Treatment & Fumigation for Wooden Pallets</h3>
        <p>International Standards for Phytosanitary Measures No. 15 (<strong>ISPM-15</strong>), established by the International Plant Protection Convention (IPPC), mandates that all raw solid wood packaging material used in international export must undergo certified debarking and thermal treatment to prevent the international introduction and spread of plant pests and wood-boring insects.</p>
        <p>Pixel Ceramic operates dedicated on-site heat treatment chambers certified by India's Directorate of Plant Protection, Quarantine & Storage. All export pallets undergo:</p>
        <ol>
            <li><strong>Thermal Kiln Treatment:</strong> The pallet wood core temperature is raised to a minimum of <strong>56°C for at least 30 continuous minutes</strong> throughout the entire thickness of the timber, completely eradicating insects, larvae, nematodes, and fungal spores.</li>
            <li><strong>IPPC Wheat-Mark Stamping:</strong> Every individual pallet is indelibly branded on two opposite sides with the official IPPC registration mark, displaying the country code (IN), regional agency code, and the treatment identifier (HT - Heat Treated).</li>
            <li><strong>Anti-Mold Treatment:</strong> To prevent surface mildew during prolonged tropical ocean crossings, timber moisture content is monitored with electronic resistance meters to guarantee &le; 18% moisture prior to assembly.</li>
        </ol>

        <h3>5. Container Stuffing, Weight Distribution & Dunnage Air Bags</h3>
        <p>Even perfectly wrapped pallets will suffer damage if allowed to shift inside the container. When a container vessel navigates ocean swell, an open space of just 50mm (2 inches) between pallets provides enough running room for thousands of kilograms of tiles to slide, slam into adjacent pallets, and shatter their edges.</p>
        <p>Pixel Ceramic's container loading engineering incorporates state-of-the-art dunnage and stowage practices:</p>
        <ul>
            <li><strong>Precision Weight Distribution:</strong> Pallets are stowed in interlocking patterns across the container floor to ensure that the container's center of gravity remains low and centered within 2% of the longitudinal and lateral centerline, preventing trailer rollover risks during highway haulage.</li>
            <li><strong>Inflatable Dunnage Air Bags:</strong> Heavy-duty, multi-ply kraft paper air bags with polyethylene inner bladders are inserted into all vertical voids between pallet rows. Inflated to 0.2 to 0.3 bar of compressed air, these air cushions exert continuous outward pressure, locking the cargo solidly against the container sidewalls and absorbing dynamic voyage vibrations.</li>
            <li><strong>Heavy-Duty Timber Chocking & Lashing:</strong> The rear container door pallets are braced with heavy 4x4-inch timber balks nailed into the container floor, complemented by cross-lashed polyester composite strapping rated for 3,000 kg breaking tenacity anchored to internal container eyelets.</li>
        </ul>

        <div class="modal-callout-info">
            <strong>Customs Inspection Protection:</strong> Rear door timber chocking prevents pallets from shifting and falling outward when container doors are opened by customs inspectors at destination ports, ensuring dockworker safety and passing strict port safety audits.
        </div>

        <h3>6. The Mundra Port Advantage: 180 km Gateway to Global Trade</h3>
        <p>A critical competitive advantage for Pixel Ceramic is our strategic proximity to <strong>Mundra Port (Gujarat, India)</strong>, India's largest, most modern deep-water commercial seaport operated by Adani Ports and Special Economic Zone (APSEZ):</p>
        <ul>
            <li><strong>Short Inland Transit (180 km / 4 hours):</strong> While ceramic factories in central or northern India must haul containers over 800 to 1,400 km of congested roads—subjecting tiles to severe highway shock and delay—Pixel Ceramic's Morbi facility connects to Mundra Port via dedicated multi-lane national highways in under 4 hours.</li>
            <li><strong>Direct Deep-Water Berths:</strong> Mundra Port features a natural draft of 17.5 meters, enabling it to berth the world's largest ultra-large container vessels (ULCVs, up to 24,000 TEU capacity) without tidal delays.</li>
            <li><strong>Direct Global Shipping Loops:</strong> Major global shipping lines—including MSC, Maersk, CMA CGM, Hapag-Lloyd, and COSCO—operate direct weekly express loops from Mundra to Jebel Ali (3 days), Rotterdam (18 days), Hamburg (20 days), Felixstowe (21 days), New York / Newark (24 days), Long Beach (28 days), and Melbourne (22 days).</li>
            <li><strong>Automated Terminal Operations:</strong> Automated container tracking, radio-frequency terminal gates, and dedicated on-dock rail sidings ensure smooth customs seal processing and zero missed vessel cut-offs.</li>
        </ul>

        <h3>7. International Trade Documentation & Customs Compliance Checklist</h3>
        <p>Flawless maritime logistics requires more than physical cargo care; it demands immaculate trade documentation to ensure seamless clearance at destination customs borders without incurring costly demurrage or storage charges. Pixel Ceramic's dedicated export documentation team provides a complete documentation suite customized to destination country regulations:</p>
        <ol>
            <li><strong>Clean On Board Ocean Bill of Lading (B/L):</strong> Issued directly by the shipping line, with precise pallet, weight, and description declarations matching commercial invoices.</li>
            <li><strong>Certified Commercial Invoice & Detailed Packing List:</strong> Itemizing box counts, square meters, net weight, gross weight, and pallet numbers for every batch.</li>
            <li><strong>Certificate of Origin (Preferential / Non-Preferential):</strong> Legalized by the Chamber of Commerce, enabling importers to claim duty concessions under bilateral free trade agreements.</li>
            <li><strong>Phytosanitary & Fumigation Certificate:</strong> Issued by authorized government agricultural inspectors verifying ISPM-15 compliance.</li>
            <li><strong>Pre-Shipment Quality Inspection Certificate:</strong> Pixel Ceramic coordinates with international third-party inspection agencies (including SGS, Bureau Veritas, Intertek, or Cotecna) for container loading supervision and sealing when mandated by destination banks or buyers.</li>
            <li><strong>Country-Specific Mandates:</strong> Fully registered with SASO SABER (Saudi Arabia), CE Marking Declarations of Performance (DoP for European Union), SONCAP (Nigeria), and PVOC (East Africa).</li>
        </ol>

        <h3>8. Standard Container Loading Schedules for Common Formats</h3>
        <p>To assist procurement managers in optimizing container order quantities, the table below details standard 20ft FCL palletization metrics based on a standard 27,500 kg net cargo weight allowance:</p>

        <div class="table-responsive">
            <table class="modal-spec-table">
                <thead>
                    <tr>
                        <th>Tile Size (cm)</th>
                        <th>Thickness (mm)</th>
                        <th>Boxes / Pallet</th>
                        <th>Pallets / 20ft FCL</th>
                        <th>Total Boxes / FCL</th>
                        <th>Total Area (m&sup2;)</th>
                        <th>Approx. Gross Weight</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>60 &times; 60 cm</strong></td>
                        <td>9.0 mm</td>
                        <td>40 boxes (4 pcs/box)</td>
                        <td>24 pallets</td>
                        <td>960 boxes</td>
                        <td>1,382.40 m&sup2;</td>
                        <td>27,200 kg</td>
                    </tr>
                    <tr>
                        <td><strong>60 &times; 120 cm</strong></td>
                        <td>9.0 mm</td>
                        <td>30 boxes (2 pcs/box)</td>
                        <td>24 pallets</td>
                        <td>720 boxes</td>
                        <td>1,036.80 m&sup2;</td>
                        <td>27,000 kg</td>
                    </tr>
                    <tr>
                        <td><strong>80 &times; 160 cm</strong></td>
                        <td>9.0 mm</td>
                        <td>24 boxes (2 pcs/box)</td>
                        <td>20 pallets</td>
                        <td>480 boxes</td>
                        <td>1,228.80 m&sup2;</td>
                        <td>27,400 kg</td>
                    </tr>
                    <tr>
                        <td><strong>120 &times; 240 cm</strong></td>
                        <td>9.0 mm</td>
                        <td>Special A-Frame / Crate</td>
                        <td>10 steel/wood crates</td>
                        <td>200 slabs</td>
                        <td>576.00 m&sup2;</td>
                        <td>26,800 kg</td>
                    </tr>
                    <tr>
                        <td><strong>20 &times; 120 cm (Wood)</strong></td>
                        <td>9.0 mm</td>
                        <td>48 boxes (4 pcs/box)</td>
                        <td>24 pallets</td>
                        <td>1,152 boxes</td>
                        <td>1,105.92 m&sup2;</td>
                        <td>27,100 kg</td>
                    </tr>
                </tbody>
            </table>
        </div>
        `,
        ctaTitle: "Calculate Your Container Payload Capacity",
        ctaDesc: "Use our export calculator or contact our logistics desk for FOB Mundra and CIF shipping schedules."
    },
    "article-5": {
        title: "Biophilic Architecture: Integrating Natural Wood-Look Porcelain Planks in Modern Facades",
        category: "Architecture & Design",
        categoryClass: "pill-arch",
        date: "July 21, 2026",
        readTime: "11 min read",
        author: "Sustainable Architecture Advisory (Pixel Ceramic Design Studio)",
        image: "assets/blog/blog-biophilic-wood.jpg",
        lead: "Wood-look vitrified porcelain planks reconcile the restorative emotional warmth of authentic old-growth timber with the fireproof, rot-proof, and maintenance-free permanence required for modern commercial facades, ventilated rainscreens, and high-traffic public promenades.",
        content: `
<h3>1. Biophilia in Contemporary Architecture: The Psychological Need for Timber</h3>
        <p>In modern urban metropolises characterized by steel skyscrapers, reflective curtain wall glazing, and exposed concrete infrastructure, human occupants experience acute visual fatigue and emotional detachment. The scientific framework of <strong>Biophilic Design</strong>—pioneered by social biologist Edward O. Wilson—posits that human beings possess an innate, genetically rooted evolutionary affinity for natural elements, organic materials, and living biological systems.</p>
        <p>Extensive peer-reviewed architectural research demonstrates that incorporating natural timber visual motifs, warm wood grain textures, and organic earth tones into corporate workplaces, healthcare recovery pavilions, and residential developments lowers resting cortisol levels by up to 15%, reduces systolic blood pressure, improves mental focus, and accelerates patient healing times. However, while architects passionately champion the aesthetic and physiological benefits of wood, structural engineers, fire safety officers, and building maintenance teams have historically faced severe dilemmas when utilizing genuine natural timber on commercial exterior envelopes and high-traffic wet floors.</p>

        <div class="modal-quote-box">
            "Biophilic architecture should not come at the cost of global forest degradation or severe structural flammability. Engineered wood-look porcelain provides the authentic biological warmth of timber with the geological permanence of vitrified stone."
        </div>

        <h3>2. The Structural & Environmental Pitfalls of Natural Timber Cladding</h3>
        <p>Specifying genuine natural hardwood (such as Burmese Teak, Ipe, Cumaru, or Western Red Cedar) on exterior building facades, open balconies, and public boardwalks introduces significant long-term structural liabilities:</p>
        <ul>
            <li><strong>Severe Ecological Depletion & Deforestation:</strong> Tropical hardwood harvesting contributes to ancient rainforest destruction, habitat fragmentation, and high embodied carbon transport emissions from remote jungle basins to metropolitan build sites.</li>
            <li><strong>Combustibility & Life-Safety Hazards:</strong> Following catastrophic international façade fires (such as the Grenfell Tower tragedy in London), international building codes (IBC Chapter 14, Eurocodes, and NFPA 285) have severely restricted or outright banned combustible materials on exterior assemblies of multi-story buildings. Untreated natural timber is classified as Class D or E under European fire standards (EN 13501-1), presenting severe fire propagation risks.</li>
            <li><strong>Hygroscopic Swelling, Warping & Splintering:</strong> Real timber is hygroscopic, continually absorbing and desorbing atmospheric moisture. In humid climates or rainy seasons, wood swells, cups, and buckles; during dry seasons, it shrinks, develops deep longitudinal checking fissures, and releases dangerous splinters under bare feet.</li>
            <li><strong>Biological Decay & Pest Infestation:</strong> Without constant chemical biocides, timber succumbs to wood-rotting fungi (white rot and brown rot), subterranean termites, carpenter ants, and marine borers.</li>
            <li><strong>Exorbitant Lifecycle Maintenance Costs:</strong> Natural exterior timber requires sanding, power washing, and toxic chemical oil staining every 12 to 18 months. Over a 30-year building lifecycle, maintenance costs frequently exceed the initial installation cost by 300% to 500%.</li>
        </ul>

        <h3>3. High-Definition Digital Wood Replication & Micro-Relief Press Molds</h3>
        <p>Pixel Ceramic's wood-look porcelain planks (spanning classic 20x120 cm and 20x100 cm architectural dimensions) replicate authentic old-growth timber through advanced digital surface engineering:</p>
        <ol>
            <li><strong>Ultra-High-Resolution Optical Photogrammetry:</strong> Reclaimed heritage oak beams, hand-planed walnut slabs, and weathered Scandinavian larch planks are digitized using multi-spectral 3D laser scanners at over 400 DPI optical resolution. Every microscopic saw mark, natural growth ring, open wood vessel, and rustic knot is captured down to 20-micron tolerances.</li>
            <li><strong>Structured 3D Roller Punch Molds:</strong> The vitrified porcelain green body is pressed using dedicated structured rubber-steel punches that impart subtle wood grain relief into the surface, ensuring the tactile texture perfectly matches the visible grain beneath.</li>
            <li><strong>32+ Unique Graphic Tile Faces:</strong> To eliminate the repetitive 'stamp effect' that plagued early ceramic wood tiles, Pixel Ceramic's continuous digital inkjet lines utilize up to 32 completely unique, non-repeating timber graphics per collection. When installed across a 100 m² terrace or continuous facade, no two adjacent planks share identical knot or grain configurations.</li>
            <li><strong>Satin-Matte Natural Luster Glazes:</strong> Formulated with micronized mineral silicates, our top glazes achieve an authentic 3° to 5° satin sheen that mimics natural oil-rubbed timber rather than artificial glossy plastic laminate.</li>
        </ol>

        <h3>4. Fire Safety Engineering: Class A1 Non-Combustibility (EN 13501-1)</h3>
        <p>For architectural specifiers working on high-rise residential towers, educational institutions, hospitals, and transit hubs, fire performance is non-negotiable. Sintered and vitrified porcelain wood planks are composed exclusively of inorganic natural minerals (clays, feldspar, quartz) fired at 1,220°C. They contain zero polymers, zero organic resins, and zero chemical adhesives.</p>
        <p>Consequently, Pixel Ceramic wood-look porcelain planks achieve the highest possible international fire classification:</p>
        <ul>
            <li><strong>EN 13501-1 Reaction to Fire:</strong> Certified <strong>Class A1 / A1fl</strong> (Non-combustible, zero contribution to fire growth).</li>
            <li><strong>Smoke Development:</strong> Rating <strong>s1</strong> (Zero smoke emission, preventing asphyxiation hazards).</li>
            <li><strong>Flaming Droplets:</strong> Rating <strong>d0</strong> (Zero flaming droplets or particles released under direct flame impingement).</li>
            <li><strong>ASTM E84 (USA):</strong> Flame Spread Index = 0, Smoke Developed Index = 0 (Class A interior finish and exterior cladding compliant).</li>
        </ul>
        <p>Architects can clad multi-story residential exterior walls, cantilevered soffits, and emergency egress corridors with the warm aesthetic of natural wood while fully complying with the world's strictest municipal fire codes.</p>

        <h3>5. Performance Matrix: Natural Timber vs WPC Composite vs Porcelain Wood Planks</h3>
        <p>To quantify the engineering advantages for building owners and developers, review the comparative technical matrix below:</p>

        <div class="table-responsive">
            <table class="modal-spec-table">
                <thead>
                    <tr>
                        <th>Technical Parameter</th>
                        <th>Pixel Porcelain Wood Plank</th>
                        <th>Natural Hardwood (Ipe / Teak)</th>
                        <th>Wood-Plastic Composite (WPC)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Fire Safety Rating</strong></td>
                        <td><strong>Class A1 (Non-combustible)</strong></td>
                        <td>Class D / E (Highly combustible)</td>
                        <td>Class B / C (Melts & emits toxic smoke)</td>
                    </tr>
                    <tr>
                        <td><strong>Water Absorption</strong></td>
                        <td><strong>&le; 0.05% (Impervious)</strong></td>
                        <td>15% &ndash; 30% (High swelling)</td>
                        <td>1.0% &ndash; 3.0% (Capillary moisture)</td>
                    </tr>
                    <tr>
                        <td><strong>UV / Color Fastness</strong></td>
                        <td><strong>100% Stable (DIN 51094)</strong></td>
                        <td>Greys & silvers within 6 months</td>
                        <td>Fades & chalks under direct sunlight</td>
                    </tr>
                    <tr>
                        <td><strong>Termite & Rot Resistance</strong></td>
                        <td><strong>100% Immune</strong></td>
                        <td>Vulnerable without chemical poisons</td>
                        <td>Vulnerable to mold growth in shade</td>
                    </tr>
                    <tr>
                        <td><strong>Scratch & Furniture Resistance</strong></td>
                        <td><strong>Mohs 7 (Scratch-proof)</strong></td>
                        <td>Dents easily under heels/furniture</td>
                        <td>Scratches easily; cannot be sanded</td>
                    </tr>
                    <tr>
                        <td><strong>30-Year Maintenance Cost</strong></td>
                        <td><strong>Zero (Routine washing only)</strong></td>
                        <td>Very High (Annual oiling & sanding)</td>
                        <td>Moderate (Power washing, replacement)</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>6. Raised Exterior Pedestal Flooring & Rooftop Terrace Systems</h3>
        <p>A premier application for 20mm thick wood-look porcelain planks is in exterior raised-floor terrace systems (pedestal flooring). Traditional exterior tiled terraces rely on thick mortar screeds and bonded waterproofing membranes, which frequently crack and leak over time due to substrate movement and trapped freeze-thaw moisture.</p>
        <p>In modern pedestal terrace construction, 20mm wood-look porcelain planks are dry-laid directly onto height-adjustable polypropylene pedestals with acoustic rubber spacer heads:</p>
        <ul>
            <li><strong>Open Free-Draining Joints:</strong> The 2mm to 4mm open joints between planks allow rainwater to drain instantly beneath the walking surface, eliminating slippery puddles and standing water.</li>
            <li><strong>Sub-Surface Utility Routing:</strong> The open void beneath the floor conceals electrical conduit, landscape irrigation pipes, and rainwater drainage channels, all while remaining 100% accessible simply by lifting an individual plank with a suction cup.</li>
            <li><strong>Thermal Insulation Protection:</strong> The elevated porcelain deck shades the underlying roof waterproofing membrane from direct UV radiation and extreme thermal cycling, extending roof membrane lifespan from 10 to over 35 years.</li>
        </ul>

        <h3>7. Installation Best Practices: Offset Rules & Lippage Prevention</h3>
        <p>Because long-format porcelain planks (20x120 cm) undergo microscopic dilatometric contraction during cooling in the kiln, all ceramic planks exhibit a slight natural center camber (curvature). To guarantee a perfectly flat, lippage-free floor, tile setters must strictly adhere to professional setting protocols:</p>
        <ol>
            <li><strong>Maximum 1/3 (33%) Staggered Offset:</strong> <em>Never</em> lay long wood-look planks in a traditional 50% center-stagger (brick-bond) pattern. In a 50% pattern, the highest point of one tile (its center) aligns directly with the lowest point of the adjacent tile (its corner), maximizing visible lippage. By specifying a <strong>1/3 or 1/4 random running stagger</strong>, edge lippage is eliminated.</li>
            <li><strong>Mandatory Leveling Spacers:</strong> Always specify reusable mechanical tile leveling clips (wedge-and-clip systems). These mechanical clamps pull adjacent plank edges into perfect planar alignment while the polymer-modified adhesive mortar cures.</li>
            <li><strong>Back-Buttering Technique:</strong> Trowel adhesive onto the substrate with a 10mm or 12mm notched trowel, and always apply a thin 1mm to 2mm flat contact layer (back-buttering) to the rear of every plank to guarantee 100% solid mortar coverage without hollow pockets.</li>
        </ol>
        `,
        ctaTitle: "Request Wood-Look Architectural Swatches",
        ctaDesc: "Order a curated presentation kit of our Nordic Oak, Smoked Walnut, and Siberian Larch plank collections in 20x120 cm formats."
    },
    "article-6": {
        title: "Slip Resistance & Pendulum Test (PTV) Ratings for Commercial Hospitality",
        category: "Technical & Installation",
        categoryClass: "pill-tech",
        date: "July 10, 2026",
        readTime: "11 min read",
        author: "Engineering Compliance Division (Pixel Ceramic Testing Lab)",
        image: "assets/blog/blog-slip-resistance.jpg",
        lead: "Slip-and-fall accidents represent the single largest public liability risk in commercial hospitality and retail architecture. Specifying verified DIN 51130 R-ratings, barefoot DIN 51097 standards, and wet Pendulum Test Values (PTV &ge; 36) is mandatory for occupant safety and building code compliance.",
        content: `
<h3>1. The Biomechanics of Slip Accidents: Hydrodynamic Squeeze & Liability</h3>
        <p>According to international occupational health and building safety statistics, slips, trips, and falls account for over <strong>40% of all reported public liability claims</strong> in commercial facilities, retail shopping concourses, luxury hotels, and transport terminals. When a pedestrian walks across a dry floor, the friction between footwear soling material and the tile surface is governed by microscopic adhesion and mechanical interlocking. However, the moment a contaminant—such as rainwater tracked through an entrance, spilled cooking oil in a restaurant, or swimming pool water on a patio—is introduced, the physics changes catastrophically.</p>
        <p>As the pedestrian's heel strikes the wet surface at an angle (typically between 5 and 7 degrees during standard gait), the liquid contaminant forms a lubricating film. If the tile surface lacks sufficient microscopic roughness, the liquid cannot be displaced in time, causing <strong>hydrodynamic squeeze-film lubrication</strong> (the exact same phenomenon as automotive hydroplaning). The heel slips forward uncontrollably, resulting in severe physical injuries and multi-million-dollar liability litigation for facility owners and architectural design firms.</p>

        <div class="modal-quote-box">
            "A tile that appears safe when dry can become as slippery as ice with a mere 20-micron film of water. Specifying verified wet friction performance is an ethical and legal obligation for every commercial architect."
        </div>

        <h3>2. International Slip Testing Standards Demystified</h3>
        <p>Architectural specifications frequently contain vague or contradictory slip resistance requirements because different global jurisdictions rely on different test methodologies. Understanding the three primary international testing systems is essential for accurate project submittals:</p>

        <h4>A. DIN 51130 Shod Ramp Test (German / European Standard)</h4>
        <p>The DIN 51130 test (now integrated into <strong>EN 16165 Annex B</strong>) is an inclined ramp test performed in an accredited laboratory. A human test subject wearing standardized safety boots with vulcanized rubber soles walks back and forth across the test tile surface, which has been continuously coated with engine lubricating oil (viscosity SAE 10W-30). The ramp inclination angle is gradually increased until the tester slips. The critical angle of slip dictates the famous 'R-Rating':</p>
        <ul>
            <li><strong>R9 (Angle 6&deg; to 10&deg;):</strong> Suitable only for dry internal areas (hotel guest bedrooms, private offices, dry retail areas). Low slip resistance in wet environments.</li>
            <li><strong>R10 (Angle 10&deg; to 19&deg;):</strong> Normal commercial slip resistance. Suitable for public restrooms, restaurant dining halls, and covered building entry vestibules.</li>
            <li><strong>R11 (Angle 19&deg; to 27&deg;):</strong> Enhanced slip resistance for wet public zones—hotel entrance ramps, outdoor patios, commercial kitchens, and wet leisure amenities.</li>
            <li><strong>R12 (Angle 27&deg; to 35&deg;):</strong> Heavy industrial slip resistance—commercial butcheries, industrial kitchens, brewery floors, and vehicle service bays.</li>
            <li><strong>R13 (Angle &gt; 35&deg;):</strong> Extreme industrial environments with thick grease, fats, and slurry accumulation.</li>
        </ul>

        <h4>B. DIN 51097 Wet Barefoot Ramp Test (Pools & Spas)</h4>
        <p>Because shod footwear behaves completely differently from human skin, wet barefoot zones (swimming pool surrounds, locker rooms, communal showers) must be tested under <strong>DIN 51097 / EN 16165 Annex A</strong>. In this test, a barefoot subject walks on the tile coated with a continuous solution of water and surfactant (soap). Ratings are classified into three distinct categories:</p>
        <ul>
            <li><strong>Class A (Inclination &ge; 12&deg;):</strong> Barefoot corridors, changing cubicles, dry sauna zones.</li>
            <li><strong>Class B (Inclination &ge; 18&deg;):</strong> Communal shower rooms, swimming pool surrounds, paddling pools, and spa relaxation areas.</li>
            <li><strong>Class C (Inclination &ge; 24&deg;):</strong> Submerged pool steps, diving board platforms, water slide exit flumes, and steeply inclined pool walk-ins.</li>
        </ul>

        <h4>C. BS 7976-2 / EN 16165 Annex C: The Pendulum Test Value (PTV)</h4>
        <p>The Pendulum Test—originally developed by the UK Health and Safety Executive (HSE) and the British Standards Institution—is widely considered the world's most rigorous and legally defensible slip resistance test. Unlike ramp tests (which can only be performed in laboratories on loose tiles), the Pendulum Tester is a portable instrument that can test tiles in a laboratory <em>and in-situ on live construction sites</em>.</p>
        <p>The device swings a mechanical arm equipped with a spring-loaded rubber slider (Slider 96 / Four-S for shod areas, or Slider 55 / TRL for barefoot areas) across the wet tile surface. The energy absorbed by friction slows the pendulum arm, which registers a direct reading called the <strong>Pendulum Test Value (PTV)</strong> or Slip Resistance Value (SRV):</p>

        <div class="table-responsive">
            <table class="modal-spec-table">
                <thead>
                    <tr>
                        <th>Pendulum Test Value (Wet PTV)</th>
                        <th>UK HSE Slip Potential Classification</th>
                        <th>Legal & Architectural Compliance Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>0 &ndash; 24 PTV</strong></td>
                        <td><strong>High Slip Risk</strong> (1 in 2 chance of slipping)</td>
                        <td>Illegal for wet commercial walkways; high liability</td>
                    </tr>
                    <tr>
                        <td><strong>25 &ndash; 35 PTV</strong></td>
                        <td><strong>Moderate Slip Risk</strong> (1 in 100 chance)</td>
                        <td>Acceptable only for strictly dry interior zones</td>
                    </tr>
                    <tr>
                        <td><strong>36+ PTV</strong></td>
                        <td><strong>Low Slip Risk</strong> (1 in 1,000,000 chance)</td>
                        <td><strong>Mandatory threshold</strong> for public commercial wet floors</td>
                    </tr>
                    <tr>
                        <td><strong>45+ PTV</strong></td>
                        <td><strong>Extremely Low Slip Risk</strong></td>
                        <td>Recommended for exterior ramps, pool decks, and wet concourses</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>3. Why You Cannot Directly Convert R-Ratings to PTV or DCOF</h3>
        <p>A frequent error made by project specifiers is assuming that an 'R10' tile automatically delivers a wet PTV of 36+, or that an R-rating can be calculated from American DCOF (ANSI A326.3). This assumption is scientifically flawed:</p>
        <div class="modal-callout-info">
            <strong>Crucial Specifier Warning:</strong> DIN 51130 uses high-viscosity motor oil and heavy-tread work boots. Pendulum BS 7976-2 uses distilled water and flat rubber sliders. Many smooth micro-textured tiles achieve an R10 rating in oil due to shoe tread suction, but fail disastrously under wet pendulum testing (yielding PTVs of 28 to 32). Always demand independent <strong>wet PTV test certificates</strong> alongside R-ratings!
        </div>

        <h3>4. Pixel Ceramic's Micro-Grip Surface Chemistry</h3>
        <p>Historically, achieving an R11 or PTV 36+ rating required adding coarse carborundum grit or deep abrasive sand particles into the glaze. While slip-resistant, these rough sandpaper-like surfaces presented a maintenance nightmare: commercial mops snagged and shredded on the grit, and microscopic dirt particles became permanently trapped in the crevices, turning bright tiles dingy and grey within months.</p>
        <p>Pixel Ceramic's proprietary <strong>Micro-Grip Crystalline Surface Technology</strong> solves this dilemma through pyrochemical surface engineering:</p>
        <ul>
            <li><strong>Fused Micro-Crystalline Needles:</strong> During the 1,220°C vitrification cycle, specialized crystalline mineral compounds melt and precipitate into microscopic, nano-scale crystal pyramids evenly dispersed across the glaze.</li>
            <li><strong>Hydrodynamic Evacuation Channels:</strong> When a wet shoe presses against the tile, the microscopic crystal peaks pierce the thin water boundary layer, establishing direct mechanical contact with the rubber sole, while the nano-valleys channel water away.</li>
            <li><strong>Effortless Surface Cleanability:</strong> Because the crystalline peaks are microscopic (&lt; 15 microns in height) and the vitreous glaze is non-porous, dirt, grease, and mop fibers cannot adhere. The tile feels smooth and comfortable to bare hands when dry, but transforms into an ultra-grippy traction surface the moment water is introduced.</li>
        </ul>

        <h3>5. Commercial Hospitality Area-by-Area Specifier Matrix</h3>
        <p>Consult this engineering guide when preparing finish schedules for hospitality and commercial projects:</p>

        <div class="table-responsive">
            <table class="modal-spec-table">
                <thead>
                    <tr>
                        <th>Hotel / Commercial Zone</th>
                        <th>Recommended DIN 51130</th>
                        <th>Recommended DIN 51097</th>
                        <th>Mandatory Wet PTV</th>
                        <th>Surface Finish Recommendation</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Grand Entrance Lobby (Internal)</strong></td>
                        <td>R10</td>
                        <td>&mdash;</td>
                        <td>PTV &ge; 36</td>
                        <td>Honed / Satin Matte Micro-Grip</td>
                    </tr>
                    <tr>
                        <td><strong>Exterior Covered Portico & Steps</strong></td>
                        <td>R11</td>
                        <td>&mdash;</td>
                        <td>PTV &ge; 40</td>
                        <td>Structured Flamed or 20mm Outdoor Paver</td>
                    </tr>
                    <tr>
                        <td><strong>Guest Suite Bathrooms</strong></td>
                        <td>R10</td>
                        <td>Class B</td>
                        <td>PTV &ge; 36</td>
                        <td>Silk-Matte Anti-Slip Porcelain</td>
                    </tr>
                    <tr>
                        <td><strong>Commercial Hotel Kitchens</strong></td>
                        <td>R11 / R12 (V4)</td>
                        <td>&mdash;</td>
                        <td>PTV &ge; 45</td>
                        <td>Full-Body Porcelain with V4 displacement</td>
                    </tr>
                    <tr>
                        <td><strong>Outdoor Infinity Pool Deck</strong></td>
                        <td>R11</td>
                        <td>Class C</td>
                        <td>PTV &ge; 45</td>
                        <td>20mm Textured Vitrified Paver</td>
                    </tr>
                    <tr>
                        <td><strong>Spa Thermal Suite & Steam Rooms</strong></td>
                        <td>R10</td>
                        <td>Class B / C</td>
                        <td>PTV &ge; 38</td>
                        <td>Micro-Grip Mosaic or Structured Porcelain</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>6. Maintenance Protocols to Preserve Slip Resistance Over Time</h3>
        <p>A certified PTV 40 tile can rapidly degrade to a dangerous PTV 25 if incorrect commercial cleaning chemicals are used. In hotels and restaurants, the most common cause of sudden slip accidents on certified non-slip floors is <strong>polymer detergent buildup</strong>:</p>
        <ol>
            <li><strong>Avoid Residue-Forming Cleaners:</strong> Many standard floor cleaners contain optical brighteners, pine oils, or synthetic wax polymers designed to make vinyl floors shiny. When applied to micro-textured vitrified porcelain, these polymers dry into a microscopic film that fills the micro-grip valleys, creating a dangerously slick barrier.</li>
            <li><strong>Mandatory Neutral & Alkaline Regimen:</strong> Daily cleaning must be conducted with clean, surfactant-free pH-neutral detergents. In dining areas and commercial kitchens, periodic bi-weekly deep cleaning with an emulsifying alkaline degreaser (pH 10 to 11) is essential to dissolve microscopic animal fats and cooking oils.</li>
            <li><strong>Routine Wet-Vac Extraction:</strong> In commercial food facilities, always extract dirty wash water with a wet-vac or auto-scrubber rather than pushing dirty water around with a contaminated cotton string mop.</li>
        </ol>
        `,
        ctaTitle: "Download Full Slip Resistance Certificates",
        ctaDesc: "Access accredited laboratory test reports for DIN 51130, DIN 51097, and BS 7976-2 PTV across our commercial tile series."
    },
    "article-7": {
        title: "Pixel Ceramic Commissions New 16,000-Tonne Automated Continuous Press Line",
        category: "Media & Press",
        categoryClass: "pill-media",
        date: "June 30, 2026",
        readTime: "10 min read",
        author: "Corporate Communications Bureau (Pixel Ceramic Morbi Complex)",
        image: "assets/blog/blog-factory-press.jpg",
        lead: "Marking a monumental leap in smart manufacturing infrastructure, Pixel Ceramic has officially inaugurated its second automated continuous compaction line in Morbi, expanding mega-slab production capacity to 1.4 million square meters annually while cutting carbon intensity by 22% through heat-recuperation kilns.",
        content: `
<h3>1. Infrastructure Expansion: Meeting Accelerating Global Sintered Stone Demand</h3>
        <p>In response to exponential global demand from architectural firms, real estate conglomerates, and international tile distributors across North America, Europe, the Middle East, and the Asia-Pacific region, Pixel Ceramic Pvt. Ltd. has officially commissioned its second continuous hydraulic compaction slab manufacturing line at its flagship industrial complex in Morbi, Gujarat.</p>
        <p>This major capital expansion—representing a technological investment exceeding USD 18 million—elevates Pixel Ceramic's total large-format sintered porcelain slab manufacturing capacity beyond <strong>1.4 million square meters annually</strong>. The newly inaugurated facility is dedicated exclusively to the production of high-performance mega-slabs in formats spanning <strong>1200x2400 mm, 1200x1800 mm, and 800x2400 mm</strong> in thicknesses ranging from ultra-slim 6mm (for ventilated curtain wall facades and interior wall paneling) to 9mm and 12mm (for high-traffic commercial flooring and luxury kitchen countertops).</p>

        <div class="modal-quote-box">
            "This expansion is not simply about producing more square meters—it is about pioneering microscopic density perfection, zero-defect planarity, and sustainable manufacturing standards that place Indian ceramic engineering at the pinnacle of the global market."
        </div>

        <h3>2. Continuous Roll Compaction vs Traditional Toggle Pressing</h3>
        <p>The core technological marvel of the new manufacturing line is its state-of-the-art <strong>continuous hydraulic roll-compaction system</strong> (developed in technical collaboration with leading Italian ceramic engineering pioneers). For decades, standard ceramic and vitrified tiles were manufactured using traditional discontinuous hydraulic toggle presses with rigid steel molds. While effective for smaller formats (such as 600x600 mm or 600x1200 mm), rigid mold presses present severe physical limitations when scaled up to mega-formats:</p>
        <ul>
            <li><strong>Entrapped Air Pockets:</strong> In traditional cavity mold pressing, atomized powder is dumped into a rigid steel die and compressed by a top punch. During rapid downward compaction, air trapped between microscopic clay particles cannot easily escape through the perimeter, creating micro-porosities, localized density variances, and internal tensile stresses that cause slabs to crack during subsequent CNC diamond cutting or bridge saw fabrication.</li>
            <li><strong>The Continuous Compaction Advantage:</strong> In Pixel Ceramic's new continuous roll line, atomized mineral powder is distributed onto a high-strength continuous steel belt with laser-guided precision thickness monitors. The powder bed passes through two massive opposing counter-rotating hydraulic compaction cylinders exerting over <strong>16,000 to 25,000 tonnes</strong> of progressive, continuous compaction force.</li>
            <li><strong>Continuous Air De-Aeration:</strong> Because compaction occurs progressively as the belt moves forward, trapped air is continuously pushed backward and expelled freely from the uncompacted powder bed. The resulting green slab achieves uniform bulk density throughout every square millimeter of its 1200x2400 mm expanse, completely eliminating internal stress fractures and ensuring flawless workability for stone fabricators.</li>
        </ul>

        <h3>3. Heat-Recuperation Kiln Technology: 22% Natural Gas Conservation</h3>
        <p>Ceramic tile manufacturing has historically been an energy-intensive industrial process requiring substantial natural gas consumption to achieve peak firing temperatures of 1,220°C. In alignment with Pixel Ceramic's corporate commitment to ESG (Environmental, Social, and Governance) leadership and industrial decarbonization, the new production line integrates a cutting-edge 240-meter <strong>intelligent heat-recuperation roller kiln</strong>:</p>
        <ol>
            <li><strong>Thermal Cascade Heat Exchangers:</strong> As vitrified slabs exit the peak firing zone (1,220°C) and enter the rapid-cooling chambers, high-efficiency heat exchangers capture the superheated clean air (exceeding 450°C to 650°C) discharged during slab cooling.</li>
            <li><strong>Direct Re-Injection into Spray Dryers:</strong> Rather than venting this valuable thermal energy into the atmosphere, insulated duct networks channel this recovered heat directly into our raw material atomized spray dryers and vertical pre-drying chambers.</li>
            <li><strong>Quantifiable Environmental Impact:</strong> This closed-loop thermal recuperation system reduces natural gas consumption by <strong>22% per square meter of finished slab</strong>, saving over 4,200 metric tonnes of CO₂ emissions annually and significantly lowering the embodied carbon of Pixel Ceramic products specified on LEED- and BREEAM-certified green building projects.</li>
        </ol>

        <div class="modal-callout-info">
            <strong>Green Building Certification:</strong> Pixel Ceramic sintered slabs contribute directly to LEED v4.1 credits in the categories of Materials and Resources (MRc2 - Environmental Product Declarations, MRc3 - Sourcing of Raw Materials) and Indoor Environmental Quality (EQc2 - Low-Emitting Materials with zero VOC emissions).
        </div>

        <h3>4. Industry 4.0 Smart Factory Automation: AGVs, AI Scanners & Robotic Packing</h3>
        <p>The newly commissioned line is designed as an end-to-end Industry 4.0 smart manufacturing ecosystem, eliminating manual human handling of heavy slabs from green pressing through final container loading:</p>
        <ul>
            <li><strong>Laser-Guided AGVs (Automated Guided Vehicles):</strong> Slabs exiting the kilns are automatically loaded onto heavy-duty computerized AGV transporters that navigate along optical floor grids, delivering stillages smoothly to polishing, rectification, and packaging cells without vibration-induced micro-fractures.</li>
            <li><strong>Optical AI Surface Defect Inspection:</strong> Every finished slab passes beneath high-speed line-scan camera arrays equipped with machine learning computer vision. The system inspects the surface at 60 frames per second, instantly identifying and rejecting micro-pinholes, gloss variances, color shade deviations (&Delta;E &gt; 0.3), and edge chips down to 0.05mm tolerances.</li>
            <li><strong>Automated Laser Planarity Verification:</strong> Continuous laser displacement sensors scan the diagonal and perimeter flatness of every slab, ensuring surface warpage remains strictly within &plusmn; 0.1% (surpassing ISO 10545-2 international standards).</li>
            <li><strong>Robotic Vacuum Stacking & Strapping:</strong> Robotic articulated arm palletizers equipped with multi-zone vacuum suction grippers lift and stack slabs into custom-engineered export wooden A-frames and crates, automatically applying protective foam edge corners and high-tensile thermal PET strapping.</li>
        </ul>

        <h3>5. Manufacturing Specifications of the New Line</h3>
        <p>The technical parameters and operational capacities of the newly inaugurated line are summarized below:</p>

        <div class="table-responsive">
            <table class="modal-spec-table">
                <thead>
                    <tr>
                        <th>Technical System</th>
                        <th>Installed Technology & Specification</th>
                        <th>Operational Advantage</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Continuous Compaction Line</strong></td>
                        <td>Continuous Roll Press (16,000 &ndash; 25,000 tonnes equivalent)</td>
                        <td>Uniform density (&gt;2.42 g/cm&sup3;), zero internal stress, flawless fabrication cutting</td>
                    </tr>
                    <tr>
                        <td><strong>Firing Kiln Architecture</strong></td>
                        <td>240-Meter Energy-Recuperating Roller Hearth Kiln</td>
                        <td>Computer-regulated 70-min firing curve at 1,220&deg;C, 22% natural gas savings</td>
                    </tr>
                    <tr>
                        <td><strong>Digital Decoration System</strong></td>
                        <td>12-Color High-Resolution Digital Inkjet with Synchro-Carving</td>
                        <td>400 DPI photographic resolution, synchronous 3D vein etching, reactive sinking glazes</td>
                    </tr>
                    <tr>
                        <td><strong>Dimensional Rectification</strong></td>
                        <td>High-Speed 32-Head Wet Diamond Squaring & Chamfering Line</td>
                        <td>Exact dimensional tolerance (&plusmn;0.5mm), perfect 90&deg; orthogonality for 1.5mm joints</td>
                    </tr>
                    <tr>
                        <td><strong>Annual Production Output</strong></td>
                        <td>1,400,000 m&sup2; (15 million sq. ft.) of Large-Format Slabs</td>
                        <td>Guaranteed rapid container dispatch and large-volume project fulfillment</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>6. Zero Liquid Discharge (ZLD) Water Recycling & Circular Economy</h3>
        <p>Located in the semi-arid region of Saurashtra, Gujarat, responsible water stewardship is central to Pixel Ceramic's industrial operating license. The new manufacturing complex integrates a comprehensive <strong>Zero Liquid Discharge (ZLD) wastewater treatment plant</strong>:</p>
        <p>All industrial water used during wet ball milling, glaze preparation, diamond grinding, edge rectification, and surface polishing is collected via sealed floor channels and routed to lamella clarifier sedimentation tanks. Coagulants and flocculants separate heavy ceramic sediment, while advanced filter presses dehydrate the sludge into solid dry filter cakes. Over <strong>98% of industrial water is clarified and continuously recycled</strong> back into the ball mills and polishing lines.</p>
        <p>Furthermore, the dried ceramic filter cakes—consisting of pure, un-fired porcelain mineral sludge—are pulverized and reintroduced into the raw material body formulation as pre-consumer recycled content, preventing thousands of tonnes of landfill waste and conserving virgin clay deposits.</p>
        `,
        ctaTitle: "Tour Our Advanced Manufacturing Complex",
        ctaDesc: "Schedule an architectural facility inspection or request OEM contract manufacturing specifications."
    },
    "article-8": {
        title: "Why Global Importers & Contractors Source Sintered Surfaces from Morbi",
        category: "Export & Logistics",
        categoryClass: "pill-export",
        date: "June 12, 2026",
        readTime: "12 min read",
        author: "International Trade Desk (Pixel Ceramic Export Directorate)",
        image: "assets/blog/blog-morbi-export.jpg",
        lead: "Accounting for over 85% of India's ceramic output and ranking as the world's second-largest tile manufacturing cluster, Morbi combines European machinery, abundant domestic raw mineral deposits, and scale economies to deliver tier-1 commercial porcelain at a 30% to 45% global cost advantage.",
        content: `
<h3>1. The Rise of Morbi: From Regional Terracotta to the World's Ceramic Capital</h3>
        <p>Over the past three decades, a remarkable industrial transformation has unfolded in Gujarat, India. The city of <strong>Morbi</strong>—nestled in the Saurashtra peninsula—has evolved from a regional center of traditional clay roofing tiles into the <strong>second-largest ceramic manufacturing cluster on Earth</strong>, surpassed in total volume only by Foshan, China. Today, the Morbi industrial belt encompasses over 1,000 state-of-the-art manufacturing facilities stretching along the National Highway corridor, producing over <strong>85% of India's total ceramic tile and porcelain output</strong> and generating billions of dollars in international trade.</p>
        <p>Historically, European tile specifiers, American distributors, and Middle Eastern developers looked exclusively to northern Italy (the Sassuolo / Modena district) or eastern Spain (Castellón) for high-end porcelain and sintered stone. However, shifting global economic realities—including surging European energy tariffs, rising carbon taxes, and labor constraints—have driven international procurement directors to seek reliable, technologically equivalent manufacturing partners. Morbi has emerged as the premier global sourcing destination, exporting premium vitrified surfaces to over <strong>160 countries worldwide</strong>.</p>

        <div class="modal-quote-box">
            "Morbi's competitive dominance is not built on low wages; it is anchored in vertical industrial clustering, world-class Italian machinery, direct natural gas pipelines, and unbeatable scale economies."
        </div>

        <h3>2. Geochemical Raw Material Sovereignty</h3>
        <p>A primary factor underpinning Morbi's cost and quality advantage is India's geological abundance of high-purity ceramic raw materials. While European manufacturers must import millions of tonnes of Ukrainian, Turkish, and Romanian ball clays across long sea lanes, Indian factories enjoy direct, domestic overland access to the world's finest mineral belts:</p>
        <ul>
            <li><strong>Rajasthan White Ball Clays & Kaolin:</strong> Mined in the Bikaner and Barmer basins of Rajasthan (located within 600 km of Morbi), these sedimentary plastic clays possess exceptional purity, low iron oxide (Fe₂O₃ &lt; 0.6%), and high alumina content, yielding green bodies with superior mechanical handling strength and bright white fired coloration.</li>
            <li><strong>High-Potassium & Soda Feldspar:</strong> Quarried extensively in Rajasthan and Gujarat, high-potash feldspar flux ensures complete pyrochemical vitrification at 1,220°C, closing open porosities down to &le; 0.05% without requiring expensive synthetic flux additives.</li>
            <li><strong>High-Silica Quartz & Refined Zirconium:</strong> Abundant local quartz deposits provide structural skeleton hardness, while domestic zircon sand refineries deliver the micronized zirconium silicate opacifiers required for brilliant white porcelain bodies.</li>
        </ul>

        <h3>3. Capital Equipment & European Machinery Parity</h3>
        <p>A lingering misconception among some Western specifiers is that Indian manufacturing relies on dated machinery. In reality, the top tier of Morbi's manufacturers—led by Pixel Ceramic—operates plants that are technologically identical (and often newer) than their counterparts in Bologna or Valencia:</p>
        <ol>
            <li><strong>Italian Continuous Pressing Systems:</strong> Pixel Ceramic utilizes SACMI Continua+ roll-compaction lines and Siti B&T hydraulic presses, ensuring microscopic body density uniformity, low internal stress, and flawless planarity across 1200x2400 mm slabs.</li>
            <li><strong>High-Resolution Digital Inkjet Printers:</strong> Decoration is executed via 12-channel high-definition digital inkjet printers from EFI Cretaprint (Spain) and System Ceramics Creadigit (Italy), operating at 400 DPI with laser-guided drop-on-demand piezo printheads.</li>
            <li><strong>European Glaze & Pigment Chemistry:</strong> All ceramic frits, reactive sinking inks, metallic luster coats, and micronized crystalline compounds are sourced from premier European chemical formulators (including Colorobbia, Esmalglass-Itaca, and Torrecid), ensuring identical aesthetic depth and scratch hardness to Italian luxury lines.</li>
            <li><strong>Automated Italian Kilns:</strong> 240-meter roller hearth kilns from SACMI and Siti B&T feature computerized 100-zone temperature control loops, ensuring batch-to-batch thermal consistency within &plusmn; 2°C.</li>
        </ol>

        <h3>4. Economic Scale Advantage: 30% to 45% Landed Cost Efficiencies</h3>
        <p>How does Pixel Ceramic deliver Italian-equivalent sintered porcelain slabs at a 30% to 45% cost savings for international distributors and commercial developers? The answer lies in the intense concentration of the Morbi cluster:</p>

        <div class="table-responsive">
            <table class="modal-spec-table">
                <thead>
                    <tr>
                        <th>Cost Driver Component</th>
                        <th>European Manufacturer (Italy / Spain)</th>
                        <th>Morbi Manufacturing Cluster (Pixel Ceramic)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Industrial Energy (Gas)</strong></td>
                        <td>Volatile European pipeline gas, high green carbon levies</td>
                        <td>Direct state-regulated piped natural gas (PNG) grid via Gujarat Gas</td>
                    </tr>
                    <tr>
                        <td><strong>Raw Material Logistics</strong></td>
                        <td>Imported sea-freight clays, cross-border shipping tariffs</td>
                        <td>Direct domestic freight from Rajasthan & Gujarat mineral reserves</td>
                    </tr>
                    <tr>
                        <td><strong>Ancillary Supply Chain</strong></td>
                        <td>Dispersed suppliers; high trucking transit times</td>
                        <td>1,000+ localized suppliers for cartons, pallets, and parts within 15 km</td>
                    </tr>
                    <tr>
                        <td><strong>Manufacturing Labor Scale</strong></td>
                        <td>High hourly labor rates, strict weekend shift premiums</td>
                        <td>Skilled technical engineering workforce, continuous 24/7 operations</td>
                    </tr>
                    <tr>
                        <td><strong>Seaport Distance</strong></td>
                        <td>Genoa / Valencia ports (often 100 &ndash; 250 km through tolls)</td>
                        <td>Mundra Deep-Water Port (180 km via direct national expressway)</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>5. Global Quality Certifications & Regulatory Compliance</h3>
        <p>To supply institutional infrastructure, international airport terminals, and commercial towers, manufacturers must hold globally recognized credentials. Pixel Ceramic's products are manufactured under strict ISO 9001:2015 quality management protocols and certified by internationally accredited laboratories:</p>
        <ul>
            <li><strong>ISO 13006 / EN 14411 Group BIa:</strong> Certified compliant for fully vitrified, dry-pressed porcelain stoneware with water absorption &le; 0.05%.</li>
            <li><strong>CE Marking & Declaration of Performance (DoP):</strong> Certified compliant with European Union Construction Products Regulation (CPR 305/2011/EU) for floor and wall applications.</li>
            <li><strong>SASO Quality Mark & SABER Registration:</strong> Pre-registered and compliant with Saudi Arabian Standards Organization regulations for swift customs clearance across GCC nations.</li>
            <li><strong>SIRIM Certified:</strong> Approved for institutional construction and commercial tenders in Malaysia and Southeast Asia.</li>
            <li><strong>ANSI A137.1 / ASTM Testing:</strong> Fully tested under North American standards for breaking strength (ASTM C648), water absorption (ASTM C373), chemical resistance (ASTM C650), and dynamic coefficient of friction (ANSI A326.3 DCOF &ge; 0.42).</li>
        </ul>

        <h3>6. Guide for International Buyers: Vetting Suppliers & Securing Contracts</h3>
        <p>For international tile importers, developers, and commercial contractors sourcing from India for the first time, establishing a robust procurement protocol ensures smooth execution:</p>
        <ol>
            <li><strong>Demand Independent Laboratory Test Reports:</strong> Never rely on promotional brochures. Always demand third-party test certificates from accredited laboratories (such as SGS, Bureau Veritas, or TÜV) verifying water absorption (ISO 10545-3), modulus of rupture (ISO 10545-4), and dimension rectification (ISO 10545-2).</li>
            <li><strong>Mandate Third-Party Container Loading Supervision:</strong> Reputable manufacturers welcome pre-shipment inspections. Specifiers can contract SGS or Intertek to inspect carton integrity, verify pallet strapping, check moisture content of wooden skids, and supervise container stuffing at the factory dock.</li>
            <li><strong>Define Incoterms Clearly (FOB Mundra vs CIF):</strong> For large distributors with existing ocean freight service contracts, buying <strong>FOB Mundra Port</strong> allows maximum control over maritime shipping lines. For contractors seeking hassle-free turnkey delivery, <strong>CIF (Cost, Insurance & Freight)</strong> to destination ports transfers maritime logistics responsibility to the manufacturer's export team.</li>
            <li><strong>Secure Clear Payment Instruments:</strong> International trade with Morbi is typically conducted via <strong>Irrevocable Letters of Credit (LC at sight)</strong> issued by top-tier global banks, or via structured Telegraphic Transfer (TT) deposit schedules (typically 30% advance, 70% against scanned original Bill of Lading).</li>
        </ol>

        <div class="modal-callout-info">
            <strong>Pixel Ceramic B2B Advantage:</strong> Our dedicated in-house international trade bureau provides end-to-end customer support, including customized carton branding (OEM private labeling), barcode generation, CAD layout shop drawings, and dedicated bilingual container tracking.
        </div>
        `,
        ctaTitle: "Inquire for Direct Factory FOB & CIF Rates",
        ctaDesc: "Connect directly with our international trade desk for comprehensive container price schedules across major global seaports."
    },
    "article-9": {
        title: "Subway & Artisanal Wall Tiles: Revitalizing Boutique Retail & Luxury Bathrooms",
        category: "Architecture & Design",
        categoryClass: "pill-arch",
        date: "May 25, 2026",
        readTime: "10 min read",
        author: "Interior Design Advisory (Pixel Ceramic Architectural Studio)",
        image: "assets/blog/blog-artisanal-subway.jpg",
        lead: "In an architectural era dominated by colossal seamless floor slabs, small-format artisanal subway tiles (7.5x30 cm and 10x30 cm) provide tactile intimacy, luminous depth, and handcrafted edge character across commercial boutique bars, restaurant feature walls, and luxury residential en-suites.",
        content: `
<h3>1. The Resurgence of the Micro-Format in Modern Interior Design</h3>
        <p>Over the past decade, interior architecture has championed monumental minimalism: expansive seamless floor slabs, concealed doors, and monolithic stone volumes. While mega-slabs create grand visual continuity on commercial floors, architects quickly discovered that large spaces clad entirely in monolithic planes can feel sterile, intimidating, and devoid of human scale.</p>
        <p>To restore warmth, handcrafted soul, and tactile rhythm, leading international designers have spearheaded a major renaissance in <strong>small-format artisanal subway tiles</strong>. Ranging from slender 7.5x30 cm strips to classic 10x30 cm and 5x20 cm bricks, micro-formats provide a deliberate aesthetic counterbalance to expansive floor slabs. They invite close human interaction, catch ambient lighting with vitreous brilliance, and allow designers to create bespoke geometric focal points across restaurant backbars, hotel reception lobbies, luxury powder rooms, and boutique retail dressing lounges.</p>

        <div class="modal-quote-box">
            "Small tiles celebrate the art of the joint. In an artisanal wall, the grid of grout lines and the undulating surface of each ceramic tile become a rhythmic architectural fabric that enriches the human experience of space."
        </div>

        <h3>2. Glaze Chemistry & Artisanal Finishes: Crackle, Reactive Frits & Hand-Molded Edges</h3>
        <p>The modern artisanal subway tile is far removed from the flat, industrial white ceramic bricks originally specified in the 1904 New York City subway system. Contemporary artisanal collections leverage sophisticated glaze pyrotechnics to achieve rich, liquid-like depth:</p>
        <ul>
            <li><strong>Reactive Crystalline Glazes:</strong> Formulated with raw mineral frits containing zinc oxide and titanium silicates, reactive glazes melt and flow unevenly during firing. As the glaze pools deeper in the center and pools thin along the edges, it produces subtle shade gradations (known as <em>ombré variation</em>) across every single piece.</li>
            <li><strong>Hand-Molded Undulating Reliefs:</strong> Instead of sharp, mechanically pressed industrial edges, Pixel Ceramic's artisanal dies feature organic, undulating contours and soft pillowed surfaces that replicate hand-thrown European terracotta.</li>
            <li><strong>High-Gloss 'Liquid Vitreous' Luster:</strong> A thick, transparent glass glaze overlay yields a mirror-like water reflection (90°+ gloss meter reading) that catches and bounces natural daylight throughout compact bathroom suites.</li>
            <li><strong>Authentic Crackle Finishes:</strong> Formulated with glaze formulas engineered with a controlled thermal expansion mismatch against the ceramic bisque, micro-crazing fissures develop across the glaze during cooling. When highlighted with contrasting stains, these micro-cracks impart an authentic centuries-old heirloom antique patina.</li>
        </ul>

        <h3>3. The 6 Essential Laying Patterns for Contemporary Commercial Walls</h3>
        <p>The aesthetic versatility of artisanal subway tiles lies in their modular flexibility. A single tile format can create six completely distinct architectural moods depending on the installation bond:</p>

        <div class="table-responsive">
            <table class="modal-spec-table">
                <thead>
                    <tr>
                        <th>Laying Pattern Motif</th>
                        <th>Architectural Description</th>
                        <th>Visual / Spatial Impact</th>
                        <th>Best Commercial Application</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Classic Running Bond (50% Stagger)</strong></td>
                        <td>Traditional offset brick-work pattern</td>
                        <td>Timeless, industrial-vintage, comforting structural familiarity</td>
                        <td>Artisan cafe counters, bistro kitchen backsplashes, residential baths</td>
                    </tr>
                    <tr>
                        <td><strong>Vertical Stacked Bond (Grid)</strong></td>
                        <td>Tiles aligned in continuous vertical & horizontal columns</td>
                        <td>Clean, Scandinavian minimalism, draws eye upward to accentuate height</td>
                        <td>Modern hotel bathrooms, spa shower towers, minimalist retail walls</td>
                    </tr>
                    <tr>
                        <td><strong>Horizontal Stacked Bond</strong></td>
                        <td>Tiles stacked directly above one another in horizontal bands</td>
                        <td>Mid-century modern aesthetic, accentuates horizontal room width</td>
                        <td>Long corridor walls, commercial bar front cladding</td>
                    </tr>
                    <tr>
                        <td><strong>90&deg; Traditional Herringbone</strong></td>
                        <td>Tiles set perpendicular in classic V-shaped zig-zag patterns</td>
                        <td>Dynamic, luxurious, adds visual movement and depth</td>
                        <td>Hotel lobby vanity niches, luxury restaurant entrance feature walls</td>
                    </tr>
                    <tr>
                        <td><strong>Vertical Herringbone</strong></td>
                        <td>Herringbone points oriented straight upward toward the ceiling</td>
                        <td>Dramatic vertical energy, contemporary chevron rhythm</td>
                        <td>Powder room accent walls, retail fitting room vestibules</td>
                    </tr>
                    <tr>
                        <td><strong>Double Herringbone / Basketweave</strong></td>
                        <td>Pairs of tiles laid perpendicular in woven geometric blocks</td>
                        <td>Bespoke, textile-inspired complexity, heritage luxury</td>
                        <td>Cocktail lounges, boutique wine tasting cellars, executive suites</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>4. Spatial Manipulation: Optical Illusions with Tile Orientation</h3>
        <p>Artisanal subway tiles are powerful optical tools in the hands of a skilled interior architect. By manipulating tile aspect ratio and laying orientation, spatial deficiencies in challenging rooms can be seamlessly corrected:</p>
        <ol>
            <li><strong>Expanding Narrow Powder Rooms:</strong> Installing 7.5x30 cm tiles in a horizontal running bond along the back wall creates strong horizontal focal lines that visually stretch the space, making cramped en-suites appear significantly wider.</li>
            <li><strong>Elevating Low Ceilings:</strong> In commercial basements or apartments with low 2.4-meter ceiling slabs, orienting subway tiles in a <strong>vertical stacked bond</strong> creates uninterrupted vertical seams that draw the human gaze upward, imparting an optical sensation of lofty height.</li>
            <li><strong>Maximizing Natural Daylight in Windowless Spaces:</strong> In interior guest bathrooms lacking natural windows, specifying high-gloss liquid vitreous glaze in creamy off-white or soft sage bounces ambient sconce lighting across multiple angles, eliminating gloomy shadows.</li>
        </ol>

        <h3>5. Curated Color Palettes for High-End Hospitality</h3>
        <p>Pixel Ceramic's artisanal subway collections move far beyond basic white, offering rich mineral pigments tailored to contemporary hospitality aesthetics:</p>
        <ul>
            <li><strong>Deep Forest Emerald (#1A3A2A):</strong> A rich, dark green glaze that pairs magnificently with brushed brass plumbing fixtures and fluted walnut vanities in cocktail bars and luxury en-suites.</li>
            <li><strong>Aegean Coast Blue (#1E3F5A):</strong> An evocative deep marine hue with reactive glaze pooling that captures Mediterranean coastal warmth in boutique hotel spas.</li>
            <li><strong>Warm Terracotta & Ochre (#A85E44):</strong> Earthy clay mineral tones that create comforting, biophilic artisan warmth in bakery cafes and wellness spas.</li>
            <li><strong>Satin Chalk & Oyster White (#F2EDE4):</strong> A soft, warm off-white glaze with a delicate satin sheen that eliminates harsh hospital-glare reflections while keeping bathrooms clean and luminous.</li>
        </ul>

        <h3>6. The Transformative Power of Grout Strategy</h3>
        <p>In subway tile design, the grout joint represents between <strong>8% to 15% of the total wall surface area</strong>. Consequently, the choice of grout color and joint width fundamentally dictates the final architectural outcome:</p>
        <div class="modal-callout-info">
            <strong>Specifier Design Rule:</strong> Matching grout (tone-on-tone) yields a unified, soft textural plane where individual tiles merge into a subtle background. High-contrast grout (e.g. charcoal grout with white subway tiles) creates a bold, graphic geometric grid that transforms the wall into a dramatic industrial focal statement.
        </div>
        <ul>
            <li><strong>Joint Width Specification:</strong> For artisanal tiles with soft hand-molded edges, specify a <strong>2.0mm to 3.0mm grout joint</strong>. Attempting to set wavy artisanal tiles with ultra-tight 1.0mm joints will cause visual crowding and alignment errors.</li>
            <li><strong>Epoxy vs Cementitious Grout:</strong> In wet shower enclosures, steam rooms, and commercial restaurant backsplashes, always specify <strong>Two-Component Epoxy Grout</strong> (conforming to EN 12004 RG). Unlike standard cement grout, epoxy grout is 100% waterproof, immune to mold and mildew staining, and never requires topical chemical sealing.</li>
            <li><strong>Sealing Crackle Glazes:</strong> If specifying true crackle-glazed tiles, the tiles <em>must be sealed with a penetrating solvent-based sealer prior to grouting</em>. Failure to pre-seal crackle tiles will allow dark grout pigments to seep into the micro-cracks, permanently discoloring the tile edges!</li>
        </ul>
        `,
        ctaTitle: "Explore Our Artisanal Subway Palette",
        ctaDesc: "Order sample swatch boards of our handcrafted liquid-gloss and satin crackle subway collections."
    },
    "article-10": {
        title: "Pixel Ceramic Unveils Sintered Stone Collections at Global Architecture Expos",
        category: "Media & Press",
        categoryClass: "pill-media",
        date: "May 05, 2026",
        readTime: "10 min read",
        author: "Press Relations Directorate (Pixel Ceramic Corporate HQ)",
        image: "assets/blog/blog-expo-exhibition.jpg",
        lead: "Commanding international attention across Coverings (USA), Cersaie (Italy), and Big 5 Global (Dubai), Pixel Ceramic unveiled its groundbreaking 6mm ventilated façade slabs, 4-panel bookmatched marble masterpieces, and 20mm outdoor architectural pavers, securing supply partnerships across 35 countries.",
        content: `
<h3>1. The Global Showcase: Leading the International Architectural Dialogue</h3>
        <p>Over the past twelve months, Pixel Ceramic Pvt. Ltd. has marked an extraordinary presence across the world's most prestigious architectural surface exhibitions—including <strong>Coverings</strong> in the United States, <strong>Cersaie</strong> in Bologna, Italy, <strong>The Big 5 Global</strong> in Dubai, UAE, and <strong>CEVISAMA</strong> in Valencia, Spain. The company's custom-designed pavilion—spanning over 350 square meters of contemporary architectural space—served as a global showcase for Indian ceramic engineering prowess, drawing thousands of international architects, façade consultants, interior designers, and commercial tile importers.</p>
        <p>The exhibitions served as the global launchpad for Pixel Ceramic's 2026-2027 surface collections, showcasing significant technological advancements in <strong>continuous roll compaction, synchronous digital 3D vein carving, ultra-slim 6mm exterior ventilated curtain wall slabs, and circular-economy recycled vitrified matrices</strong>.</p>

        <div class="modal-quote-box">
            "Our exhibition pavilions were designed not merely to display tiles, but to demonstrate complete structural envelope solutions—from monumental 4-panel bookmatched feature walls to certified ventilated curtain wall rainscreens and zero-slip exterior resort decking."
        </div>

        <h3>2. Headline Innovations Unveiled to Global Specifiers</h3>
        <p>Among the hundreds of surface designs exhibited, four distinct technological breakthroughs garnered overwhelming acclaim from international architectural juries and engineering delegates:</p>

        <h4>A. 6mm Ultra-Slim Monumental Sintered Façade Slabs (1200x2400 mm)</h4>
        <p>Engineered specifically for high-rise building envelopes, ventilated rainscreens, and commercial interior paneling, Pixel Ceramic's 6mm slabs weigh only <strong>14.5 kg/m²</strong>—delivering a 75% structural dead-load reduction compared to 20mm dimensional granite. Exhibited with full KEIL concealed undercut anchor systems and tested for high wind-load resistance (up to 3.5 kPa), these slabs generated intense interest from façade engineering firms handling commercial high-rise retrofits across North America and Europe.</p>

        <h4>B. 4-Panel Continuous Bookmatched Statuario & Calacatta Borghini</h4>
        <p>A centerpiece of the exhibition pavilion was a towering 4.8-meter-high by 2.4-meter-wide monumental feature wall demonstrating Pixel Ceramic's continuous <strong>4-Panel Bookmatched Porcelain System (Panels A, B, C, D)</strong>. Leveraging high-resolution digital scanning of rare Italian Carrara quarry blocks, the dramatic gold and anthracite veins flow seamlessly across four continuous mega-slabs in perfect mirror symmetry, creating a focal statement of timeless luxury for hotel atriums and luxury corporate lobbies.</p>

        <h4>C. 20mm Heavy-Duty Outdoor Architectural Pavers (R11 / PTV 45+)</h4>
        <p>Engineered for exterior urban plazas, pool surrounds, and commercial rooftop terraces, Pixel Ceramic unveiled its expanded line of 20mm vitrified pavers in 600x600 mm, 600x1200 mm, and 800x800 mm formats. With a breaking strength exceeding <strong>11,000 Newtons</strong> and a certified wet Pendulum Test Value of <strong>PTV 48</strong>, these pavers support dry-laid installation on adjustable pedestal systems or direct grass/gravel beds without requiring wet mortar screeds.</p>

        <h4>D. The Synchronous 3D Carving Collection</h4>
        <p>Visitors experienced the tactile depth of our Synchro-Carving surfaces, where reactive digital sinking inks depress the glaze along natural marble vein pathways down to 0.2mm tolerances. Paired with warm travertine and almond limestone palettes, this collection was lauded by interior designers as the quintessential sensory material for post-minimalist luxury hospitality design.</p>

        <h3>3. International Distribution Growth: Expanding into 35 New Markets</h3>
        <p>The global trade tour generated unprecedented commercial traction for Pixel Ceramic's export division. During the four international expos, Pixel Ceramic finalized and signed <strong>over 120 new exclusive distribution, OEM private-label, and architectural supply agreements</strong> across 35 countries:</p>

        <div class="table-responsive">
            <table class="modal-spec-table">
                <thead>
                    <tr>
                        <th>Global Region</th>
                        <th>Key Markets Contracted</th>
                        <th>Primary Products in Demand</th>
                        <th>Target Commercial Sector</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>North America</strong></td>
                        <td>United States, Canada, Mexico</td>
                        <td>1200x2400 mm slabs (9mm & 12mm), 20mm outdoor pavers</td>
                        <td>Multi-family residential, retail chains, corporate headquarters</td>
                    </tr>
                    <tr>
                        <td><strong>Western Europe</strong></td>
                        <td>United Kingdom, Germany, France, Netherlands</td>
                        <td>6mm ventilated façade slabs (Class A1), wood-look planks</td>
                        <td>Façade retrofits, green building commercial towers, hotels</td>
                    </tr>
                    <tr>
                        <td><strong>Middle East (GCC)</strong></td>
                        <td>Saudi Arabia, UAE, Qatar, Oman</td>
                        <td>Bookmatched marble slabs, high-gloss PGVT, polished porcelain</td>
                        <td>Mega-hospitality resorts, luxury villas, airport transit terminals</td>
                    </tr>
                    <tr>
                        <td><strong>Asia-Pacific</strong></td>
                        <td>Australia, New Zealand, Singapore, Malaysia</td>
                        <td>Anti-slip R11 porcelain (PTV 36+), artisanal subway tiles</td>
                        <td>Coastal leisure resorts, multi-level residential towers</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>4. ESG & Sustainable Manufacturing Showcase: Leading with 35% Recycled Content</h3>
        <p>A key theme emphasized throughout Pixel Ceramic's international exhibitions was environmental stewardship and industrial circularity. In an era where global developers must satisfy strict sustainability mandates (including LEED v4.1, BREEAM, and WELL building certifications), Pixel Ceramic presented audited third-party environmental metrics:</p>
        <ul>
            <li><strong>35% Pre-Consumer Recycled Content:</strong> Verified by third-party lifecycle assessment agencies, our porcelain bodies incorporate up to 35% recycled ceramic bisque sludge and reclaimed mineral powders, conserving virgin clay resources.</li>
            <li><strong>Zero Liquid Discharge (ZLD):</strong> Our closed-loop water treatment facilities continuously purify and recirculate 98% of industrial wastewater, discharging zero effluent into the local Morbi water table.</li>
            <li><strong>Rooftop Solar Renewable Energy:</strong> Pixel Ceramic's manufacturing plants integrate extensive rooftop photovoltaic solar arrays, supplying over 4.5 megawatts of clean renewable power directly to our automated packaging and AGV transport lines.</li>
        </ul>

        <h3>5. Digital Tools for Specifiers: BIM Libraries, CAD Details & Sample Portals</h3>
        <p>To support global architectural design firms, Pixel Ceramic unveiled its comprehensive suite of digital specification tools at the expos:</p>
        <ol>
            <li><strong>Revit / BIM Content Library:</strong> High-fidelity BIM families available for free download, containing embedded physical properties, thermal conductivity values (k-values), fire ratings, and high-resolution texture maps for seamless integration into Autodesk Revit and ArchiCAD models.</li>
            <li><strong>CAD Façade Detail Packages:</strong> Complete downloadable DWG shop drawings illustrating KEIL undercut anchor details, aluminum subframe profiles, corner miter details, and window jamb interfaces for ventilated rainscreen engineering.</li>
            <li><strong>Global Architectural Sample Courier Portal:</strong> A dedicated online platform enabling architects and designers worldwide to order 10x10 cm sample chips, full-color presentation binders, and customized swatches delivered to their design studios within 48 to 72 hours via express DHL/FedEx air freight.</li>
        </ol>

        <div class="modal-callout-info">
            <strong>Upcoming Exhibitions:</strong> Pixel Ceramic invites international partners to visit our upcoming showcase at <strong>Cersaie 2026 (Bologna, Italy)</strong> in Hall 36, Stand B12, and <strong>The Big 5 Global (Dubai World Trade Centre)</strong> in the International Surface Arena.
        </div>
        `,
        ctaTitle: "Schedule an Architectural Consultation",
        ctaDesc: "Book a virtual or in-person design presentation with our commercial specification team or request our 2026 expo catalog."
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

    function getExploreRangeUrl(sizeId, sizeData, fin) {
        if (sizeId === 'technical') {
            return 'collections.html';
        }

        const finName = (fin.name || '').toLowerCase();
        const finBadge = (fin.finishBadge || '').toLowerCase();
        const finKey = (fin.key || '').toLowerCase();
        const finFolder = (fin.folder || '').toLowerCase();
        const combined = `${finName} ${finBadge} ${finKey} ${finFolder}`;

        let sizeVal = '';
        let catVal = '';
        let lookVal = '';
        let finishVal = '';

        // 1. Resolve Size / Category
        if (sizeId === 'mosaic') {
            catVal = 'mosaic';
            if (combined.includes('matt')) {
                finishVal = 'matt';
            } else {
                finishVal = 'polished';
            }
            return `collections.html?category=${encodeURIComponent(catVal)}&finish=${encodeURIComponent(finishVal)}`;
        } else if (sizeId === '30x30') {
            catVal = 'ceramic-wall';
            sizeVal = '30x30 cm';
            finishVal = 'matt';
            return `collections.html?category=${encodeURIComponent(catVal)}&size=${encodeURIComponent(sizeVal)}&finish=${encodeURIComponent(finishVal)}`;
        } else if (sizeId === '7.5x30') {
            sizeVal = '7.5x30 cm';
        } else if (sizeId === '10x20') {
            sizeVal = '10x20 cm';
        } else if (sizeId === '120x120') {
            sizeVal = '120x120 cm';
        } else if (sizeId === '15x90') {
            sizeVal = '15x90 cm';
            finishVal = 'matt';
            return `collections.html?size=${encodeURIComponent(sizeVal)}&finish=${encodeURIComponent(finishVal)}`;
        } else {
            sizeVal = `${sizeId} cm`;
        }

        // Special handling for 30x60 collections that represent look
        if (sizeId === '30x60') {
            if (combined.includes('mosaic')) {
                return `collections.html?size=${encodeURIComponent(sizeVal)}&look=mosaic`;
            } else if (combined.includes('subway')) {
                return `collections.html?size=${encodeURIComponent(sizeVal)}&look=subway`;
            } else if (combined.includes('traditional') || combined.includes('decor')) {
                return `collections.html?size=${encodeURIComponent(sizeVal)}`;
            }
        }

        // 2. Resolve Finish
        if (combined.includes('carving')) {
            finishVal = 'carving';
        } else if (combined.includes('super highgloss') || combined.includes('super glossy') || combined.includes('high gloss') || combined.includes('lux')) {
            finishVal = 'lux-surface';
        } else if (combined.includes('satin') || combined.includes('baby satin')) {
            finishVal = 'satin';
        } else if (combined.includes('atrovel') || combined.includes('digi matt')) {
            finishVal = 'digi-matt';
        } else if (combined.includes('punch matt') || combined.includes('punch finish')) {
            finishVal = 'punch-matt';
        } else if (combined.includes('rustic') || combined.includes('structure')) {
            finishVal = 'textured';
        } else if (combined.includes('glossy') || combined.includes('polish')) {
            finishVal = 'polished';
        } else if (combined.includes('matt')) {
            finishVal = 'matt';
        }

        // Specific overrides for 60x120 finishes
        if (sizeId === '60x120') {
            if (combined.includes('stark gloss')) finishVal = 'polished';
            else if (combined.includes('stark')) finishVal = 'matt';
            else if (combined.includes('vectro')) finishVal = 'matt';
            else if (combined.includes('zion')) finishVal = 'satin';
        }

        const params = new URLSearchParams();
        if (sizeVal) params.set('size', sizeVal);
        if (catVal) params.set('category', catVal);
        if (lookVal) params.set('look', lookVal);
        if (finishVal) params.set('finish', finishVal);

        return `collections.html?${params.toString()}`;
    }

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
        renderFinishesGrid(sizeId);

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

    function renderFinishesGrid(sizeId) {
        if (!gridContainer || !currentSizeData) return;
        const activeSizeId = sizeId || (currentSizeData ? currentSizeData.sizeId : '');

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
                        <a href="${getExploreRangeUrl(activeSizeId, currentSizeData, fin)}" class="btn btn-outline btn-sm">
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

    // Event delegation fallback to guarantee click always triggers
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.view-range-btn');
        if (btn) {
            e.preventDefault();
            const sizeId = btn.getAttribute('data-size-id');
            if (sizeId) {
                openSizeFinishesModal(sizeId);
            }
        }
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
