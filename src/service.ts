const apiUrl: string = import.meta.env.VITE_API_URL;

export interface ListPhotosResponse {
    projects: Map<string, string[]>;
}

export interface IPhotoService {
    listPhotos(): Promise<ListPhotosResponse>;
}

export class PhotoService implements IPhotoService {
    private baseUrl: string;
    constructor() {
        this.baseUrl = apiUrl ?? "";
    }

    async listPhotos(): Promise<ListPhotosResponse> {
        const response = await fetch(`${this.baseUrl}/list-photos`);
        if (!response.ok) {
            throw new Error(`error listing photos: ${response.statusText}`);
        }
        const data = await response.json();
        const projectMap = new Map(Object.entries(data)) as Map<
            string,
            string[]
        >;
        return { projects: projectMap };
    }
}
