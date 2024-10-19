import React, { useEffect, useState } from 'react';
import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";


// Define the props type
interface FileUploadPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const FileUploadPopup: React.FC<FileUploadPopupProps> = ({ isOpen, onClose }) => {
  const { primaryWallet } = useDynamicContext();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      console.debug('FileUploadPopup rendered');
    }
  }, [isOpen]);

  const resetState = () => {
    setIsUploading(false);
    setUploadSuccess(false);
    setUploadMessage('');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true); // Start upload process

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch('http://localhost:8000/upload/', {
        method: 'POST',
        headers: {
          'Wallet-Address': primaryWallet?.address == null ? '' : primaryWallet.address,
        },
        body: formData,
      });

      const data = await response.json();  // Wait for the backend response
      console.log(data);

      if (response.ok && data.status === 'True') {
        setUploadSuccess(true);
        setUploadMessage(data.message);
      } else if (data.status === 'False') {
        setUploadMessage(data.message);
      } else {
        setUploadMessage('Failed to upload file.');
      }

    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadMessage('Error uploading file.');
    }

    setIsUploading(false);
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <button onClick={() => { resetState(); onClose(); }} style={styles.closeButton}>
          &times;
        </button>

        <h3>Upload a File</h3>
        {isUploading ? (
          <p>Scanning content and uploading to Walrus...</p>
        ) : uploadMessage ? (
          <>
            <p>{uploadMessage}</p>
            <button onClick={() => { resetState(); onClose(); }}>Close</button>
          </>
        ) : (
          <input type="file" onChange={handleFileUpload} />
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  popup: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    textAlign: 'center',
    width: '300px',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '15px',
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
  },
};

export default FileUploadPopup;
