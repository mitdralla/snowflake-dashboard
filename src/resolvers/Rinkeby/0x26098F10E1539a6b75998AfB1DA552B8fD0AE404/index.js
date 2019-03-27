import { lazy } from 'react'

export default lazy(() => import('./PetFriendResolver'))

export { default as extraDataComponent } from './ExtraData'

export const ABI = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "ownerId",
				"type": "uint256"
			},
			{
				"name": "chipId",
				"type": "string"
			},
			{
				"name": "petType",
				"type": "string"
			},
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "desc",
				"type": "string"
			},
			{
				"name": "imgUrl",
				"type": "string"
			}
		],
		"name": "addPet",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "petId",
				"type": "uint256"
			},
			{
				"name": "claimerHydroId",
				"type": "uint256"
			}
		],
		"name": "claimLostReport",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "petId",
				"type": "uint256"
			}
		],
		"name": "confirmReward",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "ein",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "extraData",
				"type": "bytes"
			}
		],
		"name": "onAddition",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "bytes"
			}
		],
		"name": "onRemoval",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "ownerId",
				"type": "uint256"
			},
			{
				"name": "petId",
				"type": "uint256"
			},
			{
				"name": "sceneDesc",
				"type": "string"
			},
			{
				"name": "reward",
				"type": "uint256"
			}
		],
		"name": "putLostReport",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "ownerId",
				"type": "uint256"
			},
			{
				"name": "petId",
				"type": "uint256"
			}
		],
		"name": "removeLostReport",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_snowflakeAddress",
				"type": "address"
			}
		],
		"name": "setSnowflakeAddress",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "petId",
				"type": "uint256"
			}
		],
		"name": "unclaimLostReport",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "ownerId",
				"type": "uint256"
			},
			{
				"name": "petId",
				"type": "uint256"
			},
			{
				"name": "sceneDesc",
				"type": "string"
			},
			{
				"name": "reward",
				"type": "uint256"
			}
		],
		"name": "updateLostReport",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "ownerId",
				"type": "uint256"
			},
			{
				"name": "contactName",
				"type": "string"
			},
			{
				"name": "contactData",
				"type": "string"
			}
		],
		"name": "updateOwner",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "petId",
				"type": "uint256"
			},
			{
				"name": "chipId",
				"type": "string"
			},
			{
				"name": "petType",
				"type": "string"
			},
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "desc",
				"type": "string"
			},
			{
				"name": "imgUrl",
				"type": "string"
			}
		],
		"name": "updatePet",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "snowflakeAddress",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "petId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "chipId",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "date",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "status",
				"type": "uint8"
			},
			{
				"indexed": false,
				"name": "sceneDesc",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "reward",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "claimerEin",
				"type": "uint256"
			}
		],
		"name": "LostReportChanged",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "callOnAddition",
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
		"constant": true,
		"inputs": [],
		"name": "callOnRemoval",
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
		"constant": true,
		"inputs": [],
		"name": "getAllLostReportKeys",
		"outputs": [
			{
				"name": "",
				"type": "uint256[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "petId",
				"type": "uint256"
			}
		],
		"name": "getLostReport",
		"outputs": [
			{
				"name": "status",
				"type": "uint8"
			},
			{
				"name": "sceneDesc",
				"type": "string"
			},
			{
				"name": "reward",
				"type": "uint256"
			},
			{
				"name": "claimerHydroId",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "ownerId",
				"type": "uint256"
			}
		],
		"name": "getOwner",
		"outputs": [
			{
				"name": "contactName",
				"type": "string"
			},
			{
				"name": "contactData",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "ownerId",
				"type": "uint256"
			}
		],
		"name": "getOwnerPets",
		"outputs": [
			{
				"name": "",
				"type": "uint256[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "petId",
				"type": "uint256"
			}
		],
		"name": "getPet",
		"outputs": [
			{
				"name": "chipId",
				"type": "string"
			},
			{
				"name": "petType",
				"type": "string"
			},
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "desc",
				"type": "string"
			},
			{
				"name": "imgUrl",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "petId",
				"type": "uint256"
			}
		],
		"name": "getPetOwner",
		"outputs": [
			{
				"name": "ownerId",
				"type": "uint256"
			},
			{
				"name": "contactName",
				"type": "string"
			},
			{
				"name": "contactData",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "isOwner",
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
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "snowflakeAddress",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "snowflakeDescription",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "snowflakeName",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
] // eslint-disable-line

export const requiredAllowance = "1"

export { default as logo } from './logo.png'

