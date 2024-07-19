import React from 'react';
import { Link } from 'react-router-dom';
import {
  API_ENDPOINT,
  typesOfDepartments,
  typesOfDesignations,
  typesOfStatus,
} from '../utils/constants';
import { FORMAT_VALUE, GET_EMPLOYEE_VALUE } from '../utils/functions';

class TableRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      editValue: { ...this.props.employee },
    };
  }

  deleteEmployee = async (employeeID, employeeName) => {
    if (window.confirm(`Are you sure you want to delete ${employeeName}?`)) {
      const mutation = `mutation {
        deleteEmployee(emp_id: "${employeeID}")
      }`;

      try {
        const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: mutation }),
        });

        const result = await response.json();

        if (result.errors) {
          console.error('GraphQL error:', result.errors);
        } else {
          alert(`${employeeName} deleted successfully!`);
          this.props.refresh();
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      editValue: {
        ...prevState.editValue,
        [name]: name === 'status' ? parseInt(value, 10) : value,
      },
    }));
  };

  handleSubmit = async () => {
    const { editValue } = this.state;
    const { emp_id, designation, department, status } = editValue;
    const submittingValue = { emp_id, designation, department, status };

    const mutation = `mutation {
      updateEmployee(employee: {
        ${Object.entries(submittingValue)
          .map(([key, value]) => `${key}: ${FORMAT_VALUE(value)}`)
          .join(',\n')}
      }) {
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
        body: JSON.stringify({ query: mutation }),
      });

      const data = await response.json();

      if (data.errors) {
        console.error('GraphQL error:', data.errors);
      } else {
        alert(
          `${editValue.firstName} ${editValue.lastName} updated successfully!`
        );
        this.props.refresh();
      }
      this.setState({ isEditing: false });
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  toggleEditing = () => {
    this.setState((prevState) => ({ isEditing: !prevState.isEditing }));
  };

  render() {
    const { employee, index } = this.props;
    const { isEditing, editValue } = this.state;
    const employeeName = `${employee.firstName} ${employee.lastName}`;

    return (
      <tr>
        <th scope='row'>{index}</th>
        <td>
          <Link to={`/employees/${employee.emp_id}`} className='text-primary'>
            {employeeName}
          </Link>
        </td>
        <td>{employee.age}</td>
        <td>{new Date(employee.joined).toLocaleDateString()}</td>
        <td className='position-relative'>
          <span className={isEditing ? 'd-none' : ''}>
            {GET_EMPLOYEE_VALUE(employee, 'designation')}
          </span>
          <select
            className={`form-select form-select-sm ${
              isEditing ? '' : 'd-none'
            }`}
            name='designation'
            value={editValue.designation}
            onChange={this.handleChange}
            required
          >
            {typesOfDesignations.map((desig) => (
              <option key={desig.value} value={desig.value}>
                {desig.label}
              </option>
            ))}
          </select>
        </td>
        <td className='position-relative'>
          <span className={isEditing ? 'd-none' : ''}>
            {GET_EMPLOYEE_VALUE(employee, 'department')}
          </span>
          <select
            className={`form-select form-select-sm ${
              isEditing ? '' : 'd-none'
            }`}
            name='department'
            value={editValue.department}
            onChange={this.handleChange}
            required
          >
            {typesOfDepartments.map((dept) => (
              <option key={dept.value} value={dept.value}>
                {dept.label}
              </option>
            ))}
          </select>
        </td>
        <td>{GET_EMPLOYEE_VALUE(employee, 'type')}</td>
        <td className='position-relative'>
          <span
            className={`badge ${isEditing ? 'd-none' : ''} ${
              GET_EMPLOYEE_VALUE(employee, 'status') === 'Working'
                ? 'bg-success'
                : 'bg-danger'
            }`}
          >
            {GET_EMPLOYEE_VALUE(employee, 'status')}
          </span>
          <select
            className={`form-select form-select-sm ${
              isEditing ? '' : 'd-none'
            }`}
            name='status'
            value={editValue.status}
            onChange={this.handleChange}
          >
            {typesOfStatus.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </td>
        <td>
          <button
            className={`btn btn-outline-${
              !isEditing ? 'primary' : 'success'
            } btn-sm me-2`}
            onClick={!isEditing ? this.toggleEditing : this.handleSubmit}
          >
            <i
              className={`bi bi-${!isEditing ? 'pencil-square' : 'check-lg'}`}
            ></i>{' '}
            {!isEditing ? 'Edit' : 'Save'}
          </button>
          <button
            className='btn btn-outline-danger btn-sm'
            onClick={() => this.deleteEmployee(employee.emp_id, employeeName)}
          >
            <i className='bi bi-trash'></i> Delete
          </button>
        </td>
      </tr>
    );
  }
}

export default TableRow;
