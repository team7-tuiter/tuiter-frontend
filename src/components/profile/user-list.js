import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signin } from '../../redux/userSlice'
import { signInUsingUsername } from "../../services/auth-service";

export const UserList = ({ users, deleteUser }) => {

  const dispatch = useDispatch()

  return (
    <div className="list-group">
      {
        users &&
        users.map(user => {
          return (
            <Link className="list-group-item"
              key={user._id}
              to={`/home/${user._id}`}
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
            </Link>
          )
        })
      }
    </div>)
};
