// templates.js — Frame/template definitions
// To add a new template: add a new key to TEMPLATES with padding, chromeHeight, and a draw() function.

(function () {
    "use strict";

    var roundRect = window.CanvasEngine.roundRect;

    var TEMPLATES = {
        // ─── Clean: rounded corners + drop shadow ───
        clean: {
            id: "clean",
            icon: "✨",
            padding: 60,
            chromeHeight: 0,
            borderRadius: 12,
            shadow: true,

            draw: function (ctx, W, H, img, bounds) {
                // Drop shadow
                ctx.save();
                ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
                ctx.shadowBlur = 40;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 10;

                // Draw a filled rounded rect to cast the shadow
                roundRect(ctx, bounds.x, bounds.y, bounds.w, bounds.h, 12);
                ctx.fillStyle = "#ffffff";
                ctx.fill();
                ctx.restore();

                // Clip to rounded rect and draw image
                ctx.save();
                roundRect(ctx, bounds.x, bounds.y, bounds.w, bounds.h, 12);
                ctx.clip();
                ctx.drawImage(img, bounds.x, bounds.y, bounds.w, bounds.h);
                ctx.restore();
            },
        },

        // ─── Browser: window mockup with traffic lights ───
        browser: {
            id: "browser",
            icon: "🌐",
            padding: 60,
            chromeHeight: 44,
            borderRadius: 10,
            shadow: true,

            draw: function (ctx, W, H, img, bounds) {
                var chromeH = 44;
                var radius = 10;
                var frameX = bounds.x;
                var frameY = bounds.y - chromeH;
                var frameW = bounds.w;
                var frameH = bounds.h + chromeH;

                // Shadow
                ctx.save();
                ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
                ctx.shadowBlur = 40;
                ctx.shadowOffsetY = 10;
                roundRect(ctx, frameX, frameY, frameW, frameH, radius);
                ctx.fillStyle = "#1a1a2e";
                ctx.fill();
                ctx.restore();

                // Browser chrome background
                ctx.save();
                roundRect(ctx, frameX, frameY, frameW, frameH, radius);
                ctx.clip();

                // Title bar
                ctx.fillStyle = "#1a1a2e";
                ctx.fillRect(frameX, frameY, frameW, chromeH);

                // Traffic light dots
                var dotY = frameY + chromeH / 2;
                var dotColors = ["#ff5f57", "#ffbd2e", "#28c840"];
                for (var i = 0; i < dotColors.length; i++) {
                    ctx.beginPath();
                    ctx.arc(frameX + 20 + i * 20, dotY, 6, 0, Math.PI * 2);
                    ctx.fillStyle = dotColors[i];
                    ctx.fill();
                }

                // URL bar
                var barX = frameX + 80;
                var barW = frameW - 160;
                var barH = 24;
                var barY = dotY - barH / 2;
                roundRect(ctx, barX, barY, Math.max(barW, 60), barH, 6);
                ctx.fillStyle = "#2d2d44";
                ctx.fill();

                // URL text
                ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
                ctx.font = '12px "Space Grotesk", sans-serif';
                ctx.textAlign = "left";
                ctx.fillText("oneshotted.app/slay", barX + 10, barY + 16);

                // Separator line
                ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
                ctx.fillRect(frameX, frameY + chromeH - 1, frameW, 1);

                // Screenshot
                ctx.drawImage(img, bounds.x, bounds.y, bounds.w, bounds.h);

                ctx.restore();
            },
        },
    };

    // Template list (for UI ordering)
    var TEMPLATE_LIST = ["clean", "browser"];

    window.TEMPLATES = TEMPLATES;
    window.TEMPLATE_LIST = TEMPLATE_LIST;
})();
