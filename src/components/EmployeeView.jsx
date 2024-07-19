import React from 'react';
import {
  API_ENDPOINT,
  typesOfDepartments,
  typesOfDesignations,
  typesOfEmployees,
  typesOfStatus,
} from '../utils/constants';

class EmployeeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      employee: null,
      loading: true,
      error: null,
      showCopyText: false,
      copyText: 'Click to copy Employee ID',
    };
  }

  getData = async () => {
    const { emp_id } = this.props.match.params;

    const query = `query {
      getEmployee(emp_id: "${emp_id}") {
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

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      } else {
        const { getEmployee } = result.data;
        this.setState({ employee: getEmployee, loading: false });
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
      this.setState({ error: error.message, loading: false });
    }
  };

  showCopyTextHandler = () => {
    this.setState({
      showCopyText: !this.state.showCopyText,
      copyText: !this.state.showCopyText
        ? 'Click to copy Employee ID'
        : 'Copied!',
    });
  };

  copyEmployeeID = () => {
    const { employee } = this.state;
    navigator.clipboard.writeText(employee.emp_id);
    this.setState({ copyText: 'Copied!' });
  };

  componentDidMount() {
    this.getData();
  }

  render() {
    const { employee, loading, error, showCopyText, copyText } = this.state;

    if (loading)
      return (
        <div className='text-center mt-5'>
          <div className='spinner-border text-primary' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </div>
        </div>
      );
    if (error)
      return (
        <div className='alert alert-danger m-3' role='alert'>
          Error: {error}
        </div>
      );
    if (!employee?.firstName)
      return (
        <div className='alert alert-warning m-3' role='alert'>
          Employee not found
        </div>
      );

    const EMPLOYEE_NAME = `${employee.firstName || ''} ${
      employee.lastName || ''
    }`;
    const EMPLOYEE_DEPARTMENT_TEXT = typesOfDepartments.find(
      (d) => d.value === employee.department
    )?.label;
    const EMPLOYEE_TYPE_TEXT = typesOfEmployees.find(
      (d) => d.value === employee.type
    )?.label;
    const EMPLOYEE_DESIGNATION_TEXT = typesOfDesignations.find(
      (d) => d.value === employee.designation
    )?.label;
    const EMPLOYEE_STATUS_TEXT = typesOfStatus.find(
      (d) => d.value === employee.status
    )?.label;

    return (
      <div className='container mt-5'>
        <div className='card shadow'>
          <div className='card-header bg-primary text-white'>
            <h1 className='mb-0'>{EMPLOYEE_NAME}</h1>
          </div>
          <div className='card-body'>
            <div className='row'>
              <div className='col-md-6'>
                <ul className='list-group list-group-flush'>
                  <li className='list-group-item'>
                    <strong>Department:</strong> {EMPLOYEE_DEPARTMENT_TEXT}
                  </li>
                  <li className='list-group-item'>
                    <strong>Designation:</strong> {EMPLOYEE_DESIGNATION_TEXT}
                  </li>
                  <li className='list-group-item'>
                    <strong>Employee Type:</strong> {EMPLOYEE_TYPE_TEXT}
                  </li>
                </ul>
              </div>
              <div className='col-md-6'>
                <ul className='list-group list-group-flush'>
                  <li className='list-group-item'>
                    <strong>Age:</strong> {employee.age} years
                  </li>
                  <li className='list-group-item'>
                    <strong>Joined:</strong>{' '}
                    {new Date(employee.joined).toLocaleDateString()}
                  </li>
                  <li className='list-group-item'>
                    <strong>Status:</strong>{' '}
                    <span
                      className={`badge ${
                        employee.status === 1 ? 'bg-success' : 'bg-danger'
                      }`}
                    >
                      {EMPLOYEE_STATUS_TEXT}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div
            className='card-footer d-flex justify-content-between align-items-center'
            onMouseEnter={this.showCopyTextHandler}
            onMouseLeave={this.showCopyTextHandler}
            onClick={this.copyEmployeeID}
            style={{ cursor: 'pointer' }}
          >
            <span>
              <strong>Employee ID:</strong> {employee.emp_id}
            </span>
            <span
              className={`badge bg-secondary ${
                showCopyText ? 'opacity-100' : 'opacity-0'
              } transition ${copyText === 'Copied!' ? 'bg-success' : ''}`}
            >
              {copyText}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default EmployeeView;
