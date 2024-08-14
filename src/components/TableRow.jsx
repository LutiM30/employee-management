import React from 'react';
import { Link } from 'react-router-dom';
import {
  typesOfDepartments,
  typesOfDesignations,
  typesOfStatus,
} from '../utils/constants';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { GET_EMPLOYEE_VALUE } from '../utils/functions';
import { Avatar, Tag, Tooltip } from 'antd';
import TableRowSelect from './UI/TableRowSelect.jsx';
import TableRowActionBtns from './UI/TableRowActionBtns.jsx';
import dayjs from 'dayjs';
import { UserOutlined } from '@ant-design/icons';

class TableRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      editValue: { ...this.props.employee },
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      editValue: {
        ...prevState.editValue,
        [name]: name === 'status' ? parseInt(value, 10) : value,
      },
    }));
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
          <Link
            to={`/employees/${employee.emp_id}`}
            className='text-primary d-flex align-items-center'
          >
            <Avatar
              size={25}
              icon={<UserOutlined />}
              src={employee.avatar}
              className='mr-3'
            />
            {employeeName}
          </Link>
        </td>
        <td>{employee.age}</td>
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
