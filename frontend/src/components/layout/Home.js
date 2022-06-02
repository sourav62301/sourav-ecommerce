import React, { Fragment, useEffect } from "react";
import { CgMouse } from "react-icons/all";
import "./Home.css";
import MetaData from "./MetaData";
import Product from "./ProductCard.js";
import { getProduct, clearErrors } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "./Loader";

import { useAlert } from "react-alert";
import ProductCard from "./ProductCard.js";

function Home() {
  const alert = useAlert();

  const dispatch = useDispatch();

  const { loading, error, products, } = useSelector(
    (state) => state.products
  );

  console.log(products);

  useEffect(() => {
    if (error) {
      return alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct());
  }, [dispatch, error, alert]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Sourav's Ecommerce" />

          <div className="banner">
            <p>Welcome to Sourav's Ecommerce</p>
            <h1>Find AMAZING PRODUCTS Below </h1>

            <a href="#container">
              <button>
                Scroll <CgMouse />{" "}
              </button>
            </a>
          </div>

          <h2 className="homeHeading">Featured Products</h2>

          <div className="container" id="container">
            {products &&
              products.map((product) => (<ProductCard key={product._id} product={product} />))}
          </div>
        </Fragment>
      )}
    </>
  );
}

export default Home;
