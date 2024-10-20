const { ethers, JsonRpcProvider } = require('ethers');

// fn get items
export async function get_items() {
    // SKALE Testnet RPC URL and wallet details
    const skaleRpcUrl = "https://testnet.skalenodes.com/v1/giant-half-dual-testnet";
    const walletAddress = "0x7aCB8c6792477f7b201b7F3ECfAc93E554Bf046A";

    // Load contract ABI from file
    const abi = [
        {
            "inputs": [],
            "name": "getAllUploads",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "string",
                            "name": "filename",
                            "type": "string"
                        },
                        {
                            "internalType": "bool",
                            "name": "status",
                            "type": "bool"
                        },
                        {
                            "internalType": "string",
                            "name": "key",
                            "type": "string"
                        },
                        {
                            "internalType": "address",
                            "name": "walletAddress",
                            "type": "address"
                        },
                        {
                            "internalType": "string",
                            "name": "message",
                            "type": "string"
                        }
                    ],
                    "internalType": "struct VideoUploadTracker.VideoInfo[]",
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_user",
                    "type": "address"
                }
            ],
            "name": "getAllUploadsByUser",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "string",
                            "name": "filename",
                            "type": "string"
                        },
                        {
                            "internalType": "bool",
                            "name": "status",
                            "type": "bool"
                        },
                        {
                            "internalType": "string",
                            "name": "key",
                            "type": "string"
                        },
                        {
                            "internalType": "address",
                            "name": "walletAddress",
                            "type": "address"
                        },
                        {
                            "internalType": "string",
                            "name": "message",
                            "type": "string"
                        }
                    ],
                    "internalType": "struct VideoUploadTracker.VideoInfo[]",
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_filename",
                    "type": "string"
                },
                {
                    "internalType": "bool",
                    "name": "_status",
                    "type": "bool"
                },
                {
                    "internalType": "string",
                    "name": "_key",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_message",
                    "type": "string"
                }
            ],
            "name": "uploadVideoInformation",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]
    
    // Contract address (replace with the deployed contract address)
    const contractAddress = "0x4d0cF36E43ea99C020676f82FA39A096d97502DD";
    
    // Connect to SKALE Testnet
    const provider = new JsonRpcProvider(skaleRpcUrl);
    
    // Get the contract instance
    const contract = new ethers.Contract(contractAddress, abi, provider);
    
    // Function to upload video information
    async function uploadVideoInformation(filename, status, key, message, signer) {
        try {
            const contractWithSigner = contract.connect(signer);
            const tx = await contractWithSigner.uploadVideoInformation(filename, status, key, message);
            await tx.wait();
            console.log("Video information uploaded successfully");
        } catch (error) {
            console.error("Error uploading video information:", error);
        }
    }
    
    // Function to get all uploads
    async function getAllUploads() {
        try {
            const allUploads = await contract.getAllUploads();
            return allUploads;
        } catch (error) {
            console.error("Error getting all uploads:", error);
            return [];
        }
    }
    
    // Function to get all uploads by user
    async function getAllUploadsByUser(userAddress) {
        try {
            const uploadsByUser = await contract.getAllUploadsByUser(userAddress);
            return uploadsByUser;
        } catch (error) {
            console.error("Error getting uploads by user:", error);
            return [];
        }
    }

    return getAllUploads()
}
