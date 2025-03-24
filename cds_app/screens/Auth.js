import React, { useState, useEffect, useRef } from 'react'
import { Alert, View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, AppState } from 'react-native'
import { supabase } from '../database/supabase'
import { Input } from '@rneui/themed'
import * as ImagePicker from 'expo-image-picker'
import { FontAwesome5 } from '@expo/vector-icons'

export default function Auth() {
  // Auth states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  
  // Sign up form states
  const [isSignUp, setIsSignUp] = useState(false)
  const [username, setUsername] = useState('')
  const [age, setAge] = useState('')
  const [avatar, setAvatar] = useState(null)
  
  // Refs for scrolling
  const scrollViewRef = useRef(null)

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        supabase.auth.getSession()
      }
    })

    return () => subscription.remove()
  }, [])

  async function signInWithEmail() {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all required fields')
      return
    }
    
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) Alert.alert('Error', error.message)
    setLoading(false)
  }

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

  async function uploadAvatar(userId) {
    if (!avatar) return null
    
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
      
      const { data, error } = await supabase.storage
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
      return null
    }
  }

  async function signUpWithEmail() {
    if (!isSignUp) {
      setIsSignUp(true)
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }, 100)
      return
    }
    
    // Validate all required fields
    if (!email || !password || !username || !age) {
      Alert.alert('Error', 'Please fill in all required fields')
      return
    }
    
    if (isNaN(parseInt(age)) || parseInt(age) <= 0) {
      Alert.alert('Error', 'Please enter a valid age')
      return
    }
    
    setLoading(true)
    
    try {
      // 1. Create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError
      
      const userId = authData.user.id
      
      // 2. Upload avatar if selected
      const avatarUrl = avatar ? await uploadAvatar(userId) : null
      
      // 3. Create user profile
      const { error: profileError } = await supabase
        .from('User')
        .insert({
          id: userId,
          username: username,
          age: parseInt(age),
          avatar_url: avatarUrl,
          green_coins: 0 // Starting with 0 coins
        })

      if (profileError) throw profileError
      
      Alert.alert('Success', 'Your account has been created! Please check your inbox for email verification!')
      setIsSignUp(false)
      resetForm()
    } catch (error) {
      Alert.alert('Error', error.message)
    } finally {
      setLoading(false)
    }
  }
  
  const resetForm = () => {
    setEmail('')
    setPassword('')
    setUsername('')
    setAge('')
    setAvatar(null)
  }
  
  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp)
    resetForm()
  }

  return (
    <ScrollView 
      ref={scrollViewRef}
      className="flex-1 bg-green-50 pt-12"
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View className="px-6">
        <View className="items-center mb-8">
          <Text className="text-3xl font-bold text-green-800">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </Text>
          <Text className="text-green-600 text-center mt-2">
            {isSignUp 
              ? 'Join our eco-friendly community' 
              : 'Sign in to continue your green journey'}
          </Text>
        </View>
        
        <View className="bg-white rounded-xl shadow-md p-5 mb-4">
          <View className="mb-4">
            <Text className="text-green-800 font-medium mb-1 ml-1">Email</Text>
            <View className="flex-row items-center border border-gray-200 rounded-lg px-3 py-2">
              <FontAwesome5 name="envelope" size={16} color="#047857" />
              <Input
                containerStyle={{ paddingHorizontal: 0, marginBottom: -10, flex: 1 }}
                inputContainerStyle={{ borderBottomWidth: 0 }}
                onChangeText={setEmail}
                value={email}
                placeholder="email@address.com"
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>
          
          <View className="mb-4">
            <Text className="text-green-800 font-medium mb-1 ml-1">Password</Text>
            <View className="flex-row items-center border border-gray-200 rounded-lg px-3 py-2">
              <FontAwesome5 name="lock" size={16} color="#047857" />
              <Input
                containerStyle={{ paddingHorizontal: 0, marginBottom: -10, flex: 1 }}
                inputContainerStyle={{ borderBottomWidth: 0 }}
                onChangeText={setPassword}
                value={password}
                secureTextEntry
                placeholder="Password"
                autoCapitalize="none"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>
          
          {isSignUp && (
            <>
              <View className="mb-4">
                <Text className="text-green-800 font-medium mb-1 ml-1">Username</Text>
                <View className="flex-row items-center border border-gray-200 rounded-lg px-3 py-2">
                  <FontAwesome5 name="user" size={16} color="#047857" />
                  <Input
                    containerStyle={{ paddingHorizontal: 0, marginBottom: -10, flex: 1 }}
                    inputContainerStyle={{ borderBottomWidth: 0 }}
                    onChangeText={setUsername}
                    value={username}
                    placeholder="Choose a username"
                    autoCapitalize="none"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
              
              <View className="mb-4">
                <Text className="text-green-800 font-medium mb-1 ml-1">Age</Text>
                <View className="flex-row items-center border border-gray-200 rounded-lg px-3 py-2">
                  <FontAwesome5 name="birthday-cake" size={16} color="#047857" />
                  <Input
                    containerStyle={{ paddingHorizontal: 0, marginBottom: -10, flex: 1 }}
                    inputContainerStyle={{ borderBottomWidth: 0 }}
                    onChangeText={setAge}
                    value={age}
                    placeholder="Your age"
                    keyboardType="numeric"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
              
              <View className="mb-6">
                <Text className="text-green-800 font-medium mb-3 ml-1">Profile Picture</Text>
                <TouchableOpacity 
                  onPress={selectAvatar}
                  className="items-center justify-center border-2 border-dashed border-green-300 rounded-xl p-4 bg-green-50"
                >
                  {avatar ? (
                    <Image 
                      source={{ uri: avatar }} 
                      className="w-24 h-24 rounded-full" 
                    />
                  ) : (
                    <View className="items-center">
                      <FontAwesome5 name="camera" size={24} color="#10B981" />
                      <Text className="text-green-600 mt-2">Upload a photo</Text>
                      <Text className="text-gray-400 text-xs mt-1">(Optional)</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
        
        <TouchableOpacity
          onPress={isSignUp ? signUpWithEmail : signInWithEmail}
          disabled={loading}
          className={`rounded-lg py-4 px-6 mb-4 items-center ${loading ? 'bg-green-400' : 'bg-green-600'}`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={toggleAuthMode}
          className="items-center py-3"
        >
          <Text className="text-green-700">
            {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}