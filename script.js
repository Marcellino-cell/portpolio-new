/* =========================================================
   MARCELLINO PORTFOLIO — STABLE + PERFORMANCE FRIENDLY
   Smooth navigation | Projects | Certificates | Theme
   Education / Experience dialog | Search | Responsive UI
========================================================= */
(() => {
    "use strict";

    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
    const body = document.body;
    const header = $("header");
    const navMenu = $("#navMenu");
    const menuButton = $(".menu-btn");
    const themeButton = $("#theme-toggle");
    const progressBar = $("#progress-bar");
    const topButton = $("#topBtn");
    const projectGrid = $(".project-grid");
    const projectSearch = $("#projectSearch");
    const projectEmpty = $("#projectEmpty");
    const toast = $("#toastNotification");
    const popup = $("#educationPopup");
    const popupImage = $("#popupImage");
    const popupImageFallback = $("#popupImageFallback");
    const popupFallbackTitle = $("#popupFallbackTitle");
    const popupFallbackText = $("#popupFallbackText");
    const popupTitle = $("#popupTitle");
    const popupDescription = $("#popupDescription");
    const popupTags = $("#popupTags");
    const closePopupButton = $("#closeEducation");
    const copyEmailButton = $("#copyEmail");
    const currentYear = $("#currentYear");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const projectCards = $$(".project-card");
    const filterButtons = $$(".filter-btn");
    const navLinks = $$('#navMenu a[href^="#"]');
    const pageSections = $$("section[id]");
    const projectData = Array.isArray(window.PORTFOLIO_PROJECTS)
        ? window.PORTFOLIO_PROJECTS
        : [];

    let toastTimer = 0;
    let navigationFrame = 0;
    let navigationTargetId = null;
    let navigationTimer = 0;
    let previousFocus = null;
    let activeProjectFilter = "all";
    let activeProjectSearch = "";
    let activePopupData = null;

    /* -------------------- LOADING SCREEN -------------------- */
    const loader = $("#loader");
    let loaderHidden = false;

    function hideLoader() {
        if (!loader || loaderHidden) return;
        loaderHidden = true;
        loader.classList.add("is-hidden");
        window.setTimeout(() => {
            loader.hidden = true;
        }, reduceMotion ? 0 : 420);
    }

    window.addEventListener("load", hideLoader, { once: true });
    // Don't leave the screen blocked if an optional asset stalls.
    window.setTimeout(hideLoader, 1600);

    /* -------------------- TOAST -------------------- */
    function showToast(message) {
        if (!toast) {
            console.info(message);
            return;
        }
        window.clearTimeout(toastTimer);
        toast.textContent = message;
        toast.classList.add("show");
        toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2800);
    }

    /* -------------------- THEME -------------------- */
    function readSavedTheme() {
        try {
            const value = localStorage.getItem("theme");
            return value === "light" || value === "dark" ? value : "dark";
        } catch (_error) {
            return "dark";
        }
    }

    function applyTheme(theme) {
        const nextTheme = theme === "light" ? "light" : "dark";
        const isDark = nextTheme === "dark";
        body.classList.toggle("dark", isDark);
        if (themeButton) {
            themeButton.innerHTML = isDark
                ? '<i class="fa-solid fa-sun" aria-hidden="true"></i>'
                : '<i class="fa-solid fa-moon" aria-hidden="true"></i>';
            themeButton.setAttribute("aria-label", isDark ? "Gunakan tema terang" : "Gunakan tema gelap");
            themeButton.setAttribute("title", isDark ? "Gunakan tema terang" : "Gunakan tema gelap");
        }
        try {
            localStorage.setItem("theme", nextTheme);
        } catch (_error) {
            // Theme switching still works for this page when storage is blocked.
        }
        const themeMeta = $('meta[name="theme-color"]');
        if (themeMeta) themeMeta.content = isDark ? "#080E1C" : "#F5F7FB";
    }

    applyTheme(readSavedTheme());
    themeButton?.addEventListener("click", () => {
        applyTheme(body.classList.contains("dark") ? "light" : "dark");
    });

    /* -------------------- MOBILE NAVIGATION -------------------- */
    function closeMobileMenu() {
        if (!navMenu || !menuButton) return;
        navMenu.classList.remove("active");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Buka menu");
        const icon = $("i", menuButton);
        if (icon) icon.className = "fa-solid fa-bars";
    }

    menuButton?.addEventListener("click", () => {
        if (!navMenu) return;
        const opened = navMenu.classList.toggle("active");
        menuButton.setAttribute("aria-expanded", String(opened));
        menuButton.setAttribute("aria-label", opened ? "Tutup menu" : "Buka menu");
        const icon = $("i", menuButton);
        if (icon) icon.className = opened ? "fa-solid fa-xmark" : "fa-solid fa-bars";
    });

    document.addEventListener("click", event => {
        if (!navMenu || !menuButton || !navMenu.classList.contains("active")) return;
        const target = event.target;
        if (!(target instanceof Node)) return;
        if (!navMenu.contains(target) && !menuButton.contains(target)) closeMobileMenu();
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 900) closeMobileMenu();
    }, { passive: true });

    /* -------------------- THROTTLED SCROLL UI -------------------- */
    function setActiveNav(sectionId) {
        navLinks.forEach(link => {
            const active = link.getAttribute("href") === `#${sectionId}`;
            link.classList.toggle("active", active);
            if (active) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
        });
    }

    function updateScrollUI() {
        navigationFrame = 0;
        const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const percentage = maxScroll > 0 ? Math.min(100, Math.max(0, scrollY / maxScroll * 100)) : 0;

        if (progressBar) progressBar.style.width = `${percentage}%`;
        if (header) header.classList.toggle("scrolled", scrollY > 24);
        if (topButton) topButton.style.display = scrollY > 520 ? "inline-flex" : "none";

        if (pageSections.length) {
            const marker = (header?.getBoundingClientRect().height || 0) + 110;
            let current = pageSections[0];
            for (const section of pageSections) {
                if (section.getBoundingClientRect().top <= marker) current = section;
            }
            if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 4) {
                current = pageSections[pageSections.length - 1];
            }
            const lockedTarget = navigationTargetId ? document.getElementById(navigationTargetId) : null;
            if (lockedTarget) {
                const targetTop = lockedTarget.getBoundingClientRect().top;
                const desiredTop = (header?.getBoundingClientRect().height || 0) + 6;
                setActiveNav(navigationTargetId);
                pageSections.forEach(section => section.classList.toggle("section-active", section === lockedTarget));
                if (Math.abs(targetTop - desiredTop) <= 28) clearNavigationLock();
            } else {
                setActiveNav(current.id);
                pageSections.forEach(section => section.classList.toggle("section-active", section === current));
            }
        }
    }

    function requestScrollUI() {
        if (navigationFrame) return;
        navigationFrame = window.requestAnimationFrame(updateScrollUI);
    }

    window.addEventListener("scroll", requestScrollUI, { passive: true });
    window.addEventListener("resize", requestScrollUI, { passive: true });
    window.addEventListener("load", requestScrollUI, { once: true });

    function clearNavigationLock() {
        navigationTargetId = null;
        if (navigationTimer) window.clearTimeout(navigationTimer);
        navigationTimer = 0;
    }

    function scrollToSection(id) {
        const target = document.getElementById(id);
        if (!target) return false;
        closeMobileMenu();
        const offset = header?.getBoundingClientRect().height || 0;
        const top = window.scrollY + target.getBoundingClientRect().top - offset - 6;
        clearNavigationLock();
        navigationTargetId = id;
        setActiveNav(id);
        window.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? "auto" : "smooth" });
        if (reduceMotion) {
            clearNavigationLock();
        } else {
            // Fallback for browsers that do not fire scrollend consistently.
            navigationTimer = window.setTimeout(() => {
                clearNavigationLock();
                requestScrollUI();
            }, 1900);
        }
        return true;
    }

    $$('a[href^="#"]').forEach(link => {
        link.addEventListener("click", event => {
            const href = link.getAttribute("href");
            if (!href || href === "#") {
                event.preventDefault();
                return;
            }
            const targetId = href.slice(1);
            if (!document.getElementById(targetId)) return;
            event.preventDefault();
            scrollToSection(targetId);
        });
    });

    topButton?.addEventListener("click", () => {
        clearNavigationLock();
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
        setActiveNav("home");
    });

    /* -------------------- HERO ROLE LABEL -------------------- */
    // A stable role label avoids an always-running timer and keeps the page responsive.
    const typingElement = $("#typing");
    if (typingElement) typingElement.textContent = "Frontend Developer";

    /* -------------------- PROJECT SEARCH + FILTER -------------------- */
    function normalizeText(value) {
        return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    }

    function filterProjects() {
        let visibleCount = 0;
        projectCards.forEach((card, position) => {
            const button = $(".project-btn", card);
            const slug = button?.dataset.projectSlug || "";
            const dataIndex = Number(button?.dataset.index ?? card.dataset.index ?? position);
            const data = projectData.find(project => project.slug === slug) || projectData.find(project => Number(project.index) === dataIndex);
            const category = card.dataset.category || data?.category || "all";
            const title = $("h3", card)?.textContent || "";
            const description = $("p", card)?.textContent || "";
            const tags = Array.isArray(data?.tags) ? data.tags.join(" ") : "";
            const matchingCategory = activeProjectFilter === "all" || category === activeProjectFilter;
            const matchingText = normalizeText(`${title} ${description} ${tags}`).includes(activeProjectSearch);
            const visible = matchingCategory && matchingText;
            card.hidden = !visible;
            if (visible) visibleCount += 1;
        });
        if (projectEmpty) projectEmpty.hidden = visibleCount !== 0;
        if (projectGrid) projectGrid.classList.toggle("project-grid-empty", visibleCount === 0);
    }

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            activeProjectFilter = button.dataset.filter || "all";
            filterButtons.forEach(item => {
                const active = item === button;
                item.classList.toggle("active", active);
                item.setAttribute("aria-pressed", String(active));
            });
            filterProjects();
        });
    });

    projectSearch?.addEventListener("input", () => {
        activeProjectSearch = normalizeText(projectSearch.value);
        filterProjects();
    });

    /* Route project cards to their live website when configured. Otherwise use the local detail page. */
    function resolveProjectUrl(project) {
        const candidate = String(project?.url || "").trim();
        if (!candidate || candidate === "#") return "";
        try {
            const parsed = new URL(candidate, window.location.href);
            if (!["http:", "https:", "file:"].includes(parsed.protocol)) return "";
            return candidate;
        } catch (_error) {
            return "";
        }
    }

    projectCards.forEach((card, position) => {
        const detailLink = $(".project-btn", card);
        if (!detailLink) return;
        const slug = detailLink.dataset.projectSlug || "";
        const index = Number(detailLink.dataset.index ?? card.dataset.index ?? position);
        const project = projectData.find(item => item.slug === slug) || projectData.find(item => Number(item.index) === index);
        if (!project) {
            detailLink.href = `project-detail.html?project=${encodeURIComponent(slug)}`;
            return;
        }

        const liveUrl = resolveProjectUrl(project);
        const isBmi = project.slug === "bmi-health-tracker";
        if (liveUrl && !isBmi) {
            detailLink.href = liveUrl;
            detailLink.removeAttribute("data-local-detail");
            try {
                const parsed = new URL(liveUrl, window.location.href);
                const external = parsed.origin !== window.location.origin;
                if (external) {
                    detailLink.target = "_blank";
                    detailLink.rel = "noopener noreferrer";
                } else {
                    detailLink.removeAttribute("target");
                }
            } catch (_error) {
                detailLink.removeAttribute("target");
            }
            detailLink.setAttribute("aria-label", `Buka website ${project.title}`);
        } else {
            detailLink.href = `project-detail.html?project=${encodeURIComponent(project.slug)}`;
            detailLink.dataset.localDetail = "true";
            detailLink.removeAttribute("target");
            detailLink.setAttribute("aria-label", isBmi ? "Lihat detail dan barcode BMI Health Tracker" : `Lihat detail ${project.title}`);
        }

        card.addEventListener("click", event => {
            if (event.target instanceof Element && event.target.closest("a, button, input, label")) return;
            if (detailLink.href) window.location.assign(detailLink.href);
        });
    });
    filterProjects();

    /* -------------------- SHARED DETAIL POPUP -------------------- */
    function setPopupFallback(data, message) {
        if (popupImage) {
            popupImage.hidden = true;
            popupImage.removeAttribute("src");
        }
        if (popupImageFallback) popupImageFallback.hidden = false;
        if (popupFallbackTitle) popupFallbackTitle.textContent = data.fallbackTitle || "Pratinjau dokumen belum tersedia";
        if (popupFallbackText) popupFallbackText.textContent = message || data.fallbackText || "Tambahkan foto/scan asli pada folder aset agar tampil di bagian ini.";
    }

    function openPopup(data) {
        if (!popup || !data) return;
        previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        activePopupData = data;

        if (popupTitle) popupTitle.textContent = data.title || "Detail";
        if (popupDescription) popupDescription.textContent = data.description || "Belum ada deskripsi.";
        if (popupTags) {
            popupTags.replaceChildren();
            (Array.isArray(data.tags) ? data.tags : []).forEach(label => {
                const tag = document.createElement("span");
                tag.className = "popup-tag";
                tag.textContent = String(label);
                popupTags.appendChild(tag);
            });
        }

        if (data.image && popupImage) {
            if (popupImageFallback) popupImageFallback.hidden = true;
            popupImage.hidden = true;
            popupImage.onload = () => {
                if (activePopupData !== data) return;
                popupImage.hidden = false;
                if (popupImageFallback) popupImageFallback.hidden = true;
            };
            popupImage.onerror = () => {
                if (activePopupData !== data) return;
                setPopupFallback(data);
            };
            popupImage.alt = `${data.title || "Dokumen"} — pratinjau`;
            popupImage.src = data.image;
            if (popupImage.complete && popupImage.naturalWidth > 0) {
                popupImage.hidden = false;
                if (popupImageFallback) popupImageFallback.hidden = true;
            } else if (popupImage.complete && popupImage.naturalWidth === 0) {
                setPopupFallback(data);
            }
        } else {
            setPopupFallback(data);
        }

        popup.classList.add("active");
        popup.setAttribute("aria-hidden", "false");
        body.classList.add("popup-open");
        closePopupButton?.focus({ preventScroll: true });
    }

    function closePopup() {
        if (!popup) return;
        popup.classList.remove("active");
        popup.setAttribute("aria-hidden", "true");
        body.classList.remove("popup-open");
        activePopupData = null;
        if (popupImage) {
            popupImage.onload = null;
            popupImage.onerror = null;
        }
        if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    }

    closePopupButton?.addEventListener("click", closePopup);
    popup?.addEventListener("click", event => {
        if (event.target === popup) closePopup();
    });
    document.addEventListener("keydown", event => {
        const popupIsOpen = Boolean(popup?.classList.contains("active"));
        if (event.key === "Escape") {
            if (popupIsOpen) closePopup();
            else if (navMenu?.classList.contains("active")) {
                closeMobileMenu();
                menuButton?.focus({ preventScroll: true });
            }
            return;
        }
        if (event.key === "Tab" && popupIsOpen && popup) {
            const focusable = Array.from(popup.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'))
                .filter(element => !element.hidden && element.getClientRects().length > 0);
            if (!focusable.length) {
                event.preventDefault();
                popup.focus?.({ preventScroll: true });
                return;
            }
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && (document.activeElement === first || !popup.contains(document.activeElement))) {
                event.preventDefault();
                last.focus({ preventScroll: true });
            } else if (!event.shiftKey && (document.activeElement === last || !popup.contains(document.activeElement))) {
                event.preventDefault();
                first.focus({ preventScroll: true });
            }
        }
    });

    const educationDetails = [
        {
            title: "SMK Krian Sidoarjo",
            image: "foto/smk.jpg",
            tags: ["2024–2027", "Rekayasa Perangkat Lunak"],
            description: "Saya menempuh pendidikan di SMK Krian Sidoarjo pada jurusan Rekayasa Perangkat Lunak. Saya mempelajari pemrograman, pengembangan website, basis data, dan teknologi digital.",
            fallbackTitle: "Foto dokumentasi sekolah belum tersedia",
            fallbackText: "Tambahkan foto sekolah di foto/smk.jpg untuk menampilkannya pada jendela ini."
        },
        {
            title: "SMP Negeri 1 Prambon",
            image: "foto/smp.jpg",
            tags: ["2021–2024"],
            description: "Di SMP Negeri 1 Prambon, saya mulai mengembangkan minat belajar dan ketertarikan pada komputer serta teknologi.",
            fallbackTitle: "Foto dokumentasi sekolah belum tersedia",
            fallbackText: "Tambahkan foto sekolah di foto/smp.jpg untuk menampilkannya pada jendela ini."
        },
        {
            title: "SD Negeri Kedung Wonokerto",
            image: "foto/sd.jpeg",
            tags: ["2015–2021"],
            description: "Pendidikan dasar menjadi awal perjalanan belajar dan mengembangkan pengetahuan yang terus berlanjut.",
            fallbackTitle: "Foto dokumentasi sekolah belum tersedia",
            fallbackText: "Tambahkan foto sekolah di foto/sd.jpeg untuk menampilkannya pada jendela ini."
        }
    ];

    $$(".timeline-item[data-education]").forEach(item => {
        const openEducation = () => {
            const detail = educationDetails[Number(item.dataset.education)];
            if (detail) openPopup(detail);
        };
        item.addEventListener("click", openEducation);
        item.addEventListener("keydown", event => {
            if (event.target !== item) return;
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openEducation();
            }
        });
    });

    const experienceDetail = {
        title: "PT CNC Disain Nusantara",
        image: "foto/cnc.png",
        tags: ["Praktik Kerja Lapangan", "Web Development", "Motor Servo", "Graphic Design", "Simulator CNC"],
        description: "PT CNC Disain Nusantara bergerak di bidang Motion Control dan Industrial Automation serta merupakan Authorized Solution Partner Siemens.\n\nSelama PKL, saya memperoleh pengalaman dalam service motor servo, pengembangan Web Report Before & After Service, pembuatan desain grafis, serta perakitan simulator CNC. Pengalaman tersebut membantu meningkatkan kemampuan teknis, pemrograman, kerja sama tim, dan pemecahan masalah.",
        fallbackTitle: "Foto dokumentasi PKL belum tersedia",
        fallbackText: "Tambahkan foto dokumentasi PKL di foto/cnc.png untuk menampilkannya pada jendela ini."
    };

    const experienceCard = $("#experienceCard");
    const experienceDetailButton = $("#experienceDetailBtn");
    experienceCard?.addEventListener("click", event => {
        if (event.target instanceof Element && event.target.closest("button")) return;
        openPopup(experienceDetail);
    });
    experienceCard?.addEventListener("keydown", event => {
        if (event.target !== experienceCard) return;
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openPopup(experienceDetail);
        }
    });
    experienceDetailButton?.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        openPopup(experienceDetail);
    });

    /* -------------------- CERTIFICATE DETAILS -------------------- */
    const certificateDetails = [
        {
            title: "Sertifikat Praktik Kerja Lapangan",
            image: "sertifikat/sertifikat-pkl.jpg",
            tags: ["PKL", "PT CNC Disain Nusantara", "Pengalaman industri"],
            description: "Kegiatan Praktik Kerja Lapangan di PT CNC Disain Nusantara (Surabaya Office). Pengalaman ini membantu saya mengenal lingkungan kerja dan menerapkan kemampuan teknis secara langsung.",
            fallbackTitle: "Foto sertifikat PKL belum dilampirkan",
            fallbackText: "Simpan foto/scan asli dengan nama sertifikat-pkl.jpg di folder sertifikat/ agar dokumennya dapat dilihat di sini."
        },
        {
            title: "Kunjungan Industri",
            image: "sertifikat/kunjungan-industri.jpg",
            tags: ["Kunjungan industri", "Garudafood", "Aice"],
            description: "Dokumentasi pengalaman kunjungan industri ke PT Garudafood Putra Putri Jaya, Tbk dan PT Aice Ice Cream Jatim Industry untuk mengenal lingkungan kerja dan proses industri.",
            fallbackTitle: "Dokumentasi kunjungan industri belum dilampirkan",
            fallbackText: "Simpan foto/scan dokumen dengan nama kunjungan-industri.jpg di folder sertifikat/ untuk menampilkannya di sini."
        },
        {
            title: "Jujitsu PORKAB — Juara 3",
            image: "sertifikat/jujitsu-porkab.jpg",
            tags: ["Jujitsu", "PORKAB", "Juara 3"],
            description: "Pencapaian olahraga Jujitsu di PORKAB. Prestasi ini menjadi pengingat akan pentingnya disiplin, latihan, konsistensi, dan semangat untuk terus berkembang.",
            fallbackTitle: "Foto sertifikat/penghargaan belum dilampirkan",
            fallbackText: "Simpan foto/scan asli dengan nama jujitsu-porkab.jpg di folder sertifikat/ agar dokumennya dapat dilihat di sini."
        }
    ];

    $$("[data-certificate]").forEach(button => {
        button.addEventListener("click", () => {
            const data = certificateDetails[Number(button.dataset.certificate)];
            if (data) openPopup(data);
        });
    });

    /* -------------------- COPY EMAIL -------------------- */
    const emailToCopy = "fahrifajar379@gmail.com";
    async function copyEmail() {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(emailToCopy);
            } else {
                const input = document.createElement("textarea");
                input.value = emailToCopy;
                input.setAttribute("readonly", "");
                input.style.position = "fixed";
                input.style.opacity = "0";
                body.appendChild(input);
                input.select();
                const success = document.execCommand("copy");
                input.remove();
                if (!success) throw new Error("Clipboard tidak tersedia");
            }
            showToast("Alamat email berhasil disalin.");
        } catch (_error) {
            showToast(`Email: ${emailToCopy}`);
        }
    }
    copyEmailButton?.addEventListener("click", copyEmail);

    /* -------------------- LOW-COST REVEAL + SKILL BARS -------------------- */
    if (!reduceMotion && "IntersectionObserver" in window) {
        const revealItems = $$(".section-title, .about-container, .timeline-item, .skill-card, .project-card, .certificate-card, .experience-box, .contact-box");
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: "0px 0px -24px 0px" });

        revealItems.forEach(item => {
            item.classList.add("reveal-ready");
            revealObserver.observe(item);
        });

        const skillObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-filled");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.35 });
        $$(".fill").forEach(bar => skillObserver.observe(bar));
    } else {
        $$(".fill").forEach(bar => bar.classList.add("is-filled"));
    }

    /* -------------------- MISSING IMAGE FALLBACKS -------------------- */
    function insertImageFallback(image) {
        if (!image || image.id === "popupImage" || image.dataset.fallbackAdded === "true") return;
        const parent = image.parentElement;
        if (!parent) return;
        image.dataset.fallbackAdded = "true";
        image.hidden = true;

        const fallback = document.createElement("div");
        fallback.className = "media-fallback";
        const context = parent.classList.contains("hero-photo") ? "hero"
            : parent.classList.contains("about-image") ? "about"
            : parent.classList.contains("project-card") ? "project"
            : parent.classList.contains("contact-photo") ? "contact" : "generic";
        fallback.classList.add(`media-fallback--${context}`);
        fallback.setAttribute("role", "img");
        fallback.setAttribute("aria-label", `${image.alt || "Gambar"} belum tersedia`);

        const mark = document.createElement("span");
        mark.className = "media-fallback-mark";
        mark.textContent = context === "project" ? "{ }" : context === "hero" || context === "about" ? "</>" : "IMG";
        const title = document.createElement("p");
        title.className = "media-fallback-title";
        title.textContent = context === "project"
            ? ($("h3", parent)?.textContent || image.alt || "Pratinjau proyek")
            : (image.alt || "Gambar portofolio");
        const caption = document.createElement("p");
        caption.className = "media-fallback-caption";
        caption.textContent = "MEDIA BELUM DITAMBAHKAN";
        fallback.append(mark, title, caption);
        image.insertAdjacentElement("beforebegin", fallback);
    }

    $$("img").forEach(image => {
        image.addEventListener("error", () => insertImageFallback(image), { once: true });
        if (image.complete && image.currentSrc && image.naturalWidth === 0) insertImageFallback(image);
    });

    /* -------------------- FOOTER YEAR -------------------- */
    if (currentYear) currentYear.textContent = String(new Date().getFullYear());

    // Initialise positions and controls without a repeated animation loop.
    requestScrollUI();
    console.info("Portfolio initialised: navigation, projects, certificates and dialogs ready.");
})();
