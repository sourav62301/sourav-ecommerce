import React, { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import "./ProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import { getProductDetails } from "../../actions/productAction";
import { useParams } from "react-router-dom";
import ReactStars from "react-rating-stars-component";

export default function ProductDetails() {
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );

  const { id } = useParams();

  useEffect(() => {
    dispatch(getProductDetails(id));
  }, [dispatch, id]);


  const options = {
    edit: false,
    color: "rgba(20,20,20,0.1)",
    activeColor: "pink",
    size: window.innerWidth < 600 ? 20 : 25,
    value: product.ratings,
    isHalf: true,
  };

  return (
    <>
      <div className="productDetails">
        <div>
          <Carousel>
            {product.images &&
              product.images.map((item, i) => (
                <img
                  className="CarouselImage"
                  key={i}
                  src={item.url}
                  alt={`${i} Slide`}
                />
              ))}
          </Carousel>
        </div>
      </div>

      <div>
        <div className="detailsBlock-1">
          <h2>{product.name}</h2>
          <p>Product #{product._id}</p>
        </div>
        <div className="detailsBlock-2">
          <ReactStars {...options} />
          <span>({product.numOfReviews}) Reviews</span>
        </div>
        <div className="detailsBlock-3">
          <h1>{`₹${product.price}`}</h1>
          <div className="detailsBlock3-1">
            <div className="detailsBlock3-1-1">
              <button>=</button>
              <input type="Number" value="1" />
              <button>+</button>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
}
