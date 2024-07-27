import React from 'react';
import EmployeeTypesDropdown from './EmployeeTypesDropdown.jsx';
import { DEBOUNCE } from '../utils/functions.js';
import { AutoComplete } from 'antd';

export default class EmployeeSearch extends React.Component {
  constructor(props) {
    super(props);
    this.handleSearchChange = DEBOUNCE(this.props.setSearchQuery, 300);

    this.state = {
      searchPlaceHolder: 'Search ...',
      timer: null,
      options: [],
    };

    this.setRandomPlaceHolderTimer = (flag) => {
      if (flag) {
        this.setState({
          ...this.state,
          timer: setInterval(() => {
            const options = [...this.props.options] || [];
            const randomElement =
              options[Math.floor(Math.random() * this.props.options.length)];
            this.setState({
              searchPlaceHolder: options.length
                ? `Search ${randomElement.value}...`
                : 'Searching ...',
            });
          }, 3000),
        });
      } else if (this.state.timer) {
        clearInterval(this.state.timer);
      }
    };

    this.handleAutoComplete = (value) => {
      this.setState({
        ...this.state,
        options: !value ? [] : this.props.options,
      });
    };
  }

  componentDidMount() {
    this.setRandomPlaceHolderTimer(false);
    this.setRandomPlaceHolderTimer(true);
  }

  componentWillUnmount() {
    if (this.handleSearchChange.cancel) {
      this.handleSearchChange.cancel();
    }
    this.setRandomPlaceHolderTimer(false);
  }
  render() {
    const { searchPlaceHolder, options } = this.state;
    return (
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-6'>
            <div className='row g-2 mb-4'>
              <div className='col-9'>
                <AutoComplete
                  placeholder={searchPlaceHolder}
                  options={options}
                  filterOption={(inputValue, option) =>
                    option.value
                      .toUpperCase()
                      .indexOf(inputValue.toUpperCase()) !== -1
                  }
                  onSearch={this.handleAutoComplete}
                  size='large'
                  className='w-100'
                  onChange={this.handleSearchChange}
                  variant='filled'
                  status={this.props.loading ? 'error' : ''}
                  disabled={this.props.loading}
                />
              </div>
              <div className='col-3'>
                <EmployeeTypesDropdown
                  onChange={(value) => this.props.setFilterByType(value)}
                  employeeType={this.props.employeeType}
                  className='w-100'
                  loading={this.props.loading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
