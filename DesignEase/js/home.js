// js/home.js

// 1. Mobile Sidebar Logic
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// 2. Load Saved Designs from DB
async function showSavedDesigns() {
    const grid = document.getElementById('savedDesignsGrid');
    
    try {
        const designs = await DB.getAllDesigns();
        
        if (designs.length === 0) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <i class="fa-solid fa-palette"></i>
                    <p>No saved designs yet. Click "Create Design" to start!</p>
                </div>`;
            return;
        }

        grid.innerHTML = '';
        designs.forEach(d => {
            const card = document.createElement('div');
            card.className = 'design-card';
            card.innerHTML = `
                <div class="card-preview" onclick="location.href='editor.html?id=${d.id}'">
                    <img src="${d.thumbnail}" alt="${d.name}">
                </div>
                <div class="card-info">
                    <div class="card-title">${d.name}</div>
                    <div class="card-meta">
                        <span>Edited ${new Date(d.updatedAt).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="card-actions">
                    <div class="card-action-btn" onclick="location.href='editor.html?id=${d.id}'"><i class="fa-solid fa-pen"></i></div>
                    <div class="card-action-btn danger" onclick="deleteDesign('${d.id}')"><i class="fa-solid fa-trash"></i></div>
                </div>
            `;
            grid.appendChild(card);
        });

    } catch (e) {
        console.error("Error loading designs", e);
        grid.innerHTML = '<p style="color:red">Error loading saved designs.</p>';
    }
}

// 3. Delete Logic
async function deleteDesign(id) {
    if(confirm("Are you sure you want to delete this design?")) {
        await DB.deleteDesign(id);
        showSavedDesigns(); // Refresh grid
    }
}

// 4. Initial Load
window.onload = function() {
    showSavedDesigns();
};