// export.js — PNG download + clipboard copy

(function () {
    "use strict";

    var MAX_EXPORT_DIM = 4096;

    function initExport(state) {
        var btnDownload = document.getElementById("btn-download");
        var btnCopy = document.getElementById("btn-copy");

        if (btnDownload) {
            btnDownload.addEventListener("click", function () {
                if (!state.image) {
                    showToast(slang("errorReadFail"), "error");
                    return;
                }
                downloadPNG(state);
            });
        }

        if (btnCopy) {
            btnCopy.addEventListener("click", function () {
                if (!state.image) {
                    showToast(slang("errorReadFail"), "error");
                    return;
                }
                copyToClipboard(state);
            });
        }
    }

    function renderToExportCanvas(state) {
        var exportCanvas = document.getElementById("export-canvas");
        if (!exportCanvas) return null;

        var template = window.TEMPLATES ? window.TEMPLATES[state.activeTemplate] : null;
        if (!template) template = { padding: 60, chromeHeight: 0 };

        var imgW = state.image.naturalWidth || state.image.width;
        var imgH = state.image.naturalHeight || state.image.height;
        var padding = template.padding || 60;
        var chromeH = template.chromeHeight || 0;

        // Calculate export size (with retina scale, capped)
        var baseW = imgW + padding * 2;
        var baseH = imgH + padding * 2 + chromeH;
        var scale = Math.min(state.exportScale || 2, MAX_EXPORT_DIM / Math.max(baseW, baseH));

        exportCanvas.width = Math.round(baseW * scale);
        exportCanvas.height = Math.round(baseH * scale);

        var ctx = exportCanvas.getContext("2d");
        ctx.scale(scale, scale);

        window.CanvasEngine.render(ctx, baseW, baseH, state);

        return exportCanvas;
    }

    function downloadPNG(state) {
        var canvas = renderToExportCanvas(state);
        if (!canvas) return;

        canvas.toBlob(function (blob) {
            if (!blob) {
                showToast(slang("errorReadFail"), "error");
                return;
            }
            var url = URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.href = url;
            a.download = "oneshotted-" + Date.now() + ".png";
            a.click();
            URL.revokeObjectURL(url);

            showToast(slang("downloadSuccess"), "success");
        }, "image/png");
    }

    function copyToClipboard(state) {
        var canvas = renderToExportCanvas(state);
        if (!canvas) return;

        canvas.toBlob(function (blob) {
            if (!blob) {
                showToast(slang("errorReadFail"), "error");
                return;
            }

            if (!navigator.clipboard || !navigator.clipboard.write) {
                showToast(slang("copyFail"), "error");
                return;
            }

            navigator.clipboard.write([
                new ClipboardItem({ "image/png": blob })
            ]).then(function () {
                showToast(slang("copySuccess"), "success");
            }).catch(function () {
                showToast(slang("copyFail"), "error");
            });
        }, "image/png");
    }

    window.initExport = initExport;
})();
