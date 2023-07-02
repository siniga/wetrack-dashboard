import React from "react";
import AvatarImg from "../../img/avatar.png";
import "./Avatar.css";

function Avatar(props) {
  const { width, height, avatarImgPreview } = props;

  return (
    <div>
      {avatarImgPreview ? (
        <img
          src={avatarImgPreview}
          style={{ width: width, height: height }}
          className="avatar-img"
        />
      ) : (
        <img
          src={AvatarImg}
          style={{ width: width, height: height }}
          className="avatar-img"
        />
      )}
    </div>
  );
}

export default Avatar;
