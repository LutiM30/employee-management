import React from 'react';
import {
  Card,
  Avatar,
  Descriptions,
  Tag,
  Tooltip,
  message,
  Button,
} from 'antd';
import { UserOutlined, CopyOutlined, HomeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

import {
  API_ENDPOINT,
  AVATAR_URL,
  typesOfDepartments,
  typesOfDesignations,
  typesOfEmployees,
  typesOfStatus,
} from '../utils/constants';

class EmployeeView extends React.Component {
  state = {
    employee: null,
    loading: true,
    error: null,
  };

  componentDidMount() {
    this.fetchEmployeeData();
  }

  fetchEmployeeData = async () => {
    const { emp_id } = this.props.match.params;
    const query = `query {
      getEmployee(emp_id: "${emp_id}") {
        emp_id firstName lastName age joined designation department
        type status birthDate diffDays years months days
        retirementDate retirementDateText retirementCountdownText
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
        const employee = { ...result.data.getEmployee };
        const employeeName = (
          result.data.getEmployee.firstName + result.data.getEmployee.lastName
        ).toLowerCase();
        employee.avatar = AVATAR_URL + employeeName;
        this.setState({
          employee,
          loading: false,
        });
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
      this.setState({ error: error.message, loading: false });
    }
  };

  copyEmployeeID = () => {
    const { employee } = this.state;
    navigator.clipboard.writeText(employee.emp_id);
    message.success('Employee ID copied to clipboard!');
  };

  render() {
    const { employee, loading, error } = this.state;

    if (loading) {
      return (
        <div
          className='d-flex justify-content-center align-items-center'
          style={{ height: '100vh' }}
        >
          <div className='spinner-border text-primary' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className='alert alert-danger m-3' role='alert'>
          Error: {error}
        </div>
      );
    }

    if (!employee?.firstName) {
      return (
        <div className='alert alert-warning m-3' role='alert'>
          Employee not found
        </div>
      );
    }

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
        <Card
          className='shadow-lg'
          cover={
            <div className='bg-primary text-white p-4'>
              <div className='d-flex justify-content-between align-items-center mb-3'>
                <div className='d-flex align-items-center'>
                  <Avatar
                    size={100}
                    icon={<UserOutlined />}
                    src={employee.avatar}
                  />
                  <h1 className='ms-4 mb-0'>{EMPLOYEE_NAME} </h1>
                </div>
                <Link to='/'>
                  <Button type='default' icon={<HomeOutlined />} size='large'>
                    Back to Home
                  </Button>
                </Link>
              </div>
              <Tag
                color={employee.status === 1 ? 'success' : 'error'}
                className='px-3 py-1'
              >
                {EMPLOYEE_STATUS_TEXT}
              </Tag>
            </div>
          }
        >
          <Descriptions column={2} bordered>
            <Descriptions.Item label='Department'>
              {EMPLOYEE_DEPARTMENT_TEXT}
            </Descriptions.Item>
            <Descriptions.Item label='Designation'>
              {EMPLOYEE_DESIGNATION_TEXT}
            </Descriptions.Item>
            <Descriptions.Item label='Employee Type'>
              {EMPLOYEE_TYPE_TEXT}
            </Descriptions.Item>
            <Descriptions.Item label='Birthdate'>
              {dayjs(employee.birthDate).format('MMM D, YYYY')} ({employee.age}{' '}
              years)
            </Descriptions.Item>
            <Descriptions.Item label='Joined'>
              {dayjs(employee.joined).format('MMM D, YYYY')}
            </Descriptions.Item>
            <Descriptions.Item label='Retirement'>
              {dayjs(employee.retirementDate).format('MMM D, YYYY')} (
              {employee.retirementCountdownText})
            </Descriptions.Item>
          </Descriptions>

          <div className='mt-4 d-flex justify-content-between align-items-center'>
            <span className='fw-bold'>Employee ID: {employee.emp_id}</span>
            <Tooltip color={'geekblue'} title='Copy Employee ID'>
              <Tag
                icon={<CopyOutlined />}
                color='blue'
                className='px-3 py-2'
                style={{ cursor: 'pointer' }}
                onClick={this.copyEmployeeID}
              >
                Copy ID
              </Tag>
            </Tooltip>
          </div>
        </Card>
      </div>
    );
  }
}

export default EmployeeView;
