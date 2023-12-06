require('./DB/Config');
const express = require('express');
const User = require('./DB/User');
const app = express();
const cors = require('cors');
const Hashes = require('./DB/Hashes');
app.use(cors());

const bodyParser = require('body-parser');

const res = require('express/lib/response');
const fs = require('fs')

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

Web3 = require("web3");
// Setting up a HttpProvider
web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
// console.log("Accounts:");
solc = require("solc");
// Reading the file
let file = fs.readFileSync("D://BVB//6th Semister//MP//Final Implimentation//Minor//webSite//client//src//contracts//store.sol").toString()

// input structure for solidity compiler
var input = {
    language: "Solidity", sources: {
        "store.sol": {
            content: file,
        },
    },
    settings: {
        outputSelection: {
            "*": {
                "*": ["*"],
            },
        },
    },
};
var output = JSON.parse(solc.compile(JSON.stringify(input))); console.log("Result : ", output);
// let ABI=output.contracts['store.sol']['storehash'].abi
let ABI = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "data",
                "type": "string"
            }
        ],
        "name": "set_test",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "get",
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


// let bytecode=output.contracts["store.sol"]["storehash"].evm.bytecode.object
let bytecode = "608060405234801561001057600080fd5b506104a8806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80635613a7961461003b5780636d4ce63c14610057575b600080fd5b61005560048036038101906100509190610234565b610075565b005b61005f61008f565b60405161006c91906102b6565b60405180910390f35b806000908051906020019061008b929190610121565b5050565b60606000805461009e9061038c565b80601f01602080910402602001604051908101604052809291908181526020018280546100ca9061038c565b80156101175780601f106100ec57610100808354040283529160200191610117565b820191906000526020600020905b8154815290600101906020018083116100fa57829003601f168201915b5050505050905090565b82805461012d9061038c565b90600052602060002090601f01602090048101928261014f5760008555610196565b82601f1061016857805160ff1916838001178555610196565b82800160010185558215610196579182015b8281111561019557825182559160200191906001019061017a565b5b5090506101a391906101a7565b5090565b5b808211156101c05760008160009055506001016101a8565b5090565b60006101d76101d2846102fd565b6102d8565b9050828152602081018484840111156101f3576101f2610452565b5b6101fe84828561034a565b509392505050565b600082601f83011261021b5761021a61044d565b5b813561022b8482602086016101c4565b91505092915050565b60006020828403121561024a5761024961045c565b5b600082013567ffffffffffffffff81111561026857610267610457565b5b61027484828501610206565b91505092915050565b60006102888261032e565b6102928185610339565b93506102a2818560208601610359565b6102ab81610461565b840191505092915050565b600060208201905081810360008301526102d0818461027d565b905092915050565b60006102e26102f3565b90506102ee82826103be565b919050565b6000604051905090565b600067ffffffffffffffff8211156103185761031761041e565b5b61032182610461565b9050602081019050919050565b600081519050919050565b600082825260208201905092915050565b82818337600083830152505050565b60005b8381101561037757808201518184015260208101905061035c565b83811115610386576000848401525b50505050565b600060028204905060018216806103a457607f821691505b602082108114156103b8576103b76103ef565b5b50919050565b6103c782610461565b810181811067ffffffffffffffff821117156103e6576103e561041e565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f830116905091905056fea26469706673582212206f1908fb52cfaf769127e6aebf702613e50d0c896c419b61f737b0240231166c64736f6c63430008070033"
var contract = new web3.eth.Contract(ABI);



app.use(express.json());


app.post('/register', async (req, res) => {
    console.log(req.body);
    let user = new User(req.body);
    let data = await user.save();
    console.log(data);
    res.send(data);
})


app.post('/login', async (req, res) => {
    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select('-password');
        if (user) {
            res.send(user);
        }
        else {
            res.send({ result: "no user found" });
        }
    } else {
        res.send({ result: "no user found" });
    }

})

var caddr;
let contractAddressVar;

app.post('/addHash', async (req, res) => {
    let hashnode = new Hashes(req.body);
    // console.log(hashnode.name)
    // console.log(hashnode.hash)
    let data = await hashnode.save();
    console.log(data)
    addBlockChain(hashnode.hash);
    // console.log(data.hash);
    res.send(data);
})

const addBlockChain = async (fileHash) => {
    web3.eth.getAccounts().then(async (accounts) => {
        console.log("Accounts:", accounts);
        mainAccount = accounts[0];
        console.log("Default Account:", mainAccount);
        contract
            .deploy({ data: bytecode })
            .send({ from: mainAccount })
            .on("receipt", (receipt) => {
                caddr = receipt.contractAddress;
                console.log("Contract Address:", receipt.contractAddress);
                contractAddressVar = receipt.contractAddress;
                // console.log("from variable",contractAddressVar);
            }).then((initialContract) => {
                initialContract.methods.set_test(fileHash).send({ from: "0x4659db3e2a62122479320c103ddba012277daa36" });
            });
    });
}


app.post('/searchHash', async (req, res) => {
    // console.log(contractAddressVar);
    if(req.body.hash){
        let hashVal = await Hashes.findOne(req.body);
        if(hashVal){
            console.log("Hash from newly uploaded file", req.body.hash);
            let hashValue = retrieveBlockchain(contractAddressVar);
            res.send(hashVal);
        }
        else{
            res.send({result:"no user found"});
        }
    }
    else{
        res.send({result:"no user found"});
    }
})

const retrieveBlockchain = async (contractAddressVar) => {
    let Contract = new web3.eth.Contract(ABI, contractAddressVar);
    Contract.methods.get().call({ from: '0x9d19CD6d26C4Cf85f0c9f76eDcbc43C10f5BB1F3' }).then((hash) => {
        console.log("Hash from Ethereum Blockchain :", hash);
        });
}

app.listen(3500);