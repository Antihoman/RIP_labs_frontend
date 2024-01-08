import { format } from 'date-fns';

import { axiosAPI } from ".";
import { ICard, ITurn } from "../models";

interface TurnsResponse {
    turns: ITurn[]
}

function formatDate(date: Date | null): string {
    if (!date) {
        return ""
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes} ${day}.${month}.${year}`;
}

export async function getTurns(
    status: string,
    startDate: string | null,
    endDate: string | null
): Promise<ITurn[]> {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        return [];
    }
    return axiosAPI
        .get<TurnsResponse>('/turns', {
            params: {
                ...(status && { status: status }),
                ...(startDate && {
                    formation_date_start: format(new Date(startDate), 'yyyy-MM-dd HH:mm'),
                }),
                ...(endDate && {
                    formation_date_end: format(new Date(endDate), 'yyyy-MM-dd HH:mm'),
                }),
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        })
        .then((response) =>
            response.data.turns.map((tr: ITurn) => ({
                ...tr,
                creation_date: formatDate(new Date(tr.creation_date)),
                formation_date: tr.formation_date
                    ? formatDate(new Date(tr.formation_date))
                    : null,
                completion_date: tr.completion_date
                    ? formatDate(new Date(tr.completion_date))
                    : null,
            }))
        );
}

interface TurnResponse {
    cards: ICard[]
    turn: ITurn
}

export async function getTurn(id: string | undefined): Promise<TurnResponse | null> {
    if (id === undefined) { return null; }
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        return null;
    }

    return axiosAPI.get<TurnResponse>(`/turns/${id}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            const modifiedTurn: ITurn = {
                ...response.data.turn,
                creation_date: formatDate(new Date(response.data.turn.creation_date)),
                formation_date: response.data.turn.formation_date
                    ? formatDate(new Date(response.data.turn.formation_date))
                    : null,
                completion_date: response.data.turn.completion_date
                    ? formatDate(new Date(response.data.turn.completion_date))
                    : null,
            };

            return {
                ...response.data,
                turn: modifiedTurn,
            };
        })
}