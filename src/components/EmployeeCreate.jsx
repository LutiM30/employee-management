import React from 'react';
import {
  API_ENDPOINT,
  defaultEmployeeCreateState,
  typesOfDepartments,
  typesOfDesignations,
  typesOfEmployees,
} from '../utils/constants';
import { withRouter } from 'react-router-dom';
import { FORMAT_VALUE } from '../utils/functions';

class EmployeeCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...defaultEmployeeCreateState,
      ...this.props.location?.state?.employee,
      joined: this.props.location?.state?.employee?.joined || new Date(),
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  validateForm() {
    const errors = {};
    const { firstName, lastName, age, joined } = this.state;

    if (!firstName) errors.firstName = 'First Name is required';
    if (!lastName) errors.lastName = 'Last Name is required';
    if (age < 20 || age > 70) errors.age = 'Age must be between 20 and 70';
    if (!joined) errors.joined = 'Joining Date is required';

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  }

  async handleSubmit(event) {
    event.preventDefault();
    if (!this.validateForm()) return;

    const mutationEmployee = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      age: Number(this.state.age),
      joined: this.state.joined,
      designation: this.state.designation,
      department: this.state.department,
      type: this.state.type,
    };
    if (this.state.emp_id) {
      mutationEmployee.emp_id = this.state.emp_id;
    }

    const mutation = `mutation {
      addEmployee(
        employee: {
          ${Object.entries(mutationEmployee)
            .map(([key, value]) => `${key}: ${FORMAT_VALUE(value)}`)
            .join(',\n')}
        }
      ) {
          emp_id
          firstName
          lastName
          age
          joined
          designation
          department
          type
          status
        }
      }`;

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: mutation }),
    });

    const result = await response.json();
    if (result.errors) {
      console.error('GraphQL error:', result.errors);
      return;
    }

    const newEmployee = result.data.addEmployee;
    if (newEmployee) {
      this.setState({
        ...defaultEmployeeCreateState,
      });
      this.props.history.push('/employees');
    }
  }

  render() {
    const {
      firstName,
      lastName,
      age,
      joined,
      designation,
      department,
      type,
      errors,
    } = this.state;

    return (
      <div className='container mt-5'>
        <h2>Create New Employee</h2>
        <form onSubmit={this.handleSubmit}>
          <div className='form-row'>
            <div className='form-group col-md-6'>
              <label htmlFor='firstName'>First Name</label>
              <input
                type='text'
                className='form-control'
                id='firstName'
                name='firstName'
                value={firstName}
                onChange={this.handleChange}
                required
              />
              {errors.firstName && (
                <div className='text-danger'>{errors.firstName}</div>
              )}
            </div>
            <div className='form-group col-md-6'>
              <label htmlFor='lastName'>Last Name</label>
              <input
                type='text'
                className='form-control'
                id='lastName'
                name='lastName'
                value={lastName}
                onChange={this.handleChange}
                required
              />
              {errors.lastName && (
                <div className='text-danger'>{errors.lastName}</div>
              )}
            </div>
          </div>
          <div className='form-row'>
            <div className='form-group col-md-6'>
              <label htmlFor='age'>Age</label>
              <input
                type='number'
                className='form-control'
                id='age'
                name='age'
                value={age}
                min='20'
                max='70'
                onChange={this.handleChange}
                required
              />
              {errors.age && <div className='text-danger'>{errors.age}</div>}
            </div>
            <div className='form-group col-md-6'>
              <label htmlFor='joined'>Date of Joining</label>
              <input
                type='date'
                className='form-control'
                id='joined'
                name='joined'
                value={new Date(joined).toISOString().substring(0, 10)}
                onChange={this.handleChange}
                required
              />
              {errors.joined && (
                <div className='text-danger'>{errors.joined}</div>
              )}
            </div>
          </div>
          <div className='form-row'>
            <div className='form-group col-md-6'>
              <label htmlFor='designation'>Title</label>
              <select
                className='form-control'
                id='designation'
                name='designation'
                value={designation}
                onChange={this.handleChange}
                required
              >
                {typesOfDesignations.map((desig, index) => (
                  <option key={index} value={desig.value}>
                    {desig.label}
                  </option>
                ))}
              </select>
            </div>
            <div className='form-group col-md-6'>
              <label htmlFor='department'>Department</label>
              <select
                className='form-control'
                id='department'
                name='department'
                value={department}
                onChange={this.handleChange}
                required
              >
                {typesOfDepartments.map((dept, index) => (
                  <option key={index} value={dept.value}>
                    {dept.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className='form-row'>
            <div className='form-group col-md-6'>
              <label htmlFor='type'>Employee Type</label>
              <select
                className='form-control'
                id='type'
                name='type'
                value={type}
                onChange={this.handleChange}
                required
              >
                {typesOfEmployees.map((type, index) => (
                  <option key={index} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button type='submit' className='btn btn-primary mt-3'>
            Submit
          </button>
        </form>
      </div>
    );
  }
}
export default withRouter(EmployeeCreate);
