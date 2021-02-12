import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TextInput } from 'react-native';


const { height, width } = Dimensions.get('window');

{/*Interface for props */}
interface TodoListProps {
  textValue: string;
  isCompleted: boolean;
  deleteTodo: Function;
  changeStateTodo: Function;
  updateTodo: Function;
  id: string; 
}

class TodoList extends Component<TodoListProps> {

  constructor(props: TodoListProps) {
    super(props);
    this.state = {
      isEditing: false,
      todoValue: props.textValue,
      isCompleted: false
    }
  }

  state = {
    isEditing: false,
    todoValue: '',
    isCompleted: false
  }
  changeStateItem = () => {
    const { changeStateTodo, id} = this.props;
    changeStateTodo(id)
  }

  finishEdit = () => {
    const { todoValue } = this.state;
    const { id, updateTodo } = this.props;

    updateTodo(id, todoValue);
    this.setState({
      isEditing: false,
    })
  }

  startEdit = () => {
    this.setState({
      isEditing: true,
    });
  }

  setInput = (textValue: string) => {
    this.setState({ todoValue: textValue })
  }


  render() { 

    const { isEditing, todoValue } = this.state;
    const { id, deleteTodo, isCompleted } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.rowContainer}>
          <TouchableOpacity onPress={this.changeStateItem}>
            <View style={[styles.circle, isCompleted ? styles.completeCircle : styles.incompleteCircle]}>

            </View>
          </TouchableOpacity>
          {
            isEditing ? (
              <TextInput
                value={todoValue}
                style={[
                  styles.text,
                  styles.input,
                  isCompleted ? styles.strikeText : styles.unstrikeText
                ]}
                multiline={true}
                returnKeyType={'done'}
                onBlur={this.finishEdit}
                onChangeText={this.setInput}
              />
            ) : (
                <Text
                  style={[
                    styles.text,
                    isCompleted ? styles.strikeText : styles.unstrikeText
                  ]}
                >
                  {this.props.textValue}
                </Text>
              )
          }
        </View>
        {isEditing ? (
          <View style={styles.buttons}>
            <TouchableOpacity onPressOut={this.finishEdit}>
              <View style={styles.buttonContainer}>
                <Text>✅</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
            <View style={styles.buttons}>
              <TouchableOpacity onPressOut={this.startEdit}>
                <View style={styles.buttonContainer}>
                  <Text>✏</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPressOut={() => deleteTodo(id)}>
                <View style={styles.buttonContainer}>
                  <Text>❌</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
      </View>
    )
  }
};


const styles = StyleSheet.create({
  container: {
    width: width - 50,
    borderBottomColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  text: {
    fontWeight: '500',
    fontSize: 18,
    marginVertical: 20
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: 'red',
    borderWidth: 3,
    margin: 15
  },
  completeCircle: {
    borderColor: '#bbb'
  },
  incompleteCircle: {
    borderColor: '#DA4453'
  },
  strikeText: {
    color: '#bbb',
    textDecorationLine: 'line-through'
  },
  unstrikeText: {
    color: "#29323c"
  }, rowContainer: {
    flexDirection: 'row',
    width: width / 2,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  buttons: {
    flexDirection: 'row',
  },
  buttonContainer: {
    marginVertical: 10,
    marginHorizontal: 10,
  },
  input: {
    marginVertical: 15,
    width: width / 2,
    paddingBottom: 5
  }
});

export default TodoList;