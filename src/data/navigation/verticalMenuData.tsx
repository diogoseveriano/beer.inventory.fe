// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'

const verticalMenuData = (): VerticalMenuDataType[] => [
  {
    label: 'Dashboard',
    href: '/inventory',
    icon: 'ri-inventory-smile-line'
  },
  {
    label: 'Configurations',
    href: '/configurations',
    icon: 'ri-information-line'
  }
]

export default verticalMenuData
