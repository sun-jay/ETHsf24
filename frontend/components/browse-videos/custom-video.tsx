import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';

interface CustomVideoProps {
    blobID: string;    // The blob ID to fetch the video from the blob store
    title: string;     // Title or filename of the video
}

const AGGREGATOR = "https://aggregator.walrus-testnet.walrus.space";

const CustomVideo: React.FC<CustomVideoProps> = ({ blobID, title }) => {
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        // Function to fetch video from blob store using blobID
        const fetchVideoBlob = async () => {
            try {
                const url = `${AGGREGATOR}/v1/${blobID}`;
                console.log(url);
                const response = await fetch(url);
                if (response.ok) {
                    const blob = await response.blob();
                    const videoObjectUrl = URL.createObjectURL(blob);
                    setVideoUrl(videoObjectUrl);  // Set the video URL to be used in ReactPlayer
                } else {
                    console.error('Failed to fetch video from blob store');
                }
            } catch (error) {
                console.error('Error fetching video:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchVideoBlob();
    }, [blobID]);

    if (isLoading) {
        return <p style={{ color: 'white' }}>Retreiving Video From Walrus</p>; // White loading text
    }

    if (!videoUrl) {
        return <p style={{ color: 'white' }}>Failed to load video</p>; // White error text
    }

    return (
        <div style={{ color: 'white' }}>
                        <h1>{title}</h1>
            <ReactPlayer url={videoUrl} controls />
        </div>
    );
};

export default CustomVideo;
