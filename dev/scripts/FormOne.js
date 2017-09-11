import React from 'react';

class FormOne extends React.Component {
    constructor() {
        super();
        this.state = {
            budget: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.refs.budget.value === '') {
            alert('please enter your budget!');
        } else if (isNaN(this.refs.budget.value)) {
            alert('that is not a number!');
        } else {
            this.setState({budget: this.refs.budget.value}), () => {
                this.props.FormOne(this.state.budget);
            }
            console.log(this.refs.budget.value);
            console.log(this.state.budget);
    }
}

     handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    render() {
        return (
            <section className="budget-section">
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="budget">What is your budget for this trip?</label>
                    <input type="text" ref="budget" id="budget" name="budget" placeholder="in CDN $" onChange={this.handleChange}/>
                    <button className="submit-btn">Submit</button>
                </form>
            </section>
        );
    }
}

export default FormOne;