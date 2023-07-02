import React, { useContext, useEffect, useState } from "react";
import "../Pages.css";
import { FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { fetchProducts } from "../../components/api/Products";
import axios from "axios";
import { BaseUrl } from "../../components/settings/BaseUrl";
import Dropdown from "../../components/common/Dropdown";
import PageLoader from "../../components/common/PageLoader";
import { addCategory, fetchCategories } from "../../components/api/Categories";
import { AuthContext } from "../../context/authContext";
import AddCategoriesModal from "../../components/modal/categories/AddCategoriesModal";
import DeleteItemModal from "../../components/modal/DeleteItemModal";

function Products() {
  const [products, setProducts] = useState([]);
  const [categoryModal, setShowCategoryModal] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({});
  const [itemToDeleteIndex, setItemToDeleteIndex] = useState(-1)

  const { loginState } = useContext(AuthContext);

  //handle pagination
  const itemsPerPage = 10; // Number of items to show per page
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems?.slice(indexOfFirstItem, indexOfLastItem);

  //TODO: put all this in a different file to dicouple
  //them from this file
  const token = localStorage.getItem("token");
  const BASE_URL = BaseUrl("/");

  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    setIsPageLoading(true);
    const fetchData = async () => {
      const productsData = await fetchProducts(
        axiosInstance,
        loginState.user?.business_id
      );
      if (productsData) {
        setProducts(productsData);
        setFilteredItems(productsData);
        setIsPageLoading(false);
      }
    };

    fetchData();
  }, [loginState.user]);

  useEffect(() => {
    const fetchData = async () => {
      const categoryData = await fetchCategories(
        axiosInstance,
        loginState.user?.business_id
      );
      if (categoryData) {
        setCategories(categoryData);
      }
    };

    fetchData();
  }, [newCategory, loginState]);

  const handleDropDownClick = (item) => {
    setSelectedItem(item);
    setIsPageLoading(true);

    setTimeout(function () {
      setIsPageLoading(false);
      filterItems(item);
    }, 500);
  };

  const filterItems = (selectedItem) => {
    if (selectedItem == "All") {
      setFilteredItems(products);
      return;
    }

    const filtered = products.filter((item) =>
      item.category.toLowerCase().includes(selectedItem.toLowerCase())
    );

    setFilteredItems(filtered);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const showDeletePopup = (item, index) => {
    setShowDeleteModal(true);
    setItemToDelete(item);
    setItemToDeleteIndex(index)

  };

  return (
    <div>
      <DeleteItemModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        itemToDelete={itemToDelete}
        axiosInstance={axiosInstance}
        itemToDeleteIndex={itemToDeleteIndex}
        arrayData={products}
      />
      {categoryModal && (
        <AddCategoriesModal
          loginState={loginState}
          axiosInstance={axiosInstance}
          setShowCategoryModal={setShowCategoryModal}
          setNewCategory={setNewCategory}
        />
      )}
      <div className="menu-bar">
        <h1 className="page-header">/ Products Page</h1>
        <div>
          <Dropdown
            withIcon={true}
            link={"Filter by category"}
            list={categories}
            handleItemClick={handleDropDownClick}
            style={{ zIndex: 99999, minWidth: "160%" }}
          />
        </div>
      </div>
      <div className="table-wrapper">
        <div style={{ display: "flex", gap: 10 }}>
          <Link className="primary-btn" to={"/create/product"}>
            Add Product
          </Link>
          <button
            className="white-btn"
            onClick={() => setShowCategoryModal(true)}
          >
            Add Category
          </button>
        </div>
        {isPageLoading && <PageLoader />}
        {!isPageLoading && (
          <table>
            <thead>
              <tr className="table-row">
                <th>Product</th>
                <th>Date Added</th>
                <th>Price</th>
                <th>Cost</th>
                <th>Stock</th>
                <th>Sku</th>
                <th>Category</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 20,
                        }}
                      >
                        <div
                          style={{
                            width: 60,
                            height: 60,
                            background: "#f2f2f2",
                            justifyContent: "center",
                            display: "flex",
                            alignItems: "center",
                            borderRadius: 100,
                            borderWidth: 1,
                            borderColor: "#ddd",
                          }}
                        >
                          <img
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: "100%",
                            }}
                            src={
                              " http://localhost/wetrack/api/storage/app/" +
                              item.img
                            }
                            width={20}
                            height={"auto"}
                            // onResize={"contain"}
                          />
                        </div>
                        <span>{item.name} </span>
                      </div>
                    </td>
                    <td>{item.created_at_ago}</td>
                    <td>{item.price}</td>
                    <td>{item.cost}</td>
                    <td>
                      <span
                        className="status-pill cancelled"
                        style={{
                          display: "flex",
                          borderRadius: 100,
                          height: 30,
                          width: 30,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {item.stock}
                      </span>
                    </td>
                    <td>{item.sku}</td>
                    <td>{item.category}</td>
                    <td>
                      <div
                        style={{ cursor: "pointer" }}
                        className="action-btns"
                        onClick={() => showDeletePopup(item, index)}
                      >
                        <FaTrashAlt />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        <div className="pagination">
          {Array.from({
            length: Math.ceil(filteredItems?.length / itemsPerPage),
          }).map((_, index) => (
            <button
              key={index}
              className={currentPage === index + 1 ? "active" : ""}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Products;
