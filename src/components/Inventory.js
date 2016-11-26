import React, { Component, PropTypes } from 'react';

import AddFishForm from './AddFishForm';
import base from '../base';

class Inventory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      userId: '',
      ownerId: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.auth = this.auth.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.renderInventory = this.renderInventory.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
  }

  auth(provider) {
    base.authWithOAuthPopup(provider, this.handleLogin)
  }
  
  handleChange(e, key) {
    const fish = this.props.fishes[key];
    const updatedFish = Object.assign({}, fish, {
      [e.target.name]: e.target.value
    });
    this.props.updateFish(key, updatedFish);
  }

  handleLogin(error, authData) {
    if (authData.user) {
      console.log(authData.user.uid, authData.user.providerId);
    }
    console.log(authData)
    const loading = false;
    const userId = authData && authData.user ? authData.user.uid : null;

    if (error) {
      console.error(error);
      this.setState({ loading });
      return;
    }

    if (!userId) {
      this.setState({ loading });
      return;
    }
    
    const storeRef = base.database().ref(this.props.storeId);
    storeRef.once('value', (snapshot) => {
      const data = snapshot.val() || {};
      const { ownerId } = data;

      this.setState({
        loading,
        userId,
        ownerId,
      });

      // Claim store ownership if not taken
      if (!ownerId) {
        storeRef.set({
          ownerId: userId,
        });
      }
    });
  }

  handleLogout() {
    base.unauth();
    this.setState({ userId: null })
  }

  renderLogin() {
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <p>Sign in to manage your stores inventory</p>
        <button className="github" onClick={() => this.auth('github')}>Log In with Github</button>
        <button className="facebook" onClick={() => this.auth('facebook')}>Log In with Facebook</button>
        <button className="twitter" onClick={() => this.auth('twitter')}>Log In with Twitter</button>
      </nav>
    );
  }

  renderInventory(key) {
    const fish = this.props.fishes[key];
    return (
      <div key={key} className="fish-edit">
        <input type="text" name="name" value={fish.name} onChange={(e) => this.handleChange(e, key)} placeholder="Fish Name" />
        <input type="text" name="price" value={fish.price} onChange={(e) => this.handleChange(e, key)} placeholder="Fish Price" />
        <select name="status" value={fish.status} onChange={(e) => this.handleChange(e, key)} >
          <option value="available">Fresh</option>
          <option value="unavalable">Sold Out!</option>
        </select>
        <textarea type="text" name="desc" value={fish.desc} onChange={(e) => this.handleChange(e, key)} placeholder="Fish Desc"></textarea>
        <input type="text" name="image" value={fish.image} onChange={(e) => this.handleChange(e, key)} placeholder="Fish Image" />
        <button onClick={() => this.props.removeFish(key)}>- Remove Item</button>
      </div>
    );
  }

  componentWillMount() {
    base.onAuth((user) => this.handleLogin(null, { user }));
  }
  
  render() {
    const { loading, userId, ownerId } = this.state;
    const Logout = <button onClick={this.handleLogout}>Log Out!</button>;

    if (loading) {
      return (
        <div>Loading...</div>
      );
    }

    // Show login if user NOT logged in 
    if (!this.state.userId) {
      return (
        <div>{this.renderLogin()}</div>
      );
    }

    // Only allow access to the store owner
    if (userId !== ownerId) {
      return (
        <div>
          <p>Sorry you are NOT the store owner!</p>
          {Logout}
        </div>
      );
    }

    return (
      <div>
        <h2>Inventory</h2>
        {Logout}
        {Object.keys(this.props.fishes).map(this.renderInventory)}
        <AddFishForm addFish={this.props.addFish} />
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
      </div>
    );
  }
}

Inventory.propTypes = {
  fishes: PropTypes.object.isRequired,
  addFish: PropTypes.func.isRequired,
  updateFish: PropTypes.func.isRequired,
  removeFish: PropTypes.func.isRequired,
  loadSamples: PropTypes.func.isRequired,
  storeId: PropTypes.string.isRequired,
}

export default Inventory;