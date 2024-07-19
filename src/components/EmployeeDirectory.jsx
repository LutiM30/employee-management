// EmployeeDirectory.jsx
import React from 'react';
import { API_ENDPOINT } from '../utils/constants.js';
import EmployeeSearch from './EmployeeSearch.jsx';
import EmployeeTable from './EmployeeTable.jsx';

const initialState = {
  employees: [],
  searchQuery: '',
  employeeType: '',
  loading: false,
  error: null,
};

export default class EmployeeDirectory extends React.Component {
  state = initialState;

  setQuery = (searchQuery = '') => {
    this.setState({ searchQuery }, this.fetchFilteredEmployees);
  };

  setFilterByType = (employeeType = '') => {
    this.setState({ employeeType }, this.fetchFilteredEmployees);
  };

  fetchFilteredEmployees = async () => {
    const { searchQuery, employeeType } = this.state;
    this.setState({ loading: true, error: null });

    const query = `
      query getFilteredEmployees($filters: Filters!) {
        getFilteredEmployees(filters: $filters) {
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
      }
    `;

    const variables = {
      filters: {
        searchQuery,
        type: employeeType,
      },
    };

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      this.setState({
        employees: result.data.getFilteredEmployees,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching filtered employees:', error);
      this.setState({ error: error.message, loading: false });
    }
  };

  componentDidMount() {
    this.fetchFilteredEmployees();
  }

  render() {
    const { employees, searchQuery, employeeType, loading, error } = this.state;

    return (
      <div className='container-fluid py-4'>
        <div className='row justify-content-center'>
          <div className='col-12 col-xl-10'>
            <h1 className='mb-4'>Employees</h1>
            <EmployeeSearch
              setSearchQuery={this.setQuery}
              setFilterByType={this.setFilterByType}
              searchQuery={searchQuery}
              employeeType={employeeType}
            />
            {loading ? (
              <div className='text-center mt-5'>
                <div className='spinner-border text-primary' role='status'>
                  <span className='visually-hidden'>Loading...</span>
                </div>
              </div>
            ) : error ? (
              <p>Error: {error}</p>
            ) : (
              <EmployeeTable
                listOfEmployees={employees}
                getData={this.fetchFilteredEmployees}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}
