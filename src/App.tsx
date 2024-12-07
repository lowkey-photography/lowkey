import { useEffect, useState } from "react";
import "./App.css";

interface PortfolioProject {
    projectName: string;
    coverImageUrl: string;
    imageUrls: string[];
}

function App() {
    const [projectList, setProjects] = useState(Array<PortfolioProject>());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
        setProjects([]);
    }, []);
    return (
        <>
            {!loading && (
                <div className="rootContainer">
                    <div className="sidebar">
                        <div className="sidebarTitle">lowkey</div>
                        <ul className="sidebarProjectList">
                            {projectList.map((item, index) => (
                                <li key={index}>{item.projectName}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="gallery">
                        <ul className="galleryProjectList">
                            {projectList.map((item, index) => (
                                <li key={index}>{item.projectName}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
}

export default App;
