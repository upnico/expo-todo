import React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Dimensions, Platform, ScrollView } from 'react-native';
import TodoList from "./components/todolist";
import { LinearGradient } from 'expo-linear-gradient';
import AppLoading from 'expo-app-loading';
import { v4 as uuidv1 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface state {
  dataIsReady: boolean,
  newItem: string,
  todos: any
}

export default class App extends React.Component<null, state> {

  state = {
    dataIsReady: false,
    newItem: '',
    todos: {}
  };

  setNewItem = (textValue: string) => {


    this.setState({
      newItem: textValue
    });
  }

  componentDidMount = () => {
    this.loadTodos();
  };

  loadTodos = async () => {
    try {
      const todos = JSON.parse(await AsyncStorage.getItem('todos') || '{}');
      this.setState({dataIsReady: true, todos: todos || { } })
    } catch (err) {
      console.log(err)
    }
  }
  saveTodos = async (newToDos: any) => {
    const saveTodos = await AsyncStorage.setItem('todos', JSON.stringify(newToDos));
  };

  deleteTodo = (id: string) => {
    this.setState(prevState => {
      const todos = prevState.todos;
      delete todos[id];
      const newState = {
        ...prevState,
        ...todos
      };
      this.saveTodos(newState.todos); // add this
      return { ...newState };
    });
  };

  addTodo = () => {
    const { newItem } = this.state;
    if (newItem !== '') {
      this.setState(prevState => {
        const ID = uuidv1();
        const newObjectItem = {
          [ID]: {
            id: ID,
            isCompleted: false,
            textValue: newItem,
            createdAt: new Date()
          }
        };
        const newState = {
          ...prevState,
          newTodoItem: '',
          todos: {
            ...prevState.todos,
            ...newObjectItem
          }
        };
        this.saveTodos(newState.todos); // add this
        return { ...newState };
      });
    }
  };

  changeStateTodo = (id:string) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        todos: {
          ...prevState.todos,
          [id]: {
            ...prevState.todos[id],
            isCompleted: !prevState.todos[id].isCompleted
          }
        }
      };
      this.saveTodos(newState.todos); // add this
      return { ...newState };
    });
  }; 

  updateTodo = (id: string, textValue: string) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        todos: {
          ...prevState.todos,
          [id]: {
            ...prevState.todos[id],
            textValue: textValue
          }
        }
      };
      this.saveTodos(newState.todos); // add this
      return { ...newState };
    });
  };

  render() {
    const {newItem, dataIsReady, todos } = this.state;

    if (!dataIsReady) {
      return <AppLoading />
    } else {
      return (
        <LinearGradient style={styles.container} colors={['#DA4453', '#89216B']}>
          <StatusBar barStyle="light-content" />
          <Text style={styles.appTitle}>Minimalist Todo App</Text>
          <View style={styles.card}>
            <TextInput style={styles.input} placeholder="action a faire" onSubmitEditing={this.addTodo} onChangeText={this.setNewItem} returnKeyType={'done'} placeholderTextColor={'#999'} autoCorrect={false} />
            <ScrollView>
              {Object.values(todos).map((todo: any) => <TodoList key={todo.id} {...todo} updateTodo={this.updateTodo} changeStateTodo={this.changeStateTodo} deleteTodo={this.deleteTodo} />)}
            </ScrollView>
          </View>
        </LinearGradient>
      );
    }
  }
}

const { height, width } = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    color: '#fff',
    fontSize: 36,
    marginTop: 60,
    marginBottom: 30,
    fontWeight: '300'
  },
  card: {
    backgroundColor: '#fff',
    flex: 1,
    width: width - 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: 'rgb(50,50,50)',
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0
        }
      },
      android: {
        elevation: 5
      }
    })
  },
  input: {
    padding: 20,
    borderBottomColor: '#bbb',
    borderBottomWidth: 1,
    fontSize: 24
  }
});
