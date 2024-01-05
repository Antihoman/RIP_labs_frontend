import { cards, draft_turn } from './MockData';
import { ICardProps } from '../components/Card';

export type Response = {
    draft_turn: string | null;
    cards: ICardProps[];
}

export async function getAllCards(filter?: string): Promise<Response> {
    let url = '/api/cards'
    if (filter !== undefined) {
        url += `?name=${filter}`
    }
    return fetch(url)
        .then(response => {
            if (response.status >= 500 || response.headers.get("Server") == "GitHub.com") {
                return fromMock(filter)
            }
            return response.json() as Promise<Response>
        })
        .catch(_ => {
            return fromMock(filter)
        })
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