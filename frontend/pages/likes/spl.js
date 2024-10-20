import Spline from '@splinetool/react-spline';

export default function App() {

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
    <div className="spline-container">
      <Spline scene="https://prod.spline.design/ocRQlSn4wXnKB-hN/scene.splinecode" />
      <button className="download-button" onClick={handleDownload}>
        Download Our Public Weights
      </button>
    </div>
  );
}
