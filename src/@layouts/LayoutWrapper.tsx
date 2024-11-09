'use client'

// React Imports
import type { ReactElement } from 'react'

// Type Imports
import type { SystemMode } from '@core/types'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import useLayoutInit from '@core/hooks/useLayoutInit'
import {getSession, SessionProvider} from "next-auth/react";
import CheckLogStatus from "@components/CheckLogStatus";

type LayoutWrapperProps = {
  systemMode: SystemMode
  verticalLayout: ReactElement
  horizontalLayout: ReactElement
}

const LayoutWrapper = (props: LayoutWrapperProps) => {
  // Props
  const { systemMode, verticalLayout, horizontalLayout } = props

  // Hooks
  const { settings } = useSettings()
  const session = getSession()

  useLayoutInit(systemMode)

  // Return the layout based on the layout context
  return (
    <SessionProvider session={session}>
      <CheckLogStatus />
      <div className='flex flex-col flex-auto' data-skin={settings.skin}>
        {settings.layout === 'horizontal' ? horizontalLayout : verticalLayout}
      </div>
    </SessionProvider>
  )
}

export default LayoutWrapper
