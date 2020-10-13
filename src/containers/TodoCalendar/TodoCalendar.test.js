import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { connectRouter, ConnectedRouter } from 'connected-react-router';
import { Route, Redirect, Switch } from 'react-router-dom';

import TodoCalendar from './TodoCalendar';
import { getMockStore } from '../../test-utils/mocks';
import { history } from '../../store/store';
import * as actionCreators from '../../store/actions/todo';

jest.mock('../../components/Calendar/Calendar', () => {
    return jest.fn(props => {
        let todos = [];
        for(let i = 0; i < props.todos.length ; i++) {
            let todo = (
                <div id={props.todos[i].id}>
                    {props.todos[i].title}
                    {props.todos[i].content}
                    {props.todos[i].year}
                    {props.todos[i].month}
                    {props.todos[i].date}
                    {props.todos[i].done}
                </div>
            )
            todos.push(todo);
        }
        return (
            <div className='spyCalendar'>
                <div className='spyYear'>
                    {props.year}
                </div>
                <div className='spyMonth'>
                    {props.month}
                </div>
                <button className='spyClickDoneButton'
                    onClick={props.clickDone}/>
                <div className='spyTodos'>
                    {todos}
                </div>
            </div>
        )
    })
})

const stubInitialState = {
    todos: [
        {
            id: 1,
            title: 'TODO_TEST_TITLE_1',
            content: 'TODO_TEST_CONTENT_1',
            year: 2019,
            month: 10,
            date: 2,
            done: false,
        },
        {
            id: 2,
            title: 'TODO_TEST_TITLE_2',
            content: 'TODO_TEST_CONTENT_2',
            year: 2019,
            month: 9,
            date: 2,
            done: false,
        },
        {
            id: 3,
            title: 'TODO_TEST_TITLE_3',
            content: 'TODO_TEST_CONTENT_3',
            year: 2019,
            month: 9,
            date: 3,
            done: false,
        },
    ],
    selectedTodo: null,
  };

  const mockStore = getMockStore(stubInitialState);

  describe('<TodoCalendar />', () => {
    let todoCalendar;

    beforeEach(() => {
      todoCalendar = (
        <Provider store={mockStore}>
          <ConnectedRouter history={history}>
          <Switch>
            <Route path='/' exact component={TodoCalendar} />
          </Switch>
          </ConnectedRouter>
        </Provider>
      );
    });

    afterEach(() => { jest.clearAllMocks() });

    it('should render TodoCalendar', () => {
        const component = mount(todoCalendar);
        let wrapper = component.find('TodoCalendar');
        expect(wrapper.length).toBe(1);
        wrapper = component.find(".spyCalendar");
        expect(wrapper.length).toBe(1);
    });

    it('should call handleClickPrev', () => {
        const component = mount(todoCalendar);
        const wrapper = component.find('.prev-button');
        expect(wrapper.length).toBe(1);
        for (let i = 0 ; i < 13 ; i++ ) wrapper.simulate('click');
        const todoCalendarInstance = component.find(TodoCalendar.WrappedComponent).instance();
        expect(todoCalendarInstance.state.year).toEqual(2018);
        expect(todoCalendarInstance.state.month).toEqual(9);
    });

    it('should call handleClickNext', () => {
        const component = mount(todoCalendar);
        const wrapper = component.find('.next-button');
        expect(wrapper.length).toBe(1);
        for (let i = 0 ; i < 13 ; i++ ) wrapper.simulate('click');
        const todoCalendarInstance = component.find(TodoCalendar.WrappedComponent).instance();
        expect(todoCalendarInstance.state.year).toEqual(2020);
        expect(todoCalendarInstance.state.month).toEqual(11);
    });

    it(`should call 'getTodos'`, () => {
        const spyGetTodos = jest.spyOn(actionCreators, 'getTodos')
            .mockImplementation(() => { return dispatch => {}; });
        mount(todoCalendar);
        expect(spyGetTodos).toHaveBeenCalledTimes(1);
    });

    it(`should call 'toggleTodo'`, () => {
        const spyToggleTodo = jest.spyOn(actionCreators, 'toggleTodo')
            .mockImplementation(id => { return dispatch => {}; });
        const component = mount(todoCalendar);
        const wrapper = component.find('.spyClickDoneButton');
        wrapper.simulate('click');
        expect(wrapper.length).toBe(1);
        expect(spyToggleTodo).toHaveBeenCalled();
    })
}); 