from web3 import Web3
import dotenv
import os
import json

from run_contract import send_to_chain

dotenv.load_dotenv()

# SKALE Testnet RPC URL
skale_rpc_url = "https://testnet.skalenodes.com/v1/giant-half-dual-testnet"
wallet_address = "0x7aCB8c6792477f7b201b7F3ECfAc93E554Bf046A"  # Your public wallet address
private_key = os.getenv("WALLET_KEY")
private_key = '0x' + private_key
print(private_key)

# load son from txt file
abi = json.loads(open("contract_abi.txt", "r").read())

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
print()
print(f"Contract deployed at address: {tx_receipt.contractAddress}")
print()

addr = tx_receipt.contractAddress

# send_to_chain("filename", False, 'key', 'message', addr=addr)
# send_to_chain("filename", False, 'key', 'message', addr=addr)

