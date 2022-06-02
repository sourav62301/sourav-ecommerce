import React from "react";
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";


function ProductCard({ product }) {
  const options = {
    edit: false,
    color: "rgba(20,20,20,0.1)",
    activeColor: "pink",
    size: window.innerWidth < 600 ? 20 : 25,
    value: product.ratings,
    isHalf: true,
  };

  return (
    <div>
      <Link className="productCard" to={`/product/${product._id}`}>
        <img src={product.images[0].url} alt={product.name} />
        <p>{product.name}</p>

        <div>
          <ReactStars {...options} classNames="stars" />{" "}
          <span className="productCardSpan">({product.numOfReviews} Reviews)</span>
        </div>
        <span>{`₹${product.price}`}</span>
      </Link>
    </div>
  );
}

export default ProductCard;
