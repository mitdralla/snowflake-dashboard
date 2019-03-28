// dApp Store Configuration File.
const config = {
  general: {                                       //******** General Store Settings ********//
    dappStoreName:                   "SNOWFLAKE",
    dappStoreMetaKeywords:           "dapps, dapp store, app store, decentralized applications, decentralized apps, snowflake, hydro dapp store",
    dappStoreMetaDescription:        "Hydro dApp store featuring decentralized applications powered by Snowflake.",
    dappSearchPlaceholderText:       "Search the dApp Store...",
    googleAnalyticsTag:              "UA-XXXXXXXXX",
    dappSearchActive:                true,         // Is the header dApp search bar visible? true/false
    maintenanceMode:                 false,        // Allows the store to display a temporary maintenance page or message. true/false
    theme: {                                       //******** Settings pertaining to the stores theme. ********//
      contentBackgroundColor:        "#fff",       // The background color of the main body wrapper in hex form (ex: #fff).
      maxWidth:                      "1700px"      // The store wrapper max-width. Leave blank for 100% fluidity (ex: 1500px).
    }
  },
  homepage: {                                      //******** Settings pertaining to the homepage. ********//
    heroCarousel: {                                //******** Settings pertaining to the hero carousel on the homepage. ********//
      active:                        true,         // Turns the hero carousel on the homepage on/off. true/false
      leftArrowActive:               false,        // Turns the left arrow on/off for manually moving through slides. true/false
      rightArrowActive:              true,         // Turns the left arrow on/off for manually moving through slides. true/false
      desktopItemsInView:            5,            // How many items are in view on desktop (1000px or greater).
      tabletItemsInView:             3,            // How many items are in view on tablet (600px or greater).
      mobileItemsInView:             1,            // How many items are in view on tablet (0px or greater).
      navigation:                    false,        // Is there a dot navigation below the carousel? true/false
      responsive:                    true,         // Will the carousel respect responsive breakpoints and breakpoint specific config? True recommended. true/false
      autoWidth:                     false,        // Will the carousel try to determine its container automatically? False recommended. true/false
      autoplay:                      false,         // Will the carousel start rotating automatically as default? true/false
      autoplayDesktop:               true,         // Will the carousel start rotating automatically on desktop? true/false
      autoplayTablet:                true,         // Will the carousel start rotating automatically on tablet? true/false
      autoplayMobile:                false,        // Will the carousel start rotating automatically on mobile? true/false
      rotationSpeed:                 3000,         // Rotation speed between each slide movement in milliseconds. (ex: 3000 = 3 seconds).
      pauseOnHover:                  true,         // Will the carousel stop moving on hover? true/false
      infiniteItemLoop:              true,         // Will it infinitely keep rotating? true/false
      spaceBetweenItems:             30,           // The margin between items in px (ex: 30 = 30px).
      titleActive:                   true,         // Is there an app title visible? true/false
      categoryActive:                true,         // Is there an app category visible? true/false
      ratingsActive:                 true,         // Are there app ratings visible? true/false
      hydroButtonActive:             true,         // Is there a button displaying a hydro ammount? true/false
      inDappPurchasesActive:         true          // Is there in-dapp purchase text visible? true/false
    },
    dapps: {                                       //******** Settings pertaining to the dApps on the homepage. ********//
      dappsPerRow:                   5,            // How many dapps are shown on each row of the main body content? 4-5 recommended on desktop.
      dappPaginationActive:          false,        // Is there pagination to view more pages of dapps? true/false
      filterBarActive:               true,         // Is the filter bar (featured, latest, popular) visible on the page? true/false
      filterSubTitlesActive:         true,         // Display the line of text under section titles? true/false
      featuredDappsSectionActive:    true,         // Is the featured dapp section on the homepage active? treu/false
      popularDappsSectionActive:     true,         // Is the popular dapp section on the homepage active? treu/false
      latestDappsSectionActive:      true,         // Is the latest dapp section on the homepage active? treu/false
      detailsHoverButtonActive:      true,         // When hovering a dapp in the main body content, does a details button appear? true/false
    }
  },
  dappSingleLandingPage: {                         //******** Settings pertaining to a single dApp landing page. ********//
    general: {                                     //******** General settings on a single dapp landing page. *******//
      thumbnailActive:               true,         // Is the thumbnail visible? true/false
      titleActive:                   true,         // Is the title visible? true/false
      authorActive:                  true,         // Is the author visible? true/false
      categoryActive:                true,         // Is the category visible? true/false
      reviewsActive:                 false,        // Are reviews visible? true/false
      inAppPurchasesActive:          true,         // Are inapp purchases visible? true/false
      screenshotsCarouselActive:     true,         // Are screenshots turned on? true/false
      maxScreenshotsAllowed:         5,            // What is the max number of screenshots allowed in the slider? (would recommended no more than 5)
      descriptionActive:             true,         // Is the app description active? true/false
      expandDescriptionLinkActive:   true,         // Is the link to expand the description enabled? true/false
      versionHistoryActive:          true,         // Is version history visible?
    },
    additional: {                                  //******** Additional settings on a single dapp landing page. *******//
      feeToUseActive:                true,         // Is the fee to use this dapp text visible? true/false
      inDAppPurchasesActive:         true,         // Is in-dapp purchases text visible? true/false
      licenseActive:                 true,         // Is the license text visible? true/false
      categoryActive:                true,         // Is the category text visible? true/false
      authorActive:                  true,         // Is the author text visible? true/false
      initialReleaseDateActive:      true,         // Is the initial release date text visible? true/false
      lastUpdateActive:              true,         // Is the last update text visible? true/false
      currentVersion:                true,         // Is the current version text visible? true/false
      reportActive:                  true,         // Is the report dapp text link visible? true/false
    },
    social: {                                      //******** Social icons on a single dapp landing page. *******//
        active:                      true,         // Are author social icons active? true/false
        githubActive:                true,         // Is the Github link active? true/false
        facebookActive:              true,         // Is the Facebook link active? true/false
        twitterActive:               true,         // Is the Twitter link active? true/false
        mailActive:                  true          // Is the Mail link active? true/false
    },
    statisticsActive:                false,        // Are statistics for this dApp visible? true/false
    moreFromThisDeveloper:           false,        // Is the "more from this developer" for this dApp visible? true/false
    moreFromThisDeveloperLimit:      5             // What is the max number of dApps from this developer that will be shown.

  },
  dappCategories: {                                //******** Settings pertaining to dApp categories in the main sidebar. ********//
    categories: [
      {
        name:        "All Categories",             // The Name of the cateory
        link:        "all-categories",             // The SEO slug for the category
        icon:        "IoMdFolderOpen",             // The icon class name
        description: "",                           // The category description.
        order:       1,                            // The order this category should appear in the list.
        active:      true                          // Is this category active? true/false
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
        name:    "Audits",                         // Name of link.
        link:    "/audits",                        // Link of the link.
        order:   1,                                // Order in wich the link should display.
        active:  true                              // Is this link active? true/false
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
