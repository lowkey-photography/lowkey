import { MailOutlined } from "@ant-design/icons";
import "photoswipe/dist/photoswipe.css";
import { useEffect, useMemo, useState } from "react";
import "../styles/App.scss";
import ScrollToTop from "./components/ScrollToTop";
import Spinner from "./components/Spinner";
import { ListPhotosResponse, PhotoService } from "./service";

import { PhotoSwipeOptions } from "photoswipe/lightbox";
import { Gallery, Item } from "react-photoswipe-gallery";

const photoswipeOptions: PhotoSwipeOptions = {
    bgOpacity: 0.9,
    preloaderDelay: 0,
    showHideAnimationType: "zoom",
    loop: true,
    zoom: false,
    initialZoomLevel: "fit",
    maxZoomLevel: "fit",
    secondaryZoomLevel: "fit",
};

function App() {
    const [projects, setProjects] = useState({} as ListPhotosResponse);
    const [loading, setLoading] = useState(true);
    const [activeProjectKey, setProjectKey] = useState("");

    // we pre-load the image to browser cache so we can get the dimensions and
    // also transition from a loading state to loaded
    // the worker that powers list photos should ideally give us dimensions but
    // we can't load images into a DOM there
    const [imgLoadingStates, setImageLoadingStates] = useState(
        new Map<string, boolean>()
    );
    const [imgDimensions, setImageDimensions] = useState(
        new Map<string, number[]>()
    );

    const photoService = useMemo(() => {
        return new PhotoService();
    }, []);

    const getLandingPageData = () => {
        if (!projects) return [];
        const urls = new Map<string, string>();
        projects.projects.forEach((v, k) => {
            urls.set(k, v[0]);
        });
        return urls;
    };

    const makeImageUrl = (url: string) => {
        const imageHost = import.meta.env.VITE_IMAGES_URL;
        return `${imageHost}/${url}`;
    };

    const updateImagePropsAfterLoad = (
        key: string,
        elem: HTMLImageElement | null
    ) => {
        if (elem && elem.complete) {
            setImageLoadingStates(new Map(imgLoadingStates).set(key, true));
            setImageDimensions(
                new Map(imgDimensions).set(key, [elem.width, elem.height])
            );
        }
    };

    const safeGetImageWidth = (key: string, multiplier: number = 1) => {
        const dimensionsTuple = imgDimensions.get(key);
        if (dimensionsTuple) {
            return `${Math.round(dimensionsTuple[0] * multiplier)}`;
        }
        return "";
    };

    const safeGetImageHeight = (key: string, multiplier: number = 1) => {
        const dimensionsTuple = imgDimensions.get(key);
        if (dimensionsTuple) {
            return `${Math.round(dimensionsTuple[1] * multiplier)}`;
        }
        return "";
    };

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await photoService.listPhotos();
                setProjects(response);
            } catch (error) {
                console.error(`error fetching projects: ${error}`);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
        setProjectKey("");
    }, [photoService]);

    useEffect(() => {
        if (projects.projects) {
            const imgLoadingStatesMap = new Map<string, boolean>();
            Array.from(projects.projects.values()).forEach((imgList) =>
                imgList.forEach((img) => {
                    imgLoadingStatesMap.set(img, false);
                })
            );
            setImageLoadingStates(imgLoadingStatesMap);
        }
    }, [projects]);

    return (
        <>
            {loading && <Spinner />}
            {!loading && (
                <div className="rootContainer">
                    <div className="imageViewContainer"></div>
                    <div className="sidebar">
                        <ul className="sidebarProjectList">
                            <li key="title" className="sidebarTitle">
                                Lowkey Photography
                            </li>
                            <li
                                key="home"
                                className="sidebarProjectListItem"
                                onClick={() => setProjectKey("")}
                            >
                                HOME
                            </li>
                            <li
                                key="placeholder-1"
                                className="sidebarProjectListItemSeparator mediaHide"
                            >
                                -----------
                            </li>
                            {projects &&
                                Array.from(projects.projects.keys()).map(
                                    (item) => (
                                        <li
                                            key={`${item}`}
                                            className={
                                                activeProjectKey === item
                                                    ? "sidebarProjectListItem sidebarProjectListItemActive"
                                                    : "sidebarProjectListItem mediaHide"
                                            }
                                            onClick={() => setProjectKey(item)}
                                        >
                                            {item.toUpperCase()}
                                        </li>
                                    )
                                )}
                            <li
                                key="placeholder-2"
                                className="sidebarProjectListItemSeparator mediaHide"
                            >
                                -----------
                            </li>
                            <li
                                className="sidebarProjectListItemContact mediaHide"
                                key="mailTo"
                            >
                                <a href="mailto:contactme@lowkeyphotos.com">
                                    <MailOutlined
                                        style={{ marginRight: "0.5rem" }}
                                    />
                                    contactme@lowkeyphotos.com
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="gallery" key="gallery">
                        {/* If a project isn't selected, show a 'gallery' by grabbing the first image from each collection */}
                        {!activeProjectKey &&
                            Array.from(getLandingPageData(), ([key, value]) => (
                                <div
                                    className="homepageGalleryImageContainer"
                                    onClick={() => setProjectKey(key)}
                                    key={`homepageThumbnailContainer-${key}`}
                                >
                                    <img
                                        src={makeImageUrl(value)}
                                        alt={key}
                                        key={`homepage-${key}`}
                                        className="homepageGalleryImage"
                                    />
                                    <div
                                        className="galleryImageText mediaHide"
                                        key={`homepageThumbnailText-${key}`}
                                    >
                                        {key}
                                    </div>
                                </div>
                            ))}
                        {/* If a project is selected, display the collection */}
                        <Gallery
                            options={photoswipeOptions}
                            key="photoswipeContainer"
                        >
                            {activeProjectKey &&
                                Array.from(
                                    projects.projects.get(activeProjectKey) ??
                                        []
                                ).map((item) => (
                                    <div
                                        className="collectionGalleryImageContainer"
                                        key={`galleryImageContainer-${item}`}
                                    >
                                        {!imgLoadingStates.get(item) && (
                                            <>
                                                <Spinner />
                                                <img
                                                    src={makeImageUrl(item)}
                                                    key={`${item}-loading`}
                                                    className="lazyLoadImage"
                                                    onLoad={(elem) =>
                                                        updateImagePropsAfterLoad(
                                                            item,
                                                            elem.currentTarget
                                                        )
                                                    }
                                                    ref={(elem) =>
                                                        updateImagePropsAfterLoad(
                                                            item,
                                                            elem
                                                        )
                                                    }
                                                />
                                            </>
                                        )}
                                        {imgLoadingStates.get(item) && (
                                            <Item
                                                original={makeImageUrl(item)}
                                                width={safeGetImageWidth(
                                                    item,
                                                    0.7
                                                )}
                                                height={safeGetImageHeight(
                                                    item,
                                                    0.7
                                                )}
                                            >
                                                {({ ref, open }) => (
                                                    <img
                                                        ref={ref}
                                                        onClick={open}
                                                        src={makeImageUrl(item)}
                                                        alt={makeImageUrl(item)}
                                                        key={`${item}-image`}
                                                        className="collectionGalleryImage"
                                                    />
                                                )}
                                            </Item>
                                        )}
                                    </div>
                                ))}
                        </Gallery>
                    </div>
                    <ScrollToTop />
                </div>
            )}
        </>
    );
}

export default App;
