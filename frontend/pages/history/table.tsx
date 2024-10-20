import React, { useEffect, useState } from 'react';
import { get_items } from '../../components/browse-videos/web3.js';
// import './ItemsTable.css';  // Import the CSS file

interface Video {
  filename: string;
  status: boolean;
  key: string;
  sender: string;
  message: string;
}

export default function ItemsTable() {
  const [items, setItems] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // Fetch items from the chain
        const p = await get_items();
        console.log('RES FROM CHAIN', p);

        // Parse the items into an array of Video objects
        const parsedVideos: Video[] = p.map((video: [string, boolean, string, string, string]) => {
          return {
            filename: video[0],
            status: video[1],
            key: video[2],
            sender: video[3],
            message: video[4] == '' ? 'N/A' : video[4],
          };
        });

        // reverses the order of the videos
        parsedVideos.reverse();
        // Filter out items where status is false
        // const filteredVideos = parsedVideos.filter((video) => video.status === true);

        // Save the filtered items into state
        setItems(parsedVideos);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching or parsing videos:', error);
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (items.length === 0) {
    return <div>No items to display.</div>;
  }

  return (
    <div className="table-container">
      <h2>Items from get_items</h2>
      <table className="video-table">
        <thead>
          <tr>
            <th>Filename</th>
            <th>Status</th>
            <th>Key</th>
            <th>Sender</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {items.map((video, index) => (
            <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
              <td>{video.filename}</td>
              <td>{video.status ? 'True' : 'False'}</td>
              <td>{video.key}</td>
              <td>{video.sender}</td>
              <td>{video.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
