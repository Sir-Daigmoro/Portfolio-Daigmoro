'use strict';

const toggleActive = (element, force) => {
    if (!element) {
        return;
    }

    if (typeof force === 'boolean') {
        element.classList.toggle('active', force);
        return;
    }

    element.classList.toggle('active');
};

const sidebar = document.querySelector('[data-sidebar]');
const sidebarBtn = document.querySelector('[data-sidebar-btn]');
const navigationLinks = document.querySelectorAll('[data-nav-link]');
const viewContainer = document.querySelector('#view-container');

const viewMap = {
    about: 'views/sobre-mi.html',
    resume: 'views/trayectoria.html',
    portfolio: 'views/proyectos.html',
    blog: 'views/publicaciones.html',
    contact: 'views/contacto.html'
};

// Bump this value when modular views or project content files change.
const APP_ASSET_VERSION = '20260615-1';

const EMAILJS_CONFIG = {
    publicKey: '3qa5UytXx0PVYVQ2E',
    serviceId: 'service_lwd21lg',
    templateId: 'template_3dc1f3v'
};

const withAssetVersion = (path) => {
    const separator = path.includes('?') ? '&' : '?';
    return `${path}${separator}v=${APP_ASSET_VERSION}`;
};

const projectContentCache = new Map();
const projectDetailFallback = 'Contenido técnico detallado en preparación.';

