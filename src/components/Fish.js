import React, { Component, PropTypes } from 'react';

import { formatPrice } from '../helpers';

class Fish extends Component {
  render() {
    const { fish, fishKey, addToOrder } = this.props;
    const isAvailable = fish.status === 'available';
    const buttonText = isAvailable ? 'Add To Order' : 'Sold Out!';
    const handleAddToOrder = () => addToOrder(fishKey);
    return (
      <li className="menu-fish">
        <img src={fish.image} alt={fish.name} />
        <h3 className="fish-name">
          {fish.name}
          <span className="price">{formatPrice(fish.price)}</span>
        </h3>
        <p>{fish.desc}</p>
        <button onClick={handleAddToOrder} disabled={!isAvailable}>
          {buttonText}
        </button>
      </li>
    );
  }
}

Fish.propTypes = {
  fish: PropTypes.object.isRequired,
  fishKey: PropTypes.string.isRequired,
  addToOrder: PropTypes.func.isRequired,
}

export default Fish;