// dApp Store Configuration File.
const config = {
  general: {
    dappStoreName: "SNOWFLAKE",
    dappSearchPlaceholderText: "Search the dApp Store",
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
    caegoryies: [
      {
        name:    "All Categories",
        link:    "/all-categories",
        icon:    "ion-android-folder-open",
        order:   1,
        active:  "yes"
      },
      {
        name:    "Entertainment",
        link:    "/entertainment",
        icon:    "ion-ios-film",
        order:   2,
        active:  "yes"
      },
      {
        name:    "Fintech",
        link:    "/fintech",
        icon:    "ion-card",
        order:   3,
        active:  "yes"
      },
      {
        name:    "Business",
        link:    "/business",
        icon:    "ion-ios-world",
        order:   4,
        active:  "yes"
      },
      {
        name:    "Gaming",
        link:    "/gaming",
        icon:    "ion-ios-game-controller-a",
        order:   5,
        active:  "yes"
      },
      {
        name:    "Community",
        link:    "/community",
        icon:    "ion-ios-people",
        order:   6,
        active:  "yes"
      },
      {
        name:    "Tools",
        link:    "/tools",
        icon:    "ion-ios-calculator",
        order:   7,
        active:  "yes"
      },
      {
        name:    "Other",
        link:    "/other",
        icon:    "ion-gear-a",
        order:   8,
        active:  "yes"
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
    filters: [
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
  }
}

export default config
