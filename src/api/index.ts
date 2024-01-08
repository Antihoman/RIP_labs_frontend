import { cards, draft_turn } from './MockData';
import { ICard } from '../models';
import axios, { AxiosRequestConfig } from 'axios';


const ip = 'localhost'
const port = '3000'
export const imagePlaceholder = `${import.meta.env.BASE_URL}placeholder.jpg`

export const axiosAPI = axios.create({ baseURL: `http://${ip}:${port}/api/`, timeout: 2000 });
export const axiosImage = axios.create({ baseURL: `http://${ip}:${port}/images/`, timeout: 10000 });


export type Response = {
    draft_turn: string   | null;
    cards: ICard[];
}

export async function getAllCards(filter?: string): Promise<Response> {
    let url = 'cards';
    if (filter !== undefined) {
        url += `?name=${filter}`;
    }
    const headers: AxiosRequestConfig['headers'] = {};
    let accessToken = localStorage.getItem('access_token');
    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return axiosAPI.get<Response>(url, { headers })
        .then(response => response.data)
        .catch(_ => fromMock(filter))
}

function fromMock(filter?: string): Response {
    let filteredCards = Array.from(cards.values())
    if (filter !== undefined) {
        let name = filter.toLowerCase()
        filteredCards = filteredCards.filter(
            (card) => card.name.toLowerCase().includes(name)
        )
    }
    return { draft_turn, cards: filteredCards }
}

export async function getCard(cardId?: string): Promise<ICard | undefined> {
    if (cardId === undefined) {
        return undefined
    }
    let url = 'cards/' + cardId
    return axiosAPI.get<ICard>(url)
        .then(response => response.data)
        .catch(_ => cards.get(cardId))
}