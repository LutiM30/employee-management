import React, { Component } from 'react';
import { API_ENDPOINT, typesOfEmployees } from '../utils/constants';

export class EmployeeTypesDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: typesOfEmployees,
    };
    this.getOptions = async () => {
      const query = `query {
      getEmployeeTypes {
        label
        value
      }
    }`;

      try {
        const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        });

        const result = await response.json();

        this.setState({
          options: [...result?.data?.getEmployeeTypes],
        });
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
  }

  componentDidMount = async () => await this.getOptions();

  render() {
    return (
      <>
        <select {...this.props}>
          <option value=''>All Employee Types</option>
          {this.state.options.map((item) => (
            <option value={item.value} key={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </>
    );
  }
}

export default EmployeeTypesDropdown;
