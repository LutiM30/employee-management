import React from 'react';
import { GET_EMPLOYEE_VALUE } from '../../utils/functions';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import { Tag } from 'antd';

const TableRowSelect = ({
  isEditing,
  placeholder,
  name,
  handleChange,
  editValue,
  options,
}) => {
  const customDropdownEvent = (name, value) =>
    handleChange({
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

  return (
    <Select
      className={`${isEditing ? '' : 'd-none'}`}
      showSearch
      placeholder={placeholder}
      optionFilterProp='label'
      name={name}
      onChange={(value) => customDropdownEvent(name, value)}
      options={getFilteredOptions(name, options)}
      value={editValue[name]}
      required
      size='small'
      variant='outlined'
      labelRender={(props) => labelRender({ ...props, propName: name })}
    />
  );
};

export default TableRowSelect;
