import React from "react";
import "./Stats.css";
import { FaChartPie } from "react-icons/fa";
import { NumericFormat } from "react-number-format";

function CompareStats(props) {
  const { bg, color, stat, title, icon, statFormat,subTitle, prevData, currentData } = props;
  return (
    <>
      <div className="stats-wrapper">
        <span className="stat-icon" style={{ background: bg, color: color }}>
          {icon}
        </span>
        <span className="stat-price">
          {statFormat == "currency" ? (
            <NumericFormat
              thousandSeparator={true}
              displayType={"text"}
              value={stat}
              allowLeadingZeros
              prefix={"Tsh"}
            />
          ) : (
            stat
          )}
        </span>
        <span className="stat-title">{title}</span>
        <span className="stat-sub-title">{subTitle}{ currentData > prevData ? "up from last month": "down from last month"}</span>
      </div>
    </>
  );
}

export default CompareStats;
