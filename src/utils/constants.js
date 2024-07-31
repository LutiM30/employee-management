export const typesOfEmployees = [
  {
    value: 'fullTime',
    label: 'Full Time',
  },
  {
    value: 'partTime',
    label: 'Part Time',
  },
  {
    value: 'contract',
    label: 'Contract',
  },
  {
    value: 'freelance',
    label: 'Freelance',
  },
  {
    value: 'intern',
    label: 'Intern',
  },
  {
    value: 'other',
    label: 'Other',
  },
  {
    value: 'Seasonal',
    label: 'Seasonal',
  },
];

export const typesOfDepartments = [
  {
    value: 'it',
    label: 'IT',
  },
  {
    value: 'marketing',
    label: 'Marketing',
  },
  {
    value: 'hr',
    label: 'HR',
  },
  {
    value: 'engineering',
    label: 'Engineering',
  },
];

export const typesOfDesignations = [
  {
    value: 'employee',
    label: 'Employee',
  },
  {
    value: 'manager',
    label: 'Manager',
  },
  {
    value: 'director',
    label: 'Director',
  },
  {
    value: 'vp',
    label: 'VP',
  },
];

export const typesOfStatus = [
  {
    value: 1,
    label: 'Working',
  },
  {
    value: 0,
    label: 'Retired',
  },
];

export const API_ENDPOINT = __UI_API_ENDPOINT__;

export const defaultEmployeeCreateState = {
  firstName: '',
  lastName: '',
  age: 20,
  joined: new Date(),
  designation: typesOfDesignations[0].value,
  department: typesOfDepartments[0].value,
  type: typesOfEmployees[0].value,
  errors: {},
};

export const AVATAR_URL = 'https://avatar.iran.liara.run/public/boy?username=';