const projectCatalog = {
    'ocr-cloud': {
        title: 'Plataforma Browne Data Extractor',
        kicker: 'Profesionales · Cloud / Backend',
        summary: 'Plataforma orientada a automatizacion documental mediante Google Cloud Platform, Document AI y servicios backend.',
        description: 'Plataforma orientada a automatizacion documental mediante Google Cloud Platform, Document AI y servicios backend.',
        role: 'Espacio reservado para definir responsabilidades, alcance y contribución principal.',
        technologies: [],
        challenges: [],
        detailText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam.',
        githubUrl: '',
        canvaUrl: 'https://canva.link/hu3yolifqdj15b5',
        demoUrl: '',
        videoUrl: '',
        docsUrl: '',
        contentPath: 'assets/content/projects/ocr-cloud',
        image: 'assets/images/Plataforma Browne Data Extractor Google Cloud Platform y Document AI.png',
        imageAlt: 'Vista previa del proyecto Plataforma Browne Data Extractor',
        placeholderClass: 'project-placeholder--cloud',
        placeholderIcon: 'cloud-outline',
        placeholderLabel: 'Browne Extractor'
    },
    'erp-cloud': {
        title: 'Integración sistema ERP + Servicios GCP',
        kicker: 'Profesionales · Cloud / Backend',
        summary: 'Contenido técnico en preparación.',
        description: 'Contenido técnico en preparación.',
        role: 'Espacio reservado para definir responsabilidades, alcance y contribución principal.',
        technologies: [],
        challenges: [],
        detailText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam.',
        githubUrl: '',
        canvaUrl: '',
        demoUrl: '',
        videoUrl: '',
        docsUrl: '',
        contentPath: 'assets/content/projects/erp-cloud-integration',
        placeholderClass: 'project-placeholder--integration',
        placeholderIcon: 'git-network-outline',
        placeholderLabel: 'ERP + Cloud'
    },
    'bot-gemini-teams': {
        title: 'Bot Corporativo con Gemini y Teams',
        kicker: 'Profesionales · Cloud / Backend',
        summary: 'Backend conversacional desarrollado para integrarse con Microsoft Teams, Gemini AI y APIs empresariales. El objetivo del proyecto fue permitir consultas naturales sobre información corporativa, conectando una interfaz conversacional con servicios internos mediante lógica backend, autenticación y consumo de endpoints protegidos.',
        description: 'Backend conversacional desarrollado para integrarse con Microsoft Teams, Gemini AI y APIs empresariales. El objetivo del proyecto fue permitir consultas naturales sobre información corporativa, conectando una interfaz conversacional con servicios internos mediante lógica backend, autenticación y consumo de endpoints protegidos.',
        role: 'Diseño e implementación backend, integración con servicios externos, pruebas de consumo API, estructuración de respuestas y apoyo en arquitectura de integración.',
        technologies: [
            'Node.js',
            'Express',
            'Microsoft Bot Framework',
            'Microsoft Teams',
            'Gemini AI',
            'APIs REST',
            'OAuth2 Client Credentials',
            'Google Cloud Run'
        ],
        challenges: [
            'Integrar un bot conversacional con servicios empresariales existentes.',
            'Consumir APIs protegidas mediante OAuth2.',
            'Estructurar respuestas comprensibles para usuarios no técnicos.',
            'Manejar errores de autenticación, conectividad y permisos.',
            'Desplegar el backend en un entorno cloud.'
        ],
        detailText: 'El proyecto se estructuró como un backend Node.js desplegado en Cloud Run, encargado de recibir mensajes desde Microsoft Teams mediante Bot Framework, interpretar la intención del usuario y consultar APIs empresariales protegidas. Para la integración con servicios internos se utilizó autenticación OAuth2 mediante Client Credentials, permitiendo obtener tokens de acceso y consumir endpoints corporativos de forma controlada.\n\nLa solución incorporó una capa de procesamiento conversacional apoyada por Gemini AI, orientada a transformar información técnica o estructurada en respuestas más naturales y comprensibles para el usuario final. El backend centralizó la lógica de integración, evitando exponer directamente los servicios internos hacia la interfaz conversacional.',
        githubUrl: 'https://github.com/Sir-Daigmoro/teams-certificates-bot-gemini',
        canvaUrl: 'https://canva.link/3zq94javov1u0mg',
        demoUrl: '',
        videoUrl: '',
        docsUrl: '',
        contentPath: 'assets/content/projects/bot-teams-gemini',
        image: 'assets/images/Chat bot Empresarial con IA Generativa.png',
        imageAlt: 'Vista previa del proyecto Bot Corporativo con Gemini y Teams',
        placeholderClass: 'project-placeholder--bot',
        placeholderIcon: 'chatbubbles-outline',
        placeholderLabel: 'Gemini + Teams'
    },
    battlev2: {
        title: 'Sistema de Combate para videojuegos RPG - Tactical Systems',
        kicker: 'Unity',
        summary: 'Contenido técnico en preparación.',
        description: 'Contenido técnico en preparación.',
        role: 'Espacio reservado para definir responsabilidades, alcance y contribución principal.',
        technologies: [],
        challenges: [],
        detailText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam.',
        githubUrl: '',
        canvaUrl: 'https://canva.link/nwgbaz68gob9jwt',
        demoUrl: '',
        videoUrl: '',
        docsUrl: '',
        contentPath: 'assets/content/projects/battlev2',
        image: 'assets/images/Sistema de combate ATB por turnos - movimiento táctico.jpg',
        imageAlt: 'Vista previa del proyecto Sistema de Combate ATB para videojuegos RPG - Sistema de Movimiento Tactico',
        placeholderClass: 'project-placeholder--combat',
        placeholderIcon: 'shield-half-outline',
        placeholderLabel: 'Tactical Systems'
    },
    'exploration-mode': {
        title: 'Sistema de movimiento por tiles hexagonales - Hex Grid Systems',
        kicker: 'Unity',
        summary: 'Contenido técnico en preparación.',
        description: 'Contenido técnico en preparación.',
        role: 'Espacio reservado para definir responsabilidades, alcance y contribución principal.',
        technologies: [],
        challenges: [],
        detailText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam.',
        githubUrl: '',
        canvaUrl: '',
        demoUrl: '',
        videoUrl: '',
        docsUrl: '',
        contentPath: 'assets/content/projects/exploration-mode',
        placeholderClass: 'project-placeholder--exploration',
        placeholderIcon: 'map-outline',
        placeholderLabel: 'Hex Grid Systems'
    },
    'chemlab-ar': {
        title: 'ChemLab AR',
        kicker: 'Académicos · Unity',
        summary: 'Contenido técnico en preparación.',
        description: 'Contenido técnico en preparación.',
        role: 'Espacio reservado para definir responsabilidades, alcance y contribución principal.',
        technologies: [],
        challenges: [],
        detailText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam.',
        githubUrl: '',
        canvaUrl: 'https://www.canva.com/design/DAGW-WfXk84/lKibFC1BWFZ9nVYk5CmAIQ/view?utm_content=DAGW-WfXk84&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h6ae1dc27f2',
        demoUrl: '',
        videoUrl: '',
        docsUrl: '',
        image: 'assets/images/ChemLab-AR.jpeg',
        imageAlt: 'Vista previa del proyecto ChemLab AR'
    }
};

let currentView = '';
let currentViewCleanup = () => {};
const viewCache = new Map();

if (sidebar && sidebarBtn) {
    sidebarBtn.addEventListener('click', () => {
        toggleActive(sidebar);
    });
}

const setActiveNavigation = (target) => {
    navigationLinks.forEach((link) => {
        link.classList.toggle('active', link.dataset.pageTarget === target);
    });
};

const createViewErrorMarkup = () => {
    const localHint = window.location.protocol === 'file:'
        ? '<p>La carga modular con <code>fetch()</code> requiere servir el proyecto por HTTP. En GitHub Pages funcionará correctamente; para pruebas locales usa un servidor estático.</p>'
        : '<p>Intenta recargar la página en unos segundos.</p>';

    return `
        <article class="active">
            <header>
                <h2 class="h2 article-title">Vista no disponible</h2>
                <p class="section-lead">No fue posible cargar esta sección del portfolio.</p>
            </header>
            <section class="about-text">
                ${localHint}
            </section>
        </article>
    `;
};

