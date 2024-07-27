import React from 'react';
import { DatePicker, Alert, InputNumber } from 'antd';
import dayjs from 'dayjs';
import { AGE_CALCULATOR } from '../../utils/functions';

const BirthDateInput = ({ value, onChange, error }) => {
  const handleDateChange = (date) => {
    onChange(date ? date.format('YYYY-MM-DD') : null);
  };

  const disableDates = (current) => {
    const currentDate = dayjs(current);
    const today = dayjs();

    if (currentDate.isAfter(today)) {
      return true;
    }

    const calculatedAge = AGE_CALCULATOR(currentDate);
    return calculatedAge < 20 || calculatedAge > 70;
  };

  return (
    <div>
      <DatePicker
        onChange={handleDateChange}
        disabledDate={disableDates}
        className='w-100 mb-2'
        placeholder='Select your birth date'
        value={value ? dayjs(value) : null}
      />
      {value && (
        <InputNumber
          min={20}
          max={70}
          value={AGE_CALCULATOR(dayjs(value))}
          disabled
          className='w-100 mb-2'
        />
      )}
      {error && <Alert message={error} type='error' className='mb-2' />}
    </div>
  );
};

export default BirthDateInput;
