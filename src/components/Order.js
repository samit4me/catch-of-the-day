import React, { Component, PropTypes } from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';

import { formatPrice } from '../helpers';

class Order extends Component {
  constructor(props) {
    super(props);
    this.renderOrder = this.renderOrder.bind(this);
  }

  renderOrder(key) {
    const fish = this.props.fishes[key];
    const count = this.props.order[key];
    const removeButton = (
      <button onClick={() => this.props.removeFromOrder(key)}>&times;</button>
    );
    if (!fish || fish.status === 'unavailable') {
      const product = fish ? fish.name : 'fish';
      return <li key={key}>Sorry, {product} is no longer available! {removeButton}</li>
    }
    return (
      <li key={key}>
        <span>
          <CSSTransitionGroup
            component="span"
            className="count"
            transitionName="count"
            transitionEnterTimeout={100}
            transitionLeaveTimeout={100}
          >
            <span key={count}>{count}</span>
          </CSSTransitionGroup>
          lbs {fish.name} {removeButton}
        </span>
        <span className="price">{formatPrice(count * fish.price)}</span>
      </li>
    )
  }

  render() {
    const { fishes, order } = this.props;
    const orderIds = Object.keys(order);
    const total = orderIds
      .reduce((acc, key) => {
        const count = order[key];
        const fish = fishes[key];
        const isAvailable = fish && fish.status === 'available';
        if (isAvailable) {
          return acc + (count * fish.price || 0);
        }
        return acc;
      }, 0);
    return (
      <div className="order-wrap">
        <h2>Your Order</h2>

        <CSSTransitionGroup
            component="ul"
            className="order"
            transitionName="order"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}
        >
          {orderIds.map(this.renderOrder)}
          <li className="total">
            <strong>Total:</strong>
            {formatPrice(total)}
          </li>
        </CSSTransitionGroup>
      </div>
    );
  }
}

Order.propTypes = {
  fishes: PropTypes.object.isRequired,
  order: PropTypes.object.isRequired,
  removeFromOrder: PropTypes.func.isRequired,
}

export default Order;