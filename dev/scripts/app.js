import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';
import FormOne from './FormOne';
import FormTwo from './FormTwo';
// import firebase from './firebase';
// const dbRef = firebase.database().ref('/items');


class App extends React.Component {
constructor() {
    super();
    this.state = {
        budget: '',
        items: []
    }
}    
    
handleFormTwo(item) {
    let items = this.state.items;
    items.push(item);
    this.setState([items: items]);
}

handleFormOne(budget) {
    let budgetAmt = this.state.budget;
    console.log(this.state.budget);
    this.setState(budgetAmt);
}

// componentDidMount() {
//     //to retrieve data from Firebase:
//     dbRef.on('value',(snapshot) => {
//         const newItemsArray = [];
//         const firebaseItems = snapshot.val();
//         for (let key in firebaseItems) { 
//             //"key" and "id" are made up, can be anything we want to call it!
//             const firebaseItem = firebaseItems[key];
//             firebaseItem.id = key; //this adds the id as well to our new array
//             newItemsArray.push(firebaseItem);
//         }
//         this.setState({
//             items: newItemsArray,
//         });
//     });
// }
    render() {
      return (
       <div className="app wrapper"> 
        <Header />
        <FormOne FormOne={this.handleFormOne.bind(this)} />
        <FormTwo FormTwo={this.handleFormTwo.bind(this)} />
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
            {this.state.items.map((item, index) => { 
                return (<tr key={index}>
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
