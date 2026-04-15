export interface MissingGame {
    id: number;
    name: string;
    value: string; // game_slug used for POST endpoint
    player_link: string;
    logo: string | null;
    custom_password: boolean;
    can_change_password: boolean;
    is_iframe: boolean;
    has_redirection: boolean;
    can_withdrawal: number;
}

export interface GetMissingAccountsResponse {
    status: boolean;
    message: string;
    data: MissingGame[];
}

export interface CreateMissingAccountResponse {
    status: boolean;
    message: string;
    data: [];
}
