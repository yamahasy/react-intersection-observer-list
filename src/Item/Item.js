import React, {useEffect, useRef, useState} from 'react';
import '../App.css';

export function Item({item, callback, visible}) {
    const [source, setSource] = useState('')
    const itemRef = useRef(null)
    /**
     * preload images only for elements that are inside viewport
     */
    useEffect(() => {
        if(visible) {
            const img = new Image()
            img.src = item.image
            img.onload = () => setSource(item.image)
        }
    }, [item, visible])
    /**
     * pass item reference for observer to watch
     */
    useEffect(() => {
        callback(itemRef)
    }, [itemRef, callback])
    return (
        <div key={item.id} data-id={item.id} ref={itemRef} className="item" style={{backgroundImage: `url(${source})`}}>
            {item.name} {visible ? 'visible' : 'hidden'}
        </div>
    )
}
