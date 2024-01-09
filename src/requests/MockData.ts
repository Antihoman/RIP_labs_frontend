import { ICardProps } from '../components/Card';

export const draft_turn = null
export let cards = new Map<string, ICardProps>([
    ["f269cc75-9d07-4ded-bbb4-02536f742220", {
      "uuid": "f269cc75-9d07-4ded-bbb4-02536f742220",
      "name": "Большой",
      "type": "Хищник",
      "needfood": 1,
      "image_url": "http://localhost:9000/images/img9.jpg",
      "description": "Данное животное может быть съедено только большим хищником",
  
    }
    ],
    ["c502737b-ec5c-41f6-b656-b8b08caedfc4", {
      "uuid": "c502737b-ec5c-41f6-b656-b8b08caedfc4",
      "name": "Большой",
      "type": "Не хищник",
      "needfood": 2,
      "image_url": "http://localhost:9000/images/img12.jpg",
      "description": "Сыграть одновременно на пару существ. Когда одно получит еду, то другое получит вге очереди",
    }
    ],
    ["320877f2-702c-4c8a-8d47-f17bbc51af55", {
      "uuid": "320877f2-702c-4c8a-8d47-f17bbc51af55",
      "name": "Взаимодействие",
      "type": "Хищник",
      "needfood": 1,
      "image_url": "http://localhost:9000/images/img6.jpg",
      "description": "Сыграть одновременно на пару существ. Когда одно получит еду, то другое получит вне очереди",
    }
    ]
])