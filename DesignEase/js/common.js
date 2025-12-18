// Common JavaScript functions
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar")
  sidebar.classList.toggle("active")
}

// Close sidebar when clicking outside on mobile
document.addEventListener("click", (event) => {
  const sidebar = document.getElementById("sidebar")
  const menuToggle = document.querySelector(".mobile-menu-toggle")

  if (sidebar && sidebar.classList.contains("active")) {
    if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
      sidebar.classList.remove("active")
    }
  }
})

// Local Storage Helper Functions
const storage = {
  getProjects: () => JSON.parse(localStorage.getItem("designease_projects") || "[]"),
  saveProjects: (projects) => localStorage.setItem("designease_projects", JSON.stringify(projects)),

  getProject: (id) => {
    const projects = storage.getProjects()
    return projects.find((p) => p.id === id)
  },

  saveProject: (project) => {
    const projects = storage.getProjects()
    const index = projects.findIndex((p) => p.id === project.id)
    if (index >= 0) {
      projects[index] = project
    } else {
      projects.push(project)
    }
    storage.saveProjects(projects)
  },

  deleteProject: (id) => {
    const projects = storage.getProjects()
    storage.saveProjects(projects.filter((p) => p.id !== id))
  },
}

// Generate unique ID
function generateId() {
  return "id_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
}

// Format date
function formatDate(date) {
  const now = new Date()
  const diff = now - new Date(date)
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return minutes + "m ago"
  if (hours < 24) return hours + "h ago"
  if (days === 1) return "yesterday"
  if (days < 7) return days + " days ago"
  return new Date(date).toLocaleDateString()
}
