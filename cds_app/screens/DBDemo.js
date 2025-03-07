import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yvouepcwwstjvdcgvmon.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2b3VlcGN3d3N0anZkY2d2bW9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzMzk4NTUsImV4cCI6MjA1NjkxNTg1NX0.Skyc8_AIHMzjHC3yk8PbW31-5jRzyOzj2BzWZkyf7dI';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function DBDemo() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    fetchItems();
    
    const subscription = supabase
      .from('items')
      .on('*', fetchItems)
      .subscribe();
    
    return () => {
      supabase.removeSubscription(subscription);
    };
  }, []);

  async function fetchItems() {
    const { data, error } = await supabase.from('items').select('*');
    if (!error) setItems(data);
  }

  async function addItem() {
    if (!name) return;
    await supabase.from('items').insert([{ name }]);
    setName('');
  }

  async function deleteItem(id) {
    await supabase.from('items').delete().match({ id });
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Lista de Items</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>{item.name}</Text>
            <Button title="Eliminar" onPress={() => deleteItem(item.id)} />
          </View>
        )}
      />
      <TextInput
        placeholder="Nombre del item"
        value={name}
        onChangeText={setName}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <Button title="Agregar" onPress={addItem} />
    </View>
  );
}
