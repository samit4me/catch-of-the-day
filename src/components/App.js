import React, { Component, PropTypes } from 'react';

import Fish from './Fish';
import Header from './Header';
import Inventory from './Inventory';
import Order from './Order';
import sampleFishes from '../sample-fishes';
import base from '../base';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fishes: {},
      order: {},
      loading: true,
    };
    this.addFish = this.addFish.bind(this);
    this.updateFish = this.updateFish.bind(this);
    this.removeFish = this.removeFish.bind(this);
    this.loadSamples = this.loadSamples.bind(this);
    this.addToOrder = this.addToOrder.bind(this);
    this.removeFromOrder = this.removeFromOrder.bind(this);
  }

  addFish(fish) {
    const fishes = Object.assign({}, this.state.fishes);
    fishes[`fish-${Date.now()}`] = fish;
    this.setState({ fishes });
  }

  updateFish(key, fish) {
    const fishes = Object.assign({}, this.state.fishes, {
      [key]: fish,
    });
    this.setState({ fishes });
  }

  removeFish(key) {
    const fishes = Object.assign({}, this.state.fishes, {
      [key]: null,
    });
    this.setState({ fishes });
  }

  addToOrder(key) {
    const order = Object.assign({}, this.state.order);
    order[key] = order[key] + 1 || 1;
    this.setState({ order });
  }

  removeFromOrder(key) {
    const order = Object.assign({}, this.state.order);
    delete order[key];
    this.setState({ order });
  }

  loadSamples() {
    this.setState({
      fishes: sampleFishes,
    });
  }

  componentWillMount() {
    const storeId = this.props.params.storeId;
    // sync "fishes" with firebase
    this.firebaseRef = base.syncState(`${storeId}/fishes`, {
      context: this,
      state: 'fishes',
      then() {
        this.setState({ loading: false });
      }
    });
    // sync "orders" with localStorage
    const key = `order-${storeId}`;
    const localStorageOrder = localStorage.getItem(key);
    if (localStorageOrder) {
      const order = JSON.parse(localStorageOrder);
      this.setState({ order });
    }
  }

  componentWillUnmount() {
    base.removeBinding(this.firebaseRef);
  }

  componentWillUpdate(nextProps, nextState) {
    const storeId = this.props.params.storeId;
    const key = `order-${storeId}`;
    const value = JSON.stringify(nextState.order);
    localStorage.setItem(key, value);
  }
  
  render() {
    const { fishes, order, loading } = this.state;
    const { params } = this.props;
    if (loading) {
      return (
        <div>LOADING...</div>
      );
    }
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market"/>
          <ul className="ulst-of-fishes">
            {
              Object
                .keys(fishes)
                .map((key) => (
                  <Fish
                    key={key}
                    fish={fishes[key]}
                    fishKey={key}
                    addToOrder={this.addToOrder}
                  />
                ))
            }
          </ul>
        </div>
        <Order fishes={fishes} order={order} removeFromOrder={this.removeFromOrder} />
        <Inventory
          addFish={this.addFish}
          updateFish={this.updateFish}
          removeFish={this.removeFish}
          loadSamples={this.loadSamples}
          fishes={fishes}
          storeId={params.storeId}
        />
      </div>
    );
  }
}

App.propTypes = {
  params: PropTypes.object.isRequired,
}

export default App;
