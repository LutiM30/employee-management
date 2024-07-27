import React from 'react';
import { withRouter } from 'react-router-dom';
import TableRow from './TableRow.jsx';

class EmployeeTable extends React.Component {
  render() {
    const { listOfEmployees } = this.props;

    if (listOfEmployees.length > 0) {
      return (
        <div className='table-responsive'>
          <table className='table table-hover table-striped'>
            <thead className='table-light'>
              <tr>
                <th scope='col'>#</th>
                <th scope='col'>Name</th>
                <th scope='col'>Age</th>
                <th scope='col'>Date of Joining</th>
                <th scope='col'>Designation</th>
                <th scope='col'>Department</th>
                <th scope='col'>Type of Employee</th>
                <th scope='col'>Current Status</th>
                <th scope='col'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listOfEmployees.map((employee, index) => (
                <TableRow
                  index={index + 1}
                  key={`${employee.emp_id}-${employee.firstName}-${employee.lastName}`}
                  employee={employee}
                  refresh={this.props.getData}
                  history={this.props.history}
                  even={!index % 2}
                />
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      return (
        <div className='alert alert-info' role='alert'>
          <i className='bi bi-info-circle me-2'></i>
          There's no data available at the moment.
        </div>
      );
    }
  }
}

export default withRouter(EmployeeTable);
