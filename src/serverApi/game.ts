import { GameResponseProps } from "@/types/game";
import { serverBaseQuery } from "./serverBaseQuery";

export async function getAllGames(): Promise<GameResponseProps> {
    return serverBaseQuery("/api/get-games");
}
export async function getSubGames(): Promise<any> {
    return serverBaseQuery("/api/general/home/sub-games");
}
export async function pageSEO(): Promise<any> {
    return serverBaseQuery("/api/general/home/seo");
}
export async function getSupportEmail(): Promise<any> {
    return serverBaseQuery("/api/general/supports");
}
export async function getUsp(): Promise<any> {
    return serverBaseQuery("/api/general/home/usp");
}
