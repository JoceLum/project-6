import React from 'react';
import ReactDOM from 'react-dom';
import  { toMoney } from './utilities'
import swal from 'sweetalert2'
import firebase, { auth, provider } from './firebase.js';
const userRef = firebase.database().ref('/user');


//header
const Header = () => {
    return (
        <header>
            <div className="wrapper">
                <h1>Globetrotter On a Budget</h1>
            </div>
        </header>  
    )
}

//form to enter in individual expenses
class Form extends React.Component {
    render() {
        return (
    <div className="form-section">     
        <section className="budget-section">
            <form onSubmit={this.props.handleSubmit}>
                <label htmlFor="budget">What is your budget for this trip?</label>
                <input type="text" name="budget" placeholder="$" onChange={this.props.handleChange} value={this.props.budget}/>
            </form>
        </section>    
        <section className="expenses-section">
            <p>So, what did you just buy?</p>
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
    </div>
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
            totalExpenses: 0,
            leftOverBudget: 0,
            items: [],
            user: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
}    

    removeItem(key) {
        const itemRef = firebase.database().ref(`user/items/${key}`);
        itemRef.remove();  
    }
    
    handleSubmit(event) {
        event.preventDefault();
        let costItem = toMoney(this.state.cost);
        //check to see if inputs are actually filled in
        if (this.state.budget === '') {
            swal({
              title: 'Error!',
              text: 'Please enter a budget!',
              type: 'error',
              confirmButtonText: 'Cool'
            })
        }
        else if (this.state.category === '' || this.state.desc === '' || this.state.cost === '') {
            swal({
              title: 'Error!',
              text: 'Please fill in all fields!',
              type: 'error',
              confirmButtonText: 'Cool'
            })
        }  else {
            
            var items = this.state.items.slice(0);
              
            items.push({
                category: this.state.category,
                desc: this.state.desc,
                cost: costItem,
                });

            userRef.set({
                budget: toMoney(this.state.budget),
                items: items
            });
            //resets form input values
            this.setState({
                    cost:'', 
                    desc: '',
                    category: ''
                });
        }
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

componentDidMount() {
    //to retrieve data from Firebase:
    userRef.on('value',(snapshot) => {
        const newItemsArray = [];
        const user = snapshot.val();
        if (user != null) {
            for (let key in user.items) { 
                var item = user.items[key];
                    item.id = key;
                newItemsArray.push(item);
            }
            //sums up all expenses as new entries are added
            let totalExpenses = newItemsArray.reduce((acc,curr) => {
                return acc += curr.cost;
            },0);
            
            this.setState({
                items: newItemsArray,
                budget: user.budget,
                totalExpenses: totalExpenses,
                leftOverBudget: user.budget - totalExpenses
            });
        }
    });
}
    render() {
      return (
       <div className="app wrapper"> 
        <Header />
        <Form
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmit}
        category={this.state.category}
        desc={this.state.desc}
        cost={this.state.cost}
        budget={this.state.budget}
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
                        <td>${item.cost.toFixed(2)} <button className="remove-btn" onClick={() => this.removeItem(item.id)}>x</button>
                        </td>
                    </tr>);
                    })}
        	  </tbody>
              <tfoot>
                <tr>
                   <td colSpan={3}>Total Expenses: 
                   <span> ${this.state.totalExpenses.toFixed(2)}</span></td> 
                </tr>
                <tr>
                   <td colSpan={3}>Left to Spend: <span>${this.state.leftOverBudget.toFixed(2)}</span></td> 
                </tr>
              </tfoot>
        	</table>
        </section>
      </div>

      )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