const escapeHtml = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const sanitizeUrl = (value) => {
    const url = String(value || '').trim();

    if (!url) {
        return '';
    }

    if (/^(https?:|mailto:|tel:)/i.test(url) || /^(?:\.{0,2}\/|#|assets\/)/.test(url)) {
        return url;
    }

    return '';
};

const renderInlineFormatting = (text) => {
    let output = escapeHtml(text);

    output = output.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, rawUrl) => {
        const safeUrl = sanitizeUrl(rawUrl);

        if (!safeUrl) {
            return label;
        }

        const external = /^(https?:)?\/\//i.test(safeUrl);
        return `<a href="${escapeHtml(safeUrl)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${label}</a>`;
    });

    output = output.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    output = output.replace(/`([^`]+)`/g, '<code>$1</code>');

    return output;
};

const renderCodeBlock = (lines, language = '') => {
    const code = lines.join('\n').replace(/^\n/, '').replace(/\n$/, '');
    const languageClass = language ? ` class="language-${escapeHtml(language)}"` : '';
    return `<pre><code${languageClass}>${escapeHtml(code)}</code></pre>`;
};

const isConceptDiagramLine = (line) => {
    const value = String(line || '');
    const trimmed = value.trim();

    if (!trimmed) {
        return false;
    }

    if (/[\u2500-\u257F\u2190-\u21FF\u25BC\u25B2\u25C0\u25B6]/.test(value)) {
        return true;
    }

    if (/^(?:\s{8,}|\t+).*(?:\||->|<-|=>|<=|::)/.test(value)) {
        return true;
    }

    if (/^(?:\s{8,}|\t+).*(?:[+][-=]+[+]|[|].*[|])/.test(value)) {
        return true;
    }

    return false;
};

const parseMarkdownTableRow = (line) => {
    const trimmed = String(line || '').trim().replace(/^\|/, '').replace(/\|$/, '');
    return trimmed.split('|').map((cell) => cell.trim());
};

const isMarkdownTableSeparator = (line) => {
    const cells = parseMarkdownTableRow(line);

    return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
};

const renderMarkdownTable = (headers, rows) => {
    const headMarkup = headers
        .map((cell) => `<th>${renderInlineFormatting(cell)}</th>`)
        .join('');

    const bodyMarkup = rows
        .map((row) => {
            const cells = row.map((cell) => `<td>${renderInlineFormatting(cell)}</td>`).join('');
            return `<tr>${cells}</tr>`;
        })
        .join('');

    return `
        <div class="project-document-table-wrap">
            <table class="project-document-table">
                <thead><tr>${headMarkup}</tr></thead>
                <tbody>${bodyMarkup}</tbody>
            </table>
        </div>
    `;
};

const renderStructuredText = (text) => {
    const normalized = String(text || '').replace(/\r\n/g, '\n');
    const lines = normalized.split('\n');
    const parts = [];
    let paragraph = [];
    let listItems = [];
    let listType = '';
    let codeLines = [];
    let codeLanguage = '';
    let isCodeBlock = false;

    const flushParagraph = () => {
        if (!paragraph.length) {
            return;
        }

        parts.push(`<p>${paragraph.map((line) => renderInlineFormatting(line)).join('<br>')}</p>`);
        paragraph = [];
    };

    const flushList = () => {
        if (!listItems.length) {
            return;
        }

        const tag = listType === 'ordered' ? 'ol' : 'ul';
        parts.push(`<${tag}>${listItems.map((item) => `<li>${renderInlineFormatting(item)}</li>`).join('')}</${tag}>`);
        listItems = [];
        listType = '';
    };

    const flushCodeBlock = () => {
        if (!isCodeBlock) {
            return;
        }

        parts.push(renderCodeBlock(codeLines, codeLanguage));
        codeLines = [];
        codeLanguage = '';
        isCodeBlock = false;
    };

    for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index];
        const trimmed = line.trim();
        const codeFenceMatch = line.match(/^\s*```([\w-]+)?\s*$/);

        if (codeFenceMatch) {
            if (isCodeBlock) {
                flushCodeBlock();
            } else {
                flushParagraph();
                flushList();
                isCodeBlock = true;
                codeLanguage = (codeFenceMatch[1] || '').trim();
            }

            continue;
        }

        if (isCodeBlock) {
            codeLines.push(line);
            continue;
        }

        if (!trimmed) {
            flushParagraph();
            flushList();
            continue;
        }

        const headingMatch = trimmed.match(/^(#{1,3})\s+(.*)$/);

        if (headingMatch) {
            flushParagraph();
            flushList();
            const level = headingMatch[1].length;
            parts.push(`<h${level}>${renderInlineFormatting(headingMatch[2])}</h${level}>`);
            continue;
        }

        if (isConceptDiagramLine(line)) {
            flushParagraph();
            flushList();

            const diagramLines = [line];
            index += 1;

            while (index < lines.length) {
                const nextLine = lines[index];

                if (!nextLine.trim()) {
                    diagramLines.push(nextLine);
                    index += 1;
                    continue;
                }

                if (!isConceptDiagramLine(nextLine)) {
                    index -= 1;
                    break;
                }

                diagramLines.push(nextLine);
                index += 1;
            }

            if (index >= lines.length) {
                index -= 1;
            }

            parts.push(renderCodeBlock(diagramLines, 'text'));
            continue;
        }

        if (/^---+$/.test(trimmed)) {
            flushParagraph();
            flushList();
            parts.push('<hr>');
            continue;
        }

        if (trimmed.includes('|') && index + 1 < lines.length && isMarkdownTableSeparator(lines[index + 1])) {
            flushParagraph();
            flushList();

            const headers = parseMarkdownTableRow(line);
            const rows = [];
            index += 2;

            while (index < lines.length) {
                const rowLine = lines[index];
                const rowTrimmed = rowLine.trim();

                if (!rowTrimmed || !rowTrimmed.includes('|')) {
                    index -= 1;
                    break;
                }

                rows.push(parseMarkdownTableRow(rowLine));
                index += 1;
            }

            if (index >= lines.length) {
                index -= 1;
            }

            parts.push(renderMarkdownTable(headers, rows));
            continue;
        }

        const unorderedListMatch = trimmed.match(/^[-*+]\s+(.*)$/);

        if (unorderedListMatch) {
            flushParagraph();
            if (listType && listType !== 'unordered') {
                flushList();
            }

            listType = 'unordered';
            listItems.push(unorderedListMatch[1]);
            continue;
        }

        const orderedListMatch = trimmed.match(/^\d+\.\s+(.*)$/);

        if (orderedListMatch) {
            flushParagraph();
            if (listType && listType !== 'ordered') {
                flushList();
            }

            listType = 'ordered';
            listItems.push(orderedListMatch[1]);
            continue;
        }

        flushList();
        paragraph.push(trimmed);
    }

    flushParagraph();
    flushList();
    flushCodeBlock();

    return parts.join('').trim();
};

