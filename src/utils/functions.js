/* eslint-disable consistent-return */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */
import dayjs from 'dayjs';
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

export const AGE_CALCULATOR = (birthDate) => {
  if (!birthDate) return null;
  const today = dayjs();
  const birthDayjs = dayjs(birthDate);
  let age = today.year() - birthDayjs.year();
  const monthDiff = today.month() - birthDayjs.month();

  if (monthDiff < 0 || (monthDiff === 0 && today.date() < birthDayjs.date())) {
    age--;
  }

  return age;
};

export const GET_RETIREMENT_COUNTDOWN = (joined, age) => {
  const today = new Date();

  const joinedDate = new Date(joined.split('T')[0]);
  const yearsUntilRetirement = 65 - age;

  const retirement = joinedDate;
  retirement.setFullYear(retirement.getFullYear() + yearsUntilRetirement);

  const diffTime = retirement.getTime() - today.getTime();

  // 1000 (milliseconds in a second) * 60 (seconds in a minute) * 60 (minutes in an hour) * 24 (hours in a day).
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const years = Math.floor(diffDays / 365);
  const months = Math.floor((diffDays % 365) / 30);
  const days = diffDays % 30;

  const retirementDate = retirement.toISOString().split('T')[0];

  const retirementDateText = `Retirement Date: ${new Date(
    retirementDate
  )?.toDateString()}`;
  const retirementCountdownText = `${days ? `${days} Days, ` : ''}${
    months ? `${months} Months, ` : ''
  }${years ? `${years} Years ` : ''}untill retirement`;

  return {
    diffDays,
    years,
    months,
    days,
    retirementDate,
    retirementDateText,
    retirementCountdownText,
  };
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
