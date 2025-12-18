/* DesignEase Pro Editor Logic
    Architecture:
    - app.config: Data & Constants
    - app.canvas: Fabric.js wrapper & manipulation
    - app.ui: DOM manipulation
    - app.history: Undo/Redo stack
    - app.api: Mock external APIs (Unsplash/Templates)
    - app.io: Export/Import logic
*/

const app = {
    init: function() {
        this.canvas.init();
        this.ui.init();
        this.api.init();
        console.log("DesignEase Editor Initialized");
    }
};

// --- 1. CONFIGURATION & DATA ---
app.config = {
    canvasWidth: 800,
    canvasHeight: 600,
    fonts: [
        'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 
        'Playfair Display', 'Merriweather', 'Oswald', 'Raleway', 
        'Pacifico', 'Dancing Script'
    ],
    icons: [
        { code: '\uf004', name: 'Heart' }, { code: '\uf005', name: 'Star' },
        { code: '\uf007', name: 'User' }, { code: '\uf015', name: 'Home' },
        { code: '\uf03e', name: 'Image' }, { code: '\uf013', name: 'Settings' },
        { code: '\uf095', name: 'Phone' }, { code: '\uf0e0', name: 'Mail' },
        { code: '\uf099', name: 'Twitter' }, { code: '\uf16d', name: 'Instagram' },
        { code: '\uf082', name: 'Facebook' }, { code: '\uf09a', name: 'Facebook F' },
        { code: '\uf08c', name: 'LinkedIn' }, { code: '\uf167', name: 'YouTube' },
        { code: '\uf2b9', name: 'Address Book' }, { code: '\uf073', name: 'Calendar' }
    ]
};

