import { Drawer, IconButton, Popover } from "@mui/material";
import { Fragment, useState } from "react";
import Image from "next/image";
import MenuIcon from '@mui/icons-material/Menu';
import BrandIcon from "@/lib/ui/components/brand-icon";
import styles from './nav-header.module.scss';
import { NAV_FEATURES } from "./nav-header.constants";
import { AccountCircle, GridView, Lightbulb } from "@mui/icons-material";
import LeftSidebar from "../left-sidebar/left-sidebar";
import AccountSidebar from "../account-sidebar/account-sidebar";
import Link from "next/link";
import SearchBox from "@/lib/ui/components/search-box/search-box";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { AppTheme, selectSettingsTheme, setTheme } from "@/store/reducers/settings.reducer";
import { LocalStorageEnum } from "@/lib/ui/constants/local-storage.constants";
import { IYoutubeSearchItem } from "@/lib/ui/models/youtube-search-list.model";
import { useRouter } from "next/router";
import { setVideoSearchQuery } from "@/store/reducers/video.reducer";
import SimplePopup from './file-upload';


import { FaPlus, FaUpload } from 'react-icons/fa'; // Importing icons from react-icon   s
import { totalmem } from "os";

type Anchor = 'left' | 'right';



export default function NavHeader() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const theme = useAppSelector(selectSettingsTheme);



    const [featureAnchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isSidenavOpen, setSidenavOpen] = useState({
        left: false,
        right: false
    });

    const isFeatureMenuOpen = Boolean(featureAnchorEl);
    const navFeatures = NAV_FEATURES;

    const handleFeatureMenuClick = (event: React.MouseEvent<HTMLElement>): void => {
        setAnchorEl(event.currentTarget);
    };

    const handleFeatureMenuClose = (): void => {
        setAnchorEl(null);
    };

    const toggleDrawer = (anchor: Anchor, open: boolean) => () => {
        setSidenavOpen({ ...isSidenavOpen, [anchor]: open });
    };

    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

    const openPopup = () => {
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    const toggleFileUploadPopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };


    const onChageTheme = (): void => {
        if (theme === AppTheme.DARK) {
            dispatch(setTheme({ theme: AppTheme.LIGHT }))
            localStorage.setItem(LocalStorageEnum.SAVED_THEME, AppTheme.LIGHT);
        } else {
            dispatch(setTheme({ theme: AppTheme.DARK }))
            localStorage.setItem(LocalStorageEnum.SAVED_THEME, AppTheme.DARK);
        }
    };

    const inputChangeHandler = (option: IYoutubeSearchItem | string): void => {
        if (typeof option === 'object') {
            router.push(`/watch?v=${option?.id?.videoId}`);
        } else {
            dispatch(setVideoSearchQuery(option))
        }
    }

    const log = () => {
        console.log('log')
    }

    return (
        <Fragment>

            <div className={styles.host}>
                <div className={styles.header}>
                    <div className={styles.header__start}>
                        <div className={styles.headerNavIcon}>
                            <IconButton
                                className={styles.headerNavIcon__btn}
                                onClick={toggleDrawer('left', true)}
                            >
                                <MenuIcon />
                            </IconButton>
                        </div>

                        {/* <Drawer
                            anchor={'left'}
                            open={isSidenavOpen['left']}
                            onClose={toggleDrawer('left', false)}
                        >
                            <LeftSidebar closeHandler={toggleDrawer('left', false)} />
                        </Drawer>

                        <Drawer
                            anchor={'right'}
                            open={isSidenavOpen['right']}
                            onClose={toggleDrawer('right', false)}
                        >
                            <AccountSidebar />
                        </Drawer> */}

                        <Link href="/">
                            <div className={styles.headerBrandIcon}>
                                {/* <BrandIcon className={styles.brandIcon} />
                                <span className={styles.headerBrandIcon__countryCode}>PL</span> */}
                                <img src={'logo.png'} style={{ width: '40px', height: '40px' }}></img>
                            </div>
                        </Link>
                    </div>

                    <div className={styles.header__center}>
                        <SearchBox inputChangeHandler={inputChangeHandler} />
                    </div>

                    <div className={styles.header__end}>
                        

                    <div className={styles.headerFeature}>
                        <IconButton className={styles.headerNavIcon__btn } onClick={openPopup}>
                            <FaPlus size={25} /> {/* Plus icon with increased size */}
                        </IconButton>
                    </div>
                    <SimplePopup isOpen={isPopupOpen} onClose={closePopup} />
                    
                    </div>  
                </div>
            </div>
        </Fragment>
    );
}