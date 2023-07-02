import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./Sales.css";
import { Button } from "../../components/elements/Button";
import Table from "../../components/tables/Table";
import Card from "../../components/cards/Card";
import TableHeader from "../../components/tables/TableHeader";
import TableData from "../../components/tables/TableData";
import TableRow from "../../components/tables/TableRow";

function ViewSale(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState({});

  useEffect(() => {
    if (location.state) setOrder(location.state.sale);
  }, []);


  const cancelOrder = () => {
    alert("cancelOrder");
  };

  return (
    <div className="page view-sale-container">
      <div className="invoice-wrapper">
        <div
          className="back-btn-wrapper action-btns"
          onClick={() => navigate("/sales")}
        >
          <FaArrowLeft />
        </div>
        <div className="order-header">
          <div className="order-header-btns">
            <div className="header-action-btns">
              <Button buttonStyle={"btn--outline"}>Edit Invoice</Button>
              <Button>Print</Button>
            </div>
          </div>
          <div className="order-header-info">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <p style={{ fontWeight: 600, fontSize: 24 }}>Order Info</p>
              <span>Order number</span>
              <span>
                {"#"} {order.order_no}
              </span>
            </div>
            <div className="order-status">
              <p>
                <span style={{ fontWeight: "bold" }}>Status:{" "}</span>
                {order.status == 1 && (
                  <span>Processing</span>
                )}
                {order.status == 2 && (
                  <span>Completed</span>
                )}
                {order.status == 3 && (
                  <span>Cancelled</span>
                )}
              </p>
              <span>
                <span style={{ fontWeight: "bold" }}>Date: </span>{" "}{order.device_time}
              </span>
            </div>
          </div>
        </div>
        <div className="billing-info-wrapper">
          <h3>Billing Information</h3>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <p>
                <span>Name : </span>
                <span>{order.customer} </span>
              </p>
              <p>
                <span>Phone: </span>
                <span>{order.customer_phone}</span>
              </p>
              <p>
                <span>Location: </span>
                <span>{order.location ? order.location : "-"}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="order-body">
        <Table>
            <Card>
              {console.log(order)}
              <TableHeader columns={ ["Order Number", "Item Name", "Cost", "Unit Price"]} />
              {order.products &&
                order.products.map((product, index) => {
                  return (
                    <div>
                      <TableRow key={index}>
                      <TableData>{"#"}{order.order_no}</TableData>
                        <TableData>{product.name}</TableData>
                        <TableData>{product.quantity}</TableData>
                        <TableData>{product.price}</TableData>
                        <TableData>
                          
                        </TableData>
                      </TableRow>
                    </div>
                  );
                })}
            </Card>
          </Table>
        </div>
        <div className="order-footer"></div>
      </div>
    </div>
  );
}

export default ViewSale;
