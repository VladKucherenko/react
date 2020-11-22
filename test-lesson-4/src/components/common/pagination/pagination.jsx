import styles from './pagination.module.css';
import React, { useState } from 'react';

const Pagination = ({totalItemsCount, pageSize, currentPage, onPageChanged, porsionSize = 10}) => {

    let pageCount = Math.ceil(totalItemsCount / pageSize);
    let pages = [];
    for (let i = 1; i <= pageCount; i++) {
        pages.push(i);
    }

    let porsionCount = Math.ceil(pageCount / porsionSize);

    let [portionNumber, setportionNumber] = useState(1);

    let leftPorsionNumber = (portionNumber - 1) * porsionSize + 1;
    
    let rightPorsionNumber = (portionNumber) * porsionSize;



    return (
        <div>

            {portionNumber > 1 &&
            <button onClick={ () => {setportionNumber(portionNumber - 1)}}>Prev</button>
            }

            {pages
            .filter(p => p >= leftPorsionNumber && p <= rightPorsionNumber)
            .map(p => {
                return <span
                    className={currentPage === p
                        && styles.selectedPage}
                    onClick={(e) => { onPageChanged(p); }}>{p}&#160;</span>
            })}

            {porsionCount > portionNumber &&
            <button onClick={ () => {setportionNumber(portionNumber + 1)}}>Next</button>
            }
        </div>
    );
}

export default Pagination;