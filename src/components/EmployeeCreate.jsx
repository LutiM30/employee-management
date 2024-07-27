import React from 'react';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  Typography,
  message,
} from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  BankOutlined,
  IdcardOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  API_ENDPOINT,
  typesOfDepartments,
  typesOfDesignations,
  typesOfEmployees,
} from '../utils/constants';
import { withRouter } from 'react-router-dom';
import { FORMAT_VALUE } from '../utils/functions';
import BirthDateInput from './UI/BirthdateInput.jsx';

const { Title } = Typography;
const { Option } = Select;

class EmployeeCreate extends React.Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      joined: dayjs(),
    };
  }

  onFinish = async (values) => {
    console.log(values);
    const mutationEmployee = {
      ...values,
      joined: values.joined.format('YYYY-MM-DD'),
      birthDate: values.birthDate, // This is already in 'YYYY-MM-DD' format
    };

    const mutation = `mutation {
      addEmployee(
        employee: {
          ${Object.entries(mutationEmployee)
            .map(([key, value]) => `${key}: ${FORMAT_VALUE(value)}`)
            .join(',\n')}
        }
      ) {
          emp_id
          firstName
          lastName
          age
          joined
          designation
          department
          type
          status
          birthDate
        }
      }`;

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: mutation }),
      });

      const result = await response.json();
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      const newEmployee = result.data.addEmployee;
      if (newEmployee) {
        message.success('Employee created successfully!');
        this.props.history.push('/employees');
      }
    } catch (error) {
      console.error({ error });
      message.error(`Failed to create employee: ${error.message}`);
    }
  };

  render() {
    return (
      <div className='container-fluid bg-light py-5'>
        <Card className='shadow-lg' style={{ maxWidth: 800, margin: '0 auto' }}>
          <Title level={2} className='text-center mb-4'>
            <UserOutlined className='mr-2' />
            Create New Employee
          </Title>
          <Form
            ref={this.formRef}
            name='employeeCreate'
            onFinish={this.onFinish}
            layout='vertical'
            initialValues={{ joined: this.state.joined }}
          >
            <div className='row'>
              <div className='col-md-6'>
                <Form.Item
                  name='firstName'
                  label='First Name'
                  rules={[
                    { required: true, message: 'Please input the first name!' },
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder='First Name' />
                </Form.Item>
              </div>
              <div className='col-md-6'>
                <Form.Item
                  name='lastName'
                  label='Last Name'
                  rules={[
                    { required: true, message: 'Please input the last name!' },
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder='Last Name' />
                </Form.Item>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-6'>
                <Form.Item
                  name='birthDate'
                  label='Birth Date'
                  rules={[
                    {
                      required: true,
                      message: 'Please select the birth date!',
                    },
                  ]}
                >
                  <BirthDateInput />
                </Form.Item>
              </div>
              <div className='col-md-6'>
                <Form.Item
                  name='joined'
                  label='Date of Joining'
                  rules={[
                    {
                      required: true,
                      message: 'Please select the joining date!',
                    },
                  ]}
                >
                  <DatePicker className='w-100' />
                </Form.Item>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-6'>
                <Form.Item
                  name='designation'
                  label='Title'
                  rules={[
                    {
                      required: true,
                      message: 'Please select the designation!',
                    },
                  ]}
                >
                  <Select
                    placeholder='Select designation'
                    prefix={<IdcardOutlined />}
                  >
                    {typesOfDesignations.map((desig) => (
                      <Option key={desig.value} value={desig.value}>
                        {desig.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className='col-md-6'>
                <Form.Item
                  name='department'
                  label='Department'
                  rules={[
                    {
                      required: true,
                      message: 'Please select the department!',
                    },
                  ]}
                >
                  <Select
                    placeholder='Select department'
                    prefix={<BankOutlined />}
                  >
                    {typesOfDepartments.map((dept) => (
                      <Option key={dept.value} value={dept.value}>
                        {dept.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>
            <Form.Item
              name='type'
              label='Employee Type'
              rules={[
                { required: true, message: 'Please select the employee type!' },
              ]}
            >
              <Select
                placeholder='Select employee type'
                prefix={<TeamOutlined />}
              >
                {typesOfEmployees.map((type) => (
                  <Option key={type.value} value={type.value}>
                    {type.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type='primary' htmlType='submit' className='w-100'>
                Create Employee
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  }
}

export default withRouter(EmployeeCreate);
