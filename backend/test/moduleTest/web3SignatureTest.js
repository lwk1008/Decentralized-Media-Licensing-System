const Web3 = require('web3');


const rpcURL = "wss://goerli.infura.io/ws/v3/c534ef8f240747dcb3df378605c8094d";

const address = "0x1c747117eFB836f0E995BE7642Ab96a2090E1e66";

async function test(){
    const web3 = new Web3(rpcURL);

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

    const contract = new web3.eth.Contract(DMLABI, "0x90e3Cf8B3077E5d2C83c0F7764836D46cca7376c");

    var signature = await contract.methods.get("387febec6fcc695ba6274bddac28e5c06eca235bddedda99d478a3eb2e00ad44").call();
    console.log(signature);
    var doc = {
        applicant: "abc",
        usage: "abc",
        license: "0",
        applicantAddress: "0xc5424ab9ac5af5a24cdda71b9f0b2a0abbdd23d1"
    }
    const msg = doc.applicant+doc.usage+doc.date+doc.license+doc.applicantAddress+"1";
    console.log(web3.eth.accounts.recover(msg,signature));
    web3.currentProvider.disconnect();
}
test();

