// controls.js — Sidebar UI: template picker, backgrounds, text overlay, phrase chips

(function () {
    "use strict";

    function initControls(state, onStateChange) {
        populateSlangText();
        initMobileTabs();
        initTemplateGrid(state, onStateChange);
        initGradientGrid(state, onStateChange);
        initColorPicker(state, onStateChange);
        initTextControls(state, onStateChange);
        initPhraseChips(state, onStateChange);
    }

    // ─── Mobile Tab Bar ───
    function initMobileTabs() {
        var tabBar = document.getElementById("mobile-tab-bar");
        var sidebar = document.querySelector(".editor-sidebar");
        if (!tabBar || !sidebar) return;

        // Populate tab labels from slang
        setText("tab-label-frames", slang("tabFrames"));
        setText("tab-label-vibes", slang("tabVibes"));
        setText("tab-label-text", slang("tabText"));
        setText("tab-label-export", slang("tabExport"));

        // Tab click handler
        var tabs = tabBar.querySelectorAll(".mobile-tab");
        tabs.forEach(function (tab) {
            tab.addEventListener("click", function () {
                // Update active tab button
                tabs.forEach(function (t) {
                    t.classList.toggle("active", t === tab);
                });
                // Update sidebar active tab (CSS handles show/hide)
                sidebar.dataset.activeTab = tab.dataset.tab;
            });
        });
    }

    // ─── Populate all text from slang.js ───
    function populateSlangText() {
        setText("hero-headline", slang("heroHeadline"));
        setText("hero-subtext", slang("heroSubtext"));
        setText("upload-headline", slang("uploadHeadline"));
        setText("upload-subtext", slang("uploadSubtext"));
        setText("feature-frames-title", slang("featureFramesTitle"));
        setText("feature-frames-desc", slang("featureFramesDesc"));
        setText("feature-backgrounds-title", slang("featureBackgroundsTitle"));
        setText("feature-backgrounds-desc", slang("featureBackgroundsDesc"));
        setText("feature-text-title", slang("featureTextTitle"));
        setText("feature-text-desc", slang("featureTextDesc"));
        setText("footer-tagline", slang("footerTagline"));
        setText("sidebar-title", slang("sidebarTitle"));
        setText("section-templates", slang("templateSection"));
        setText("section-backgrounds", slang("backgroundSection"));
        setText("section-text", slang("textSection"));
        setText("section-export", slang("exportSection"));

        // Button text
        var btnDownload = document.getElementById("btn-download");
        if (btnDownload) btnDownload.innerHTML = "<span>\u2B07\uFE0F</span> " + slang("downloadButton");
        var btnCopy = document.getElementById("btn-copy");
        if (btnCopy) btnCopy.innerHTML = "<span>\uD83D\uDCCB</span> " + slang("copyButton");
        var btnReplace = document.getElementById("btn-replace");
        if (btnReplace) btnReplace.textContent = slang("replaceImage");
    }

    function setText(id, text) {
        var el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    // ─── Template Grid ───
    function initTemplateGrid(state, onStateChange) {
        var grid = document.getElementById("template-grid");
        if (!grid) return;
        grid.innerHTML = "";

        window.TEMPLATE_LIST.forEach(function (templateId) {
            var tmpl = window.TEMPLATES[templateId];
            var btn = document.createElement("button");
            btn.className = "template-thumb" + (state.activeTemplate === templateId ? " active" : "");
            btn.dataset.template = templateId;
            btn.innerHTML =
                '<div class="template-preview">' + tmpl.icon + "</div>" +
                '<div>' + slangNamed("templateNames", templateId) + "</div>";

            btn.addEventListener("click", function () {
                state.activeTemplate = templateId;
                state.isDirty = true;
                onStateChange();
                // Update active class
                grid.querySelectorAll(".template-thumb").forEach(function (el) {
                    el.classList.toggle("active", el.dataset.template === templateId);
                });
            });

            grid.appendChild(btn);
        });
    }

    // ─── Gradient Grid ───
    function initGradientGrid(state, onStateChange) {
        var grid = document.getElementById("gradient-grid");
        if (!grid) return;
        grid.innerHTML = "";

        window.CanvasEngine.GRADIENTS.forEach(function (gradient) {
            var swatch = document.createElement("button");
            swatch.className = "gradient-swatch" + (state.background.type === "gradient" && state.background.value === gradient.id ? " active" : "");
            swatch.dataset.gradient = gradient.id;
            swatch.style.background = "linear-gradient(135deg, " + gradient.colors.join(", ") + ")";

            var label = document.createElement("span");
            label.className = "swatch-name";
            label.textContent = slangNamed("gradientNames", gradient.id);
            swatch.appendChild(label);

            swatch.addEventListener("click", function () {
                state.background.type = "gradient";
                state.background.value = gradient.id;
                state.isDirty = true;
                onStateChange();
                updateActiveGradient(grid, gradient.id);
            });

            grid.appendChild(swatch);
        });
    }

    function updateActiveGradient(grid, activeId) {
        grid.querySelectorAll(".gradient-swatch").forEach(function (el) {
            el.classList.toggle("active", el.dataset.gradient === activeId);
        });
    }

    // ─── Color Picker ───
    function initColorPicker(state, onStateChange) {
        var picker = document.getElementById("bg-color-picker");
        if (!picker) return;

        picker.addEventListener("input", function () {
            state.background.type = "solid";
            state.background.value = picker.value;
            state.isDirty = true;
            onStateChange();
            // Deselect gradient swatches
            var grid = document.getElementById("gradient-grid");
            if (grid) {
                grid.querySelectorAll(".gradient-swatch").forEach(function (el) {
                    el.classList.remove("active");
                });
            }
        });
    }

    // ─── Text Controls ───
    function initTextControls(state, onStateChange) {
        var textInput = document.getElementById("text-input");
        var textPosition = document.getElementById("text-position");
        var textSize = document.getElementById("text-size");

        var debounceTimer;

        if (textInput) {
            textInput.addEventListener("input", function () {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(function () {
                    state.textOverlay.text = textInput.value;
                    state.textOverlay.enabled = textInput.value.length > 0;
                    state.isDirty = true;
                    onStateChange();
                }, 100);
            });
        }

        if (textPosition) {
            textPosition.addEventListener("change", function () {
                state.textOverlay.position = textPosition.value;
                state.isDirty = true;
                onStateChange();
            });
        }

        if (textSize) {
            textSize.addEventListener("input", function () {
                state.textOverlay.fontSize = parseInt(textSize.value, 10);
                state.isDirty = true;
                onStateChange();
            });
        }
    }

    // ─── Phrase Chips ───
    function initPhraseChips(state, onStateChange) {
        var container = document.getElementById("phrase-chips");
        var textInput = document.getElementById("text-input");
        if (!container || !textInput) return;

        var phrases = SLANG.suggestedPhrases || [];
        container.innerHTML = "";

        phrases.forEach(function (phrase) {
            var chip = document.createElement("button");
            chip.className = "phrase-chip";
            chip.textContent = phrase;
            chip.addEventListener("click", function () {
                textInput.value = phrase;
                state.textOverlay.text = phrase;
                state.textOverlay.enabled = true;
                state.isDirty = true;
                onStateChange();
            });
            container.appendChild(chip);
        });
    }

    window.initControls = initControls;
})();
