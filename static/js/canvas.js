// canvas.js — Canvas rendering engine with layer compositing

(function () {
    "use strict";

    // ─── Gradient Presets ───
    var GRADIENTS = [
        { id: "sunset-slay", colors: ["#f97316", "#ec4899", "#8b5cf6"] },
        { id: "ocean-main-character", colors: ["#06b6d4", "#3b82f6", "#8b5cf6"] },
        { id: "purple-reign", colors: ["#7c3aed", "#a855f7", "#c084fc"] },
        { id: "toxic-affectionate", colors: ["#22c55e", "#84cc16", "#eab308"] },
        { id: "midnight-thoughts", colors: ["#1e1b4b", "#312e81", "#4338ca"] },
        { id: "y2k-dreamcore", colors: ["#f472b6", "#c084fc", "#67e8f9"] },
    ];

    // ─── Utility: rounded rect path ───
    function roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    // ─── Calculate screenshot placement within canvas ───
    function calculateBounds(canvasW, canvasH, imgW, imgH, template) {
        var padding = template.padding || 60;
        var extraTop = template.chromeHeight || 0;

        var availW = canvasW - padding * 2;
        var availH = canvasH - padding * 2 - extraTop;

        var scale = Math.min(availW / imgW, availH / imgH);
        var w = imgW * scale;
        var h = imgH * scale;

        var x = (canvasW - w) / 2;
        var y = padding + extraTop + (availH - h) / 2;

        return { x: x, y: y, w: w, h: h };
    }

    // ─── Calculate canvas dimensions based on image aspect ratio ───
    function calculateCanvasSize(containerW, containerH, imgW, imgH, template) {
        var padding = template.padding || 60;
        var chromeH = template.chromeHeight || 0;
        // Total content size including padding/chrome
        var totalW = imgW + padding * 2;
        var totalH = imgH + padding * 2 + chromeH;
        // Scale to fit container
        var scale = Math.min(containerW / totalW, containerH / totalH, 1);
        return {
            w: Math.round(totalW * scale),
            h: Math.round(totalH * scale),
        };
    }

    // ─── Draw background ───
    function drawBackground(ctx, W, H, bg) {
        if (bg.type === "gradient") {
            var preset = null;
            for (var i = 0; i < GRADIENTS.length; i++) {
                if (GRADIENTS[i].id === bg.value) {
                    preset = GRADIENTS[i];
                    break;
                }
            }
            if (preset) {
                var grad = ctx.createLinearGradient(0, 0, W, H);
                for (var j = 0; j < preset.colors.length; j++) {
                    grad.addColorStop(j / (preset.colors.length - 1), preset.colors[j]);
                }
                ctx.fillStyle = grad;
            } else {
                ctx.fillStyle = "#7c3aed";
            }
        } else {
            ctx.fillStyle = bg.value || "#7c3aed";
        }
        ctx.fillRect(0, 0, W, H);
    }

    // ─── Draw text overlay ───
    function drawTextOverlay(ctx, W, H, textState) {
        if (!textState.enabled || !textState.text) return;

        var fontSize = textState.fontSize || 28;
        ctx.save();
        ctx.font = "bold " + fontSize + "px 'Space Grotesk', sans-serif";
        ctx.textAlign = "center";

        var textW = ctx.measureText(textState.text).width;
        var padX = 16;
        var padY = 8;
        var y;

        if (textState.position === "top") {
            y = fontSize + 20;
        } else if (textState.position === "center") {
            y = H / 2 + fontSize / 3;
        } else {
            y = H - 24;
        }

        // Backdrop
        ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
        roundRect(ctx, W / 2 - textW / 2 - padX, y - fontSize - padY + 4, textW + padX * 2, fontSize + padY * 2, 8);
        ctx.fill();

        // Text
        ctx.fillStyle = textState.color || "#ffffff";
        ctx.fillText(textState.text, W / 2, y);
        ctx.restore();
    }

    // ─── Draw watermark ───
    function drawWatermark(ctx, W, H) {
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = "#ffffff";
        ctx.font = '12px "Space Grotesk", sans-serif';
        ctx.textAlign = "right";
        ctx.fillText("oneshotted", W - 12, H - 10);
        ctx.restore();
    }

    // ─── Main render function ───
    function render(ctx, W, H, state) {
        var template = window.TEMPLATES
            ? window.TEMPLATES[state.activeTemplate]
            : null;
        if (!template) template = { padding: 60, borderRadius: 12, shadow: true };

        // 1. Clear
        ctx.clearRect(0, 0, W, H);

        // 2. Background
        drawBackground(ctx, W, H, state.background);

        if (!state.image) return;

        // 3. Calculate bounds
        var bounds = calculateBounds(W, H, state.image.naturalWidth || state.image.width, state.image.naturalHeight || state.image.height, template);

        // 4. Frame back layer + image + frame front layer (delegated to template)
        ctx.save();
        if (template.draw) {
            template.draw(ctx, W, H, state.image, bounds);
        } else {
            // Fallback: just draw image
            ctx.drawImage(state.image, bounds.x, bounds.y, bounds.w, bounds.h);
        }
        ctx.restore();

        // 5. Text overlay
        drawTextOverlay(ctx, W, H, state.textOverlay);

        // 6. Watermark
        if (state.watermark) {
            drawWatermark(ctx, W, H);
        }
    }

    // Expose
    window.CanvasEngine = {
        render: render,
        calculateBounds: calculateBounds,
        calculateCanvasSize: calculateCanvasSize,
        GRADIENTS: GRADIENTS,
        roundRect: roundRect,
    };
})();