const renderMarkdownBlocks = (text) => {
    const rendered = renderStructuredText(text);
    return rendered || `<p>${escapeHtml(projectDetailFallback)}</p>`;
};

const renderTextBlocks = (text) => {
    const rendered = renderStructuredText(text);
    return rendered || `<p>${escapeHtml(projectDetailFallback)}</p>`;
};

const loadProjectDetailContent = async (project) => {
    const cacheKey = project?.contentPath || project?.title || '';

    if (cacheKey && projectContentCache.has(cacheKey)) {
        return projectContentCache.get(cacheKey);
    }

    if (!project?.contentPath) {
        return {
            html: renderTextBlocks(projectDetailFallback),
            source: 'fallback'
        };
    }

    const candidates = [
        { path: `${project.contentPath}.md`, type: 'md' },
        { path: `${project.contentPath}.txt`, type: 'txt' }
    ];

    for (const candidate of candidates) {
        try {
            const response = await fetch(withAssetVersion(candidate.path), { cache: 'no-cache' });

            if (!response.ok) {
                continue;
            }

            const rawContent = await response.text();
            const html = candidate.type === 'md'
                ? renderMarkdownBlocks(rawContent)
                : renderTextBlocks(rawContent);
            const result = {
                html: html || renderTextBlocks(projectDetailFallback),
                source: candidate.type
            };

            projectContentCache.set(cacheKey, result);
            return result;
        } catch (error) {
            console.warn(`No fue posible cargar ${candidate.path}`, error);
        }
    }

    const fallbackResult = {
        html: renderTextBlocks(projectDetailFallback),
        source: 'fallback'
    };

    if (cacheKey) {
        projectContentCache.set(cacheKey, fallbackResult);
    }

    return fallbackResult;
};

const fetchViewMarkup = async (target) => {
    if (viewCache.has(target)) {
        return viewCache.get(target);
    }

    const viewPath = viewMap[target];

    if (!viewPath) {
        throw new Error(`No view mapped for "${target}"`);
    }

    const response = await fetch(withAssetVersion(viewPath), { cache: 'no-cache' });

    if (!response.ok) {
        throw new Error(`Failed to load ${viewPath}`);
    }

    const markup = await response.text();
    viewCache.set(target, markup);
    return markup;
};

const initServiceCarousel = () => {
    const cardCarousel = viewContainer.querySelector('[data-card-carousel]');
    const carouselPrevBtn = viewContainer.querySelector('[data-carousel-prev]');
    const carouselNextBtn = viewContainer.querySelector('[data-carousel-next]');

    if (!cardCarousel || !carouselPrevBtn || !carouselNextBtn) {
        return () => {};
    }

    const scrollCarousel = (direction) => {
        const scrollAmount = cardCarousel.clientWidth;
        cardCarousel.scrollBy({
            left: direction * scrollAmount,
            behavior: 'smooth'
        });
    };

    const handlePrev = () => scrollCarousel(-1);
    const handleNext = () => scrollCarousel(1);

    carouselPrevBtn.addEventListener('click', handlePrev);
    carouselNextBtn.addEventListener('click', handleNext);

    return () => {
        carouselPrevBtn.removeEventListener('click', handlePrev);
        carouselNextBtn.removeEventListener('click', handleNext);
    };
};

