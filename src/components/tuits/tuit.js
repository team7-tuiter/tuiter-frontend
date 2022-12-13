import React from "react";
import TuitStats from "./tuit-stats";
import TuitImage from "./tuit-image";
import TuitVideo from "./tuit-video";

const Tuit = ({ tuit, deleteTuit }) => {
  const postedOn = new Date(tuit.postedOn);
  const formattedDate = `${postedOn.getFullYear()}/${postedOn.getMonth()}/${postedOn.getDay()}`;
  return (
    <li className="p-2 ttr-tuit list-group-item d-flex rounded-0">
      <div className="pe-2">
        {
          tuit?.postedBy &&
          <img src={`/images/nasa-logo.jpg`}
            className="ttr-tuit-avatar-logo rounded-circle" />
        }
      </div>
      <div className="w-100">
        <i onClick={() => deleteTuit(tuit._id)} className="fas fa-remove fa-pull-right"></i>
        <p
          className="fs-5 m-0">
          @{tuit?.postedBy && tuit?.postedBy?.username}
          <small className="small text-muted"> - {formattedDate}</small></p>
        {tuit?.tuit}
        {
          tuit.youtube &&
          <TuitVideo tuit={tuit} />
        }
        {
          tuit.image &&
          <TuitImage tuit={tuit} />
        }
        <TuitStats tuit={tuit} />
      </div>
    </li>
  );
}
export default Tuit;