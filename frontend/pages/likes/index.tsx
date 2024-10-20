
import Ming from './spl'

export default function Likes() {

    const handleDownload = () => {
        // Create an empty Blob representing the content of the .pkl file
        const fileContent = new Blob([], { type: 'application/octet-stream' });
        
        // Create a link element and set the file to download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(fileContent);
        link.download = 'weights.pkl';  // Name of the file to be downloaded
    
        // Programmatically click the link to trigger the download
        link.click();
    
        // Clean up the URL object after download
        URL.revokeObjectURL(link.href);
      };
    return (
        <div>
    <Ming />
    <button className="download-button" onClick={handleDownload}>
        Download Our Public Weights
      </button>
    </div>
);
}