const initTestimonialsCarousel = () => {
    const testimonialsTrack = viewContainer.querySelector('.testimonials-list');
    const testimonialSlides = testimonialsTrack
        ? Array.from(testimonialsTrack.querySelectorAll('.testimonials-item'))
        : [];

    if (!testimonialsTrack || testimonialSlides.length === 0) {
        return () => {};
    }

    let testimonialIndex = 0;
    let autoplayId = null;
    let autoplayResumeId = null;
    let scrollTimer = null;
    let isPointerDown = false;
    let dragStartX = 0;
    let dragStartScrollLeft = 0;
    let dragDeltaX = 0;

    const getSlideWidth = () => testimonialsTrack.clientWidth;

    const goToTestimonial = (index, behavior = 'smooth') => {
        const lastIndex = testimonialSlides.length - 1;
        testimonialIndex = Math.max(0, Math.min(index, lastIndex));
        testimonialsTrack.scrollTo({
            left: getSlideWidth() * testimonialIndex,
            behavior
        });
    };

    const syncTestimonialIndex = () => {
        const slideWidth = getSlideWidth();

        if (!slideWidth) {
            return;
        }

        testimonialIndex = Math.round(testimonialsTrack.scrollLeft / slideWidth);
    };

    const clearAutoplay = () => {
        if (autoplayId) {
            window.clearInterval(autoplayId);
            autoplayId = null;
        }

        if (autoplayResumeId) {
            window.clearTimeout(autoplayResumeId);
            autoplayResumeId = null;
        }
    };

    const startAutoplay = () => {
        clearAutoplay();
        autoplayId = window.setInterval(() => {
            const nextIndex = (testimonialIndex + 1) % testimonialSlides.length;
            goToTestimonial(nextIndex);
        }, 3000);
    };

    const restartAutoplay = (delay = 3400) => {
        clearAutoplay();
        autoplayResumeId = window.setTimeout(() => {
            startAutoplay();
        }, delay);
    };

    const handlePointerMove = (event) => {
        if (!isPointerDown) {
            return;
        }

        event.preventDefault();
        dragDeltaX = event.clientX - dragStartX;
        testimonialsTrack.scrollLeft = dragStartScrollLeft - dragDeltaX;
    };

    const handlePointerUp = () => {
        if (!isPointerDown) {
            return;
        }

        isPointerDown = false;
        testimonialsTrack.classList.remove('is-dragging');

        const slideWidth = getSlideWidth();
        const threshold = Math.max(slideWidth * 0.12, 48);

        if (Math.abs(dragDeltaX) > threshold) {
            if (dragDeltaX > 0) {
                goToTestimonial(testimonialIndex - 1);
            } else {
                goToTestimonial(testimonialIndex + 1);
            }
        } else {
            goToTestimonial(testimonialIndex);
        }

        restartAutoplay();
    };

    const handlePointerDown = (event) => {
        if (event.button !== 0) {
            return;
        }

        isPointerDown = true;
        dragStartX = event.clientX;
        dragStartScrollLeft = testimonialsTrack.scrollLeft;
        dragDeltaX = 0;

        syncTestimonialIndex();
        clearAutoplay();
        testimonialsTrack.classList.add('is-dragging');
        testimonialsTrack.setPointerCapture(event.pointerId);
    };

    const handleScroll = () => {
        if (isPointerDown) {
            return;
        }

        window.clearTimeout(scrollTimer);
        scrollTimer = window.setTimeout(() => {
            syncTestimonialIndex();
        }, 120);
    };

    const handleResize = () => {
        goToTestimonial(testimonialIndex, 'auto');
    };

    testimonialsTrack.addEventListener('pointerdown', handlePointerDown);
    testimonialsTrack.addEventListener('pointermove', handlePointerMove);
    testimonialsTrack.addEventListener('pointerup', handlePointerUp);
    testimonialsTrack.addEventListener('pointercancel', handlePointerUp);
    testimonialsTrack.addEventListener('pointerleave', () => {
        if (isPointerDown) {
            handlePointerUp();
        }
    });
    testimonialsTrack.addEventListener('scroll', handleScroll);
    testimonialsTrack.addEventListener('mouseenter', clearAutoplay);
    testimonialsTrack.addEventListener('mouseleave', () => restartAutoplay(1400));
    testimonialsTrack.addEventListener('focusin', clearAutoplay);
    testimonialsTrack.addEventListener('focusout', () => restartAutoplay(1400));
    window.addEventListener('resize', handleResize);

    goToTestimonial(0, 'auto');
    startAutoplay();

    return () => {
        clearAutoplay();
        window.clearTimeout(scrollTimer);
        window.removeEventListener('resize', handleResize);
    };
};

