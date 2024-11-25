// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Snackbar from '@mui/material/Snackbar'
import type { SnackbarOrigin } from '@mui/material/Snackbar'
import {Alert} from "@mui/material";

type State = SnackbarOrigin & {
  open: boolean
}

type SnackbarPositionedProps = {
  open: boolean
}

const Toast = ({ open: propOpen } : SnackbarPositionedProps) => {
  // States
  const [state, setState] = useState<State>({
    open: false,
    vertical: 'top',
    horizontal: 'right'
  })

  // Sync the open state with the prop
  useEffect(() => {
    setState(prevState => ({ ...prevState, open: propOpen }))
  }, [propOpen])

  const { vertical, horizontal, open } = state

  const handleClose = () => {
    setState({ ...state, open: false })
  }

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      color={"success"}
      autoHideDuration={10000}
      key={vertical + horizontal}
      anchorOrigin={{ vertical, horizontal }}
    >
      <Alert variant='filled' severity='success' onClose={handleClose} className='is-full shadow-xs items-center'>
        Your entry has been saved successfully.
      </Alert>
    </Snackbar>
  )
}

export default Toast
