const Web3 = require('web3');
const axios = require('axios');
const { exception } = require('console');
//const { Contract } = require('web3-eth-contract');
const rpcURL = "wss://goerli.infura.io/ws/v3/c534ef8f240747dcb3df378605c8094d";

//PROJECT ID
//c534ef8f240747dcb3df378605c8094d
//PROJECT SECRET
//1b1c59c2c03a4d5888fedf048ca6a165

//ENDPOINTS
//RINKEBY
//https://rinkeby.infura.io/v3/c534ef8f240747dcb3df378605c8094d
//wss://rinkeby.infura.io/ws/v3/c534ef8f240747dcb3df378605c8094d


const web3 = new Web3(rpcURL);

var web3Service ={};
const urls = [
    "alex",
    "anson_lo",
    "ariana",
    "candy",
    "day",
    "hero_man",
    "hinscheung",
    "jack",
    "john",
    "keungto",
    "kitty",
    "prince_joyce",
    "serini",
    "taylor_swift",
    "tsai_chin",
    "woodwood"
]
web3Service.getNFTMetadata = async (address, id) =>{

    const web3 = new Web3(rpcURL);
    const contract = new web3.eth.Contract(sampleERC721ABI, address);

    var url = await contract.methods.tokenURI(id).call();
    web3.currentProvider.disconnect();


    const sendGetRequest = async (url) => {
        try {
            const resp = await axios.get(url);
            //console.log(JSON.stringify(resp.data)); 
            return JSON.stringify(resp.data);
        } catch (err) {
            // Handle Error Here
            console.error("Error jor");
            return undefined;
        };
    };
    var ret = await sendGetRequest(url);
    return ret;
};

web3Service.getApproverAddress = async (address, index) =>{
    /*const contractAbi = web3.abi.encodeFunctionSignature();
    const contract = web3.Contract(contractAbi, address);*/
    //should get from web3, need to implement

    const sendGetRequest = async (address, index) => {
        try {
            //TO BE IMPLEMENT web3
            //dummy
            //var approver = ["0x72e3585237f87acf605e17540a588b72c3edd769","0x72e3585237f87acf605e17540a588b72c3edd769","0x72e3585237f87acf605e17540a588b72c3edd769"];
            
            const web3 = new Web3(rpcURL);
            const contract = new web3.eth.Contract(sampleERC721ABI, address);

            var owner = await contract.methods.ownerOf(index).call();
            owner = owner.toLowerCase();
            return owner;
        } catch (err) {
            // Handle Error Here
            console.error("Error jor");
            return undefined;
        };
    };
    var ret = await sendGetRequest(address, index);
    return ret;
};

web3Service.getSignatureAndVerify = async(doc, hash, approverAddr) => {

    const sendGetRequest = async (doc, hash, approverAddr) => {
        try {
            const web3 = new Web3(rpcURL);
            const contract = new web3.eth.Contract(DMLABI, "0x90e3Cf8B3077E5d2C83c0F7764836D46cca7376c");

            var signature = await contract.methods.get(hash).call();
            const msg = doc.applicant+doc.usage+doc.date+doc.license+doc.applicantAddress+doc.status;
            const verSig = web3.eth.accounts.recover(msg,signature);
            return [signature, verSig];
        } catch (err) {
            // Handle Error Here
            console.error("Error jor");
            return undefined;
        };
    };
    var ret = await sendGetRequest(doc, hash, approverAddr);
    return ret;

}

const sampleERC721ABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "uri",
				"type": "string"
			}
		],
		"name": "safeMint",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getApproved",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

const DMLABI = [
    {
      inputs: [
        {
          internalType: 'string',
          name: '_addr',
          type: 'string',
        },
      ],
      name: 'remove',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'string',
          name: '_addr',
          type: 'string',
        },
        {
          internalType: 'string',
          name: '_i',
          type: 'string',
        },
      ],
      name: 'set',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'string',
          name: '_addr',
          type: 'string',
        },
      ],
      name: 'get',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string',
        },
      ],
      name: 'myMap',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ];



module.exports = web3Service;