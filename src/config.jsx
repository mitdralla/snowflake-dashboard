// dApp Store Configuration File.
const config = {
  general: {
    dappStoreName: "SNOWFLAKE",
    dappSearchPlaceholderText: "Search the dApp Store...",
    featuredDappsSection: "on",
    popularDappsSection: "on",
    latestDappsSection: "on",
  },
  homepage: {
    heroCarousel: "on",
    featuredDappsSection: "on",
    popularDappsSection: "on",
    latestDappsSection: "on",
  },
  heroCarousel: {
    leftArrow: "no",
    rightArrow: "yes",
    maxItems: 10,
  },
  dappCategories: {
    categories: [
      {
        name:        "All Categories",
        link:        "all-categories",
        icon:        "IoMdFolderOpen",
        description: "",
        order:       1,
        active:      "yes"
      },
      {
        name:        "Entertainment",
        link:        "entertainment",
        icon:        "IoIosFilm",
        description: "",
        order:       2,
        active:      "yes"
      },
      {
        name:        "Fintech",
        link:        "fintech",
        icon:        "IoMdCard",
        description: "",
        order:       3,
        active:      "yes"
      },
      {
        name:        "Business",
        link:        "business",
        icon:        "IoIosGlobe",
        order:       4,
        active:      "yes"
      },
      {
        name:        "Gaming",
        link:        "gaming",
        icon:        "IoLogoGameControllerA",
        description: "",
        order:       5,
        active:      "yes"
      },
      {
        name:        "Community",
        link:        "community",
        icon:        "IoIosPeople",
        description: "",
        order:       6,
        active:      "yes"
      },
      {
        name:        "Tools",
        link:        "tools",
        icon:        "IoIosCalculator",
        description: "",
        order:       7,
        active:      "yes"
      },
      {
        name:        "Other",
        link:        "other",
        icon:        "IoIosSettings",
        description: "",
        order:       8,
        active:      "yes"
      }
    ]
  },
  dappFilters: {
    filters: [
      {
        name:    "All",
        link:    "#all",
        order:   1,
        active:  "yes"
      },
      {
        name:    "Featured",
        link:    "#featured",
        order:   2,
        active:  "yes"
      },
      {
        name:    "Most Popular",
        link:    "#most-popular",
        order:   3,
        active:  "yes"
      },
      {
        name:    "Latest Releases",
        link:    "#latest-releases",
        order:   4,
        active:  "yes"
      }
    ]
  },
  dappFooterNavigation: {
    items: [
      {
        name:    "Audits",
        link:    "/audits",
        order:   1,
        active:  "yes"
      },
      {
        name:    "Privacy Policy",
        link:    "/privacy-policy",
        order:   2,
        active:  "yes"
      },
      {
        name:    "Terms of Use",
        link:    "/terms-of-use",
        order:   3,
        active:  "yes"
      },
      {
        name:    "About",
        link:    "/about",
        order:   4,
        active:  "yes"
      },
      {
        name:    "Contact",
        link:    "/contact",
        order:   5,
        active:  "yes"
      }
    ]
  },
  jumbotrons: {
    items: [
      {
        id:           "1",
        jumbotron:    "default",
        title:        "Get Involved",
        description:  "Are you a developer? Do you have a dApp idea? Do you want to partner with us?",
        buttonText:   "Let Us Know",
        buttonLink:   "/developers"
      }
    ]
  },
  faqs: {
    items: [
      {
        id:           "1",
        question:     "What is this all about?",
        answer:       "It is about this and that. It also has a lot to do with x, y and z.",
        category:     "general",
        active:       "yes"
      },
      {
        id:           "2",
        question:     "What is this all about?",
        answer:       "It is about this and that. It also has a lot to do with x, y and z.",
        category:     "general",
        active:       "yes"
      },
      {
        id:           "3",
        question:     "What is this all about?",
        answer:       "It is about this and that. It also has a lot to do with x, y and z.",
        category:     "general",
        active:       "yes"
      },
      {
        id:           "4",
        question:     "What is this all about?",
        answer:       "It is about this and that. It also has a lot to do with x, y and z.",
        category:     "general",
        active:       "yes"
      },
      {
        id:           "5",
        question:     "What is this all about?",
        answer:       "It is about this and that. It also has a lot to do with x, y and z.",
        category:     "general",
        active:       "yes"
      },

    ]
  }
}

export default config
