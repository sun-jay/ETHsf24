from web3 import Web3
import dotenv
import os

dotenv.load_dotenv()

# SKALE Testnet RPC URL
skale_rpc_url = "https://testnet.skalenodes.com/v1/giant-half-dual-testnet"
wallet_address = "0x7aCB8c6792477f7b201b7F3ECfAc93E554Bf046A"  # Your public wallet address
private_key = os.getenv("WALLET_KEY")
private_key = '0x' + private_key
print(private_key)

# Replace these with your actual contract ABI and bytecode
abi = [
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
with open("contract_bytes.txt", "r") as f:
    bytecode = f.read()

# Connect to SKALE Testnet
web3 = Web3(Web3.HTTPProvider(skale_rpc_url))

# Ensure we're connected
if not web3.is_connected():
    raise Exception("Failed to connect to SKALE Testnet")
print("Connected to SKALE Testnet")

# Get the nonce (transaction count) for the wallet
nonce = web3.eth.get_transaction_count(wallet_address)

# Build the contract deployment transaction
transaction = {
    'from': wallet_address,
    'nonce': nonce,
    'gas': 2000000,  # Adjust gas limit based on your contract
    'gasPrice': web3.to_wei('1', 'gwei'),  # SKALE typically has low gas fees
    'data': bytecode,  # The bytecode of the contract
    'chainId': 974399131 
}

# Sign the transaction with the private key
signed_transaction = web3.eth.account.sign_transaction(transaction, private_key)

# Send the transaction
tx_hash = web3.eth.send_raw_transaction(signed_transaction.raw_transaction)

# Wait for the transaction receipt (deployment confirmation)
tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

# Output the deployed contract address
print(f"Contract deployed at address: {tx_receipt.contractAddress}")
