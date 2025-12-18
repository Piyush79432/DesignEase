// js/assets.js

const FONTS = [
    "Roboto", "Open Sans", "Lato", "Montserrat", "Oswald", "Raleway", "Merriweather", "Playfair Display", "Nunito", "Poppins", 
    "Rubik", "Anton", "Bebas Neue", "Dancing Script", "Pacifico", "Abril Fatface", "Cinzel", "Shadows Into Light", "Indie Flower", 
    "Lobster", "Comfortaa", "Righteous", "Fredoka One", "Archivo Black", "Bangers", "Creepster", "Permanent Marker", "Satisfy", 
    "Amatic SC", "Courgette", "Great Vibes", "Sacramento", "Orbitron", "Exo 2", "Titillium Web", "Work Sans", "Fira Sans"
];

const SHAPES = [
    { name: "Rect", type: "rect" },
    { name: "Circle", type: "circle" },
    { name: "Triangle", type: "triangle" },
    { name: "Star", type: "path", path: "M 25 0 L 31 18 L 50 18 L 35 29 L 40 48 L 25 38 L 10 48 L 15 29 L 0 18 L 19 18 Z" },
    { name: "Heart", type: "path", path: "M 25 45 C 25 45 5 25 5 12 A 10 10 0 0 1 25 12 A 10 10 0 0 1 45 12 C 45 25 25 45 25 45 Z" },
    { name: "Arrow", type: "path", path: "M 10 20 L 35 20 L 35 10 L 50 25 L 35 40 L 35 30 L 10 30 Z" },
    { name: "Cloud", type: "path", path: "M 15 25 Q 15 15 25 15 Q 30 5 40 15 Q 50 15 50 25 Q 55 25 55 35 Q 55 45 45 45 L 15 45 Q 5 45 5 35 Q 5 25 15 25" },
    { name: "Badge", type: "poly", path: "M 10 0 L 40 0 L 50 25 L 40 50 L 10 50 L 0 25 Z" }
];

// CRITICAL: Hardcoded Unicodes for Fabric.js to render icons as text
const ICONS = [
    { name: "Star", code: "\uf005" }, { name: "Heart", code: "\uf004" }, { name: "User", code: "\uf007" },
    { name: "Home", code: "\uf015" }, { name: "Check", code: "\uf00c" }, { name: "Image", code: "\uf03e" },
    { name: "Phone", code: "\uf095" }, { name: "Twitter", code: "\uf099" }, { name: "Instagram", code: "\uf16d" },
    { name: "Facebook", code: "\uf09a" }, { name: "YouTube", code: "\uf167" }, { name: "LinkedIn", code: "\uf08c" },
    { name: "Envelope", code: "\uf0e0" }, { name: "Globe", code: "\uf0ac" }, { name: "Search", code: "\uf002" },
    { name: "Bell", code: "\uf0f3" }, { name: "Cart", code: "\uf07a" }, { name: "Calendar", code: "\uf133" },
    { name: "Camera", code: "\uf030" }, { name: "Music", code: "\uf001" }, { name: "Map", code: "\uf279" },
    { name: "Bolt", code: "\uf0e7" }, { name: "Car", code: "\uf1b9" }, { name: "Ghost", code: "\uf6e2" },
    { name: "Gift", code: "\uf06b" }, { name: "Coffee", code: "\uf0f4" }, { name: "Paw", code: "\uf1b0" },
    { name: "Rocket", code: "\uf135" }, { name: "Smile", code: "\uf118" }, { name: "Sun", code: "\uf185" }
];

// Unsplash Image IDs
const IMAGES = {
    nature: ["1470071459604-3b5ec3a7fe05", "1441974231531-c6227db76b6e", "1472214103451-9374bd1c798e"],
    business: ["1497366216548-37526070297c", "1556761175-5973dc0f32e7", "1542744173-8e7e53415bb0"],
    tech: ["1518770660439-4636190af475", "1519389950473-47ba0277781c", "1531297461368-8f0482e530c8"]
};