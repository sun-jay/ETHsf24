from web3 import Web3
import dotenv
import os

# Load environment variables
dotenv.load_dotenv()

# SKALE Testnet RPC URL and wallet details
skale_rpc_url = "https://testnet.skalenodes.com/v1/giant-half-dual-testnet"
wallet_address = "0x7aCB8c6792477f7b201b7F3ECfAc93E554Bf046A"

# ABI of your contract
abi = [
    # ABI of the contract (same as used for deployment)
]

# Contract address (replace with the deployed contract address)
contract_address = "0xYourDeployedContractAddress"  # Use the contract address from the deployment receipt

# Connect to SKALE Testnet
web3 = Web3(Web3.HTTPProvider(skale_rpc_url))

# Ensure we're connected
if not web3.is_connected():
    raise Exception("Failed to connect to SKALE Testnet")
print("Connected to SKALE Testnet")

# Get the contract instance
contract = web3.eth.contract(address=contract_address, abi=abi)

# 1. Read all uploads using getAllUploads (returns an array of VideoInfo)
def get_all_uploads():
    all_uploads = contract.functions.getAllUploads().call()
    return all_uploads

# 2. Optionally, read uploads by user using getAllUploadsByUser
def get_uploads_by_user(user_address):
    uploads_by_user = contract.functions.getAllUploadsByUser(user_address).call()
    return uploads_by_user

# Example usage: Read all uploads from the smart contract
all_uploaded_videos = get_all_uploads()

# Print all uploaded videos
for video in all_uploaded_videos:
    filename = video[0]  # _filename
    status = video[1]    # _status
    key = video[2]       # _key
    wallet_address = video[3]  # walletAddress
    message = video[4]   # _message

    print(f"Filename: {filename}, Status: {status}, Key: {key}, Wallet Address: {wallet_address}, Message: {message}")

# Example usage: Read uploads by a specific user
user_uploaded_videos = get_uploads_by_user(wallet_address)
print(f"User's uploads: {user_uploaded_videos}")
