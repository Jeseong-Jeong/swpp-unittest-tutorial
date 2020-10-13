import React from 'react';
import { shallow } from 'enzyme';
import Calendar from './Calendar';

const stubCalendar={
    year: 2020,
    month: 4,
    todos: [
    {
        id: 1,
        title: "TODO_TEST_TITLE_1",
        content: "TODO_TEST_CONTENT_1",
        year: 2020,
        month: 3,
        date: 1,
        done: false,
    },
    {
        id: 2,
        title: "TODO_TEST_TITLE_2",
        content: "TODO_TEST_CONTENT_2",
        year: 2020,
        month: 3,
        date: 1,
        done: true,
    },
  ],
}

describe('<Calendar />', () => {
  let mockClickDone;
  let component;

  beforeEach(() => {
    mockClickDone = jest.fn(id => { return null });
    component = shallow(
            <Calendar 
                year={stubCalendar.year}
                month={stubCalendar.month}
                todos={stubCalendar.todos}
                clickDone={mockClickDone}
            />
    );
  })

  it('should render without errors', () => {
    let wrapper = component.find('.cell');
    expect(wrapper.length).toBe(30);
  });

  it('should show todo as done/notdone', () => {
    const wrapper1 = component.find('.notdone');
    const wrapper2 = component.find('.done');
    expect(wrapper1.length).toBe(1);
    expect(wrapper2.length).toBe(1);
  });

  it('should handle clicks', () => {
    const wrapper = component.find('.todoTitle');
    wrapper.at(0).simulate('click');
    expect(mockClickDone).toHaveBeenCalledTimes(1);
    expect(mockClickDone).toHaveBeenCalledWith(stubCalendar.todos[0].id);
    wrapper.at(1).simulate('click');
    expect(mockClickDone).toHaveBeenCalledTimes(2);
    expect(mockClickDone).toHaveBeenCalledWith(stubCalendar.todos[1].id);
  });
});
