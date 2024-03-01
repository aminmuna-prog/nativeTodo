import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

const HomeScreen = () => {
  const initialState = {
    id: 0,
    title: "",
    description: "",
    completed: false,
  };
  const [todo, setTodo] = useState([]);
  const [newTodo, setNewTodo] = useState(initialState);
  const [showModal, setShowModal] = useState(false);

  const getTodos = async () => {
    const todos = await AsyncStorage.getItem("todo");
    console.log(todos);
    setTodo(JSON.parse(todos) ? JSON.parse(todos) : []);
  };

  useEffect(() => {
    getTodos();
  }, []);

  const clear = () => setNewTodo(initialState);
  const handleChange = (title, value) =>
    setNewTodo({ ...newTodo, [title]: value });

  const addTodo = () => {
    if (!newTodo.title || !newTodo.description) {
      alert("Please enter all the values.");
      return;
    }
    newTodo.id = todo.length + 1;
    const updatedTodo = [newTodo, ...todo];
    setTodo(updatedTodo);
    AsyncStorage.setItem("todo", JSON.stringify(updatedTodo));
    setShowModal(false);
    clear();
  };
  const updateTodo = (item) => {
    const itemToBeUpdated = todo.filter((todoItem) => todoItem.id == item.id);
    itemToBeUpdated[0].completed = !itemToBeUpdated[0].completed;

    const remainingTodos = todo.filter((todoItem) => todoItem.id != item.id);
    const updatedTodo = [...itemToBeUpdated, ...remainingTodos];

    setTodo(updatedTodo);
    AsyncStorage.setItem("todo", JSON.stringify(updatedTodo));
  };
  const displayTodo = (item) => (
    <TouchableOpacity
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomColor: "#FAA300",
        borderBottomWidth: 1,
        paddingVertical: 16,
      }}
      // onPress={() =>
      //   Alert.alert(`${item.title}`, `${item.description}`, [
      //     {
      //       text: item.completed ? "Mark InProgress" : "Mark Completed",
      //       onPress: () => updateTodo(item),
      //     },
      //     {
      //       text: "Ok",
      //       style: "cancel",
      //     },
      //   ])
      // }
    >
      <BouncyCheckbox
        isChecked={item.completed ? true : false}
        fillColor="#FAA300"
        onPress={() => updateTodo(item)}
      />
      <Text
        style={{
          color: "#000",
          width: "90%",
          fontSize: 16,
          textDecorationLine: item.completed ? "line-through" : "none",
        }}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        paddingHorizontal: 20,
        marginTop: 20,
        backgroundColor: "#F7F6BB",
        flex: 1,
      }}
    >
      <View
        style={{
          paddingVertical: 20,
        }}
      >
        <View>
          <Text style={{ color: "#000", fontWeight: "semibold", fontSize: 22 }}>
            Your daily todo App.
          </Text>
          <Text style={{ fontSize: 16 }}>
            {todo.length} {todo.length == 1 ? "task" : "tasks"} for you
          </Text>
        </View>
      </View>
      <Text
        style={{
          color: "#000",
          fontSize: 28,
          fontWeight: "bold",
          backgroundColor: "#FAA300",
          paddingHorizontal: 10,
          paddingVertical: 7,
        }}
      >
        To do 📄
      </Text>

      <ScrollView>
        <View style={{ height: 250 }}>
          {todo.map((item) => (!item.completed ? displayTodo(item) : null))}
        </View>
      </ScrollView>
      <View
        style={{
          backgroundColor: "#FAA300",
          paddingHorizontal: 10,
          paddingVertical: 10,
        }}
      >
        <Text style={{ color: "#000", fontSize: 22, fontWeight: "bold" }}>
          Completed
        </Text>
      </View>
      <ScrollView>
        <View style={{ height: 250 }}>
          {todo.map((item) => (item.completed ? displayTodo(item) : null))}
        </View>
      </ScrollView>
      <View style={{ width: "100%", alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          style={{
            backgroundColor: "#FAA300",
            borderRadius: 100,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 60,
            height: 60,
            marginBottom: 50,
          }}
        >
          <Text style={{ fontSize: 46 }}>+</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={{ paddingHorizontal: 20 }}>
          <View
            style={{
              paddingVertical: 20,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 16 }}>
              {/* {todo.length} {todo.length == 1 ? "task" : "tasks"} for you */}
            </Text>
          </View>

          <Text
            style={{
              color: "#000",
              fontSize: 22,
              fontWeight: "semibold",
              marginVertical: 10,
              backgroundColor: "#FAA300",
              paddingHorizontal: 10,
              paddingVertical: 10,
            }}
          >
            Add a Todo Item
          </Text>
          <TextInput
            placeholder="Title"
            value={newTodo.title}
            onChangeText={(title) => handleChange("title", title)}
            style={{
              backgroundColor: "rgb(240, 240, 240)",
              paddingHorizontal: 10,
              borderRadius: 10,
              borderColor: "#FAA300",
              borderWidth: 1,
              marginVertical: 15,
            }}
          />
          <TextInput
            placeholder="Description"
            value={newTodo.description}
            onChangeText={(desc) => handleChange("description", desc)}
            style={{
              backgroundColor: "rgb(240, 240, 240)",
              paddingHorizontal: 10,
              borderRadius: 10,
              marginVertical: 10,
              borderColor: "#FAA300",
              borderWidth: 1,
            }}
            multiline={true}
            numberOfLines={6}
          />

          <View style={{ width: "100%", alignItems: "center", marginTop: 10 }}>
            <TouchableOpacity
              onPress={addTodo}
              style={{
                backgroundColor: "#FAA300",
                width: 120,
                borderRadius: 10,
                alignItems: "center",
                padding: 10,
              }}
            >
              <Text style={{ fontSize: 22, color: "#000" }}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;
