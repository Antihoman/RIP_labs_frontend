import { useEffect, useState, FC } from 'react';
import { SmallCCard, ICardProps } from '../components/Card';
import LoadAnimation from '../components/LoadAnimation';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { getAllCards } from '../requests/GetAllCards'

interface ISearchProps {
    setCards: React.Dispatch<React.SetStateAction<ICardProps[]>>
}

const Search: FC<ISearchProps> = ({ setCards }) => {
    const [searchText, setSearchText] = useState<string>('');

    const handleSearch = (event: React.FormEvent<any>) => {
        event.preventDefault();
        getAllCards(searchText)
            .then(data => {
                setCards(data.cards)
            })
    }
    return (
        <Navbar>
            <Form className="d-flex flex-row flex-grow-1 gap-2" onSubmit={handleSearch}>
                <Form.Control
                    type="text"
                    placeholder="Поиск"
                    className="form-control-sm flex-grow-1 shadow shadow-sm"
                    data-bs-theme="dark"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <Button
                    variant="primary"
                    size="sm"
                    type="submit"
                    className="shadow">
                    Поиск
                </Button>
            </Form>
        </Navbar>)
}

const AllCards = () => {
    const [loaded, setLoaded] = useState<boolean>(false)
    const [cards, setCards] = useState<ICardProps[]>([]);
    const [_, setDraftTurn] = useState<string | null>(null);

    useEffect(() => {
        getAllCards()
            .then(data => {
                setDraftTurn(data.draft_turn)
                setCards(data.cards)
                setLoaded(true)
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    return (
        <>
            <Search setCards={setCards} />
            <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 px-1'>
                {loaded ? (
                    cards.map((cards) => (
                        <div className='d-flex p-2 justify-content-center' key={cards.uuid}>
                            <SmallCCard  {...cards} />
                        </div>
                    ))
                ) : (
                    <LoadAnimation />
                )}
            </div>
        </>
    )
}

export { AllCards }