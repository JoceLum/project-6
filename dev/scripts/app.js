import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';
import  { toMoney } from './utilities'
import swal from 'sweetalert2'
import firebase from './firebase';
const itemRef = firebase.database().ref('/items');
const budgetRef = firebase.database().ref('/budget');
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
            totalCost: '',
            items: [],
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
        else if (this.state.desc === '' || this.state.cost === '') {
            swal({
              title: 'Error!',
              text: 'Please add an expense item!',
              type: 'error',
              confirmButtonText: 'Cool'
            })
        }  else {
            const budgetAmt = {
                budget: this.state.budget
            }
            const newItem = {
                category: this.state.category,
                desc: this.state.desc,
                cost: costItem,
                }
            itemRef.push(newItem);
            budgetRef.set({value: budgetAmt});
            console.log(newItem);

            this.setState({
                    cost:'', 
                    desc: '',
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
    itemRef.on('value',(snapshot) => {
        const newItemsArray = [];
        const firebaseItems = snapshot.val();
        for (let key in firebaseItems) { 
            const firebaseItem = firebaseItems[key];
                firebaseItem.id = key;
            newItemsArray.push(firebaseItem);
        }
        let totalExpenses = newItemsArray.reduce((acc,curr) => {
            return acc += curr.cost;
        },0);

        this.setState({
            items: newItemsArray,
            totalExpenses: totalExpenses,
            // leftOverBudget: this.state.budget - totalExpenses
        });
    });

    budgetRef.on('value', (snapshot) => {
        const firebaseBudget = snapshot.val();
        this.setState({
            leftOverBudget: firebaseBudget.value
        })
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
                        <td>${item.cost}</td>
                    </tr>);
                    })}
        	  </tbody>
              <tfoot>
                <tr>
                   <td colSpan={3}>Total Expenses: 
                   <span> ${this.state.totalExpenses}</span></td> 
                </tr>
                <tr>
                   <td colSpan={3}><strong>Budget: </strong></td> 
                </tr>
              </tfoot>
        	</table>
        </section>
      </div>

      )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
