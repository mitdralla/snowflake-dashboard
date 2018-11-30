import React, { useState, Suspense } from 'react'
import { IconButton } from '@material-ui/core'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import { Button, Dialog, DialogActions, DialogContent } from '@material-ui/core';

export default function ResolverModal ({ ein, children: ResolverComponent }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <OpenInNewIcon />
      </IconButton>

      <Dialog
        fullScreen
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogContent>
          <Suspense fallback={<div />}>
            <ResolverComponent ein={ein} />
          </Suspense>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
