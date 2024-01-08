export interface ICard {
    uuid: string
    name: string
    type: string
    needfood: number
    description: string
    image_url: string
}

export interface ITurn {
    uuid: string
    status: string
    creation_date: string
    formation_date: string | null
    completion_date: string | null
    moderator: string | null
    customer: string
    takefood: string | null
    sending_status: string | null
}