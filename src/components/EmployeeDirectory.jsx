// EmployeeDirectory.jsx
import React from 'react';
import { API_ENDPOINT, AVATAR_URL } from '../utils/constants.js';
import EmployeeSearch from './EmployeeSearch.jsx';
import EmployeeTable from './EmployeeTable.jsx';
import { LoadingOutlined } from '@ant-design/icons';

const initialState = {
  employees: [],
  searchQuery: '',
  employeeType: '',
  loading: true,
  error: null,
  upcomingRetirement: false,
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
    const { searchQuery, employeeType, upcomingRetirement } = this.state;
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
          diffDays
          years
          months
          days
          retirementDate
          retirementDateText
          retirementCountdownText
          birthDate
        }
      }
    `;

    const variables = {
      filters: {
        searchQuery,
        type: employeeType,
        upcomingRetirement,
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
      const keys = [
        'department',
        'designation',
        'firstName',
        'lastName',
        'type',
      ];
      const autoCompleteOptions = [];
      const avatarAddFunc = (employee) => {
        const employeeName = (
          employee.firstName + employee.lastName
        ).toLowerCase();
        employee.avatar = AVATAR_URL + employeeName;
        return employee;
      };

      const employees = [...result.data.getFilteredEmployees].map(
        avatarAddFunc
      );

      employees.forEach((employee) =>
        keys.forEach((key) => autoCompleteOptions.push(employee[key]))
      );

      this.setState({
        employees,
        loading: false,
        // loading: true,
        autoCompleteOptions: [...new Set(autoCompleteOptions)].map((opt) => ({
          value: opt,
        })),
      });
    } catch (error) {
      console.error('Error fetching filtered employees:', error);
      this.setState({
        error: error.message,
        loading: false,
        // loading: true,
      });
    }
  };

  componentDidMount() {
    this.fetchFilteredEmployees();
  }

  render() {
    const {
      employees,
      searchQuery,
      employeeType,
      loading,
      error,
      upcomingRetirement,
    } = this.state;

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
              options={this.state.autoCompleteOptions}
              upcomingRetirement={upcomingRetirement}
              setUpcomingRetirement={(val) =>
                this.setState(
                  { ...this.state, upcomingRetirement: val },
                  this.fetchFilteredEmployees
                )
              }
            />
            {loading ? (
              <div className='text-center mt-5'>
                <LoadingOutlined
                  spin
                  style={{ fontSize: '35px', color: '#0d6efd' }}
                />
              </div>
            ) : error ? (
              <p>Error: {error}</p>
            ) : (
              <>
                <EmployeeTable
                  listOfEmployees={employees}
                  getData={this.fetchFilteredEmployees}
                />
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}
