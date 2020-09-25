// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.


const repoUrl = "https://github.com/lampepfl/scala3-macro-tutorial";

const siteConfig = {
  title: "Scala 3 Macro Tutorial",
  tagline: "A tutorial to cover all the features involved in writing macros in Scala 3",

  url: "https://lampepfl.github.io/",
  baseUrl: "/scala3-macro-tutorial/",

  // Used for publishing and more
  projectName: "scala3-macro-tutorial",
  organizationName: "lampepfl",

  customDocsPath: 'mdoc/target/mdoc',

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    { doc: 'tutorial/introduction', label: 'Tutorial' },
    { doc: 'contributing', label: 'Contribute' },
    { href: repoUrl, label: "GitHub", external: true }
  ],

// TODO: request an apikey from algolia
//  algolia: {
//    apiKey: "f77e0c381ea8939fc6c34dc0e17ea492",
//    indexName: "scala-3-migration-guide"
//  },

  /* path to images for header/footer */
  headerIcon: 'img/dotty-logo-white.svg',
  footerIcon: 'img/dotty-logo-white.svg',
  favicon: 'img/dotty-logo.svg',

  /* Colors for website */
  colors: {
    primaryColor: '#ca445e',
    secondaryColor: '#224951',
  },

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Lato",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

  stylesheets: [
    'https://fonts.googleapis.com/css?family=Lobster&display=swap',
    'https://fonts.googleapis.com/css?family=Lato:400,700|Fira+Code:400,700&display=fallback'
  ],

  // This copyright info is used in /core/Footer.js and blog rss/atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} LAMP EPFL`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks
    theme: "github"
  },

  // Add custom scripts here that would be placed in <script> tags.
//  scripts: ['https://buttons.github.io/buttons.js'],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.

  /* Open Graph and Twitter card images */
  ogImage: "img/dotty-logo.svg",
  twitterImage: "img/dotty-logo.svg",

  editUrl: `${repoUrl}/edit/master/docs/`,

  repoUrl
};

module.exports = siteConfig;