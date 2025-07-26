"use client"
import React from 'react'
import { ClerkProvider } from '@clerk/nextjs'

const layout = ({children}: {children:React.ReactNode}) => {
  return (
    <ClerkProvider>
        {children}
    </ClerkProvider>
  )
}

export default layout
