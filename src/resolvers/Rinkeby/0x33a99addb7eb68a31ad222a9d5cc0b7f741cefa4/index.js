import { lazy } from 'react'

export default lazy(() => import('./HelloWorld'))

export const requiredAllowance = "1500"

export { default as logo } from './HelloWorld.jpg'