// --- 2. CANVAS ENGINE (Fabric.js) ---
app.canvas = {
    instance: null,
    zoom: 1,

    init: function() {
        this.instance = new fabric.Canvas('c', {
            width: app.config.canvasWidth,
            height: app.config.canvasHeight,
            backgroundColor: '#ffffff',
            preserveObjectStacking: true, // Selected object doesn't jump to top
            selection: true
        });

        // Event Listeners
        this.instance.on('selection:created', this.onSelectionCreated.bind(this));
        this.instance.on('selection:updated', this.onSelectionUpdated.bind(this));
        this.instance.on('selection:cleared', this.onSelectionCleared.bind(this));
        this.instance.on('object:modified', () => app.history.save());
        this.instance.on('object:added', () => { app.ui.updateLayers(); });
        this.instance.on('object:removed', () => { app.ui.updateLayers(); });

        // Initial History Save
        app.history.save();
    },

    // --- ADDING OBJECTS ---
    addRect: function() {
        const rect = new fabric.Rect({
            left: 100, top: 100, fill: '#6366f1', width: 100, height: 100
        });
        this.addToCanvas(rect);
    },

    addCircle: function() {
        const circle = new fabric.Circle({
            left: 150, top: 150, fill: '#ef4444', radius: 50
        });
        this.addToCanvas(circle);
    },

    addTriangle: function() {
        const tri = new fabric.Triangle({
            left: 200, top: 200, fill: '#10b981', width: 100, height: 100
        });
        this.addToCanvas(tri);
    },
    
    addLine: function() {
        const line = new fabric.Line([50, 100, 200, 100], {
            left: 100, top: 100, stroke: '#0f172a', strokeWidth: 5
        });
        this.addToCanvas(line);
    },

    addStar: function() {
        // Custom path or simple logic. Fabric doesn't have native star, simulating via Polygon
        // Simplified star coordinates
        const star = new fabric.Polygon([
            {x: 350, y: 75}, {x: 379, y: 161}, {x: 469, y: 161}, {x: 397, y: 215},
            {x: 423, y: 301}, {x: 350, y: 250}, {x: 277, y: 301}, {x: 303, y: 215},
            {x: 231, y: 161}, {x: 321, y: 161}
        ], {
            left: 100, top: 100, fill: '#f59e0b', scaleX: 0.5, scaleY: 0.5
        });
        this.addToCanvas(star);
    },

    addHeading: function() {
        const text = new fabric.Textbox('Add a Heading', {
            left: 50, top: 50, width: 400, fontSize: 48, fontWeight: 'bold', fontFamily: 'Roboto', textAlign: 'center'
        });
        this.addToCanvas(text);
    },

    addBodyText: function() {
        const text = new fabric.Textbox('Lorem ipsum dolor sit amet, consectetur adipiscing elit.', {
            left: 50, top: 150, width: 400, fontSize: 18, fontFamily: 'Open Sans'
        });
        this.addToCanvas(text);
    },

    addIcon: function(unicode) {
        const icon = new fabric.Text(unicode, {
            fontFamily: 'Font Awesome 6 Free',
            fontWeight: 900,
            fontSize: 60,
            left: 200, top: 200,
            fill: '#334155'
        });
        this.addToCanvas(icon);
    },

    addImage: function(url) {
        fabric.Image.fromURL(url, (img) => {
            img.set({ left: 100, top: 100 });
            img.scaleToWidth(300); // Reasonable default size
            this.addToCanvas(img);
        }, { crossOrigin: 'anonymous' }); // Crucial for export
    },

    handleUpload: function(e) {
        const reader = new FileReader();
        reader.onload = (f) => {
            const imgObj = new Image();
            imgObj.src = f.target.result;
            imgObj.onload = () => {
                const img = new fabric.Image(imgObj);
                img.set({ left: 50, top: 50 });
                img.scaleToWidth(300);
                this.addToCanvas(img);
                
                // Add to Uploads Grid UI
                app.ui.addUploadThumbnail(f.target.result);
            };
        };
        reader.readAsDataURL(e.target.files[0]);
    },

    addToCanvas: function(obj) {
        this.instance.add(obj);
        this.instance.setActiveObject(obj);
        this.instance.renderAll();
        app.history.save();
    },

    // --- MANIPULATION ---
    updateActive: function(prop, value) {
        const obj = this.instance.getActiveObject();
        if(obj) {
            // Special handling for fonts to trigger WebFontLoader if needed
            if(prop === 'fontFamily') {
                WebFont.load({
                    google: { families: [value] },
                    active: () => {
                        obj.set(prop, value);
                        this.instance.requestRenderAll();
                    }
                });
            } else {
                obj.set(prop, value);
                this.instance.requestRenderAll();
            }
            app.history.save();
        }
    },

    toggleBold: function() {
        const obj = this.instance.getActiveObject();
        if(obj && obj.fontWeight) {
            obj.set('fontWeight', obj.fontWeight === 'bold' ? 'normal' : 'bold');
            this.instance.requestRenderAll();
        }
    },

    toggleItalic: function() {
        const obj = this.instance.getActiveObject();
        if(obj && obj.fontStyle) {
            obj.set('fontStyle', obj.fontStyle === 'italic' ? 'normal' : 'italic');
            this.instance.requestRenderAll();
        }
    },

    bringForward: function() {
        const obj = this.instance.getActiveObject();
        if(obj) { this.instance.bringForward(obj); app.ui.updateLayers(); }
    },
    
    sendBackward: function() {
        const obj = this.instance.getActiveObject();
        if(obj) { this.instance.sendBackwards(obj); app.ui.updateLayers(); }
    },

    deleteActive: function() {
        const obj = this.instance.getActiveObject();
        if(obj) {
            this.instance.remove(obj);
            this.instance.discardActiveObject();
            this.instance.requestRenderAll();
            app.history.save();
        }
    },

    // --- ZOOM ---
    zoomIn: function() {
        this.zoom = Math.min(this.zoom + 0.1, 3);
        this.applyZoom();
    },
    zoomOut: function() {
        this.zoom = Math.max(this.zoom - 0.1, 0.5);
        this.applyZoom();
    },
    applyZoom: function() {
        this.instance.setZoom(this.zoom);
        // Center zoom logic roughly
        this.instance.setWidth(app.config.canvasWidth * this.zoom);
        this.instance.setHeight(app.config.canvasHeight * this.zoom);
        document.getElementById('zoom-val').innerText = Math.round(this.zoom * 100) + '%';
    },

    // --- EVENTS ---
    onSelectionCreated: function(e) { app.ui.showProperties(e.selected[0]); },
    onSelectionUpdated: function(e) { app.ui.showProperties(e.selected[0]); },
    onSelectionCleared: function() { app.ui.hideProperties(); }
};

