import React, { useState, useEffect } from 'react'
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Alert, 
  ActivityIndicator 
} from 'react-native'
import { supabase } from '../database/supabase'
import { Input } from '@rneui/themed'
import * as ImagePicker from 'expo-image-picker'
import { FontAwesome5 } from '@expo/vector-icons'
import { useSession } from '../hooks/SessionProvider'

export default function Account() {
  // Loading and session states
  const [loading, setLoading] = useState(false)
  const { session } = useSession()

  // Profile states
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [age, setAge] = useState('')
  const [avatar, setAvatar] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState('')

  // Fetch user profile on component mount
  useEffect(() => {
    if (session) {
      fetchUserProfile()
    }
  }, [session])

  // Fetch user profile details
  async function fetchUserProfile() {
    setLoading(true)
    try {
      // Fetch from User table (based on Auth screen's structure)
      const { data, error } = await supabase
        .from('User')
        .select('username, age, avatar_url')
        .eq('id', session?.user.id)
        .single()

      if (error) throw error

      // Set profile states
      setUsername(data.username || '')
      setAge(data.age ? data.age.toString() : '')
      setEmail(session?.user.email || '')
      setAvatarUrl(data.avatar_url || '')
    } catch (error) {
      Alert.alert('Error', error.message)
    } finally {
      setLoading(false)
    }
  }

  // Avatar selection
  async function selectAvatar() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.canceled) {
      setAvatar(result.assets[0].uri)
    }
  }

  // Upload avatar to Supabase storage
  async function uploadAvatar(userId) {
    if (!avatar) return avatarUrl
    
    try {
      const fileExt = avatar.split('.').pop()
      const filePath = `avatars/${userId}.${fileExt}`
      
      const photo = {
        uri: avatar,
        type: `image/${fileExt}`,
        name: filePath
      }
      
      const formData = new FormData()
      formData.append('file', photo)
      
      const { error } = await supabase.storage
        .from('avatars')
        .upload(filePath, formData, {
          upsert: true
        })
        
      if (error) throw error
      
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)
        
      return urlData.publicUrl
    } catch (error) {
      console.error('Error uploading avatar:', error)
      return avatarUrl
    }
  }

  // Update profile
  async function updateProfile() {
    // Validate inputs
    if (!username) {
      Alert.alert('Error', 'El nombre de usuario es obligatorio')
      return
    }
    
    if (age && (isNaN(parseInt(age)) || parseInt(age) <= 0)) {
      Alert.alert('Error', 'Por favor, ingrese una edad válida')
      return
    }

    setLoading(true)
    
    try {
      // Upload avatar if new one selected
      const newAvatarUrl = avatar 
        ? await uploadAvatar(session?.user.id) 
        : avatarUrl

      // Update user profile
      const { error } = await supabase
        .from('User')
        .update({
          username: username,
          age: age ? parseInt(age) : null,
          avatar_url: newAvatarUrl
        })
        .eq('id', session?.user.id)

      if (error) throw error

      Alert.alert('Éxito', '¡Perfil actualizado con éxito!')
      
      // Reset avatar selection
      setAvatar(null)
    } catch (error) {
      Alert.alert('Error', error.message)
    } finally {
      setLoading(false)
    }
  }

  // Sign out function
  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <ScrollView 
      className="flex-1 pt-12"
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View className="px-6 pb-36">
        {/* <View className="items-center mb-8">
          <Text className="text-3xl font-bold text-cyan-800">
            Mi Perfil
          </Text>
          <Text className="text-cyan-600 text-center mt-2">
            Administra los detalles de tu cuenta
          </Text>
        </View> */}
        
        <View className="bg-white rounded-xl shadow-md p-5 mb-4">
          {/* Email Input */}
          <View className="mb-4">
            <Text className="text-cyan-800 font-medium mb-1 ml-1">Correo Electrónico</Text>
            <View className="flex-row items-center border space-x-2 border-gray-200 rounded-lg px-3 py-2">
              <FontAwesome5 name="envelope" size={16} color="#1b96fc" />
              <Input
                containerStyle={{ paddingHorizontal: 0, marginBottom: -10, flex: 1 }}
                inputContainerStyle={{ borderBottomWidth: 0 }}
                value={email}
                disabled
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>
          
          {/* Username Input */}
          <View className="mb-4">
            <Text className="text-cyan-800 font-medium mb-1 ml-1">Nombre de Usuario</Text>
            <View className="flex-row space-x-2 items-center border border-gray-200 rounded-lg px-3 py-2">
              <FontAwesome5 name="user" size={16} color="#1b96fc" />
              <Input
                containerStyle={{ paddingHorizontal: 0, marginBottom: -10, flex: 1 }}
                inputContainerStyle={{ borderBottomWidth: 0 }}
                onChangeText={setUsername}
                value={username}
                placeholder="Actualiza tu nombre de usuario"
                autoCapitalize="none"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>
          
          {/* Age Input */}
          <View className="mb-4">
            <Text className="text-cyan-800 font-medium mb-1 ml-1">Edad</Text>
            <View className="flex-row space-x-2 items-center border border-gray-200 rounded-lg px-3 py-2">
              <FontAwesome5 name="birthday-cake" size={16} color="#1b96fc" />
              <Input
                containerStyle={{ paddingHorizontal: 0, marginBottom: -10, flex: 1 }}
                inputContainerStyle={{ borderBottomWidth: 0 }}
                onChangeText={setAge}
                value={age}
                placeholder="Actualiza tu edad"
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>
          
          {/* Profile Picture */}
          <View className="mb-6">
            <Text className="text-cyan-800 font-medium mb-3 ml-1">Foto de Perfil</Text>
            <TouchableOpacity 
              onPress={selectAvatar}
              className="items-center justify-center border-2 border-dashed border-cyan-300 rounded-xl p-4 bg-cyan-50"
            >
              {avatar ? (
                <Image 
                  source={{ uri: avatar }} 
                  className="w-24 h-24 rounded-full" 
                />
              ) : avatarUrl ? (
                <Image 
                  source={{ uri: avatarUrl }} 
                  className="w-24 h-24 rounded-full" 
                />
              ) : (
                <View className="items-center">
                  <FontAwesome5 name="camera" size={24} color="#10B981" />
                  <Text className="text-cyan-600 mt-2">Sube una foto</Text>
                  <Text className="text-gray-400 text-xs mt-1">(Opcional)</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Update Profile Button */}
        <TouchableOpacity
          onPress={updateProfile}
          disabled={loading}
          className={`rounded-lg py-4 px-6 mb-4 items-center ${loading ? 'bg-cyan-400' : 'bg-cyan-600'}`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">
              Actualizar Perfil
            </Text>
          )}
        </TouchableOpacity>
        

      </View>
    </ScrollView>
  )
}