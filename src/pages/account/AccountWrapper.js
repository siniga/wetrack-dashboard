import React, { useState, useEffect } from "react";
import VertList from "../../components/common/VertList";
import { BsGear, BsLock, BsPerson } from "react-icons/bs";
import Card from "../../components/cards/Card";
import Password from "./Password";
import Account from "./Account";
import Settings from "./Settings";

function AccountWrapper(props) {
  const { setSideBar } = props;
  const [selectedView, setSelectedView] = useState("basic");
  const [viewChildren, setviewChildren] = useState("basic");

  useEffect(() => {
    setSideBar(true);
  }, []);

  const swithView = (selectedView) => {
    setviewChildren(selectedView);
    setSelectedView(selectedView);
  };

  return (
    <div
      className="page main-page-container"
      style={{ display: "flex", gap: 20 }}
    >
      <Card width="25%">
        <div style={{ padding: "2px 20px" }}>
          <ul className="vertical-ul">
            <VertList
              showBorder={false}
              onClick={() => swithView("basic")}
              background={selectedView == "basic" ? "#ecf4fc" : null}
              color={"#144b81"}
              radius={7}
            >
              <p>
                <BsPerson /> Basic information
              </p>
            </VertList>
            <VertList
              onClick={() => swithView("password")}
              background={selectedView == "password" ? "#ecf4fc" : null}
              color={"#144b81"}
              radius={7}
            >
              <p>
                <BsLock /> Password
              </p>
            </VertList>
            <VertList
              onClick={() => swithView("settings")}
              background={selectedView == "settings" ? "#ecf4fc" : null}
              color={"#144b81"}
              radius={7}
            >
              <p>
                <BsGear /> Settings
              </p>
            </VertList>
          </ul>
        </div>
      </Card>
      <div style={{ width: "75%" }}>
        {viewChildren == "basic" && <Account />}
        {viewChildren == "password" && <Password />}
        {viewChildren == "settings" && <Settings />}
      </div>
    </div>
  );
}

export default AccountWrapper;
