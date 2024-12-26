// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import {Menu, MenuItem, MenuSection, SubMenu} from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'
import Divider from "@mui/material/Divider";
import {useSession} from "next-auth/react";

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const { data: session } = useSession()

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar



  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 17 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-fill' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <MenuSection label={"Management"} icon={<i className='ri-stock-line' />} />
        <SubMenu icon={<i className='ri-list-check' />} label={"Items & Variants"}>
          <MenuItem href={"/items/categories"}>Item Categories</MenuItem>
          <MenuItem href={"/items"}>Item & Variants</MenuItem>
        </SubMenu>
        <MenuItem href='/batches' icon={<i className='ri-list-check' />}>
          Batches
        </MenuItem>
        <MenuItem href='/productions' icon={<i className='ri-shopping-cart-line' />}>
          Productions
        </MenuItem>
        <MenuItem href='/stock' icon={<i className='ri-beer-fill' />}>
          Stock
        </MenuItem>
        <MenuItem href='/inventory' icon={<i className='ri-stock-line' />}>
          Inventory
        </MenuItem>
        <MenuItem href='/purchase-orders' icon={<i className='ri-shopping-cart-line' />}>
          Purchase Orders
        </MenuItem>
        <MenuItem href='/suppliers' icon={<i className='ri-box-1-fill' />}>
          Suppliers
        </MenuItem>
        <MenuItem href='/alerts' icon={<i className='ri-tools-line' />}>
          Alerts
        </MenuItem>
        <MenuSection label={"Configurations"} icon={<i className='ri-tools-line' />} />
        <MenuItem href='/company' icon={<i className='ri-tools-line' />}>
          Company Settings
        </MenuItem>
        <MenuItem href='/warehouses' icon={<i className='ri-database-line' />}>
          Warehouses
        </MenuItem>
        { session?.user && session.user.role == 'ADMIN' ?
        <MenuItem href='/users' icon={<i className='ri-user-fill' />}>
          Users
        </MenuItem> : <></> }
        {
          /*
          <MenuItem href='/customs' icon={<i className='ri-file-paper-line' />}>
          e-DIC / e-DUC
        </MenuItem>
          <MenuSection label={"Clients"} icon={<i className='ri-user-fill' />} />
        <MenuItem href='/purchase-orders' icon={<i className='ri-shopping-cart-line' />}>
          Clients
        </MenuItem>
        <MenuItem href='/invoices' icon={<i className='ri-file-paper-line' />}>
          Invoices
        </MenuItem>
        <MenuItem href='/purchase-orders' icon={<i className='ri-shopping-cart-line' />}>
          Orders
        </MenuItem>
        <MenuItem href='/purchase-orders' icon={<i className='ri-shopping-cart-line' />}>
          Shipping
        </MenuItem>
           */
        }
      </Menu>
      {/* <Menu
        popoutMenuOffset={{ mainAxis: 17 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-fill' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <GenerateVerticalMenu menuData={menuData(dictionary, params)} />
      </Menu> */}
    </ScrollWrapper>
  )
}

export default VerticalMenu
