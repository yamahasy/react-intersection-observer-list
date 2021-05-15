import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {Item} from '../Item/Item';

export function List({items, loadNext}) {
    const [mappings, setMappings] = useState({})
    /**
     * map each element visibility at the start (default false)
     * We need this object to change state of element for loading
     */
    useEffect(() => {
        setMappings(oldMappings => {
            const newMappings = items.reduce((acc, item) => {
                if (!oldMappings[item.id]) {
                    acc[item.id] = false
                }
                return acc
            }, {})
            return {...oldMappings, ...newMappings}
        })
    }, [items, items.length])

    /**
     * create instance of observer
     * @type {IntersectionObserver}
     */
    const observer = useMemo(() => {
            return new IntersectionObserver((entries) => {
                const newMappings = entries.reduce((acc, entry) => {
                    // check if item is in viewport
                    if (entry.isIntersecting) {
                        // check if item is the last element in list to trigger loading new group of items
                        if (!entry.target.nextSibling) {
                            loadNext()
                        }
                        //change item visibility to true
                        acc[entry.target.dataset.id] = true
                        //remove observe from current item
                        observer.unobserve(entry.target)
                    }
                    return acc
                }, {})
                if (Object.values(newMappings).length > 0) {
                    // update global visibility array to trigger rerender (lazy-load) for elements in viewport
                    setMappings((oldMappings) => {
                        return {...oldMappings, ...newMappings}
                    })
                }
            }, {})
        }
        , [loadNext])
    /**
     * set item for observable to watch
     * @type {(function(*): void)|*}
     */
    const setObserver = useCallback((itemRef) => {
        observer.observe(itemRef.current)
    }, [observer])

    return (
        <div className="item-container">
            {items.map((item) => {
                return (
                    <Item key={item.id} item={item} callback={setObserver} visible={mappings[item.id]}/>
                )
            })}
        </div>
    );
}
