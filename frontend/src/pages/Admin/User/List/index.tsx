import { AxiosRequestConfig } from "axios";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { requestBackend } from "util/requests";
import UserCrudCard from "../UserCrudCard";
import { SpringPage, User } from "types";
import UserFilter, { UserFilterData } from "Components/Filters/UserFilter";
import Pagination from "Components/Pagination";
import './styles.css';

type ControlComponentsData = {
    activePage: number;
    filterData: UserFilterData;
}

const List = () => {

     // pagination and filter
     const [controlComponentsData, setControlComponentsData] = useState<ControlComponentsData>({activePage:0, filterData: { name: '' },});

     const handlePageChange = (pageNumber : number) => {
       setControlComponentsData({activePage: pageNumber, filterData: controlComponentsData.filterData});
     }

    const [page, setPage] = useState<SpringPage<User>>();

    const getUsers = useCallback(() => {
        const params : AxiosRequestConfig = {
          method:"GET",
          url: "/users",
          params: {
            page: controlComponentsData.activePage,
            size: 12,
    
            name: controlComponentsData.filterData.name
          },
          withCredentials: true
        }
      
        requestBackend(params) 
          .then(response => {
            setPage(response.data);
            window.scrollTo(0, 0);
          })
      }, [controlComponentsData])

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    const handleSubmitFilter = (data : UserFilterData) => {
      setControlComponentsData({activePage: 0, filterData: data});
    }

    return(
        <div className='users-crud-container'>
          <div className="users-crud-content-container">
            <div className="users-crud-bar-container">
                  <Link to="/admin/users/create">
                      <button className="btn btn-primary btn-crud-add" style={{color:"white", marginBottom:"20px"}}>
                          ADD NEW USER
                      </button>
                  </Link>
              </div>
              <div className='users-search-bar-container'>
                <UserFilter onSubmitFilter={handleSubmitFilter} />
              </div>
              <div className='row users-crud-row'>
                  {page?.content
                      .sort( (a,b) => a.name > b.name ? 1 : -1)
                      .map((item) => (
                          <div className="col-sm-4 col-md-4 col-lg-3 col-xl-2 user-crud-column" key={item.id}>
                              <UserCrudCard user={item} onDelete={() => getUsers()} />
                          </div>
                      ))
                  }
            </div>
          </div>
            <div className='users-pagination-container'>
              <Pagination 
                pageCount={(page) ? page.totalPages : 0} 
                range={2}
                onChange={handlePageChange}
                forcePage={page?.number}
              />
            </div>
    </div>
    );
}

export default List;