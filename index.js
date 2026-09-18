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
    const BASE_PRODUCTS = [
        {
            id: "p-sub-1",
            name: "Emerald Glossy Porcelain Subway",
            category: "porcelain-subway",
            categoryLabel: "Porcelain Subway",
            size: "75x300 mm",
            sizeLabel: "75x300 MM",
            color: "blue-green",
            colorLabel: "Emerald Green",
            finish: "polished",
            finishLabel: "Glossy",
            look: "subway",
            lookLabel: "Subway Look",
            image: "assets/tile-emerald.jpg",
            description: "Elongated premium porcelain subway tile with high-gloss liquid glaze, perfect for modern accent backsplashes."
        },
        {
            id: "p-sub-2",
            name: "Arctic White Matt Porcelain Subway",
            category: "porcelain-subway",
            categoryLabel: "Porcelain Subway",
            size: "75x300 mm",
            sizeLabel: "75x300 MM",
            color: "white",
            colorLabel: "Arctic White",
            finish: "matt",
            finishLabel: "Matt",
            look: "subway",
            lookLabel: "Subway Look",
            image: "assets/tile-marble.jpg",
            description: "Crisp white porcelain subway tile with refined matt finish, offering a clean contemporary look."
        },
        {
            id: "c-sub-1",
            name: "Classic Ocean Blue Ceramic Subway",
            category: "ceramic-subway",
            categoryLabel: "Ceramic Subway",
            size: "75x150 mm",
            sizeLabel: "75x150 MM",
            color: "blue-green",
            colorLabel: "Ocean Teal Blue",
            finish: "polished",
            finishLabel: "Glossy",
            look: "subway",
            lookLabel: "Subway Look",
            image: "assets/tile-emerald.jpg",
            description: "Bevelled glazed ceramic subway tile bringing classic charm and rich depth to kitchen splashbacks."
        },
        {
            id: "c-sub-2",
            name: "Soot Black Matt Ceramic Subway",
            category: "ceramic-subway",
            categoryLabel: "Ceramic Subway",
            size: "75x150 mm",
            sizeLabel: "75x150 MM",
            color: "black",
            colorLabel: "Midnight Soot Black",
            finish: "matt",
            finishLabel: "Matt",
            look: "subway",
            lookLabel: "Subway Look",
            image: "assets/tile-slate.jpg",
            description: "Ultra-matt soot black glazed ceramic tile with rustic bevels for bold industrial aesthetics."
        },
        {
            id: "c-wall-1",
            name: "Royal Calacatta Ceramic Wall",
            category: "ceramic-wall",
            categoryLabel: "Ceramic Wall",
            size: "300x600 mm",
            sizeLabel: "300x600 MM",
            color: "white",
            colorLabel: "Calacatta Gold",
            finish: "polished",
            finishLabel: "Glossy",
            look: "marble",
            lookLabel: "Marble Look",
            image: "assets/tile-marble.jpg",
            description: "Premium ceramic wall tile replicating polished Calacatta gold veins for warm, classical bathrooms."
        },
        {
            id: "c-wall-2",
            name: "Pietra Grey Satin Wall",
            category: "ceramic-wall",
            categoryLabel: "Ceramic Wall",
            size: "300x600 mm",
            sizeLabel: "300x600 MM",
            color: "grey",
            colorLabel: "Pietra Slate Grey",
            finish: "satin",
            finishLabel: "Satin / Slick",
            look: "stone",
            lookLabel: "Stone Look",
            image: "assets/tile-slate.jpg",
            description: "Smooth slate grey ceramic wall tile with high-definition textures, perfect for contemporary walls."
        },
        {
            id: "porc-1",
            name: "Nero Marquina Polished Porcelain",
            category: "porcelain",
            categoryLabel: "Porcelain Tiles",
            size: "600x600 mm",
            sizeLabel: "600x600 MM",
            color: "black",
            colorLabel: "Nero Marquina Black",
            finish: "polished",
            finishLabel: "Glossy",
            look: "marble",
            lookLabel: "Marble Look",
            image: "assets/tile-slate.jpg",
            description: "Mirror-polished vitrified tile with premium white-and-gold veining on deep black backing."
        },
        {
            id: "porc-2",
            name: "Crema Marfil Satin Porcelain",
            category: "porcelain",
            categoryLabel: "Porcelain Tiles",
            size: "800x800 mm",
            sizeLabel: "800x800 MM",
            color: "beige",
            colorLabel: "Crema Marfil Beige",
            finish: "satin",
            finishLabel: "Satin / Slick",
            look: "marble",
            lookLabel: "Marble Look",
            image: "assets/tile-marble.jpg",
            description: "Smooth satin floor tile featuring light cream calcite cloud patterns for subtle, bright spaces."
        },
        {
            id: "wood-antique",
            name: "Antique Wood Brown",
            category: "wooden-planks",
            categoryLabel: "Wooden Planks",
            size: "200x1200 mm",
            sizeLabel: "200x1200 MM",
            color: "brown",
            finish: "textured",
            finishLabel: "Carving / Textured",
            look: "wood",
            lookLabel: "Wood Look",
            image: "assets/wood/antique_wood_brown.jpeg",
            description: "Premium carving texture vitrified porcelain wooden plank in rich antique brown.",
            variants: [
                { color: "brown", label: "Antique Wood Brown", colorCode: "#8B5A2B", image: "assets/wood/antique_wood_brown.jpeg" },
                { color: "gold", label: "Antique Wood Gold", colorCode: "#CD9B1D", image: "assets/wood/antique_wood_gold.jpeg" },
                { color: "olive", label: "Antique Wood Olive", colorCode: "#808000", image: "assets/wood/antique_wood_olive.jpeg" },
                { color: "pimlico", label: "Antique Wood Pimlico", colorCode: "#4E3629", image: "assets/wood/antique_wood_pimlico.jpeg" }
            ]
        },
        {
            id: "wood-oak",
            name: "Oak Wood Natural",
            category: "wooden-planks",
            categoryLabel: "Wooden Planks",
            size: "200x1200 mm",
            sizeLabel: "200x1200 MM",
            color: "beige",
            finish: "satin",
            finishLabel: "DG Surface / Satin",
            look: "wood",
            lookLabel: "Wood Look",
            image: "assets/wood/oak_wood_natural.jpeg",
            description: "Sleek satin surface oak pattern wooden plank tile with natural sand grains.",
            variants: [
                { color: "beige", label: "Oak Wood Natural", colorCode: "#D2B48C", image: "assets/wood/oak_wood_natural.jpeg" },
                { color: "brown", label: "Oak Wood Honey", colorCode: "#C59A6F", image: "assets/wood/oak_wood_honey.jpeg" },
                { color: "brown", label: "Oak Wood Smoked", colorCode: "#70543E", image: "assets/wood/oak_wood_smoked.jpeg" },
                { color: "grey", label: "Oak Wood Grey", colorCode: "#A9A9A9", image: "assets/wood/oak_wood_grey.jpeg" }
            ]
        },
        {
            id: "wood-teak",
            name: "Teak Wood Classic",
            category: "wooden-planks",
            categoryLabel: "Wooden Planks",
            size: "200x1000 mm",
            sizeLabel: "200x1000 MM",
            color: "brown",
            finish: "matt",
            finishLabel: "Matt / Natural",
            look: "wood",
            lookLabel: "Wood Look",
            image: "assets/wood/teak_wood_classic.jpeg",
            description: "Classic matt finish teakwood plank tile, providing traditional warm grain tones.",
            variants: [
                { color: "brown", label: "Teak Wood Classic", colorCode: "#B25900", image: "assets/wood/teak_wood_classic.jpeg" },
                { color: "gold", label: "Teak Wood Amber", colorCode: "#CD853F", image: "assets/wood/teak_wood_amber.jpeg" },
                { color: "brown", label: "Teak Wood Wenge", colorCode: "#3E2723", image: "assets/wood/teak_wood_wenge.jpeg" }
            ]
        },
        {
            id: "wood-pine",
            name: "Pine Wood Ecrù",
            category: "wooden-planks",
            categoryLabel: "Wooden Planks",
            size: "200x1200 mm",
            sizeLabel: "200x1200 MM",
            color: "beige",
            finish: "matt",
            finishLabel: "Matt",
            look: "wood",
            lookLabel: "Wood Look",
            image: "assets/wood/pine_wood_ecru.jpeg",
            description: "Nordic pine wood pattern plank tile with neutral soft ash textures.",
            variants: [
                { color: "beige", label: "Pine Wood Ecrù", colorCode: "#E1C699", image: "assets/wood/pine_wood_ecru.jpeg" },
                { color: "brown", label: "Pine Wood Nut", colorCode: "#8A5A36", image: "assets/wood/pine_wood_nut.jpeg" },
                { color: "grey", label: "Pine Wood Ash", colorCode: "#B0C4DE", image: "assets/wood/pine_wood_ash.jpeg" }
            ]
        },
        {
            id: "slab-1",
            name: "Carrara Gold Monumental Slab",
            category: "porcelain-slab",
            categoryLabel: "Porcelain Slabs",
            size: "800x1600 mm",
            sizeLabel: "800x1600 MM",
            color: "white",
            colorLabel: "Carrara Gold White",
            finish: "polished",
            finishLabel: "Glossy",
            look: "marble",
            lookLabel: "Marble Look",
            image: "assets/tile-marble.jpg",
            description: "Grand format monumental slab for countertops and lobbies, offering seamless continuous stone veining."
        },
        {
            id: "slab-2",
            name: "Concrete Grigio Matt Slab",
            category: "porcelain-slab",
            categoryLabel: "Porcelain Slabs",
            size: "1200x2400 mm",
            sizeLabel: "1200x2400 MM",
            color: "grey",
            colorLabel: "Concrete Grigio",
            finish: "matt",
            finishLabel: "Matt",
            look: "cement",
            lookLabel: "Cement Look",
            image: "assets/tile-slate.jpg",
            description: "High-strength large-format concrete style slab tile for sleek minimalist facades and lobbies."
        }
    ];

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
            category: 'porcelain',
            categoryLabel: 'Porcelain Tiles',
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
    const rawProducts = baseFiltered.concat(woodItems).concat(mosaicItems).concat(plank30x90Items).concat(plank20x20Items).concat(plank15x90Items).concat(plankSlabsItems).concat(plank25x50Items).concat(plank20x60Items).concat(plank60x120Items);

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

    const PRODUCTS = rawProducts.map(p => {
        const normalizedSize = convertSizeToCm(p.size);
        return {
            ...p,
            size: normalizedSize.toLowerCase(),
            sizeLabel: normalizedSize
        };
    });

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

            // Update result counter
            const totalItems = filteredProducts.length;
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
            const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

                let detailsHtml = '';
                if (product.category === 'mosaic') {
                    const activeVariant = (product.variants && product.variants.length > 0) ? product.variants[activeVarIdx] : null;
                    const activeChipSize = activeVariant ? activeVariant.chipSizeLabel : product.chipSizeLabel;
                    const activeSheetSize = activeVariant ? activeVariant.sheetSizeLabel : product.sheetSizeLabel;
                    const activeThickness = activeVariant ? activeVariant.thicknessLabel : product.thicknessLabel;
                    const activeFinish = activeVariant ? activeVariant.finishLabel : product.finishLabel;

                    detailsHtml = `
                        <div class="tile-details mt-10">
                            <span><strong>Chip Size:</strong> <span class="tile-chip-size">${activeChipSize}</span></span>
                            <span><strong>Sheet Size:</strong> <span class="tile-sheet-size">${activeSheetSize}</span></span>
                            <span><strong>Thickness:</strong> <span class="tile-thickness">${activeThickness}</span></span>
                            <span><strong>${product.pattern ? 'Pattern' : 'Look'}:</strong> ${product.pattern ? product.pattern : product.lookLabel}</span>
                            <span><strong>Finish:</strong> <span class="tile-finish">${activeFinish}</span></span>
                        </div>
                    `;
                } else {
                    detailsHtml = `
                        <div class="tile-details mt-10">
                            <span><strong>Size:</strong> ${product.sizeLabel}</span>
                            <span><strong>${product.pattern ? 'Pattern' : 'Look'}:</strong> ${product.pattern ? product.pattern : product.lookLabel}</span>
                            <span><strong>Finish:</strong> ${product.finishLabel}</span>
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
                                const chipEl = card.querySelector('.tile-chip-size');
                                if (chipEl) chipEl.textContent = newChipSize;
                            }
                            if (newSheetSize) {
                                const sheetEl = card.querySelector('.tile-sheet-size');
                                if (sheetEl) sheetEl.textContent = newSheetSize;
                            }
                            if (newThickness) {
                                const thickEl = card.querySelector('.tile-thickness');
                                if (thickEl) thickEl.textContent = newThickness;
                            }
                            if (newFinish) {
                                const finishEl = card.querySelector('.tile-finish');
                                if (finishEl) finishEl.textContent = newFinish;
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

        // URL parameter pre-selector (e.g. ?category=porcelain-slab)
        const urlParams = new URLSearchParams(window.location.search);
        let hasUrlFilters = false;

        ['category', 'size', 'look', 'color', 'finish'].forEach(group => {
            const paramValue = urlParams.get(group);
            if (paramValue) {
                const checkbox = document.querySelector(`.catalog-sidebar input[name="${group}"][value="${paramValue}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                    activeFilters[group].push(paramValue.toLowerCase());
                    hasUrlFilters = true;

                    // Expand parent filter group accordion
                    const optionsContainer = checkbox.closest('.filter-options');
                    const titleHeader = optionsContainer ? optionsContainer.previousElementSibling : null;
                    if (optionsContainer && titleHeader) {
                        optionsContainer.classList.add('active');
                        titleHeader.classList.add('active');
                    }
                }
            }
        });

        // Run initial catalog render
        renderCatalog();
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
            const phone = document.getElementById('contactPhone').value;
            const country = document.getElementById('contactCountry').value;
            const volume = document.getElementById('contactVolume').value;
            const message = document.getElementById('contactMessage').value;
            const interests = selectedInterestsInput ? selectedInterestsInput.value : '';

            // Form validation
            if (!name || !email || !phone || !country || !volume || !message) {
                formFeedback.style.display = 'block';
                formFeedback.className = 'form-feedback error';
                formFeedback.textContent = 'Please fill out all required fields (including Destination Country and expected cargo volume).';
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
});

