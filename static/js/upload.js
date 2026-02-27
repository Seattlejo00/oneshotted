// upload.js — handles drag-drop, clipboard paste, and file picker

(function () {
    "use strict";

    const VALID_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB

    function initUpload(zone, fileInput, onImageLoaded) {
        if (!zone) return;

        // ── Drag & Drop ──
        ["dragenter", "dragover"].forEach(function (evt) {
            zone.addEventListener(evt, function (e) {
                e.preventDefault();
                e.stopPropagation();
                zone.classList.add("drag-over");
                var headline = zone.querySelector(".upload-headline");
                if (headline) headline.textContent = slang("uploadDragOver");
            });
        });

        ["dragleave", "drop"].forEach(function (evt) {
            zone.addEventListener(evt, function (e) {
                e.preventDefault();
                e.stopPropagation();
                zone.classList.remove("drag-over");
                var headline = zone.querySelector(".upload-headline");
                if (headline) headline.textContent = slang("uploadHeadline");
            });
        });

        zone.addEventListener("drop", function (e) {
            var file = e.dataTransfer.files[0];
            if (file) processFile(file, onImageLoaded);
        });

        // ── Click to open file picker ──
        zone.addEventListener("click", function () {
            fileInput.click();
        });

        fileInput.addEventListener("change", function (e) {
            var file = e.target.files[0];
            if (file) processFile(file, onImageLoaded);
            fileInput.value = ""; // reset so same file can be re-selected
        });

        // ── Clipboard paste (global) ──
        document.addEventListener("paste", function (e) {
            var items = e.clipboardData && e.clipboardData.items;
            if (!items) return;
            for (var i = 0; i < items.length; i++) {
                if (items[i].type.indexOf("image/") === 0) {
                    var file = items[i].getAsFile();
                    if (file) processFile(file, onImageLoaded);
                    break;
                }
            }
        });
    }

    function processFile(file, callback) {
        // Validate type
        if (VALID_TYPES.indexOf(file.type) === -1) {
            showToast(slang("errorWrongType"), "error");
            return;
        }

        // Validate size
        if (file.size > MAX_SIZE) {
            showToast(slang("errorTooLarge"), "error");
            return;
        }

        showToast(slang("loading"), "loading");

        var reader = new FileReader();
        reader.onload = function (e) {
            var img = new Image();
            img.onload = function () {
                callback(img);
                showToast(slang("uploadSuccess"), "success");
            };
            img.onerror = function () {
                showToast(slang("errorReadFail"), "error");
            };
            img.src = e.target.result;
        };
        reader.onerror = function () {
            showToast(slang("errorReadFail"), "error");
        };
        reader.readAsDataURL(file);
    }

    function showToast(message, type, duration) {
        duration = duration || 3000;
        var container = document.getElementById("toast-container");
        if (!container) return;

        var toast = document.createElement("div");
        toast.className = "toast toast-" + type;
        toast.textContent = message;
        container.appendChild(toast);

        // Trigger animation on next frame
        requestAnimationFrame(function () {
            toast.classList.add("visible");
        });

        setTimeout(function () {
            toast.classList.remove("visible");
            toast.addEventListener("transitionend", function () {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            });
            // Fallback removal
            setTimeout(function () {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 500);
        }, duration);
    }

    // Expose globally
    window.initUpload = initUpload;
    window.showToast = showToast;
})();
