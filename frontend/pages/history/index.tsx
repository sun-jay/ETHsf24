import { Fragment, useCallback, useEffect, useState } from "react";
import styles from './index.module.scss';
import { Delete, DeleteOutline, Pause, Replay } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearWatchHistory, selectIsWatchHistoryEnabled, selectedWatchedVideos, toggleIsWatchHistoryEnabled } from "@/store/reducers/account.reducer";
import { IYoutubeSearchItem } from "@/lib/ui/models/youtube-search-list.model";
import { Observable, map, filter, forkJoin, finalize, from } from "rxjs";
import { useSearchList } from "@/lib/ui/hooks/useSearchList";
import VideoThumbnailLoader from "@/lib/ui/components/video-thumbnail-loader/video-thumbnail-loader";
import { Button } from "@mui/material";
import VideoThumbnail from "@/lib/ui/components/video-thumbnail/video-thumbnail";
import Link from "next/link";

import ItemsTable from './table';
import Ming from '../likes/spl'


export default function HistoryPage() {
   return (
   <>
    <ItemsTable />
    <div style={{ top: 0, left: 0, width: '100%', height: '100%' }}>
      <Ming />
    </div>
    
    </>
    );
}