import { cards } from './MockData';
import { ICardProps } from '../components/Card';

const api = '/api/cards/'

export async function getCard(cardId?: string): Promise<ICardProps | undefined> {
    if (cardId === undefined) {
        return undefined
    }
    let url = api + cardId
    return fetch(url)
        .then(response => {
            if (response.status >= 500 || response.headers.get("Server") == "GitHub.com") {
                return cards.get(cardId)
            }
            return response.json() as Promise<ICardProps | undefined>
        })
        .catch(_ => {
            return cards.get(cardId)
        })
}