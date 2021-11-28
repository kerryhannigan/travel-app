import React from 'react';
import 'react-day-picker/lib/style.css';
import DayPicker from 'react-day-picker';
import '../CSS/index.css';

export default class Calendar extends React.Component {
  render() {
    return (
      <div>
        <DayPicker
          numberOfMonths={this.props.numberOfMonths}
          selectedDays={this.props.selectedDays}
          onDayClick={this.props.handleDayClick}
          disabledDays={[{ before: new Date() }]}
        />
      </div>
    );
  }
}