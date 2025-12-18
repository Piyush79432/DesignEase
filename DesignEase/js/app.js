// Main Application Logic for DesignEase Editor
const App = {
  canvas: null,
  selected: null,
  currentDesignId: null,

  init: function () {
    this.canvas = new fabric.Canvas("mainCanvas", {
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
    })

    this.canvas.on("selection:created", (e) => this.handleSelection(e))
    this.canvas.on("selection:updated", (e) => this.handleSelection(e))
    this.canvas.on("selection:cleared", () => this.clearSelection())

    this.lib.loadTemplates("Resume")
    this.lib.populateFonts()
    this.lib.populateShapes()
    this.lib.populateIcons()
    this.lib.populateEmojis()
    this.lib.loadDefaultImages()

    // Check if loading existing design
    const urlParams = new URLSearchParams(window.location.search)
    const designId = urlParams.get("id")
    if (designId) {
      this.io.loadFromDatabase(designId)
    }

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.key === "Delete" && this.canvas.getActiveObject()) {
        this.canvas.remove(this.canvas.getActiveObject())
        this.canvas.renderAll()
      }
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault()
        this.io.saveToDatabase()
      }
      if (e.ctrlKey && e.key === "d") {
        e.preventDefault()
        this.canvas.duplicate()
      }
    })
  },

  ui: {
    openPanel: (panelName, btn) => {
      // Deactivate all nav buttons
      document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")

      // Hide all panels
      document.querySelectorAll(".panel-section").forEach((p) => p.classList.remove("active"))

      // Show selected panel
      document.getElementById("panel-" + panelName).classList.add("active")
    },

    toggleAssets: (type, chip) => {
      // Update chip active state
      chip.parentElement.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"))
      chip.classList.add("active")

      // Show/hide asset views
      document.getElementById("view-shapes").style.display = type === "shapes" ? "block" : "none"
      document.getElementById("view-icons").style.display = type === "icons" ? "block" : "none"
      document.getElementById("view-emojis").style.display = type === "emojis" ? "block" : "none"
    },
  },

  lib: {
    loadTemplates: async (category, chip) => {
      // Update chip active state
      if (chip) {
        chip.parentElement.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"))
        chip.classList.add("active")
      }

      const grid = document.getElementById("templates-grid")
      grid.innerHTML =
        '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">Generating template previews...</p>'

      const templates = TemplatesData[category] || []
      grid.innerHTML = ""

      for (const template of templates) {
        // Check if thumbnail exists in cache
        let thumbnail = await DesignDB.getTemplateThumbnail(template.id)

        if (!thumbnail) {
          // Generate thumbnail
          thumbnail = await App.lib.generateTemplateThumbnail(template)
          // Cache it
          await DesignDB.saveTemplateThumbnail(template.id, thumbnail)
        }

        const card = document.createElement("div")
        card.className = "template-card"
        card.onclick = () => App.lib.applyTemplate(template)
        card.innerHTML = `
                    <div class="t-preview">
                        <img src="${thumbnail}" alt="${template.name}">
                    </div>
                    <div class="t-tag">${template.name}</div>
                `
        grid.appendChild(card)
      }
    },

    generateTemplateThumbnail: (template) =>
      new Promise((resolve) => {
        const tempCanvas = new fabric.Canvas(document.createElement("canvas"))
        const data = JSON.parse(template.json)

        // Set canvas size based on template
        const width = 600
        const height = 850
        tempCanvas.setDimensions({ width, height })

        tempCanvas.loadFromJSON(data, () => {
          const dataURL = tempCanvas.toDataURL({
            format: "png",
            quality: 0.8,
            multiplier: 0.3, // Lower resolution for thumbnails
          })
          tempCanvas.dispose()
          resolve(dataURL)
        })
      }),

    applyTemplate: (template) => {
      const data = JSON.parse(template.json)
      App.canvas.clear()
      App.canvas.loadFromJSON(data, () => {
        App.canvas.renderAll()
        document.getElementById("docTitle").value = template.name
      })
    },

    populateFonts: () => {
      const fonts = [
        "Montserrat",
        "Roboto",
        "Open Sans",
        "Lato",
        "Oswald",
        "Playfair Display",
        "Bebas Neue",
        "Poppins",
        "Raleway",
        "Ubuntu",
        "Merriweather",
        "Nunito",
        "Pacifico",
        "Lobster",
        "Dancing Script",
        "Righteous",
        "Indie Flower",
      ]

      const container = document.getElementById("fonts-list")
      const selectEl = document.getElementById("font-family")

      fonts.forEach((font) => {
        // For panel list
        const row = document.createElement("div")
        row.className = "font-row"
        row.style.fontFamily = font
        row.textContent = font
        row.onclick = () => App.canvas.updateProp("fontFamily", font)
        container.appendChild(row)

        // For toolbar dropdown
        const option = document.createElement("option")
        option.value = font
        option.textContent = font
        selectEl.appendChild(option)
      })
    },

    populateShapes: () => {
      const shapes = [
        { icon: "⬛", type: "rect" },
        { icon: "●", type: "circle" },
        { icon: "▲", type: "triangle" },
        { icon: "⭐", type: "star" },
      ]

      const grid = document.getElementById("shapes-grid")
      const outlineGrid = document.getElementById("shapes-outline-grid")

      shapes.forEach((shape) => {
        // Filled shapes
        const box = document.createElement("div")
        box.className = "asset-box"
        box.textContent = shape.icon
        box.onclick = () => App.canvas.addShape(shape.type, false)
        grid.appendChild(box)

        // Outlined shapes
        const outlineBox = document.createElement("div")
        outlineBox.className = "asset-box"
        outlineBox.textContent = shape.icon
        outlineBox.onclick = () => App.canvas.addShape(shape.type, true)
        outlineGrid.appendChild(outlineBox)
      })
    },

    populateIcons: () => {
      const icons = [
        "fa-heart",
        "fa-star",
        "fa-check",
        "fa-times",
        "fa-arrow-right",
        "fa-arrow-left",
        "fa-arrow-up",
        "fa-arrow-down",
        "fa-phone",
        "fa-envelope",
        "fa-location-dot",
        "fa-user",
        "fa-users",
        "fa-briefcase",
        "fa-building",
        "fa-calendar",
        "fa-clock",
        "fa-globe",
        "fa-home",
        "fa-search",
        "fa-cog",
        "fa-lightbulb",
        "fa-rocket",
        "fa-trophy",
        "fa-thumbs-up",
        "fa-camera",
        "fa-music",
        "fa-video",
      ]

      const grid = document.getElementById("icons-grid")
      icons.forEach((icon) => {
        const box = document.createElement("div")
        box.className = "asset-box"
        box.innerHTML = `<i class="fa-solid ${icon}"></i>`
        box.onclick = () => App.canvas.addIcon(icon)
        grid.appendChild(box)
      })
    },

    populateEmojis: () => {
      const emojis = [
        "😊",
        "😍",
        "🎉",
        "🎊",
        "🎁",
        "❤️",
        "⭐",
        "✨",
        "🌟",
        "💡",
        "🚀",
        "🏆",
        "👍",
        "👏",
        "💪",
        "🔥",
        "⚡",
        "✅",
        "❌",
        "📱",
      ]

      const grid = document.getElementById("emojis-grid")
      emojis.forEach((emoji) => {
        const box = document.createElement("div")
        box.className = "asset-box"
        box.textContent = emoji
        box.onclick = () => App.canvas.addEmoji(emoji)
        grid.appendChild(box)
      })
    },

    loadDefaultImages: function () {
      const keywords = ["business", "technology", "office", "people", "nature"]
      const keyword = keywords[Math.floor(Math.random() * keywords.length)]
      this.searchImages(keyword)
    },

    searchImages: (query) => {
      if (!query) return
      const grid = document.getElementById("images-grid")
      grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Searching...</p>'

      // Using Lorem Picsum for placeholder images
      grid.innerHTML = ""
      for (let i = 1; i <= 12; i++) {
        const box = document.createElement("div")
        box.className = "img-box"
        const imgUrl = `https://picsum.photos/300/200?random=${Date.now()}-${i}`
        box.innerHTML = `<img src="${imgUrl}" alt="Image">`
        box.onclick = () => App.canvas.addImage(imgUrl)
        grid.appendChild(box)
      }
    },

    filterIcons: (query) => {
      const boxes = document.querySelectorAll("#icons-grid .asset-box")
      boxes.forEach((box) => {
        const icon = box.querySelector("i").className.toLowerCase()
        box.style.display = icon.includes(query.toLowerCase()) ? "flex" : "none"
      })
    },
  },

  canvas: {
    addHeading: () => {
      const text = new fabric.Textbox("Your Heading", {
        left: 100,
        top: 100,
        fontSize: 36,
        fontFamily: "Montserrat",
        fontWeight: "bold",
        fill: "#1e293b",
        width: 400,
        editable: true,
      })
      App.canvas.add(text)
      App.canvas.setActiveObject(text)
      App.canvas.renderAll()
    },

    addBody: () => {
      const text = new fabric.Textbox("Your text here...", {
        left: 100,
        top: 200,
        fontSize: 14,
        fontFamily: "Open Sans",
        fill: "#475569",
        width: 400,
        editable: true,
      })
      App.canvas.add(text)
      App.canvas.setActiveObject(text)
      App.canvas.renderAll()
    },

    addShape: (type, outline) => {
      let shape
      const common = {
        left: 200,
        top: 200,
        fill: outline ? "transparent" : "#6366f1",
        stroke: outline ? "#6366f1" : "",
        strokeWidth: outline ? 3 : 0,
      }

      switch (type) {
        case "rect":
          shape = new fabric.Rect({ ...common, width: 150, height: 150 })
          break
        case "circle":
          shape = new fabric.Circle({ ...common, radius: 75 })
          break
        case "triangle":
          shape = new fabric.Triangle({ ...common, width: 150, height: 150 })
          break
        case "star":
          shape = new fabric.Polygon(
            [
              { x: 50, y: 0 },
              { x: 61, y: 35 },
              { x: 98, y: 35 },
              { x: 68, y: 57 },
              { x: 79, y: 91 },
              { x: 50, y: 70 },
              { x: 21, y: 91 },
              { x: 32, y: 57 },
              { x: 2, y: 35 },
              { x: 39, y: 35 },
            ],
            { ...common, scaleX: 1.5, scaleY: 1.5 },
          )
          break
      }

      App.canvas.add(shape)
      App.canvas.setActiveObject(shape)
      App.canvas.renderAll()
    },

    addIcon: function (iconClass) {
      const text = new fabric.Text(this.getIconUnicode(iconClass), {
        left: 200,
        top: 200,
        fontSize: 48,
        fontFamily: "Font Awesome 6 Free",
        fill: "#475569",
      })
      App.canvas.add(text)
      App.canvas.setActiveObject(text)
      App.canvas.renderAll()
    },

    getIconUnicode: (iconClass) => {
      // Map common icons to Unicode (simplified)
      const map = {
        "fa-heart": "\uf004",
        "fa-star": "\uf005",
        "fa-check": "\uf00c",
        "fa-times": "\uf00d",
        "fa-arrow-right": "\uf061",
      }
      return map[iconClass] || "●"
    },

    addEmoji: (emoji) => {
      const text = new fabric.Text(emoji, {
        left: 200,
        top: 200,
        fontSize: 48,
      })
      App.canvas.add(text)
      App.canvas.setActiveObject(text)
      App.canvas.renderAll()
    },

    addImage: (url) => {
      fabric.Image.fromURL(
        url,
        (img) => {
          img.scaleToWidth(300)
          img.set({ left: 150, top: 150 })
          App.canvas.add(img)
          App.canvas.setActiveObject(img)
          App.canvas.renderAll()
        },
        { crossOrigin: "anonymous" },
      )
    },

    handleUpload: (event) => {
      const file = event.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = async (e) => {
        const dataURL = e.target.result
        await DesignDB.saveUpload(dataURL)
        App.lib.loadUploads()
        App.canvas.addImage(dataURL)
      }
      reader.readAsDataURL(file)
    },

    updateColor: (color) => {
      const obj = App.canvas.getActiveObject()
      if (!obj) return

      if (obj.type === "textbox" || obj.type === "text" || obj.type === "i-text") {
        obj.set("fill", color)
      } else {
        obj.set("fill", color)
      }
      App.canvas.renderAll()
      document.getElementById("color-preview").style.background = color
    },

    updateProp: (prop, value) => {
      const obj = App.canvas.getActiveObject()
      if (!obj) return

      const update = {}
      update[prop] = value
      obj.set(update)
      App.canvas.renderAll()
    },

    layerUp: () => {
      const obj = App.canvas.getActiveObject()
      if (obj) {
        App.canvas.bringForward(obj)
        App.canvas.renderAll()
      }
    },

    layerDown: () => {
      const obj = App.canvas.getActiveObject()
      if (obj) {
        App.canvas.sendBackwards(obj)
        App.canvas.renderAll()
      }
    },

    duplicate: () => {
      const obj = App.canvas.getActiveObject()
      if (!obj) return

      obj.clone((cloned) => {
        cloned.set({
          left: cloned.left + 20,
          top: cloned.top + 20,
        })
        App.canvas.add(cloned)
        App.canvas.setActiveObject(cloned)
        App.canvas.renderAll()
      })
    },

    deleteSelected: () => {
      const obj = App.canvas.getActiveObject()
      if (obj) {
        App.canvas.remove(obj)
        App.canvas.renderAll()
      }
    },

    zoomIn: () => {
      let zoom = App.canvas.getZoom()
      zoom = Math.min(zoom * 1.1, 3)
      App.canvas.setZoom(zoom)
      document.getElementById("zoom-level").textContent = Math.round(zoom * 100) + "%"
    },

    zoomOut: () => {
      let zoom = App.canvas.getZoom()
      zoom = Math.max(zoom / 1.1, 0.3)
      App.canvas.setZoom(zoom)
      document.getElementById("zoom-level").textContent = Math.round(zoom * 100) + "%"
    },

    resetZoom: () => {
      App.canvas.setZoom(1)
      document.getElementById("zoom-level").textContent = "100%"
    },
  },

  handleSelection: (e) => {
    const obj = e.selected[0]
    App.selected = obj

    document.getElementById("prop-placeholder").style.display = "none"
    document.getElementById("prop-active").style.display = "flex"

    // Update color preview
    const color = obj.fill || "#000000"
    document.getElementById("color-preview").style.background = color
    document.getElementById("fill-color").value = color

    // Show/hide text tools
    const isText = obj.type === "textbox" || obj.type === "text" || obj.type === "i-text"
    document.getElementById("text-tools").style.display = isText ? "flex" : "none"

    if (isText) {
      document.getElementById("font-family").value = obj.fontFamily || "Arial"
      document.getElementById("font-size").value = obj.fontSize || 16
    }
  },

  clearSelection: () => {
    App.selected = null
    document.getElementById("prop-placeholder").style.display = "block"
    document.getElementById("prop-active").style.display = "none"
  },

  io: {
    saveToDatabase: async () => {
      document.getElementById("loadingOverlay").classList.add("show")

      try {
        const json = JSON.stringify(App.canvas.toJSON())
        const thumbnail = App.canvas.toDataURL({
          format: "png",
          quality: 0.8,
          multiplier: 0.5,
        })

        const design = {
          title: document.getElementById("docTitle").value || "Untitled Design",
          json: json,
          thumbnail: thumbnail,
          category: "Custom",
        }

        if (App.currentDesignId) {
          design.id = App.currentDesignId
        }

        const id = await DesignDB.saveDesign(design)
        App.currentDesignId = id

        alert("Design saved successfully!")
      } catch (error) {
        console.error("Save error:", error)
        alert("Failed to save design")
      } finally {
        document.getElementById("loadingOverlay").classList.remove("show")
      }
    },

    loadFromDatabase: async (id) => {
      document.getElementById("loadingOverlay").classList.add("show")

      try {
        const design = await DesignDB.getDesign(id)
        if (design) {
          App.canvas.loadFromJSON(design.json, () => {
            App.canvas.renderAll()
            document.getElementById("docTitle").value = design.title
            App.currentDesignId = id
          })
        }
      } catch (error) {
        console.error("Load error:", error)
        alert("Failed to load design")
      } finally {
        document.getElementById("loadingOverlay").classList.remove("show")
      }
    },

    download: (format) => {
      const title = document.getElementById("docTitle").value || "design"

      if (format === "png") {
        const dataURL = App.canvas.toDataURL({
          format: "png",
          quality: 1,
          multiplier: 2,
        })
        const link = document.createElement("a")
        link.download = title + ".png"
        link.href = dataURL
        link.click()
      } else if (format === "pdf") {
        const { jsPDF } = window.jspdf
        const imgData = App.canvas.toDataURL("image/png")
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        })
        pdf.addImage(imgData, "PNG", 0, 0, 210, 297)
        pdf.save(title + ".pdf")
      }
    },
  },
}

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  App.init()
})
