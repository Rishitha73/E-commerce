import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productDetails: {},
    count: 1,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const {match} = this.props
    const {id} = match.params

    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/products/${id}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()

      const updatedData = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        brand: data.brand,
        price: data.price,
        rating: data.rating,
        totalReviews: data.total_reviews,
        description: data.description,
        availability: data.availability,
        similarProducts: data.similar_products.map(eachProduct => ({
          id: eachProduct.id,
          title: eachProduct.title,
          brand: eachProduct.brand,
          imageUrl: eachProduct.image_url,
          price: eachProduct.price,
          rating: eachProduct.rating,
        })),
      }

      this.setState({
        productDetails: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  incrementCount = () => {
    this.setState(prevState => ({
      count: prevState.count + 1,
    }))
  }

  decrementCount = () => {
    this.setState(prevState => ({
      count: prevState.count > 1 ? prevState.count - 1 : 1,
    }))
  }

  renderLoadingView = () => (
    <div className="product-item-details-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="product-item-details-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="product-item-details-failure-image"
      />

      <h1 className="product-item-details-failure-heading">
        Product Not Found
      </h1>

      <button
        type="button"
        className="product-item-details-failure-button"
        onClick={this.apifailure}
      >
        Continue Shopping
      </button>
    </div>
  )

  apifailure = () => {
    const {history} = this.props
    history.push('/products')
  }

  renderSuccessView = () => {
    const {productDetails, count} = this.state

    const {
      imageUrl,
      title,
      price,
      rating,
      totalReviews,
      description,
      availability,
      brand,
      similarProducts,
    } = productDetails

    return (
      <>
        <div className="product-item-details-container">
          <img
            src={imageUrl}
            alt="product"
            className="product-item-details-image"
          />

          <div className="product-item-details-content">
            <h1 className="product-item-details-title">{title}</h1>

            <p className="product-item-details-price">Rs {price}/-</p>

            <div className="product-item-details-rating-container">
              <p className="product-item-details-rating">{rating}</p>

              <p className="product-item-details-reviews">
                {totalReviews} Reviews
              </p>
            </div>

            <p className="product-item-details-description">{description}</p>

            <p className="product-item-details-availability">
              <span className="product-item-details-label">Available:</span>{' '}
              {availability}
            </p>

            <p className="product-item-details-brand">
              <span className="product-item-details-label">Brand:</span> {brand}
            </p>

            <hr className="product-item-details-separator" />

            <div className="product-item-details-quantity-container">
              <button
                type="button"
                className="product-item-details-quantity-button"
                onClick={this.decrementCount}
                data-testid="minus"
              >
                <BsDashSquare />
              </button>

              <p className="product-item-details-quantity">{count}</p>

              <button
                type="button"
                className="product-item-details-quantity-button"
                onClick={this.incrementCount}
                data-testid="plus"
              >
                <BsPlusSquare />
              </button>
            </div>

            <button
              type="button"
              className="product-item-details-add-cart-button"
            >
              ADD TO CART
            </button>
          </div>
        </div>

        <div className="product-item-details-similar-products-container">
          <h1 className="product-item-details-similar-products-heading">
            Similar Products
          </h1>

          <ul className="product-item-details-similar-products-list">
            {similarProducts.map(eachProduct => (
              <SimilarProductItem
                key={eachProduct.id}
                productDetails={eachProduct}
              />
            ))}
          </ul>
        </div>
      </>
    )
  }

  render() {
    const {apiStatus} = this.state

    return (
      <>
        <Header />

        {apiStatus === apiStatusConstants.inProgress &&
          this.renderLoadingView()}

        {apiStatus === apiStatusConstants.success && this.renderSuccessView()}

        {apiStatus === apiStatusConstants.failure && this.renderFailureView()}
      </>
    )
  }
}

export default ProductItemDetails
