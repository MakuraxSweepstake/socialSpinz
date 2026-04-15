export interface MetaProps {
    meta_title: string;
    meta_description: string;
    og_image: File | null;
    og_image_url?: string;
}

export interface FileResponse {
    file_name: string;
    mime_type: string;
    size: number;
    contents: string;
}
export interface CommonGameProps {
    name: string;
    category?: string;
    meta?: MetaProps,
    description: string;
    api: string;
    provider: string;
    profit?: string;
}
export interface GameProps extends CommonGameProps {
    thumbnail?: File | null;
    screenshots?: File | File[] | null;
    subgames?: File | File[] | null;
    screenshots_files?: string[];
    subgames_files?: string[];
}

export interface GameItem extends CommonGameProps {
    id: number;
    active_users?: string | number
    thumbnail?: string | null;
    screenshots?: string[] | null;
    subgames?: string[] | null;
    game_url?: string;
    is_iframe?: boolean;
    has_redirection?: boolean;
    user?: {
        name: string;
        password: string;
    }
}

export interface Pagination {
    total: number;
    count: number;
    per_page: number;
    current_page: number;
    total_pages: number;
}

export interface GameResponseProps {
    data: {
        data: GameItem[];
        pagination: Pagination;
        message: string;
        success: boolean;
    }
}

export interface SingleGameResponse {
    data: GameItem;
    pagination: Pagination;
    message: string;
    success: boolean;
}

// ✅ Initial Values for Formik
export const gameInitialValues: GameProps = {
    name: "",
    category: "",
    description: "",
    thumbnail: null,
    screenshots: [],
    subgames: [],
    api: "",
    provider: "",
    profit: "",
};


export interface CredentialsProps {
    id?: string;
    name: string,
    credentials: {
        password: string,
        username: string
    },
    logo: string | null,
    game_url: string,
    full_name: string,
    custom_password: boolean
    entries: string | number;
    is_iframe?: boolean;
    has_redirection?: boolean;
    can_change_password?: boolean;
}
export interface CredentialsResponseProps {
    data: CredentialsProps[];
    success: string;
    message: string;
}