// Canva API Integration Module

const CanvaAPI = {
  // API Configuration
  config: {
    apiKey: "YOUR_CANVA_API_KEY", // Replace with actual API key
    baseUrl: "https://api.canva.com/v1",
    partnerId: "YOUR_PARTNER_ID", // Replace with actual partner ID
  },

  // Initialize API
  init: function (apiKey, partnerId) {
    this.config.apiKey = apiKey
    this.config.partnerId = partnerId
  },

  // Get authorization headers
  getHeaders: function () {
    return {
      Authorization: `Bearer ${this.config.apiKey}`,
      "Content-Type": "application/json",
    }
  },

  // Fetch templates from Canva
  getTemplates: async function (category = null, limit = 20) {
    try {
      let url = `${this.config.baseUrl}/templates`

      const params = new URLSearchParams()
      if (category) params.append("category", category)
      params.append("limit", limit)

      if (params.toString()) {
        url += "?" + params.toString()
      }

      const response = await fetch(url, {
        method: "GET",
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      return data.templates || []
    } catch (error) {
      console.error("[v0] Error fetching templates:", error)
      // Return mock templates as fallback
      return this.getMockTemplates(category)
    }
  },

  // Get template by ID
  getTemplateById: async function (templateId) {
    try {
      const response = await fetch(`${this.config.baseUrl}/templates/${templateId}`, {
        method: "GET",
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("[v0] Error fetching template:", error)
      return null
    }
  },

  // Create design from template
  createFromTemplate: async function (templateId, customizations = {}) {
    try {
      const response = await fetch(`${this.config.baseUrl}/designs`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({
          template_id: templateId,
          customizations: customizations,
        }),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("[v0] Error creating design:", error)
      return null
    }
  },

  // Export design
  exportDesign: async function (designId, format = "png") {
    try {
      const response = await fetch(`${this.config.baseUrl}/designs/${designId}/export`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({
          format: format,
          quality: "high",
        }),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("[v0] Error exporting design:", error)
      return null
    }
  },

  // Mock templates for offline/development mode
  getMockTemplates: (category) => {
    const templates = {
      "social-media": [
        {
          id: "t1",
          name: "Instagram Post - Modern",
          category: "social-media",
          width: 1080,
          height: 1080,
          thumbnail: "/modern-instagram-template.png",
        },
        {
          id: "t2",
          name: "Facebook Cover",
          category: "social-media",
          width: 820,
          height: 312,
          thumbnail: "/facebook-cover-template.png",
        },
        {
          id: "t3",
          name: "Twitter Post",
          category: "social-media",
          width: 1200,
          height: 675,
          thumbnail: "/twitter-post-template.png",
        },
        {
          id: "t4",
          name: "LinkedIn Banner",
          category: "social-media",
          width: 1584,
          height: 396,
          thumbnail: "/linkedin-banner-template.jpg",
        },
      ],
      marketing: [
        {
          id: "t5",
          name: "Flyer - Business",
          category: "marketing",
          width: 816,
          height: 1056,
          thumbnail: "/business-flyer-template.png",
        },
        {
          id: "t6",
          name: "Poster - Event",
          category: "marketing",
          width: 1224,
          height: 1584,
          thumbnail: "/event-poster-template.jpg",
        },
        {
          id: "t7",
          name: "Brochure",
          category: "marketing",
          width: 2550,
          height: 3300,
          thumbnail: "/brochure-template.jpg",
        },
        {
          id: "t8",
          name: "Banner Ad",
          category: "marketing",
          width: 728,
          height: 90,
          thumbnail: "/banner-ad-template.png",
        },
      ],
      business: [
        {
          id: "t9",
          name: "Business Card",
          category: "business",
          width: 1050,
          height: 600,
          thumbnail: "/business-card-template.png",
        },
        {
          id: "t10",
          name: "Presentation Slide",
          category: "business",
          width: 1920,
          height: 1080,
          thumbnail: "/presentation-slide-template.png",
        },
        {
          id: "t11",
          name: "Invoice",
          category: "business",
          width: 816,
          height: 1056,
          thumbnail: "/invoice-template.png",
        },
        {
          id: "t12",
          name: "Resume",
          category: "business",
          width: 816,
          height: 1056,
          thumbnail: "/modern-resume-template.png",
        },
      ],
    }

    if (category && templates[category]) {
      return templates[category]
    }

    // Return all templates if no category specified
    return Object.values(templates).flat()
  },

  // Search templates
  searchTemplates: async function (query) {
    try {
      const response = await fetch(`${this.config.baseUrl}/templates/search?q=${encodeURIComponent(query)}`, {
        method: "GET",
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      return data.templates || []
    } catch (error) {
      console.error("[v0] Error searching templates:", error)
      // Filter mock templates
      const allTemplates = this.getMockTemplates()
      return allTemplates.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()))
    }
  },
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = CanvaAPI
}
