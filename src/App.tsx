import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { ListPhotosResponse, PhotoService } from "./service";

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
                        <div className="sidebarTitle">lowkey</div>
                        <ul className="sidebarProjectList">
                            {projects &&
                                Array.from(projects.projects.keys()).map(
                                    (item, index) => <li key={index}>{item}</li>
                                )}
                        </ul>
                    </div>
                    <div className="gallery">
                        <ul className="galleryProjectList">
                            {projects &&
                                Array.from(projects.projects.keys()).map(
                                    (item, index) => <li key={index}>{item}</li>
                                )}
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
}

export default App;
