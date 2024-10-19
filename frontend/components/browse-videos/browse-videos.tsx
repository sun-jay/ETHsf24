import { Fragment, useCallback, useEffect, useState } from 'react';
import React, { ChangeEvent, FormEvent } from 'react';
import axios from 'axios'; // Import axios for making API requests
import styles from './browse-videos.module.scss';
import MiniSidebar from '../mini-sidebar/mini-sidebar';
import { IYoutubeVideoItem } from '@/lib/ui/models/youtube-video-list.model';
import VideoThumbnail from '@/lib/ui/components/video-thumbnail/video-thumbnail';
import { useAppSelector } from '@/store/hooks';
import { selectSearchQuery } from '@/store/reducers/video.reducer';
import { useSearchList } from '@/lib/ui/hooks/useSearchList';
import { useVideoList } from '@/lib/ui/hooks/useVideoList';
import BrowserVideosLoader from './browse-videos-loader/browse-videos-loader';
import BrowseVideosEmpty from './browse-videos-empty/browse-videos-empty';
import BrowseVideosError from './browse-videos-error/browse-videos-error';
import CustomVideo from './custom-video';
import Link from 'next/link';

export default function BrowserVideos() {
    const [videoIds, setVideoIds] = useState<string | undefined>();
    const [customVideoItems, setCustomVideoItems] = useState<any[]>([]); // State for custom video items
    const searchQuery = useAppSelector(selectSearchQuery);
    const { fetchSeachItems, searchItems, isSearchItemsLoading, searchItemsError } = useSearchList();
    const { fetchVideoItems, videoItems } = useVideoList();

    const getVideoDetail = useCallback((id: string | undefined): IYoutubeVideoItem | undefined => {
        return videoItems?.find((videoItem) => videoItem.items[0].id === id)?.items?.[0];
    }, [videoItems]);

    useEffect(() => {
        const ids = searchItems?.map((item) => item.id?.videoId).join(',');
        setVideoIds(ids);
    }, [searchItems]);

    useEffect(() => {
        fetchSeachItems({ query: searchQuery });
    }, [searchQuery, fetchSeachItems]);

    useEffect(() => {
        fetchVideoItems({ id: videoIds });
    }, [videoIds, fetchVideoItems]);

    // New effect to fetch custom video items from /get_items and store in state
    useEffect(() => {
        const fetchCustomItems = async () => {
            try {
                const response = await axios.get('http://localhost:8000/get_items'); // Adjust the URL based on your backend configuration
                const r = response.data;    
                console.log('Videos:', r);
                // parse r into arr of json objects
                
                var j = JSON.parse(r);

                console.log('Custom video items:', j);
                setCustomVideoItems(j);
                // setCustomVideoItems([1,2,3,4,5]);
            } catch (error) {
                console.error('Error fetching custom video items:', error);
            }
        };

        fetchCustomItems();
    }, []); // This runs on mount (empty dependency array)

    if (searchItemsError) {
        return <BrowseVideosError />;
    }

    if (!isSearchItemsLoading && !searchItemsError && !searchItems?.length) {
        return <BrowseVideosEmpty />;
    }

    if (isSearchItemsLoading) {
        return <BrowserVideosLoader />;
    }

    return (
        <Fragment>
            <div className={styles.browseVideos}>
                <div className={styles.browseVideos__sidenav}>
                    <MiniSidebar className={styles.miniSidebarWrapper} />
                </div>

                <div className={styles.browseVideosList}>
                    {/* Render the custom video items */}
                    {Array.isArray(customVideoItems) && customVideoItems.length > 0 && (
                        <div>
                            <h2>Custom Video Items</h2>
                            {customVideoItems.map((item, index) => (
                                <div key={index} className={styles.customVideoItem}>
                                    <CustomVideo
                                        blobID={item.key} // Pass blobID
                                        title={item.filename} // Pass title or filename
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                    

                    {/* Existing video search logic */}
                    {/* {searchItems?.slice(0, 1)?.map((searchItem, index) => {
                        return (
                            <div className={styles.videoPlayer} key={index}>
                                <VideoThumbnail
                                    searchItem={searchItem}
                                    videoDetail={getVideoDetail(searchItem.id?.videoId)}
                                    isNowPlaying={false}
                                    direction="horizontal"
                                />
                            </div>
                        );
                    })} */}
                </div>
            </div>
        </Fragment>
    );
}
