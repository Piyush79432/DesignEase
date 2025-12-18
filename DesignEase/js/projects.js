// Projects page functionality
const storage = {
  getProjects: () => {
    // Mock implementation for demonstration purposes
    return [
      { id: "1", name: "Project A", thumbnail: "thumbnail1.jpg", updatedAt: new Date() },
      { id: "2", name: "Project B", thumbnail: "", updatedAt: new Date() },
    ]
  },
  deleteProject: (id) => {
    // Mock implementation for demonstration purposes
    console.log(`Project with id ${id} deleted`)
  },
}

const formatDate = (date) => {
  // Mock implementation for demonstration purposes
  return date.toLocaleDateString()
}

function loadAllProjects() {
  const projects = storage.getProjects()
  const container = document.getElementById("projectsGrid")

  if (projects.length === 0) {
    container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <i class="fa-solid fa-folder-open" style="font-size: 4rem; color: var(--text-gray); margin-bottom: 20px;"></i>
                <h2 style="color: var(--text-gray); margin-bottom: 10px;">No projects yet</h2>
                <p style="color: var(--text-gray); margin-bottom: 30px;">Start creating your first design</p>
                <button class="btn-primary" onclick="location.href='editor.html'" style="padding: 12px 24px;">
                    <i class="fa-solid fa-plus"></i> Create New Project
                </button>
            </div>
        `
    return
  }

  container.innerHTML = projects
    .map(
      (project) => `
        <div class="design-card" onclick="openProject('${project.id}')">
            <div class="card-preview">
                ${
                  project.thumbnail
                    ? `<img src="${project.thumbnail}" alt="${project.name}">`
                    : '<div style="display: flex; align-items: center; justify-content: center; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 3rem;"><i class="fa-solid fa-palette"></i></div>'
                }
            </div>
            <div class="card-details">
                <div class="card-title">${project.name}</div>
                <div class="card-meta">
                    <span>Edited ${formatDate(project.updatedAt)}</span>
                    <i class="fa-solid fa-ellipsis" onclick="event.stopPropagation(); showProjectMenu('${project.id}')"></i>
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

function openProject(id) {
  window.location.href = `editor.html?project=${id}`
}

function showProjectMenu(id) {
  if (confirm("Delete this project?")) {
    storage.deleteProject(id)
    loadAllProjects()
  }
}

// Search functionality
document.addEventListener("DOMContentLoaded", () => {
  loadAllProjects()

  const searchInput = document.getElementById("projectSearch")
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase()
      const projects = storage.getProjects()
      const filtered = projects.filter((p) => p.name.toLowerCase().includes(searchTerm))

      const container = document.getElementById("projectsGrid")
      container.innerHTML = filtered
        .map(
          (project) => `
                <div class="design-card" onclick="openProject('${project.id}')">
                    <div class="card-preview">
                        ${
                          project.thumbnail
                            ? `<img src="${project.thumbnail}" alt="${project.name}">`
                            : '<div style="display: flex; align-items: center; justify-content: center; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 3rem;"><i class="fa-solid fa-palette"></i></div>'
                        }
                    </div>
                    <div class="card-details">
                        <div class="card-title">${project.name}</div>
                        <div class="card-meta">
                            <span>Edited ${formatDate(project.updatedAt)}</span>
                            <i class="fa-solid fa-ellipsis"></i>
                        </div>
                    </div>
                </div>
            `,
        )
        .join("")
    })
  }
})
