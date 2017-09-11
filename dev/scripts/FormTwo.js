import React from 'react';
import  { toMoney } from './utilities'
import firebase from './firebase';
const dbRef = firebase.database().ref('/items');

class FormTwo extends React.Component {
        constructor() {
        super();
        this.state = {
            category: '',
            desc: '',
            cost: '',
            items: [],
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        //check to see if inputs are actually filled in
        if (this.refs.desc.value === '' || this.refs.cost.value === '') {
            alert('please add something!');
       //check to see if cost entered is actually a number     
        } else if (isNaN(this.refs.cost.value)) {
        	alert('that is not a number!');
        }	else {
            this.setState({items: {
                category: this.refs.category.value,
                desc: this.refs.desc.value,
                cost: toMoney(this.refs.cost.value),
            }}, () => {
                // console.log(this.state);
                this.props.FormTwo(this.state.items);
            })
        }
        // const newItem = {
        //     category: this.state.category,
        //     desc: this.state.desc,
        //     cost: this.state.cost
        // };
        // dbRef.push(newItem);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    render() {
        return (
        <section className="addExpense">
            <p>So, what did you just spend $ on?</p>
            <form onSubmit={this.handleSubmit}> 
               <div className="dropdown"> 
                <select ref="category" onChange={this.handleChange}>
                      <option key="Food" value="Food">Food</option>
                      <option key="Shopping" value="Shopping">Shopping</option>
                      <option key="Transportation" value="Transportation">Transportation</option>
                      <option key="Attraction" value="Attraction">Attractions</option>
                      <option key="Other" value="Other">Other</option>
                </select>
                <i className="fa fa-chevron-down" aria-hidden="true"></i>
                </div>
                <input type="text" id="desc" ref="desc" placeholder="Description" onChange={this.handleChange}/>
                <input type="text" id="cost" ref="cost" placeholder="Cost" onChange={this.handleChange}/>
                <button className="add-btn">Add</button>
            </form> 
        </section>
        )
    }
}

export default FormTwo;