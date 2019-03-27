// dApp Store Configuration File.
const config = {
  general: {
    dappStoreName:                   "SNOWFLAKE",
    dappSearchPlaceholderText:       "Search the dApp Store...",
    featuredDappsSectionActive:      true,
    popularDappsSectionActive:       true,
    latestDappsSectionActive:        true,
    theme: {
      contentBackgroundColor:        "#fff",
      maxWidth:                      "1700px"
    }
  },
  homepage: {
    heroCarouselActive:              true,
    featuredDappsSectionActive:      true,
    popularDappsSectionActive:       true,
    latestDappsSectionActive:        true,
  },
  dappSingleLandingPage: {
    thumbnailActive:                 true,
    titleActive:                     true,
    authorActive:                    true,
    categoryActive:                  true,
    reviewsActive:                   false,
    inAppPurchasesActive:            true,
    screenshotsCarouselActive:       true,
    maxScreenshotsAllowed:           5,
    descriptionActive:               true,
    expandDescriptionLinkActive:     true,
    versionHistoryActive:            true,
    additionalInformation: {
      feeToUseActive:                true,
      inDAppPurchasesActive:         true,
      licenseActive:                 true,
      categoryActive:                true,
      authorActive:                  true,
      initialReleaseDateActive:      true,
      lastUpdateActive:              true,
      currentVersion:                true,
      reportActive:                  true,
    },
    social: {
        active:                      true,
        githubActive:                true,
        facebookActive:              true,
        twitterActive:               true,
        mailActive:                  true
    },
    statisticsActive:                false,
    moreFromThisDeveloper:           false,
    moreFromThisDeveloperLimit:      5

  },
  heroCarousel: {
    leftArrowActive:                 false,
    rightArrowActive:                true,
    maxItems:                        10,
    itemsInViewDesktop:              4,
    itemsInViewTablet:               4,
    itemsInViewMobile:               1
  },
  dappCategories: {
    categories: [
      {
        name:        "All Categories",
        link:        "all-categories",
        icon:        "IoMdFolderOpen",
        description: "",
        order:       1,
        active:      true
      },
      {
        name:        "Entertainment",
        link:        "entertainment",
        icon:        "IoIosFilm",
        description: "",
        order:       2,
        active:      true
      },
      {
        name:        "Fintech",
        link:        "fintech",
        icon:        "IoMdCard",
        description: "",
        order:       3,
        active:      true
      },
      {
        name:        "Business",
        link:        "business",
        icon:        "IoIosGlobe",
        order:       4,
        active:      true
      },
      {
        name:        "Gaming",
        link:        "gaming",
        icon:        "IoLogoGameControllerA",
        description: "",
        order:       5,
        active:      true
      },
      {
        name:        "Community",
        link:        "community",
        icon:        "IoIosPeople",
        description: "",
        order:       6,
        active:      true
      },
      {
        name:        "Tools",
        link:        "tools",
        icon:        "IoIosCalculator",
        description: "",
        order:       7,
        active:      true
      },
      {
        name:        "Other",
        link:        "other",
        icon:        "IoIosSettings",
        description: "",
        order:       8,
        active:      true
      }
    ]
  },
  dappFilters: {
    filters: [
      {
        name:    "All",
        link:    "#all",
        order:   1,
        active:  true
      },
      {
        name:    "Featured",
        link:    "#featured",
        order:   2,
        active:  true
      },
      {
        name:    "Most Popular",
        link:    "#most-popular",
        order:   3,
        active:  true
      },
      {
        name:    "Latest Releases",
        link:    "#latest-releases",
        order:   4,
        active:  true
      }
    ]
  },
  dappFooterNavigation: {
    items: [
      {
        name:    "Audits",
        link:    "/audits",
        order:   1,
        active:  true
      },
      {
        name:    "Privacy Policy",
        link:    "/privacy-policy",
        order:   2,
        active:  true
      },
      {
        name:    "Terms of Use",
        link:    "/terms-of-use",
        order:   3,
        active:  true
      },
      {
        name:    "About",
        link:    "/about",
        order:   4,
        active:  true
      },
      {
        name:    "Contact",
        link:    "/contact",
        order:   5,
        active:  true
      }
    ]
  },
  jumbotrons: {
    items: [
      {
        id:              "1",
        jumbotron:       "default",
        title:           "Get Involved",
        description:     "Are you a developer? Do you have a dApp idea? Do you want to partner with us?",
        buttonText:      "Let Us Know",
        buttonLink:      "/developers",
        backgroundColor: "#e8e8e8"
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
        active:       true
      },
      {
        id:           "2",
        question:     "What is this all about?",
        answer:       "It is about this and that. It also has a lot to do with x, y and z.",
        category:     "general",
        active:       true
      },
      {
        id:           "3",
        question:     "What is this all about?",
        answer:       "It is about this and that. It also has a lot to do with x, y and z.",
        category:     "general",
        active:       true
      },
      {
        id:           "4",
        question:     "What is this all about?",
        answer:       "It is about this and that. It also has a lot to do with x, y and z.",
        category:     "general",
        active:       true
      },
      {
        id:           "5",
        question:     "What is this all about?",
        answer:       "It is about this and that. It also has a lot to do with x, y and z.",
        category:     "general",
        active:       true
      },

    ]
  }
}

export default config
