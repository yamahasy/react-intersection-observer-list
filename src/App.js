import React, {useCallback, useState} from 'react';
import {List} from './List/List';

const generateItems = (page = 0) => {
    const perPage = 10
    return [...Array(perPage).keys()].map((item) => {
        const val = page * perPage + item
        return {
            id: val,
            name: 'Some name' + val,
            image: `https://picsum.photos/id/${val}/250/250.jpg`
        }
    })
}

function App() {
    const [state, setState] = useState({
        items: generateItems(0),
        page: 0
    })
    /*
    Load next page example callback, next page currently stored here in state, but can be passed as a param
     */
    const loadNext = useCallback(() => {
        setState(oldState => {
            const page = oldState.page + 1;
            const newItems = generateItems(page)
            return {
                items: [...oldState.items, ...newItems],
                page: page
            }
        })
    }, [])
    return (
        <List items={state.items} loadNext={loadNext}/>
    );
}

export default App;
