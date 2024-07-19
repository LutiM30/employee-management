import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class NavBar extends Component {
  render() {
    return (
      <nav className='navbar navbar-expand-lg navbar-dark bg-primary'>
        <div className='container'>
          <NavLink className='navbar-brand' to='/'>
            Employee Directory
          </NavLink>
          <button
            className='navbar-toggler'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#navbarNav'
            aria-controls='navbarNav'
            aria-expanded='false'
            aria-label='Toggle navigation'
          >
            <span className='navbar-toggler-icon'></span>
          </button>
          <div className='collapse navbar-collapse' id='navbarNav'>
            <ul className='navbar-nav ms-auto'>
              <li className='nav-item'>
                <NavLink
                  className='nav-link'
                  exact
                  to='/'
                  activeClassName='active'
                >
                  Home
                </NavLink>
              </li>
              <li className='nav-item'>
                <NavLink
                  className='nav-link'
                  exact
                  to='/employees'
                  activeClassName='active'
                >
                  Employees
                </NavLink>
              </li>
              <li className='nav-item'>
                <NavLink
                  className='nav-link'
                  exact
                  to='/employees/create'
                  activeClassName='active'
                >
                  Create Employee
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default NavBar;
