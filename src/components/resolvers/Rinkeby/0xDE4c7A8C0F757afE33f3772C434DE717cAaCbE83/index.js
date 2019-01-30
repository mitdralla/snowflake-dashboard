import { lazy } from 'react'

export default lazy(() => import('./Oxide'))

export const ABI = [
	{
		"constant": true,
		"inputs": [
			{
				"name": "self",
				"type": "AddressSet.Set storage"
			},
			{
				"name": "other",
				"type": "address"
			}
		],
		"name": "contains",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "self",
				"type": "AddressSet.Set storage"
			},
			{
				"name": "other",
				"type": "address"
			}
		],
		"name": "remove",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "self",
				"type": "AddressSet.Set storage"
			},
			{
				"name": "other",
				"type": "address"
			}
		],
		"name": "insert",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "self",
				"type": "AddressSet.Set storage"
			}
		],
		"name": "length",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]


export const requiredAllowance = "0"

export { default as logo } from './logo.png'
