import { View, Text, TextInput, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
  const [todo, setTodo] = useState('');
  const [todoList, setTodoList] = useState<Array<{id: number, text: string, isEditing: boolean}>>([]);
  const [editText, setEditText] = useState('');
  const [hoveredId, setHoveredId] = useState<number | string | null>(null);

  // Load todos from storage on initial render
  useEffect(() => {
    loadTodos();
  }, []);

  // Load todos from AsyncStorage
  const loadTodos = async () => {
    try {
      const savedTodos = await AsyncStorage.getItem('todos');
      if (savedTodos) {
        setTodoList(JSON.parse(savedTodos));
      }
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  };

  // Save todos to AsyncStorage
  const saveTodos = async (newTodos: Array<{id: number, text: string, isEditing: boolean}>) => {
    try {
      await AsyncStorage.setItem('todos', JSON.stringify(newTodos));
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  };

  // Create
  const handleAddTodo = () => {
    if (todo.trim().length > 0) {
      const newTodoList = [...todoList, {
        id: Date.now(),
        text: todo,
        isEditing: false
      }];
      setTodoList(newTodoList);
      saveTodos(newTodoList);
      setTodo('');
    }
  };

  // Delete
  const handleDeleteTodo = (id: number) => {
    const newTodoList = todoList.filter(item => item.id !== id);
    setTodoList(newTodoList);
    saveTodos(newTodoList);
  };

  // Update
  const handleUpdateTodo = (id: number) => {
    if (editText.trim().length > 0) {
      const newTodoList = todoList.map(item => 
        item.id === id ? { ...item, text: editText, isEditing: false } : item
      );
      setTodoList(newTodoList);
      saveTodos(newTodoList);
      setEditText('');
    }
  };

  // Toggle Edit Mode
  const toggleEditMode = (id: number, text: string) => {
    setTodoList(todoList.map(item =>
      item.id === id ? { ...item, isEditing: !item.isEditing } : { ...item, isEditing: false }
    ));
    setEditText(text);
  };

  return (
    <View style={tw`flex-1 bg-gradient-to-b from-indigo-100 to-purple-100 pt-16`}>
      <StatusBar style="auto" />
      <View style={tw`px-6`}>
        <Text style={tw`text-4xl font-bold text-indigo-900 mb-8 text-center`}>
          My Tasks
        </Text>
        
        <View style={tw`flex-row items-center mb-6`}>
          <View style={tw`flex-1 mr-3`}>
            <TextInput
              style={tw`w-full px-6 py-3 bg-white rounded-xl border-2 border-indigo-100 text-lg shadow-sm`}
              placeholder="What needs to be done?"
              placeholderTextColor="#94a3b8"
              value={todo}
              onChangeText={setTodo}
            />
          </View>
          <TouchableOpacity 
            style={[
              tw`px-6 py-3 bg-indigo-600 rounded-xl shadow-md`,
              hoveredId === -1 && tw`bg-indigo-700`
            ]}
            onPress={handleAddTodo}
            onPressIn={() => setHoveredId(-1)}
            onPressOut={() => setHoveredId(null)}
          >
            <Text style={tw`text-white font-bold text-lg`}>Add</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={tw`flex-1`}>
          {todoList.map((item) => (
            <Pressable
              key={item.id}
              onPressIn={() => setHoveredId(item.id)}
              onPressOut={() => setHoveredId(null)}
            >
              <View 
                style={[
                  tw`flex-row items-center justify-between bg-white p-5 rounded-2xl mb-4 shadow-lg border-l-4 border-indigo-500`,
                  hoveredId === item.id && tw`bg-indigo-50`
                ]}
              >
                {item.isEditing ? (
                  <View style={tw`flex-row flex-1 items-center`}>
                    <TextInput
                      style={tw`flex-1 px-4 py-2 mr-3 bg-gray-50 rounded-xl border-2 border-indigo-100`}
                      value={editText}
                      onChangeText={setEditText}
                      autoFocus
                    />
                    <TouchableOpacity 
                      onPress={() => handleUpdateTodo(item.id)}
                      style={[
                        tw`bg-green-500 px-4 py-2 rounded-xl`,
                        hoveredId === `save-${item.id}` && tw`bg-green-600`
                      ]}
                      onPressIn={() => setHoveredId(`save-${item.id}`)}
                      onPressOut={() => setHoveredId(null)}
                    >
                      <Text style={tw`text-white font-bold`}>Save</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <>
                    <Text style={tw`text-gray-800 flex-1 text-lg`}>{item.text}</Text>
                    <View style={tw`flex-row items-center`}>
                      <TouchableOpacity 
                        onPress={() => toggleEditMode(item.id, item.text)}
                        style={[
                          tw`mr-3 bg-indigo-100 p-2 rounded-lg`,
                          hoveredId === `edit-${item.id}` && tw`bg-indigo-200`
                        ]}
                        onPressIn={() => setHoveredId(`edit-${item.id}`)}
                        onPressOut={() => setHoveredId(null)}
                      >
                        <Text style={tw`text-indigo-700 font-bold`}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={() => handleDeleteTodo(item.id)}
                        style={[
                          tw`bg-red-100 p-2 rounded-lg`,
                          hoveredId === `delete-${item.id}` && tw`bg-red-200`
                        ]}
                        onPressIn={() => setHoveredId(`delete-${item.id}`)}
                        onPressOut={() => setHoveredId(null)}
                      >
                        <Text style={tw`text-red-700 font-bold`}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
