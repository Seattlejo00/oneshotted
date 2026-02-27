// slang.js — edit this file to update all brainrot text across the app
// Each key maps to an array of options. The app randomly picks one each time.
// To add new text: just add more strings to any array.
// To remove text: delete strings you don't want.
// To add a new text slot: add a new key with an array of options.

const SLANG = {
    // ─── Upload zone ───
    uploadHeadline: [
        "drop the receipts bestie",
        "load that screenshot",
        "feed us the content",
        "screenshot or it didn't happen",
    ],
    uploadSubtext: [
        "drag & drop, paste (ctrl+v), or click to upload",
    ],
    uploadDragOver: [
        "let it go bestie",
        "drop it like it's hot",
        "release the content",
        "yes bestie, right here",
    ],

    // ─── Loading / processing ───
    loading: [
        "cooking...",
        "looksmaxxing your screenshot rn",
        "it's giving... processing",
        "hold on we're glazing this",
        "screenshot glow up loading...",
    ],

    // ─── Success ───
    uploadSuccess: [
        "screenshot loaded — time for the glow up",
        "content acquired, let's cook",
        "we're so back",
        "screenshot secured, now let's make it go hard",
    ],

    // ─── Errors ───
    errorWrongType: [
        "that's not it bestie — images only (PNG, JPG, WEBP, GIF)",
        "sir this is not an image",
        "we need pixels not whatever that was",
    ],
    errorTooLarge: [
        "too thicc fr — keep it under 10MB",
        "that file is unhinged in size bestie",
        "nah that's way too large, 10MB max",
    ],
    errorReadFail: [
        "we fumbled fr — try again",
        "skill issue on our end — try again",
        "L + couldn't read that + try again",
    ],

    // ─── Export ───
    downloadButton: [
        "yoink (download PNG)",
    ],
    downloadSuccess: [
        "yoink — secured the bag",
        "screenshot acquired, go share that",
        "downloaded fr fr",
    ],
    copyButton: [
        "copy to clipboard",
    ],
    copySuccess: [
        "copied — go paste that flex",
        "ctrl+v era begins now",
        "clipboard loaded, go off",
    ],
    copyFail: [
        "clipboard said no bestie — try downloading instead",
        "copy failed, L + just download it",
    ],

    // ─── Editor sidebar sections ───
    sidebarTitle: [
        "the glow up station",
        "screenshot looksmaxxing lab",
        "the screenshot spa",
    ],
    templateSection: [
        "pick your fighter",
        "choose your aesthetic",
        "frame check",
    ],
    backgroundSection: [
        "set the vibe",
        "background check",
        "vibe selection",
    ],
    textSection: [
        "say something bestie",
        "drop your lore",
        "add your caption era",
    ],
    exportSection: [
        "secure the bag",
        "finalize the content",
        "yoink zone",
    ],

    // ─── Text overlay suggested phrases (shown as clickable chips) ───
    suggestedPhrases: [
        "it's giving...",
        "no thoughts, head empty",
        "understood the assignment",
        "ratio",
        "skill issue",
        "rent free",
        "main character behavior",
        "lowkey iconic",
        "highkey unhinged",
        "slay",
        "caught in 4k",
        "no cap",
        "this is the way",
        "living my best life",
        "ate and left no crumbs",
        "bruh",
        "its giving what it needs to give",
        "not me screenshotting this",
    ],

    // ─── Landing page ───
    heroHeadline: [
        "your screenshots are mid",
        "screenshots need glow ups too",
        "your screenshots called, they want a glow up",
    ],
    heroSubtext: [
        "looksmaxx your screenshots with frames, effects, and certified vibes.",
        "turn mid screenshots into certified content.",
    ],
    heroCTA: [
        "drop the receipts",
        "start the glow up",
        "let's cook",
    ],
    featureFramesTitle: [
        "frames that go hard",
    ],
    featureFramesDesc: [
        "device mockups, clean frames, and more — pick your fighter",
    ],
    featureBackgroundsTitle: [
        "backgrounds that slap",
    ],
    featureBackgroundsDesc: [
        "gradients so clean they should be illegal",
    ],
    featureTextTitle: [
        "text overlay era",
    ],
    featureTextDesc: [
        "add captions with pre-loaded brainrot or write your own lore",
    ],

    // ─── Misc ───
    replaceImage: [
        "swap the screenshot",
        "new content just dropped",
        "load different receipts",
    ],
    footerTagline: [
        "made with unhinged energy",
        "built different",
        "no screenshots were harmed in the making of this site (they were improved)",
    ],
    watermarkText: [
        "oneshotted",
    ],

    // ─── Gradient preset names ───
    gradientNames: {
        "sunset-slay": "sunset slay",
        "ocean-main-character": "ocean main character",
        "purple-reign": "purple reign",
        "toxic-affectionate": "toxic (affectionate)",
        "midnight-thoughts": "midnight thoughts",
        "y2k-dreamcore": "y2k dreamcore",
    },

    // ─── Template names ───
    templateNames: {
        "clean": "no cap, just clean",
        "browser": "browser arc energy",
    },
    templateDescriptions: {
        "clean": "minimal and classy. understated slay.",
        "browser": "your screenshot in a browser window. very tech bro core.",
    },
};

// Helper: pick a random option from a slang array
function slang(key) {
    const options = SLANG[key];
    if (!options || !Array.isArray(options) || options.length === 0) return key;
    return options[Math.floor(Math.random() * options.length)];
}

// Helper: get a specific named value (for gradientNames, templateNames, etc.)
function slangNamed(key, name) {
    const map = SLANG[key];
    if (!map || typeof map !== "object") return name;
    return map[name] || name;
}

// Make available globally (no module bundler)
window.SLANG = SLANG;
window.slang = slang;
window.slangNamed = slangNamed;