const initAboutView = () => {
    const carouselCleanup = initServiceCarousel();
    const testimonialsCleanup = initTestimonialsCarousel();

    return () => {
        carouselCleanup();
        testimonialsCleanup();
    };
};

const initProjectsView = () => {
    const select = viewContainer.querySelector('[data-select]');
    const selectItems = viewContainer.querySelectorAll('[data-select-item]');
    const selectValue = viewContainer.querySelector('[data-select-value]');
    const filterButtons = viewContainer.querySelectorAll('[data-filter-btn]');
    const filterItems = viewContainer.querySelectorAll('[data-filter-item]');

    const applyFilter = (selectedValue) => {
        filterItems.forEach((item) => {
            const categories = (item.dataset.category || '').split(/\s+/).filter(Boolean);
            const shouldShow =
                selectedValue === 'all' || categories.includes(selectedValue);

            item.classList.toggle('active', shouldShow);
        });
    };

    const syncActiveFilterButton = (selectedValue) => {
        filterButtons.forEach((button) => {
            button.classList.toggle(
                'active',
                button.dataset.filterValue === selectedValue
            );
        });
    };

    if (select) {
        select.addEventListener('click', () => {
            toggleActive(select);
        });
    }

    selectItems.forEach((item) => {
        item.addEventListener('click', () => {
            const selectedValue = item.dataset.filterValue || 'all';

            if (selectValue) {
                selectValue.textContent = item.textContent.trim();
            }

            toggleActive(select, false);
            applyFilter(selectedValue);
            syncActiveFilterButton(selectedValue);
        });
    });

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const selectedValue = button.dataset.filterValue || 'all';

            if (selectValue) {
                selectValue.textContent = button.textContent.trim();
            }

            applyFilter(selectedValue);
            syncActiveFilterButton(selectedValue);
        });
    });

    const projectModal = viewContainer.querySelector('[data-project-modal]');
    const projectModalMedia = viewContainer.querySelector('[data-project-modal-media]');
    const projectModalKicker = viewContainer.querySelector('[data-project-modal-kicker]');
    const projectModalTitle = viewContainer.querySelector('[data-project-modal-title]');
    const projectModalSummary = viewContainer.querySelector('[data-project-modal-summary]');
    const projectModalActions = viewContainer.querySelector('[data-project-modal-actions]');
    const projectModalDescription = viewContainer.querySelector('[data-project-modal-description]');
    const projectModalRole = viewContainer.querySelector('[data-project-modal-role]');
    const projectModalTechnologies = viewContainer.querySelector('[data-project-modal-technologies]');
    const projectModalChallenges = viewContainer.querySelector('[data-project-modal-challenges]');
    const projectSummaryView = viewContainer.querySelector('[data-project-summary-view]');
    const projectDocumentView = viewContainer.querySelector('[data-project-document-view]');
    const projectDocumentKicker = viewContainer.querySelector('[data-project-document-kicker]');
    const projectDocumentTitle = viewContainer.querySelector('[data-project-document-title]');
    const projectDocumentBody = viewContainer.querySelector('[data-project-document-body]');
    const projectOpenButtons = viewContainer.querySelectorAll('[data-project-open]');
    const projectCloseButtons = viewContainer.querySelectorAll('[data-project-close]');
    const detailToggle = viewContainer.querySelector('[data-project-detail-toggle]');
    const detailContent = viewContainer.querySelector('[data-project-detail-content]');
    let lastProjectTrigger = null;
    let activeProject = null;
    let detailRequestId = 0;

    const setDocumentMode = (enabled) => {
        const modalDialog = projectModal?.querySelector('.project-modal-dialog');

        modalDialog?.classList.toggle('is-document-view', enabled);

        if (projectSummaryView) {
            projectSummaryView.hidden = enabled;
        }

        if (projectDocumentView) {
            projectDocumentView.hidden = !enabled;
        }

        if (detailToggle) {
            detailToggle.setAttribute('aria-expanded', String(enabled));
        }

        if (enabled && projectDocumentBody) {
            projectDocumentBody.scrollTop = 0;
        }
    };

    const resetDocumentView = () => {
        detailRequestId += 1;
        setDocumentMode(false);

        if (projectSummaryView) {
            projectSummaryView.scrollTop = 0;
        }

        if (detailContent) {
            detailContent.innerHTML = `<p>${escapeHtml(projectDetailFallback)}</p>`;
        }
    };

    const buildProjectMedia = (project) => {
        if (!projectModalMedia) {
            return;
        }

        if (project.image) {
            projectModalMedia.innerHTML = `<img src="${project.image}" alt="${project.imageAlt || project.title}" loading="lazy">`;
            return;
        }

        projectModalMedia.innerHTML = `
            <div class="project-placeholder ${project.placeholderClass || ''}" aria-hidden="true">
                <ion-icon name="${project.placeholderIcon || 'briefcase-outline'}"></ion-icon>
                <span>${project.placeholderLabel || project.title}</span>
            </div>
        `;
    };

    const renderTextBlock = (element, text) => {
        if (!element) {
            return;
        }

        element.innerHTML = `<p>${escapeHtml(text)}</p>`;
    };

    const renderListBlock = (element, items, fallback) => {
        if (!element) {
            return;
        }

        if (!Array.isArray(items) || items.length === 0) {
            element.innerHTML = `<p>${escapeHtml(fallback)}</p>`;
            return;
        }

        element.innerHTML = `
            <ul>
                ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
            </ul>
        `;
    };

    const renderProjectLinks = (project) => {
        if (!projectModalActions) {
            return;
        }

        const links = [];
        const githubUrl = sanitizeUrl(project.githubUrl);
        const canvaUrl = sanitizeUrl(project.canvaUrl);

        if (githubUrl) {
            links.push(`
                <a class="project-modal-link" href="${escapeHtml(githubUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Abrir repositorio GitHub de ${project.title}">
                    <ion-icon name="logo-github"></ion-icon>
                </a>
            `);
        }

        if (canvaUrl) {
            links.push(`
                <a class="project-modal-link" href="${escapeHtml(canvaUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Abrir presentación Canva de ${escapeHtml(project.title)}">
                    <span class="project-modal-link-canva" aria-hidden="true">c</span>
                </a>
            `);
        }

        if (links.length === 0) {
            projectModalActions.hidden = true;
            projectModalActions.innerHTML = '';
            return;
        }

        projectModalActions.hidden = false;
        projectModalActions.innerHTML = links.join('');
    };

    const openProjectModal = (projectId, trigger) => {
        const project = projectCatalog[projectId];

        if (!project || !projectModal) {
            return;
        }

        lastProjectTrigger = trigger || null;
        activeProject = project;
        buildProjectMedia(project);
        resetDocumentView();

        if (projectModalKicker) {
            projectModalKicker.textContent = project.kicker || '';
        }

        if (projectModalTitle) {
            projectModalTitle.textContent = project.title;
        }

        if (projectModalSummary) {
            projectModalSummary.textContent = project.summary || 'Contenido técnico en preparación.';
        }

        renderTextBlock(
            projectModalDescription,
            project.description || 'Contenido técnico en preparación.'
        );
        renderTextBlock(
            projectModalRole,
            project.role || 'Espacio reservado para definir responsabilidades, alcance y contribución principal.'
        );
        renderListBlock(
            projectModalTechnologies,
            project.technologies,
            'Espacio reservado para stack, servicios cloud, frameworks y herramientas.'
        );
        renderListBlock(
            projectModalChallenges,
            project.challenges,
            'Espacio reservado para describir desafíos, decisiones técnicas y aprendizajes relevantes.'
        );
        renderProjectLinks(project);

        if (projectDocumentKicker) {
            projectDocumentKicker.textContent = project.kicker || '';
        }

        if (projectDocumentTitle) {
            projectDocumentTitle.textContent = project.title;
        }

        projectModal.hidden = false;
        document.body.style.overflow = 'hidden';
    };

    const closeProjectModal = () => {
        if (!projectModal || projectModal.hidden) {
            return;
        }

        resetDocumentView();
        projectModal.hidden = true;
        activeProject = null;
        document.body.style.overflow = '';

        if (lastProjectTrigger) {
            lastProjectTrigger.focus();
        }
    };

    const handleProjectKeydown = (event) => {
        if (event.key === 'Escape') {
            closeProjectModal();
        }
    };

    projectOpenButtons.forEach((button) => {
        button.addEventListener('click', () => {
            openProjectModal(button.dataset.projectId, button);
        });
    });

    projectCloseButtons.forEach((button) => {
        button.addEventListener('click', closeProjectModal);
    });

    if (detailToggle) {
        resetDocumentView();
        detailToggle.addEventListener('click', async () => {
            if (!activeProject || !detailContent) {
                return;
            }

            const requestId = ++detailRequestId;
            setDocumentMode(true);
            detailContent.innerHTML = '<p>Cargando detalle técnico...</p>';
            const detailData = await loadProjectDetailContent(activeProject);

            if (requestId !== detailRequestId) {
                return;
            }

            detailContent.innerHTML = detailData.html;
        });
    }

    window.addEventListener('keydown', handleProjectKeydown);

    return () => {
        window.removeEventListener('keydown', handleProjectKeydown);
        document.body.style.overflow = '';
    };
};

