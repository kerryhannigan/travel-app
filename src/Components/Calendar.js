import React from 'react';
import 'react-day-picker/lib/style.css';
import DayPicker from 'react-day-picker';
import '../CSS/index.css';

export default class Calendar extends React.Component {
  render() {
    return (
      <div className="RangeExample">
        <DayPicker
          className="Selectable"
          numberOfMonths={this.props.numberOfMonths}
          selectedDays={this.props.selectedDays}
          modifiers={this.props.modifiers}
          onDayClick={this.props.handleDayClick}
        />
      </div>
    );
  }
}