// --- 3. UI MANAGER ---
app.ui = {
    init: function() {
        this.renderFonts();
        this.renderIcons();
        this.populateFontSelect();
        
        // Keyboard Shortcuts
        document.addEventListener('keydown', (e) => {
            if(e.key === 'Delete') app.canvas.deleteActive();
            if((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); app.history.undo(); }
            if((e.ctrlKey || e.metaKey) && e.key === 'y') { e.preventDefault(); app.history.redo(); }
        });
    },

    switchPanel: function(panelId) {
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        
        document.getElementById(`panel-${panelId}`).classList.add('active');
        // Rough highlight logic
        const btn = Array.from(document.querySelectorAll('.nav-btn')).find(b => b.textContent.includes(panelId.charAt(0).toUpperCase() + panelId.slice(1)));
        if(btn) btn.classList.add('active');
    },

    showProperties: function(obj) {
        document.getElementById('default-props').style.display = 'none';
        document.getElementById('active-props').style.display = 'flex';
        
        // Update values in UI
        if(obj.fill && typeof obj.fill === 'string') document.getElementById('prop-fill').value = obj.fill;
        document.getElementById('prop-opacity').value = obj.opacity;
        
        // Text specific
        const textProps = document.getElementById('text-props');
        if(obj.type === 'textbox' || obj.type === 'text') {
            textProps.style.display = 'flex';
            document.getElementById('prop-font-size').value = obj.fontSize;
            document.getElementById('prop-font-family').value = obj.fontFamily;
        } else {
            textProps.style.display = 'none';
        }
    },

    hideProperties: function() {
        document.getElementById('default-props').style.display = 'block';
        document.getElementById('active-props').style.display = 'none';
    },

    renderFonts: function() {
        const container = document.getElementById('fonts-list');
        app.config.fonts.forEach(font => {
            const div = document.createElement('div');
            div.className = 'font-card';
            div.style.fontFamily = font;
            div.innerText = font;
            div.onclick = () => app.canvas.addText(font, 32, 'normal', font);
            // Actually change font of active text if selected
            div.addEventListener('click', () => {
                const active = app.canvas.instance.getActiveObject();
                if(active && (active.type === 'text' || active.type === 'textbox')) {
                    app.canvas.updateActive('fontFamily', font);
                }
            });
            container.appendChild(div);
        });
    },

    renderIcons: function() {
        const container = document.getElementById('icons-grid');
        app.config.icons.forEach(icon => {
            const btn = document.createElement('div');
            btn.className = 'shape-btn';
            btn.innerHTML = `<i class="fa-solid">${icon.code}</i>`;
            btn.onclick = () => app.canvas.addIcon(icon.code);
            container.appendChild(btn);
        });
    },

    populateFontSelect: function() {
        const select = document.getElementById('prop-font-family');
        app.config.fonts.forEach(font => {
            const opt = document.createElement('option');
            opt.value = font;
            opt.innerText = font;
            select.appendChild(opt);
        });
    },

    addUploadThumbnail: function(src) {
        const grid = document.getElementById('uploads-grid');
        const img = document.createElement('img');
        img.src = src;
        img.className = 'asset-card';
        img.style.height = '100px';
        img.onclick = () => {
             const i = new fabric.Image();
             i.setSrc(src, (o) => { o.scaleToWidth(300); app.canvas.addToCanvas(o); });
        };
        grid.prepend(img); // Add to top
    },

    updateLayers: function() {
        const list = document.getElementById('layers-list');
        list.innerHTML = '';
        const objects = app.canvas.instance.getObjects().slice().reverse(); // Top first
        
        objects.forEach((obj, index) => {
            const li = document.createElement('li');
            li.style.padding = '10px';
            li.style.borderBottom = '1px solid #eee';
            li.style.cursor = 'pointer';
            li.style.display = 'flex';
            li.style.justifyContent = 'space-between';
            
            let name = obj.type;
            if(obj.type === 'text' || obj.type === 'textbox') name = `Text: "${obj.text.substring(0, 10)}..."`;
            if(obj.type === 'image') name = 'Image';
            
            li.innerHTML = `<span>${name}</span> <i class="fa-solid fa-eye"></i>`;
            li.onclick = () => {
                app.canvas.instance.setActiveObject(obj);
                app.canvas.instance.renderAll();
            };
            list.appendChild(li);
        });
    }
};

