import React, { Component, PropTypes } from 'react';

import { getFunName } from '../helpers';

class StorePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      storeId: getFunName(),
    };
    this.gotToStore = this.gotToStore.bind(this);
    this.handleStoreIdChange = this.handleStoreIdChange.bind(this);
  }

  gotToStore(event) {
    event.preventDefault();
    const { router } = this.context;
    const redirectPath = `/store/${this.state.storeId}`;
    router.transitionTo(redirectPath);
  }

  handleStoreIdChange(event) {
    this.setState({ storeId: event.target.value });
  }

  render() {
    return (
      <form className="store-selector" onSubmit={this.gotToStore}>
        <h2>Please Enter A Store</h2>
        <input
          required
          type="text"
          placeholder="Store Name"
          value={this.state.storeId}
          onChange={this.handleStoreIdChange}
        />
        <button type="submit">Visit Store</button>
      </form>
    )
  }
}

StorePicker.contextTypes = {
  router: PropTypes.object.isRequired,
}

export default StorePicker;
