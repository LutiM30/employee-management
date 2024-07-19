import React from 'react';
import EmployeeTypesDropdown from './EmployeeTypesDropdown.jsx';
import { DEBOUNCE } from '../utils/functions.js';

export default class EmployeeSearch extends React.Component {
  constructor(props) {
    super(props);
    this.handleSearchChange = DEBOUNCE(this.props.setSearchQuery, 300);
  }

  componentWillUnmount() {
    if (this.handleSearchChange.cancel) {
      this.handleSearchChange.cancel();
    }
  }
  render() {
    return (
      <div className='card shadow-sm mb-4'>
        <div className='card-body'>
          <div className='row g-3'>
            <div className='col-md-6'>
              <div className='input-group'>
                <span className='input-group-text bg-primary text-white'>
                  <i className='bi bi-search'></i>
                </span>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Search employees...'
                  aria-label='Search employees'
                  onChange={(e) => this.handleSearchChange(e.target.value)}
                />
              </div>
            </div>
            <div className='col-md-6'>
              <EmployeeTypesDropdown
                className='form-select'
                aria-label='Filter by Employee Type'
                onChange={(e) => this.props.setFilterByType(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
