import React, { Component, PropTypes } from 'react';

class AddFishForm extends Component {
  createFish(event) {
    event.preventDefault();
    const fish = {
      name: this.name.value,
      price: this.price.value,
      status: this.status.value,
      desc: this.desc.value,
      image: this.image.value,
    };
    console.log('Create a fish 🐟', fish);
    this.props.addFish(fish);
    this.fishForm.reset();
  }

  render() {
    return (
      <form ref={(ref) => this.fishForm = ref} className="fish-edit" onSubmit={(e) => this.createFish(e)}>
        <input ref={(ref) => this.name = ref} type="text" placeholder="Fish Name" />
        <input ref={(ref) => this.price = ref} type="text" placeholder="Fish Price" />
        <select ref={(ref) => this.status = ref}>
          <option value="avalable">Fresh</option>
          <option value="unavalable">Sold Out!</option>
        </select>
        <textarea ref={(ref) => this.desc = ref} type="text" placeholder="Fish Desc"></textarea>
        <input ref={(ref) => this.image = ref} type="text" placeholder="Fish Image" />
        <button type="submit">+ Add Item</button>
      </form>
    );
  }
}

AddFishForm.propTypes = {
  addFish: PropTypes.func.isRequired,
}

export default AddFishForm;