const initContactView = () => {
    if (window.emailjs && !window.__portfolioEmailInit) {
        window.emailjs.init({
            publicKey: EMAILJS_CONFIG.publicKey
        });
        window.__portfolioEmailInit = true;
    }

    const form = viewContainer.querySelector('[data-form]');
    const formInputs = viewContainer.querySelectorAll('[data-form-input]');
    const formBtn = viewContainer.querySelector('[data-form-btn]');
    const formStatus = viewContainer.querySelector('[data-form-status]');
    const contactForm = viewContainer.querySelector('#contact-form');
    const contactBtn = viewContainer.querySelector('#formBtn');
    const emailInput = viewContainer.querySelector('input[name="from_email"]');
    const reasonSelect = viewContainer.querySelector('select[name="contact_reason"]');
    const messageInput = viewContainer.querySelector('textarea[name="message"]');
    const defaultButtonMarkup =
        '<ion-icon name="paper-plane"></ion-icon><span>Enviar mensaje</span>';

    if (!contactForm || !contactBtn || !form || !formBtn) {
        return () => {};
    }

    const setFormStatus = (message, state = '') => {
        if (!formStatus) {
            return;
        }

        formStatus.textContent = message;
        formStatus.classList.remove('is-success', 'is-error');

        if (state) {
            formStatus.classList.add(state);
        }
    };

    const updateFormState = () => {
        formBtn.disabled = !form.checkValidity();
    };

    const updateMessagePlaceholder = () => {
        if (!messageInput) {
            return;
        }

        if (reasonSelect?.value === 'Quiero compartir un testimonio') {
            messageInput.placeholder = 'Comparte tu testimonio, contexto o experiencia trabajando conmigo';
            return;
        }

        messageInput.placeholder = 'Cuentame sobre tu proyecto o idea';
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            updateFormState();
            return;
        }

        const honeypot = contactForm.querySelector('input[name="company"]');

        if (honeypot && honeypot.value.trim() !== '') {
            return;
        }

        if (!window.emailjs) {
            setFormStatus(
                'No fue posible cargar el servicio de correo. Inténtalo nuevamente en unos minutos.',
                'is-error'
            );
            return;
        }

        contactBtn.disabled = true;
        contactBtn.innerHTML = '<span>Enviando mensaje...</span>';
        setFormStatus('Enviando tu mensaje...', '');

        try {
            const replyToInput = contactForm.querySelector('input[name="reply_to"]');

            if (replyToInput && emailInput) {
                replyToInput.value = emailInput.value.trim();
            }

            await window.emailjs.sendForm(
                EMAILJS_CONFIG.serviceId,
                EMAILJS_CONFIG.templateId,
                contactForm,
                {
                    publicKey: EMAILJS_CONFIG.publicKey
                }
            );

            contactForm.reset();
            contactBtn.innerHTML = defaultButtonMarkup;
            setFormStatus(
                'Mensaje enviado correctamente. Gracias por tu interés; te responderé pronto.',
                'is-success'
            );
            updateMessagePlaceholder();
            updateFormState();
        } catch (error) {
            console.error('Error al enviar el mensaje:', {
                status: error?.status,
                text: error?.text,
                message: error?.message,
                error
            });
            contactBtn.disabled = false;
            contactBtn.innerHTML = defaultButtonMarkup;
            setFormStatus(
                'Hubo un problema al enviar el mensaje. Puedes intentarlo nuevamente o escribirme directamente por correo.',
                'is-error'
            );
        }
    };

    formInputs.forEach((input) => {
        input.addEventListener('input', updateFormState);
    });

    reasonSelect?.addEventListener('change', () => {
        updateMessagePlaceholder();
        updateFormState();
    });

    contactForm.addEventListener('submit', handleSubmit);
    updateMessagePlaceholder();
    updateFormState();

    return () => {
        document.body.style.overflow = '';
    };
};

