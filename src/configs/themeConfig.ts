/*
 * If you change the following items in the config object, you will not see any effect in the local development server
 * as these are stored in the cookie (cookie has the highest priority over the themeConfig):
 * 1. mode
 * 2. skin
 * 3. semiDark
 * 4. layout
 * 5. navbar.contentWidth
 * 6. contentWidth
 * 7. footer.contentWidth
 *
 * To see the effect of the above items, you can click on the reset button from the Customizer
 * which is on the top-right corner of the customizer besides the close button.
 * This will reset the cookie to the values provided in the config object below.
 *
 * Another way is to clear the cookie from the browser's Application/Storage tab and then reload the page.
 */

// Type Imports
import type { Mode, Skin, Layout, LayoutComponentPosition, LayoutComponentWidth } from '@core/types'

type Navbar = {
  type: LayoutComponentPosition
  contentWidth: LayoutComponentWidth
  floating: boolean
  detached: boolean
  blur: boolean
}

type Footer = {
  type: LayoutComponentPosition
  contentWidth: LayoutComponentWidth
  detached: boolean
}

export type Config = {
  templateShortName: string
  templateName: string
  homePageUrl: string
  settingsCookieName: string
  mode: Mode
  skin: Skin
  semiDark: boolean
  layout: Layout
  layoutPadding: number
  navbar: Navbar
  contentWidth: LayoutComponentWidth
  compactContentWidth: number
  footer: Footer
  disableRipple: boolean
}

const themeConfig: Config = {
  templateShortName: 'BIS',
  templateName: 'Beer Inventory System',
  homePageUrl: '/inventory_BK',
  settingsCookieName: 'materialize-mui-next-demo-1',
  mode: 'system', // 'system', 'light', 'dark'
  skin: 'default', // 'default', 'bordered'
  semiDark: true, // true, false
  layout: 'vertical', // 'vertical', 'collapsed', 'horizontal'
  layoutPadding: 24, // Common padding for header, content, footer layout components (in px)
  compactContentWidth: 1440, // in px
  navbar: {
    type: 'fixed', // 'fixed', 'static'
    contentWidth: 'wide', // 'compact', 'wide'
    floating: false, //! true, false (This will not work in the Horizontal Layout)
    detached: true, //! true, false (This will not work in the Horizontal Layout or floating navbar is enabled)
    blur: true // true, false
  },
  contentWidth: 'wide', // 'compact', 'wide'
  footer: {
    type: 'static', // 'fixed', 'static'
    contentWidth: 'wide', // 'compact', 'wide'
    detached: true //! true, false (This will not work in the Horizontal Layout)
  },
  disableRipple: false // true, false
}

export default themeConfig
