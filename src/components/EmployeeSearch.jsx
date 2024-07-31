import React, { useState, useEffect, useRef } from 'react';
import EmployeeTypesDropdown from './EmployeeTypesDropdown.jsx';
import { AutoComplete, Radio, Space } from 'antd';

const EmployeeSearch = (props) => {
  const { upcomingRetirement, setUpcomingRetirement } = props;
  const [searchPlaceholder, setSearchPlaceholder] = useState(
    'Type Something & Press Enter to Search...'
  );
  const [options, setOptions] = useState([]);
  const autoCompleteRef = useRef(null);

  const handleSearchChange = props.setSearchQuery;

  const setRandomPlaceholderTimer = () => {
    const timer = setInterval(() => {
      const availableOptions = props.options || [];

      const randomElement =
        availableOptions[Math.floor(Math.random() * availableOptions.length)];

      setSearchPlaceholder(
        availableOptions.length
          ? `Type ${randomElement.value} & Press Enter to Search...`
          : 'Type Something & Press Enter to Search...'
      );
    }, 5000);

    return () => clearInterval(timer);
  };

  const handleAutoComplete = (value) => {
    setOptions(!value ? [] : props.options);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchChange(e.target.value);
    }
  };

  useEffect(() => {
    const cleanup = setRandomPlaceholderTimer();

    const handleSlashKey = (e) => {
      if (e.key === '/' && document.activeElement !== autoCompleteRef.current) {
        e.preventDefault();
        autoCompleteRef.current.focus();
      }
    };

    document.addEventListener('keydown', handleSlashKey);

    return () => {
      cleanup();
      document.removeEventListener('keydown', handleSlashKey);
      if (handleSearchChange.cancel) {
        handleSearchChange.cancel();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.options, props.loading]);

  return (
    <div className='container'>
      <div className='row justify-content-center'>
        <div className='col-12'>
          <div className='row g-3 mb-4 align-items-center'>
            <div className='col-lg-4 col-md-6'>
              <AutoComplete
                ref={autoCompleteRef}
                placeholder={searchPlaceholder}
                options={options}
                filterOption={(inputValue, option) =>
                  option.value
                    .toUpperCase()
                    .indexOf(inputValue.toUpperCase()) !== -1
                }
                onSearch={handleAutoComplete}
                size='large'
                className='w-100'
                variant='filled'
                status={props.loading ? 'error' : ''}
                disabled={props.loading}
                onKeyDown={handleKeyDown}
                onClear={() => {
                  handleSearchChange('');
                  autoCompleteRef.current.focus();
                }}
                backfill
                allowClear
                loading={props.loading}
              />
            </div>
            <div className='col-lg-5 col-md-6'>
              <Space size='small'>
                <Radio.Group
                  value={upcomingRetirement}
                  onChange={(e) => {
                    setUpcomingRetirement(e.target.value);
                  }}
                  size='large'
                >
                  <Radio.Button value={false}>All</Radio.Button>
                  <Radio.Button value={true}>Retiring in 6 Months</Radio.Button>
                </Radio.Group>
              </Space>
            </div>
            <div className='col-lg-3 col-md-12'>
              <EmployeeTypesDropdown
                onChange={(value) => props.setFilterByType(value)}
                employeeType={props.employeeType}
                className='w-100'
                loading={props.loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSearch;
