import { ListPhotosResponseItem } from "lowkey-photo-list-worker/src/index";

export interface ListPhotosResponse {
    projects: Map<string, Array<ListPhotosResponseItem>>;
}

export interface ListPhotosApiResponse {
    items: Array<ListPhotosResponseItem>;
}

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

    projectListFromListPhotos(
        response: ListPhotosApiResponse
    ): ListPhotosResponse {
        const projectMap = new Map<string, Array<ListPhotosResponseItem>>();
        if (!response.items || response.items.length === 0) {
            return { projects: projectMap };
        }
        response.items
            .filter((i) => i.isValidGalleryImage)
            .forEach((element) => {
                const key = `${element.imageDetails.month} ${element.imageDetails.year} - ${element.imageDetails.album}`;
                if (projectMap.has(key)) {
                    projectMap.get(key)?.push(element);
                } else {
                    projectMap.set(key, [element]);
                }
            });
        return { projects: projectMap };
    }

    async listPhotos(): Promise<ListPhotosResponse> {
        const response = await fetch(`${this.baseUrl}/list-photos`);
        if (!response.ok) {
            throw new Error(`error listing photos: ${response.statusText}`);
        }
        const data = (await response.json()) as Array<ListPhotosResponseItem>;
        const projectList = this.projectListFromListPhotos({ items: data });
        return projectList;
    }
}
