import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginAs } from '../../redux/userSlice'

/**
 * Not in use.
 * @returns User list.
 * @deprecated
 */
export const UserList = ({ users, deleteUser }) => {

  const dispatch = useDispatch()

  return (
    <div className="list-group">
      {
        users &&
        users.map(user => {
          return (
            <li className="list-group-item"
              key={user._id}
            >
              <span className="fs-3">
                {user.username}
              </span>
              <button onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                deleteUser(user._id)
              }} className="btn btn-danger fa-pull-right">
                <i className="fas fa-remove"></i>
              </button>
            </li>
          )
        })
      }
    </div>)
};
