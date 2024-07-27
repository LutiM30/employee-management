import React from 'react';
import { Link } from 'react-router-dom';
import {
  API_ENDPOINT,
  typesOfDepartments,
  typesOfDesignations,
  typesOfStatus,
} from '../utils/constants';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import {
  FORMAT_VALUE,
  GET_EMPLOYEE_VALUE,
  GET_RETIREMENT_COUNTDOWN,
} from '../utils/functions';
import { Button, Dropdown, Select, Tag, Tooltip } from 'antd';

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
    const customDropdownEvent = (name, value) =>
      this.handleChange({
        target: { name, value },
      });
    const getFilteredOptions = (NAME, OPTIONS) =>
      OPTIONS.filter((o) => editValue[NAME] !== o.value);

    const labelRender = (props) => {
      const { label, value, propName } = props;
      if (label) {
        return value;
      }
      const className = '';

      return (
        <>
          {propName === 'status' ? (
            <Tag
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
              {GET_EMPLOYEE_VALUE(editValue, propName)}
            </Tag>
          ) : (
            <span className={className}>
              {GET_EMPLOYEE_VALUE(editValue, propName)}
            </span>
          )}
        </>
      );
    };
    const { retirementDateText, retirementCountdownText } =
      GET_RETIREMENT_COUNTDOWN(employee.joined, Number(employee.age));

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
          <Select
            className={`${isEditing ? '' : 'd-none'}`}
            showSearch
            placeholder={'Select a Designation'}
            optionFilterProp='label'
            name='designation'
            onChange={(value) => customDropdownEvent('designation', value)}
            options={getFilteredOptions('designation', typesOfDesignations)}
            value={editValue.designation}
            required
            size='small'
            variant='outlined'
            labelRender={(props) =>
              labelRender({ ...props, propName: 'designation' })
            }
          />
        </td>
        <td className='position-relative'>
          <span className={isEditing ? 'd-none' : ''}>
            {GET_EMPLOYEE_VALUE(employee, 'department')}
          </span>
          <Select
            className={`${isEditing ? '' : 'd-none'}`}
            showSearch
            placeholder={'Select a Department'}
            optionFilterProp='label'
            name='department'
            onChange={(value) => customDropdownEvent('department', value)}
            options={getFilteredOptions('department', typesOfDepartments)}
            value={editValue.department}
            required
            popupMatchSelectWidth={false}
            size='small'
            variant='outlined'
            labelRender={(props) =>
              labelRender({ ...props, propName: 'department' })
            }
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
          <Select
            className={`${isEditing ? '' : 'd-none'}`}
            placeholder={'Select a Status'}
            optionFilterProp='label'
            name='status'
            onChange={(value) => customDropdownEvent('status', value)}
            options={getFilteredOptions('status', typesOfStatus)}
            value={editValue.status}
            required
            size='middle'
            variant='outlined'
            labelRender={(props) =>
              labelRender({ ...props, propName: 'status' })
            }
          />
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
