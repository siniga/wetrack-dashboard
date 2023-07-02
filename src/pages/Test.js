import cx from "classnames";
import React, { useState } from "react";
export default () => {
  const [like, setLike] = useState(100);
  const [isClicked, setClicked] = useState(false);

  const increaseLikes = () => {
    if (!isClicked) {
      setLike(like + 1);
      setClicked(true);
    } else {
      setLike(like - 1);
      setClicked(false);
    }
  };

  const increaseDislikes = () =>{}
  
  return (
    <>
      <div>
        <button className="like-button" onClick={increaseLikes}>
          Like |<span className="likes-counter">{like} </span>
        </button>
        <button className="dislike-button" onClick={increaseDislikes}>
          Dislike | 1
        </button>
      </div>
      <style>{`
                    .like-button, .dislike-button {
                        font-size: 1rem;
                        padding: 5px 10px;
                        color:   #585858;
                    }

                    .liked, .disliked {
                        font-weight: bold;
                        color: #1565c0;
                    }
                `}</style>
    </>
  );
};
