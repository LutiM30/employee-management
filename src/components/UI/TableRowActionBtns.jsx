import React, { useState } from 'react';
import { FORMAT_VALUE } from '../../utils/functions';
import { API_ENDPOINT } from '../../utils/constants';
import { Button, Popconfirm, Tooltip } from 'antd';
import {
  EditTwoTone,
  DeleteTwoTone,
  CheckCircleTwoTone,
  CloseCircleOutlined,
} from '@ant-design/icons';

const TableRowActionBtns = ({
  isEditing,
  setParentState,
  parentState,
  refresh = () => {},
  emp_id,
  employeeName,
  employeeStatus,
}) => {
  const [expandedButton, setExpandedButton] = useState(null);

  const invalidDelete = !isNaN(employeeStatus)
    ? Number(employeeStatus) !== 0
    : true;

  const toggleEditing = () => {
    setParentState({ isEditing: !parentState?.isEditing });
    setExpandedButton(expandedButton === 'edit' ? null : 'edit');
  };

  const toggleDelete = () => {
    setExpandedButton(expandedButton === 'delete' ? null : 'delete');
  };

  const handleSubmit = async () => {
    const { editValue } = parentState;
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
        refresh();
      }
      setParentState({ isEditing: false });
    } catch (error) {
      console.error('Error updating employee: ', error);
      alert('Error updating employee: ', error);
    }
  };

  const deleteEmployee = async (employeeID, employeeName) => {
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
        refresh();
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const INVALID_DELETE_TEXT = 'Working Employees cannot be deleted!';

  return (
    <td className='text-nowrap'>
      <div className={'d-flex align-items-center'}>
        {(expandedButton === 'edit' || expandedButton === null) && (
          <Button
            shape={!isEditing ? 'circle' : 'round'}
            type='default'
            className={`me-2 ${expandedButton === 'edit' ? 'w-10' : ''}`}
            onClick={!isEditing ? toggleEditing : handleSubmit}
            icon={
              !isEditing ? (
                <EditTwoTone />
              ) : (
                <CheckCircleTwoTone twoToneColor={'#52c41a'} />
              )
            }
          >
            {expandedButton === 'edit' && !isEditing
              ? 'Edit'
              : isEditing
              ? 'Save'
              : ''}
          </Button>
        )}

        {(expandedButton === 'delete' || expandedButton === null) &&
          !isEditing && (
            <Tooltip
              placement='bottom'
              title={invalidDelete ? INVALID_DELETE_TEXT : ''}
              color='volcano'
            >
              <div
                className={`d-inline-block ${
                  expandedButton === 'delete' ? 'w-10' : ''
                }`}
              >
                <Popconfirm
                  title={`Are you sure you want to delete ${employeeName}?`}
                  okText='Yes'
                  cancelText='No'
                  onConfirm={() => deleteEmployee(emp_id, employeeName)}
                  onCancel={() => {
                    if (isEditing) {
                      toggleEditing();
                    }
                    toggleDelete();
                    setExpandedButton(null);
                  }}
                  disabled={invalidDelete}
                >
                  <Button
                    shape={expandedButton === 'delete' ? 'round' : 'circle'}
                    type='default'
                    danger
                    className='w-10'
                    icon={<DeleteTwoTone twoToneColor='#e65b65' />}
                    disabled={invalidDelete}
                    onClick={toggleDelete}
                  >
                    {expandedButton === 'delete' ? 'Delete' : ''}
                  </Button>
                </Popconfirm>
              </div>
            </Tooltip>
          )}

        {expandedButton && (
          <Button
            shape='circle'
            type='text'
            icon={<CloseCircleOutlined />}
            onClick={() => {
              if (isEditing) {
                toggleEditing();
              }
              toggleDelete();
              setExpandedButton(null);
            }}
            className='ms-0.5'
          />
        )}
      </div>
    </td>
  );
};

export default TableRowActionBtns;
