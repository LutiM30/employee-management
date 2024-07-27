import React, { Component } from 'react';
import { API_ENDPOINT, typesOfEmployees } from '../utils/constants';
import { Select } from 'antd';

export class EmployeeTypesDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: typesOfEmployees,
      loading: true,
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
          loading: false,
        });
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
  }

  componentDidMount = async () => await this.getOptions();

  render() {
    const getFilteredOptions = (OPTIONS) =>
      OPTIONS.filter((o) => this.props.employeeType !== o.value);
    return (
      <>
        <Select
          aria-label='Filter by Employee Type'
          showSearch
          placeholder={'Filter by Employee Type'}
          optionFilterProp='label'
          options={getFilteredOptions(this.state.options)}
          size='large'
          popupMatchSelectWidth={true}
          allowClear
          onChange={this.props.onChange}
          variant='filled'
          loading={this.props.loading}
        />
      </>
    );
  }
}

export default EmployeeTypesDropdown;