const initializeView = (target) => {
    switch (target) {
        case 'about':
            return initAboutView();
        case 'portfolio':
            return initProjectsView();
        case 'contact':
            return initContactView();
        default:
            return () => {};
    }
};

const loadView = async (target, options = {}) => {
    const { updateHash = true, scroll = true } = options;

    if (!viewContainer || !viewMap[target]) {
        return;
    }

    currentViewCleanup();
    currentViewCleanup = () => {};
    document.body.style.overflow = '';

    try {
        const markup = await fetchViewMarkup(target);
        viewContainer.innerHTML = markup;
        currentView = target;
        currentViewCleanup = initializeView(target);
        setActiveNavigation(target);

        if (updateHash && window.location.hash !== `#${target}`) {
            window.location.hash = target;
        }

        if (scroll) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    } catch (error) {
        console.error('Error loading view:', error);
        viewContainer.innerHTML = createViewErrorMarkup();
        currentView = target;
        setActiveNavigation(target);
    }
};

const resolveInitialView = () => {
    const hashTarget = window.location.hash.replace('#', '').trim();
    return viewMap[hashTarget] ? hashTarget : 'about';
};

navigationLinks.forEach((link) => {
    link.addEventListener('click', () => {
        const targetPage = link.dataset.pageTarget;

        if (!targetPage || targetPage === currentView) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        loadView(targetPage, { updateHash: true, scroll: true });
    });
});

window.addEventListener('hashchange', () => {
    const target = resolveInitialView();

    if (target !== currentView) {
        loadView(target, { updateHash: false, scroll: false });
    }
});

loadView(resolveInitialView(), { updateHash: false, scroll: false });
