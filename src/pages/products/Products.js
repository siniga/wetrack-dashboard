import React, { useState, useEffect } from "react";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import {
  FaPlus,
  FaFileExport,
  FaFileDownload,
  FaCalendar,
  FaFilter,
  FaArrowRight,
  FaTimes,
  FaTrashAlt,
  FaEdit,
} from "react-icons/fa";
import Product1 from "../../img/products/p1.png";
import Product2 from "../../img/products/p2.jpg";
import Product3 from "../../img/products/p3.jpg";
import Product4 from "../../img/products/p1.png";
import "./Products.css";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/modal/Modal";
import Header from "../../components/header/Header";
import ActionButtonsMenue from "../../components/header/ActionButtonsMenue";
import FilterButtonsMenue from "../../components/header/FilterButtonsMenue";
import Card from "../../components/cards/Card";
import { Checkbox } from "../../components/elements/Checkbox";
import { Button } from "../../components/elements/Button";
import Table from "../../components/tables/Table";
import TableRow from "../../components/tables/TableRow";
import TableData from "../../components/tables/TableData";
import TableHeader from "../../components/tables/TableHeader";
import { BaseUrl, StorageUrl } from "../../components/settings/BaseUrl";
import { authToken } from "../../components/settings/Authentication";
import axios from "axios";
import VertList from "../../components/common/VertList";
import { authUserBusinessData } from "../../components/settings/AuthUserData";
import Loader from "../../components/pageloader/Loader";
import { FetchData } from "../../components/settings/api/FetchData";

function Products(props) {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({});
  const [categoryId, setCategoryId] = useState(1);

  useEffect(() => {
    FetchData(`categories/business/${authUserBusinessData().business_id}`)
      .then((response) => {
        console.log(response);
        setCategories(response.categories);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    setIsLoading(true);
    FetchData(
      `products/business/${
        authUserBusinessData().business_id
      }/category/${categoryId}/special/0`
    )
      .then((response) => {
        console.log(response);
        setProducts(response.products);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, [categoryId]);

  const deleteProduct = () => {
    setIsModalLoading(true);
    // return ;

    axios({
      url: BaseUrl("product/" + currentProduct.id),
      method: "delete",
      headers: {
        Authorization: "Bearer " + authToken(),
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setIsModalLoading(false);
        let filteredProducts = products.filter(
          (product) => product.id !== currentProduct.id
        );

        console.log(filteredProducts);
        setProducts(filteredProducts);
        // setTeams(filteredProducts);
        setShowModal(false);
      })
      .catch((err) => {
        setIsModalLoading(false);
      });
  };

  const getCategories = () => {
    if (!authUserBusinessData()) return;

    axios({
      url: BaseUrl("categories/business/" + authUserBusinessData().business_id),
      method: "get",
      headers: {
        Authorization: "Bearer " + authToken(),
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setCategories(response.data.categories);
        setCategoryId(response.data.categories[0].id);
      })
      .catch((err) => {});
  };

  const showDeletePopup = (currentProduct) => {
    console.log(currentProduct);
    setShowModal(true);
    setCurrentProduct(currentProduct);
  };

  return (
    <>
      <Modal
        showContinueBtn={true}
        header="Delete Item"
        showBackDrop={true}
        style={{ minWidth: "40%", height: "150px", background: "white" }}
        showModal={showModal}
        continueAction={deleteProduct}
        setShowModal={setShowModal}
        isModalLoading={isModalLoading}
      >
        <p>You dont have the permission to delete this item</p>
      </Modal>
      <div className="page product-container">
        <Header>
          <ActionButtonsMenue>
            <Button buttonLink={"/add-product"}>New Product</Button>
            <Button buttonLink={"/add-category"} buttonStyle={"btn--outline"}>
              New Category
            </Button>
          </ActionButtonsMenue>
          <FilterButtonsMenue>
            <p>
              <MenuButton>
                <FaTrashAlt /> <span>Trash</span>
              </MenuButton>
            </p>
            <Menu
              menuButton={
                <MenuButton>
                  <FaFilter /> <span>Categories</span>
                </MenuButton>
              }
              transition
            >
              {categories &&
                categories.map((category, key) => {
                  return <MenuItem key={key}>{category.name}</MenuItem>;
                })}
            </Menu>
            <Menu
              menuButton={
                <MenuButton>
                  <FaCalendar /> <span>Select Date</span>
                </MenuButton>
              }
              transition
            >
              <MenuItem>Today</MenuItem>
              <MenuItem>Yesterday</MenuItem>
              <MenuItem>This Week</MenuItem>
              <MenuItem>This Month</MenuItem>
              <MenuItem>3 Month</MenuItem>
              <MenuItem>6 Month</MenuItem>
              <MenuItem>This Year</MenuItem>
              {/* <MenuItem onClick={showDatePickerModal}>Select Date Range</MenuItem> */}
            </Menu>

            <Menu
              menuButton={
                <MenuButton>
                  <FaFileExport /> <span>Export</span>
                </MenuButton>
              }
              transition
            >
              <MenuItem>Today</MenuItem>
              <MenuItem>Yesterday</MenuItem>
              <MenuItem>This Week</MenuItem>
              <MenuItem>This Month</MenuItem>
              <MenuItem>3 Month</MenuItem>
              <MenuItem>6 Month</MenuItem>
              <MenuItem>This Year</MenuItem>
              <MenuItem>Select Date Range</MenuItem>
            </Menu>
          </FilterButtonsMenue>
        </Header>
        <div style={{ display: "flex", gap: 20, width: "74%" }}>
          <Table>
            <Loader loadMsg={"Loading data..."} isLoading={isLoading} />
            <TableHeader
              columns={["Product", "Price", "Cost", "Category", "Action"]}
            />
            {products && products.length > 0
              ? products.map((product, index) => {
                  return (
                    <div>
                      <TableRow key={index}>
                        <TableData>
                          <img
                            src={StorageUrl(product.img)}
                            style={{ maxWidth: 25 }}
                          />{" "}
                          {product.name.substr(0, 13)}
                        </TableData>
                        <TableData>{product.price}</TableData>
                        <TableData>{product.cost}</TableData>
                        <TableData>{product.category}</TableData>
                        <TableData>
                          {/* <div className="action-btns">
                              <FaEdit />
                            </div> */}
                          <div
                            className="action-btns"
                            onClick={() => showDeletePopup(product)}
                          >
                            <FaTrashAlt />
                          </div>
                        </TableData>
                      </TableRow>
                    </div>
                  );
                })
              : "No available data"}
          </Table>
          <Card minWidth={"30%"}>
            <h4>Categories</h4>
            {categories &&
              categories.map((category, key) => {
                return (
                  <VertList
                    key={key}
                    onClick={() => setCategoryId(category.id)}
                    background={category.id == categoryId ? "#ecf4fc" : null}
                    color={"#144b81"}
                    radius={7}
                  >
                    <p className="children"> {category.name}</p>
                  </VertList>
                );
              })}
          </Card>
        </div>
      </div>
    </>
  );
}

export default Products;
