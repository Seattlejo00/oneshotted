// app.js — Main orchestrator: state, render loop, event wiring

(function () {
    "use strict";

    // ─── Application State ───
    var AppState = {
        image: null,
        activeTemplate: "clean",
        background: {
            type: "gradient",
            value: "sunset-slay",
        },
        textOverlay: {
            enabled: false,
            text: "",
            position: "bottom",
            fontSize: 28,
            color: "#ffffff",
        },
        watermark: true,
        exportScale: 2,
        isDirty: true,
    };

    // ─── DOM refs ───
    var landingView;
    var editorView;
    var previewCanvas;
    var previewCtx;
    var canvasArea;

    // ─── Init ───
    document.addEventListener("DOMContentLoaded", function () {
        landingView = document.getElementById("landing-view");
        editorView = document.getElementById("editor-view");
        previewCanvas = document.getElementById("preview-canvas");
        canvasArea = document.querySelector(".canvas-area");

        if (previewCanvas) {
            previewCtx = previewCanvas.getContext("2d");
        }

        // Init upload (landing zone)
        var uploadZone = document.getElementById("landing-upload-zone");
        var fileInput = document.getElementById("file-input");
        if (uploadZone && fileInput) {
            initUpload(uploadZone, fileInput, onImageLoaded);
        }

        // Init controls
        initControls(AppState, onStateChange);

        // Init export
        initExport(AppState);

        // Replace image button
        var btnReplace = document.getElementById("btn-replace");
        if (btnReplace) {
            btnReplace.addEventListener("click", function () {
                fileInput.click();
            });
        }

        // Start render loop
        requestAnimationFrame(renderLoop);

        // Handle window resize
        window.addEventListener("resize", function () {
            if (AppState.image) {
                sizeCanvas();
            }
        });

        // Handle mobile orientation change
        window.addEventListener("orientationchange", function () {
            setTimeout(function () {
                if (AppState.image) {
                    sizeCanvas();
                }
            }, 200);
        });
    });

    // ─── Image loaded callback ───
    function onImageLoaded(img) {
        AppState.image = img;
        AppState.isDirty = true;
        showEditor();
        sizeCanvas();
    }

    // ─── View switching ───
    function showEditor() {
        if (landingView) landingView.classList.remove("active");
        if (editorView) editorView.classList.add("active");
        // Resize canvas after view switch
        setTimeout(function () {
            sizeCanvas();
        }, 50);
    }

    function showLanding() {
        if (editorView) editorView.classList.remove("active");
        if (landingView) landingView.classList.add("active");
    }

    // ─── Size canvas to fit container ───
    function sizeCanvas() {
        if (!canvasArea || !previewCanvas || !AppState.image) return;

        var style = getComputedStyle(canvasArea);
        var padX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
        var padY = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
        var containerW = canvasArea.clientWidth - padX;
        var containerH = canvasArea.clientHeight - padY;

        var template = window.TEMPLATES ? window.TEMPLATES[AppState.activeTemplate] : null;
        if (!template) template = { padding: 60, chromeHeight: 0 };

        var imgW = AppState.image.naturalWidth || AppState.image.width;
        var imgH = AppState.image.naturalHeight || AppState.image.height;

        var size = window.CanvasEngine.calculateCanvasSize(containerW, containerH, imgW, imgH, template);

        // Set display size
        previewCanvas.style.width = size.w + "px";
        previewCanvas.style.height = size.h + "px";

        // Set actual pixel size (2x for sharpness)
        var dpr = window.devicePixelRatio || 1;
        previewCanvas.width = Math.round(size.w * dpr);
        previewCanvas.height = Math.round(size.h * dpr);

        previewCtx = previewCanvas.getContext("2d");
        previewCtx.scale(dpr, dpr);

        AppState.isDirty = true;
    }

    // ─── State change callback ───
    function onStateChange() {
        sizeCanvas(); // Re-size in case template changed padding/chrome
    }

    // ─── Render loop ───
    function renderLoop() {
        if (AppState.isDirty && AppState.image && previewCtx) {
            AppState.isDirty = false;
            var displayW = parseInt(previewCanvas.style.width, 10) || previewCanvas.width;
            var displayH = parseInt(previewCanvas.style.height, 10) || previewCanvas.height;
            window.CanvasEngine.render(previewCtx, displayW, displayH, AppState);
        }
        requestAnimationFrame(renderLoop);
    }

    // Expose for direct-link editor mode
    window.AppController = {
        showEditor: showEditor,
        showLanding: showLanding,
        state: AppState,
    };
})();
