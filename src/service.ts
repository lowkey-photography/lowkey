import { ListPhotosResponse } from "lowkey-photos-list-worker/src/index";

export interface IPhotoService {
    listPhotos(): Promise<ListPhotosResponse>;
}

export class PhotoService implements IPhotoService {
    private baseUrl: string;
    constructor() {
        if (import.meta.env.DEV) {
            // set this so we can use production data for local dev too
            this.baseUrl = "https://lowkeyphotos.com";
        } else {
            this.baseUrl = "";
        }
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
