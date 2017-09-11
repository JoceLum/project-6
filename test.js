class FormTwo extends React.Component {
    static defaultProps = {
        categories: ['Food', 'Shopping', 'Transportation', 'Attractions', "Other"]
    }
    render() {
        let categoryOptions = this.props.categories.map(category => {
            return <option key={category} value="category">{category}</option>
        });
        return (
        <section className="addExpense">
            <p>So, what did you just spend $ on?</p>
            <form onSubmit={this.handleSubmit}> 
                <select ref="category" onChange={this.handleChange}>
                {categoryOptions}
                </select>
                <input type="text" id="desc" name="desc" placeholder="Description" onChange={this.handleChange}/>
                <input type="text" id="cost" name="cost" placeholder="Cost" onChange={this.handleChange}/>
                <button className="add-btn">Add</button>
            </form> 
        </section>
        );
    }
}