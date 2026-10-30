(() => {
    "use strict";

    const projects = Array.isArray(window.PORTFOLIO_PROJECTS)
        ? window.PORTFOLIO_PROJECTS
        : [];

    const params = new URLSearchParams(window.location.search);
    const requestedSlug = params.get("project") || "";
    const project = projects.find(item => item.slug === requestedSlug);

    const titleEl = document.getElementById("projectTitle");
    const descriptionEl = document.getElementById("projectDescription");
    const summaryEl = document.getElementById("projectSummary");
    const categoryEl = document.getElementById("projectCategory");
    const numberEl = document.getElementById("projectNumber");
    const tagsEl = document.getElementById("projectTags");
    const cover = document.getElementById("projectCover");
    const coverFallback = document.getElementById("coverFallback");
    const barcodePanel = document.getElementById("bmiBarcodePanel");
    const barcodeImage = document.getElementById("bmiBarcodeImage");
    const barcodeLoading = document.getElementById("barcodeLoading");
    const barcodeError = document.getElementById("barcodeError");
    const barcodeNote = document.getElementById("barcodeNote");
    const barcodeTargetLink = document.getElementById("barcodeTargetLink");
    const openProjectWebsite = document.getElementById("openProjectWebsite");
    const projectLinkNote = document.getElementById("projectLinkNote");
    const notFound = document.getElementById("projectNotFound");

    function safeProjectUrl(projectItem) {
        const raw = String(projectItem?.url || "").trim();
        if (!raw || raw === "#") return "";

        try {
            const parsed = new URL(raw, window.location.href);
            if (!["http:", "https:", "file:"].includes(parsed.protocol)) return "";
            return parsed.href;
        } catch (error) {
            console.warn("URL proyek tidak valid:", raw);
            return "";
        }
    }

    function setNotFound() {
        if (titleEl) titleEl.textContent = "Proyek tidak ditemukan";
        if (descriptionEl) descriptionEl.textContent = "Tautan proyek tidak valid atau proyek tidak tercantum dalam katalog.";
        if (notFound) notFound.hidden = false;
        const grid = document.querySelector(".detail-grid");
        if (grid) grid.hidden = true;
    }

    function loadCover(projectItem) {
        if (!cover || !coverFallback) return;
        cover.alt = `Pratinjau ${projectItem.title}`;
        cover.hidden = true;
        coverFallback.hidden = false;
        cover.onload = () => {
            cover.hidden = false;
            coverFallback.hidden = true;
        };
        cover.onerror = () => {
            cover.hidden = true;
            coverFallback.hidden = false;
        };
        if (projectItem.image) cover.src = projectItem.image;
        else {
            cover.hidden = true;
            coverFallback.hidden = false;
        }
    }

    function renderTags(tags) {
        if (!tagsEl) return;
        tagsEl.replaceChildren();
        (Array.isArray(tags) ? tags : []).forEach(tagText => {
            const tag = document.createElement("span");
            tag.className = "detail-tag";
            tag.textContent = String(tagText);
            tagsEl.appendChild(tag);
        });
    }

    function renderBarcode(projectItem, configuredUrl) {
        if (!barcodePanel || !barcodeImage) return;
        barcodePanel.hidden = false;
        barcodeImage.hidden = true;
        barcodeError.hidden = true;
        barcodeLoading.hidden = false;
        barcodeLoading.textContent = "Menyiapkan barcode...";

        const fallbackPageUrl = new URL(
            `project-detail.html?project=${encodeURIComponent(projectItem.slug)}`,
            window.location.href
        ).href;
        const targetUrl = configuredUrl || fallbackPageUrl;
        const localFile = window.location.protocol === "file:";

        if (barcodeTargetLink) {
            barcodeTargetLink.href = targetUrl;
            barcodeTargetLink.hidden = false;
        }
        if (barcodeNote) {
            if (!configuredUrl && localFile) {
                barcodeNote.textContent = "Belum ada URL website live. QR saat ini mengarah ke file lokal dan baru dapat dipakai dari HP setelah portofolio diunggah ke hosting atau alamat website BMI ditambahkan di projects-data.js.";
            } else if (!configuredUrl) {
                barcodeNote.textContent = "Belum ada URL aplikasi BMI terpisah. QR mengarah ke halaman detail BMI ini. Isi properti url di projects-data.js agar QR mengarah langsung ke aplikasi BMI.";
            } else {
                barcodeNote.textContent = "QR mengarah ke alamat website BMI yang telah diatur pada projects-data.js.";
            }
        }

        let hasTriedQrFallback = false;
        const useGeneratedQr = () => {
            if (hasTriedQrFallback) {
                barcodeLoading.hidden = true;
                barcodeImage.hidden = true;
                barcodeError.hidden = false;
                return;
            }
            hasTriedQrFallback = true;
            const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=340x340&margin=12&data=" + encodeURIComponent(targetUrl);
            barcodeImage.onload = () => {
                barcodeLoading.hidden = true;
                barcodeError.hidden = true;
                barcodeImage.hidden = false;
            };
            barcodeImage.onerror = () => {
                barcodeLoading.hidden = true;
                barcodeImage.hidden = true;
                barcodeError.hidden = false;
            };
            barcodeImage.src = qrUrl;
        };

        barcodeImage.onload = () => {
            barcodeLoading.hidden = true;
            barcodeError.hidden = true;
            barcodeImage.hidden = false;
        };
        barcodeImage.onerror = () => {
            if (!hasTriedQrFallback) {
                useGeneratedQr();
            } else {
                barcodeLoading.hidden = true;
                barcodeImage.hidden = true;
                barcodeError.hidden = false;
            }
        };

        const photoPath = String(projectItem.barcodeImage || "").trim();
        if (photoPath) {
            // If the user supplies their real barcode photo, it is preferred over generated QR.
            barcodeImage.src = photoPath;
        } else {
            useGeneratedQr();
        }
    }

    function renderProject(projectItem) {
        const configuredUrl = safeProjectUrl(projectItem);
        const isBmi = projectItem.slug === "bmi-health-tracker";

        document.title = `${projectItem.title} | Marcellino Portfolio`;
        if (titleEl) titleEl.textContent = projectItem.title;
        if (descriptionEl) descriptionEl.textContent = projectItem.description || "Detail proyek portofolio.";
        if (summaryEl) summaryEl.textContent = projectItem.description || "Belum ada ringkasan proyek.";
        if (categoryEl) categoryEl.textContent = String(projectItem.category || "project").replaceAll("-", " ").toUpperCase();
        if (numberEl) numberEl.textContent = String(Number(projectItem.index) + 1).padStart(2, "0");

        renderTags(projectItem.tags);
        loadCover(projectItem);

        if (configuredUrl && openProjectWebsite) {
            openProjectWebsite.href = configuredUrl;
            openProjectWebsite.hidden = false;
            projectLinkNote.hidden = true;
        } else {
            if (openProjectWebsite) openProjectWebsite.hidden = true;
            if (projectLinkNote) {
                projectLinkNote.hidden = false;
                projectLinkNote.textContent = "Link website live belum ditambahkan. Isi properti url pada proyek ini di file projects-data.js agar tombol dapat membuka website yang sebenarnya.";
            }
        }

        if (isBmi) {
            renderBarcode(projectItem, configuredUrl);
        } else if (barcodePanel) {
            barcodePanel.hidden = true;
        }
    }

    if (document.getElementById("currentYear")) {
        document.getElementById("currentYear").textContent = String(new Date().getFullYear());
    }

    if (!project) {
        setNotFound();
    } else {
        renderProject(project);
    }
})();
