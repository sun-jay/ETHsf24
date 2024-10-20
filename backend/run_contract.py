from web3 import Web3
import dotenv
import os
import json

def send_to_chain(filename, status, key, message, addr='0x7aCB8c6792477f7b201b7F3ECfAc93E554Bf046A'):

    # Load environment variables
    dotenv.load_dotenv()

    # SKALE Testnet RPC URL and wallet details
    skale_rpc_url = "https://testnet.skalenodes.com/v1/giant-half-dual-testnet"
    wallet_address = "0x7aCB8c6792477f7b201b7F3ECfAc93E554Bf046A"
    private_key = os.getenv("WALLET_KEY")
    private_key = '0x' + private_key

    # ABI of your contract
    abi = json.loads(open("contract_abi.txt", "r").read())

    # Contract address (replace with the deployed contract address)
    contract_address = addr

    # Connect to SKALE Testnet
    web3 = Web3(Web3.HTTPProvider(skale_rpc_url))

    # Ensure we're connected
    if not web3.is_connected():
        raise Exception("Failed to connect to SKALE Testnet")
    print("Connected to SKALE Testnet")

    # Get the contract instance
    contract = web3.eth.contract(address=contract_address, abi=abi)


    # Get the nonce (transaction count) for the wallet
    nonce = web3.eth.get_transaction_count(wallet_address)

    # Build the transaction to call the uploadVideoInformation function
    transaction = contract.functions.uploadVideoInformation(
        filename,  # _filename (string)
        status,    # _status (bool)
        key,       # _key (string)
        message    # _message (string)
    ).build_transaction({
        'from': wallet_address,
        'nonce': nonce,
        'gas': 2000000,  # Adjust the gas limit based on your function complexity
        'gasPrice': web3.to_wei('1', 'gwei'),  # SKALE network, low gas fees
        'chainId': 974399131  # Chain ID for SKALE
    })

    # Sign the transaction with your private key
    signed_transaction = web3.eth.account.sign_transaction(transaction, private_key)

    # Send the signed transaction
    tx_hash = web3.eth.send_raw_transaction(signed_transaction.raw_transaction)

    # Wait for the transaction receipt
    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

    # Output the transaction hash
    print(f"Transaction hash: {web3.to_hex(tx_hash)}")
    print(f"Transaction status: {tx_receipt.status}")
