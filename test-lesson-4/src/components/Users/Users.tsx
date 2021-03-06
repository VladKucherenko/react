import React, { useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import styles from './users.module.css';
import Pagination from '../common/pagination/pagination';
import { UsersDataType } from '../../types/types';
import UsersSurchForm from './UsersSurchForm';
import { FilterType, followThunkCreator, getUsersThunkCreator, unfollowThunkCreator } from '../../Redux/users-reducer';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentPage, getFilter, getFollowingInProgress, getPageSize, getTotalUsersCount, getUsers } from '../../Redux/users-selectors';
const queryString = require('query-string');
type PropsType = {
    
    
}
type QueryParamsType = {
    term?: string, page?: string, friend?: string
}

let Users: React.FC<PropsType> = (props) => {

    useEffect(() => {
        const {search} = history.location
        const parsed = queryString.parse(search) as QueryParamsType;
        
        
        let actualPage = currentPage
        let actualFilter = filter

        if (parsed.page) actualPage = Number(parsed.page)
        if (parsed.term) actualFilter = {...actualFilter, term: parsed.term}
        switch(parsed.friend) {
            case "null": {
                actualFilter = {...actualFilter, friend: null}
            }
            break;
            case "true": {
                actualFilter = {...actualFilter, friend: true}
            }
            break;
            case "false": {
                actualFilter = {...actualFilter, friend: false}
            }
            break;
        }
        
        dispatch(getUsersThunkCreator(actualPage, pageSize, actualFilter));
    }, [])
    const totalUsersCount = useSelector(getTotalUsersCount)
    const currentPage = useSelector(getCurrentPage)
    const pageSize = useSelector(getPageSize)
    const usersData = useSelector(getUsers)
    const filter = useSelector(getFilter)
    const followingInProgress = useSelector(getFollowingInProgress)
    const history = useHistory()
    const dispatch = useDispatch()
    
    let onPageChanged = (pageNumber: number) => {
        dispatch(getUsersThunkCreator(pageNumber, pageSize, filter));
    }

    let onFilterChange = (filter: FilterType) => {
        dispatch(getUsersThunkCreator(1, pageSize, filter));
    }

    useEffect(()=> {
        const query: QueryParamsType = {}
        if(!!filter.term) query.term = filter.term
        if(filter.friend != null) query.friend = String(filter.friend)

        if(currentPage != 1) query.page = String(currentPage)

        // let my = queryString.stringify(query)
        // debugger
        history.push({
            pathname: '/users',
            search: queryString.stringify(query)
        })
    }, [filter, currentPage])

    let unfollowThunk = (id: number) => {
        dispatch(unfollowThunkCreator(id))
    }

    let followThunk = (id: number) => {
        dispatch(followThunkCreator(id))
    }

    return (
        <div>
            <UsersSurchForm onFilterChange={onFilterChange}/>
            <Pagination
                currentPage={currentPage}
                onPageChanged={onPageChanged}
                totalItemsCount={totalUsersCount}
                pageSize={pageSize}
            />
            {usersData.map((u: UsersDataType) => <div className={styles.main} key={u.id}>
                <div >
                    <div className={styles.info}>
                        <div>
                            <NavLink to={`/profile/${u.id}`}>
                                <img className={styles.photo}
                                    src={u.photos.small != null
                                        ? u.photos.small
                                        : 'https://www.pinclipart.com/picdir/middle/165-1653686_female-user-icon-png-download-user-colorful-icon.png'} />
                            </NavLink>
                            <span>
                                <span className={styles.name}>{u.name}</span>
                                {u.status
                                    ? <span className={styles.status}>Status: {u.status}</span>
                                    : <span className={styles.status}>Status: ---</span>
                                }

                            </span>

                        </div>
                        <div>
                            {u.followed
                                ? <button disabled={followingInProgress.some((id: number) => id === u.id)}
                                    onClick={() => { unfollowThunk(u.id); }}>Unfollow</button>
                                : <button disabled={followingInProgress.some((id: number) => id === u.id)}
                                    onClick={() => { followThunk(u.id); }}>Follow</button>}
                        </div>
                    </div>

                </div>
            </div>)}
        </div>
    );
}


export default Users;