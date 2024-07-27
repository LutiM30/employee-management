import React from 'react';
import { Link } from 'react-router-dom';
import {
  API_ENDPOINT,
  typesOfDepartments,
  typesOfDesignations,
  typesOfStatus,
} from '../utils/constants';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { FORMAT_VALUE, GET_EMPLOYEE_VALUE } from '../utils/functions';
import { Tag, Tooltip } from 'antd';
import TableRowSelect from './UI/TableRowSelect.jsx';
import TableRowActionBtns from './UI/TableRowActionBtns.jsx';
import dayjs from 'dayjs';

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
          console.error('GraphQL error:', result.errors[0]?.message);
          alert(`Error deleting employee: ${result.errors[0]?.message}`);
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
        console.error('GraphQL error: ', data.errors?.messages);
      } else {
        alert(
          `${editValue.firstName} ${editValue.lastName} updated successfully!`
        );
        this.props.refresh();
      }
      this.setState({ isEditing: false });
    } catch (error) {
      console.error('Error updating employee: ', error);
      alert('Error updating employee: ', error);
    }
  };

  toggleEditing = () => {
    this.setState((prevState) => ({ isEditing: !prevState.isEditing }));
  };

  render() {
    const { employee, index } = this.props;
    const { isEditing, editValue } = this.state;
    const employeeName = `${employee.firstName} ${employee.lastName}`;
    const { retirementDateText, retirementCountdownText } = employee;
    return (
      <tr>
        <th scope='row'>{index}</th>
        <td>
          <Link to={`/employees/${employee.emp_id}`} className='text-primary'>
            {employeeName}
          </Link>
        </td>
        <td>
          <Tooltip
            placement={this.props.even ? 'topRight' : 'bottomRight'}
            title={retirementDateText}
            color='cyan'
          >
            {employee.age}
          </Tooltip>
        </td>
        <td>
          <Tooltip
            placement={this.props.even ? 'topRight' : 'bottomRight'}
            title={retirementDateText}
            color='cyan'
          >
            {dayjs(employee.birthDate).format('MMM D, YYYY')}
          </Tooltip>
        </td>
        <td>
          <Tooltip
            placement={this.props.even ? 'topLeft' : 'bottomLeft'}
            title={retirementCountdownText}
            color='cyan'
          >
            {new Date(employee.joined).toLocaleDateString()}
          </Tooltip>
        </td>
        <td className='position-relative'>
          <span className={isEditing ? 'd-none' : ''}>
            {GET_EMPLOYEE_VALUE(employee, 'designation')}
          </span>
          <TableRowSelect
            editValue={editValue}
            handleChange={this.handleChange}
            isEditing={isEditing}
            name='designation'
            options={typesOfDesignations}
            placeholder={'Select a Designation'}
          />
        </td>
        <td className='position-relative'>
          <span className={isEditing ? 'd-none' : ''}>
            {GET_EMPLOYEE_VALUE(employee, 'department')}
          </span>
          <TableRowSelect
            editValue={editValue}
            handleChange={this.handleChange}
            isEditing={isEditing}
            name='department'
            options={typesOfDepartments}
            placeholder={'Select a Department'}
          />
        </td>
        <td>{GET_EMPLOYEE_VALUE(employee, 'type')}</td>
        <td className='position-relative'>
          <Tag
            className={`${!isEditing ? '' : 'd-none'}`}
            icon={
              GET_EMPLOYEE_VALUE(editValue, 'status') === 'Working' ? (
                <CheckCircleOutlined />
              ) : (
                <CloseCircleOutlined />
              )
            }
            color={
              GET_EMPLOYEE_VALUE(editValue, 'status') === 'Working'
                ? 'success'
                : 'error'
            }
          >
            {GET_EMPLOYEE_VALUE(employee, 'status')}
          </Tag>
          <TableRowSelect
            editValue={editValue}
            handleChange={this.handleChange}
            isEditing={isEditing}
            name='status'
            options={typesOfStatus}
            placeholder={'Select a Status'}
          />
        </td>
        <TableRowActionBtns
          emp_id={employee?.emp_id || ''}
          employeeName={employeeName}
          isEditing={isEditing}
          setParentState={(update) =>
            this.setState({ ...this.state, ...update })
          }
          parentState={this.state}
          refresh={this.props.refresh}
          employeeStatus={employee.status}
        />
      </tr>
    );
  }
}

export default TableRow;
