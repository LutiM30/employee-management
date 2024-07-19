/* eslint-disable consistent-return */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */
import {
  typesOfDepartments,
  typesOfDesignations,
  typesOfEmployees,
  typesOfStatus,
} from './constants';

export const GET_EMPLOYEE_VALUE = (employee, dataKey) => {
  let employeeData = '';
  switch (dataKey) {
    case 'type':
      typesOfEmployees.forEach((type) => {
        if (employee.type === type.value) {
          employeeData = type.label;
        }
      });
      return employeeData;

    case 'status':
      typesOfStatus.forEach((type) => {
        if (employee.status === type.value) {
          employeeData = type.label;
        }
      });
      return employeeData;
    case 'designation':
      typesOfDesignations.forEach((type) => {
        if (employee.designation === type.value) {
          employeeData = type.label;
        }
      });
      return employeeData;
    case 'department':
      typesOfDepartments.forEach((type) => {
        if (employee.department === type.value) {
          employeeData = type.label;
        }
      });
      return employeeData;

    default:
      break;
  }
};

export const FORMAT_VALUE = (value) => {
  if (typeof value === 'string') {
    return `"${value}"`.trim();
  } else if (value instanceof Date) {
    return `"${value.toISOString()}"`.trim();
  } else {
    return value;
  }
};

export const DEBOUNCE = (func, delay) => {
  let timeoutId;

  function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  }

  debounced.cancel = function () {
    clearTimeout(timeoutId);
  };

  return debounced;
};
