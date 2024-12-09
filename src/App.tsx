import { ListPhotosResponse } from "lowkey-photos-list-worker/src";
import { useEffect, useMemo, useState } from "react";
import "../styles/App.scss";
import { PhotoService } from "./service";
import ScrollToTop from "./components/ScrollToTop";

function App() {
    const [projects, setProjects] = useState({} as ListPhotosResponse);
    const [loading, setLoading] = useState(true);
    const photoService = useMemo(() => {
        return new PhotoService();
    }, []);

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
    }, [photoService]);

    return (
        <>
            {loading && <div>Loading...</div>}
            {!loading && (
                <div className="rootContainer">
                    <div className="sidebar">
                        <ul className="sidebarProjectList">
                            <li className="sidebarTitle">lowkey photography</li>
                            <li
                                key="home"
                                className="sidebarProjectListItem mediaHide"
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
                                            className="sidebarProjectListItem mediaHide"
                                        >
                                            {item}
                                        </li>
                                    )
                                )}
                        </ul>
                    </div>
                    <div className="gallery"></div>
                    <ScrollToTop />
                </div>
            )}
        </>
    );
}

export default App;
