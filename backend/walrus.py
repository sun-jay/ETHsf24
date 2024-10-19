import requests

AGGREGATOR = "https://aggregator.walrus-testnet.walrus.space"
PUBLISHER = "https://publisher.walrus-testnet.walrus.space"

def upload(file_path) -> str:
    """
    Uploads a file to the publisher endpoint and returns the blob ID.

    :param file_path: Path to the file to upload.
    :return: The blob ID as a string.
    """
    url = f"{PUBLISHER}/v1/store?epochs=5"
    headers = {'Content-Type': 'application/octet-stream'}

    try:
        with open(file_path, 'rb') as f:
            response = requests.put(url, data=f, headers=headers)
        response.raise_for_status()
        json_response = response.json()
        print(json_response)
        if 'alreadyCertified' in json_response:
            blob_id = json_response['alreadyCertified']['blobId']
            return blob_id

        blob_id = json_response['newlyCreated']['blobObject']['blobId']
        return blob_id
    except Exception as e:
        print(f"Error uploading file: {e}")
        raise

def get(blob_id, save_path) -> bool:
    """
    Downloads a blob from the aggregator endpoint and saves it to the specified path.

    :param blob_id: The blob ID to download.
    :param save_path: Path where the downloaded file will be saved.
    :return: True if successful, False otherwise.
    """
    url = f"{AGGREGATOR}/v1/{blob_id}"

    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()
        with open(save_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        return True
    except Exception as e:
        print(f"Error downloading blob: {e}")
        return False

if __name__ == "__main__":
    # Test the upload and download functions
    file_path = "./uploads/logo.png"
    upload(file_path)
    