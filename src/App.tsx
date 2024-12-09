import { useEffect, useMemo, useState } from "react";
import "../styles/App.scss";
import ScrollToTop from "./components/ScrollToTop";
import { ListPhotosResponse, PhotoService } from "./service";
import Spinner from "./components/Spinner";

function App() {
    const [projects, setProjects] = useState({} as ListPhotosResponse);
    const [loading, setLoading] = useState(true);
    const [activeProjectKey, setProjectKey] = useState("");

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

    return (
        <>
            {loading && <Spinner />}
            {!loading && (
                <div className="rootContainer">
                    <div className="sidebar">
                        <ul className="sidebarProjectList">
                            <li className="sidebarTitle">lowkey photography</li>
                            <li
                                key="home"
                                className="sidebarProjectListItem mediaHide"
                                onClick={() => setProjectKey("")}
                            >
                                Home
                            </li>
                            <li
                                key="placeholder"
                                className="sidebarProjectListItemSeparator mediaHide"
                            >
                                -
                            </li>
                            {projects &&
                                Array.from(projects.projects.keys()).map(
                                    (item, index) => (
                                        <li
                                            key={index}
                                            className={
                                                activeProjectKey === item
                                                    ? "sidebarProjectListItem sidebarProjectListItemActive mediaHide"
                                                    : "sidebarProjectListItem mediaHide"
                                            }
                                            onClick={() => setProjectKey(item)}
                                        >
                                            {item}
                                        </li>
                                    )
                                )}
                        </ul>
                    </div>
                    <div className="gallery">
                        {/* If a project isn't selected, show a 'gallery' by grabbing the first image from each collection */}
                        {!activeProjectKey &&
                            Array.from(getLandingPageData(), ([key, value]) => (
                                <>
                                    <div
                                        className="homepageGalleryImageContainer"
                                        onClick={() => setProjectKey(key)}
                                    >
                                        <img
                                            src={makeImageUrl(value)}
                                            alt={key}
                                            className="homepageGalleryImage"
                                        />
                                        <div className="galleryImageText mediaHide">
                                            {key}
                                        </div>
                                    </div>
                                </>
                            ))}
                        {/* If a project is selected, display the collection */}
                        {activeProjectKey &&
                            Array.from(
                                projects.projects.get(activeProjectKey) ?? []
                            ).map((item) => (
                                <>
                                    <div className="collectionGalleryImageContainer">
                                        <img
                                            src={makeImageUrl(item)}
                                            alt={item}
                                            className="collectionGalleryImage"
                                        />
                                    </div>
                                </>
                            ))}
                    </div>
                    <ScrollToTop />
                </div>
            )}
        </>
    );
}

export default App;