// --- 4. HISTORY (Undo/Redo) ---
app.history = {
    state: [],
    mods: 0,
    locked: false, // Prevent recording while undoing

    save: function() {
        if(this.locked) return;
        // Keep only 10 states for performance
        if(this.state.length > 10) this.state.shift();
        this.state.push(JSON.stringify(app.canvas.instance));
        this.mods = this.state.length - 1;
    },

    undo: function() {
        if (this.mods > 0) {
            this.locked = true;
            this.mods--;
            app.canvas.instance.loadFromJSON(this.state[this.mods], () => {
                app.canvas.instance.renderAll();
                this.locked = false;
            });
        }
    },

    redo: function() {
        if (this.mods < this.state.length - 1) {
            this.locked = true;
            this.mods++;
            app.canvas.instance.loadFromJSON(this.state[this.mods], () => {
                app.canvas.instance.renderAll();
                this.locked = false;
            });
        }
    }
};

// --- 5. MOCK API (Templates & Photos) ---
app.api = {
    init: function() {
        this.loadTemplates();
        // Load initial photos
        this.searchPhotos('nature'); 
    },

    loadTemplates: function() {
        // Mock Templates
        const templates = [
            { id: 1, name: 'Sale', thumb: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=300', json: `{"version":"5.3.0","objects":[{"type":"rect","left":0,"top":0,"width":800,"height":600,"fill":"#FCD34D"},{"type":"text","left":250,"top":200,"width":300,"fontSize":60,"text":"BIG SALE","fill":"#000000","fontWeight":"bold","fontFamily":"Oswald"}]}` },
            { id: 2, name: 'Event', thumb: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300', json: `{"version":"5.3.0","objects":[{"type":"rect","left":0,"top":0,"width":800,"height":600,"fill":"#1E293B"},{"type":"text","left":200,"top":250,"fontSize":50,"text":"TECH SUMMIT","fill":"#ffffff","fontWeight":"bold","fontFamily":"Montserrat"}]}` }
        ];

        const grid = document.getElementById('templates-grid');
        templates.forEach(t => {
            const div = document.createElement('div');
            div.className = 'asset-card';
            div.style.height = '140px';
            div.innerHTML = `<img src="${t.thumb}"><div style="position:absolute;bottom:0;width:100%;background:rgba(0,0,0,0.6);color:white;font-size:0.7rem;padding:4px;">${t.name}</div>`;
            div.onclick = () => {
                if(confirm('Load template? Current work will be lost.')) {
                    app.canvas.instance.loadFromJSON(t.json, app.canvas.instance.renderAll.bind(app.canvas.instance));
                    app.history.save();
                }
            };
            grid.appendChild(div);
        });
    },

    searchPhotos: function(query) {
        if(!query) query = 'abstract';
        // Simulating Unsplash API with Source URL
        const images = [
            `https://source.unsplash.com/random/300x200?${query}&sig=1`,
            `https://source.unsplash.com/random/300x200?${query}&sig=2`,
            `https://source.unsplash.com/random/300x200?${query}&sig=3`,
            `https://source.unsplash.com/random/300x200?${query}&sig=4`,
            `https://source.unsplash.com/random/300x200?${query}&sig=5`,
            `https://source.unsplash.com/random/300x200?${query}&sig=6`
        ];
        
        // Unsplash Source is deprecated/redirects, using direct images for reliability in demo
        // For production, use real Unsplash API Key.
        // Fallback for demo stability:
        const demoImages = [
            "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=300",
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300",
            "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300",
            "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300",
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300",
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300"
        ];

        const grid = document.getElementById('photos-grid');
        grid.innerHTML = '';
        demoImages.forEach(src => {
            const div = document.createElement('div');
            div.className = 'asset-card';
            div.style.height = '100px';
            div.innerHTML = `<img src="${src}">`;
            div.onclick = () => app.canvas.addImage(src);
            grid.appendChild(div);
        });
    }
};

// --- 6. IMPORT/EXPORT ---
app.io = {
    exportDesign: function() {
        const title = document.getElementById('design-title').value || 'design';
        const dataURL = app.canvas.instance.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: 2 // High Res
        });
        
        const link = document.createElement('a');
        link.download = `${title}.png`;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

// Initialize App
window.onload = function() {
    app.init();
};