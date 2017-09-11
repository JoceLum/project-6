import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';
import  { toMoney } from './utilities'
import firebase from './firebase';
const dbRef = firebase.database().ref('/items');

//form to enter budget
class FormOne extends React.Component {
render() {
        return (
            <section className="budget-section">
                <form onSubmit={this.props.handleSubmit}>
                    <label htmlFor="budget">What is your budget for this trip?</label>
                    <input type="text" name="budget" placeholder="in CDN $" onChange={this.props.handleChange} value={this.props.budget}/>
                    <button className="submit-btn">Submit</button>
                </form>
            </section>
        );
    }
}

//form to enter in individual expenses
class FormTwo extends React.Component {
    render() {
        return (
        <section className="addExpense">
            <p>So, what did you just spend $ on?</p>
            <form onSubmit={this.props.handleSubmit}> 
               <div className="dropdown"> 
                <select onChange={this.props.handleChange} value={this.props.category} name="category">
                      <option key="Category" value="Category">Category</option>
                      <option key="Food" value="Food">Food</option>
                      <option key="Shopping" value="Shopping">Shopping</option>
                      <option key="Transportation" value="Transportation">Transportation</option>
                      <option key="Attraction" value="Attraction">Attractions</option>
                      <option key="Other" value="Other">Other</option>
                </select>
                <i className="fa fa-chevron-down" aria-hidden="true"></i>
                </div>
                <input type="text" placeholder="Description" name="desc" onChange={this.props.handleChange} value={this.props.desc}/>
                <input type="number" placeholder="Cost" name="cost" onChange={this.props.handleChange} value={this.props.cost}/>
                <button className="add-btn">Add</button>
            </form> 
        </section>
        )
    }
}

class App extends React.Component {
constructor() {
    super();
        this.state = {
            budget: '',
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
        let costItem = toMoney(this.state.cost);
        //check to see if inputs are actually filled in
        if (this.state.desc === '' || this.state.cost === '') {
            alert('please add something!');
        }  else {
        const newItem = {
            category: this.state.category,
            desc: this.state.desc,
            cost: costItem,
        };
        dbRef.push(newItem);
        }
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

componentDidMount() {
    //to retrieve data from Firebase:
    dbRef.on('value',(snapshot) => {
        const newItemsArray = [];
        const firebaseItems = snapshot.val();
        for (let key in firebaseItems) { 
            const firebaseItem = firebaseItems[key];
                firebaseItem.id = key;
            newItemsArray.push(firebaseItem);
        }
        this.setState({
            items: newItemsArray,
        });
    });
}
    render() {
      return (
       <div className="app wrapper"> 
        <Header />
        <FormOne
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmit}
        budget={this.state.budget}
        />
        <FormTwo
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmit}
        category={this.state.category}
        desc={this.state.desc}
        cost={this.state.cost}
         />
        <section className="expenseList">
            <table>
        	  <thead>
            	 <tr>
            	   <th>Category</th>
            	   <th>Description</th> 
            	   <th>Amount</th>
            	 </tr>
        	  </thead>
        	  <tbody>      	  	
            {this.state.items.map((item) => { 
                return (<tr key={item.id}>
                        <td>{item.category}</td>
                        <td>{item.desc}</td>
                        <td>${item.cost}</td>
                    </tr>);
                    })}
        	  </tbody>
              <tfoot>
                <tr>
                   <td colSpan={3}><strong>Budget:</strong> ${this.state.budget}</td> 
                </tr>
              </tfoot>
        	</table>
        </section>
      </div>

      )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
