import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome5, Ionicons, Octicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useSession } from '../hooks/SessionProvider'
import { supabase } from '../database/supabase'
import UpdateAppButton from '../components/UpdateAppButton'

const Profile = () => {
  const navigation = useNavigation()
  const [userPoints, setUserPoints] = useState(1250) // Example points value
  const [username, setUsername] = useState("John Doe")
  const [avatarUrl, setAvatarUrl] = useState("https://randomuser.me/api/portraits/men/32.jpg")
  const { session } = useSession()

  

    useEffect(() => {
        if (session) {
        fetchUserProfile()
        }
    }, [session])

    async function fetchUserProfile() {
    try {
        // Fetch from User table (based on Auth screen's structure)
        const { data, error } = await supabase
        .from('User')
        .select('username, age, avatar_url, green_coins')
        .eq('id', session?.user.id)
        .single()

        if (error) throw error

        // Set profile states
        setUsername(data.username || '')
        setAvatarUrl(data.avatar_url || '')
        setUserPoints(data.green_coins || 0) 
    } catch (error) {
        Alert.alert('Error', error.message)
    } 
    }

    async function signOut() {
    await supabase.auth.signOut()
    }


  // Placeholder functions
  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: () => signOut() }
      ]
    )
  }
  
  const navigateToEditProfile = () => {
    navigation.navigate("Account")
  }
  
  const handleCreateGroup = () => {
    navigation.navigate("CreateCollaborativeGroup");
  }
  
  const handleJoinGroup = () => {
    navigation.navigate("JoinGroupScreen");
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header with points */}
      <View className="bg-secondary pt-12 pb-10 rounded-b-3xl shadow-md">
        <View className="flex-row justify-between items-center px-6">
          <View>
            <Text className="text-white text-xl font-bold">Mi Perfil</Text>
            <Text className="text-white text-sm opacity-80">Gestiona tu perfil</Text>
          </View>
          <View className="bg-white/20 px-4 py-2 rounded-full">
            <Text className="text-white font-bold">{userPoints} trotamundis</Text>
          </View>
        </View>
      </View>
      
      {/* User info card */}
      <View className="mx-4 -mt-6 bg-white p-4 rounded-xl shadow-sm shadow-gray-700">
        <View className="flex-row items-center space-x-4">
          <Image 
            source={{ uri: avatarUrl }} 
            className="h-20 w-20 rounded-full"
          />
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-800">{username}</Text>
            <Text className="text-gray-500">Green Level Member</Text>
            <TouchableOpacity 
              className="bg-blue-100 py-1 px-3 rounded-full mt-2 self-start"
              onPress={navigateToEditProfile}
            >
              <Text className="text-blue-700 text-sm font-medium">Editar Perfil</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      {/* Options section */}
      <View className="mt-6 mx-4 bg-white rounded-xl shadow-sm">
        <Text className="text-lg font-bold text-gray-800 p-4 border-b border-gray-100">Grupos</Text>
        
        <TouchableOpacity 
          className="flex-row items-center justify-between p-4 border-b border-gray-100" 
          onPress={handleCreateGroup}
        >
          <View className="flex-row items-center">
            <View className="bg-blue-100 p-2 rounded-lg mr-3">
              <Ionicons name="people" size={22} color="#3b82f6" />
            </View>
            <Text className="text-gray-700 font-medium">Crear un grupo colaborativo</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="flex-row items-center justify-between p-4" 
          onPress={handleJoinGroup}
        >
          <View className="flex-row items-center">
            <View className="bg-purple-100 p-2 rounded-lg mr-3">
              <Ionicons name="enter-outline" size={22} color="#8b5cf6" />
            </View>
            <Text className="text-gray-700 font-medium">Unirme a un grupo</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>
      </View>
      
      {/* Account section */}
      <View className="mt-6 mx-4 bg-white rounded-xl shadow-sm">
        <Text className="text-lg font-bold text-gray-800 p-4 border-b border-gray-100">Ajustes</Text>
        
        <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-100">
          <View className="flex-row items-center">
            <View className="bg-yellow-100 p-2 rounded-lg mr-3">
              <Ionicons name="notifications-outline" size={22} color="#eab308" />
            </View>
            <Text className="text-gray-700 font-medium">Notificaciones</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-100">
          <View className="flex-row items-center">
            <View className="bg-green-100 p-2 rounded-lg mr-3">
              <Ionicons name="shield-checkmark-outline" size={22} color="#10b981" />
            </View>
            <Text className="text-gray-700 font-medium">Privacidad</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-100">
          <View className="flex-row items-center">
            <View className="bg-red-100 p-2 rounded-lg mr-3">
              <Ionicons name="help-circle-outline" size={22} color="#ef4444" />
            </View>
            <Text className="text-gray-700 font-medium">Ayuda & Soporte</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("RequestApiUrlScreen")} className="flex-row items-center justify-between p-4 border-b border-gray-100">
          <View className="flex-row items-center">
            <View className="bg-gray-100 p-2 rounded-lg mr-3">
              <Octicons name="server" size={22} color="rgb(16, 16, 16)" />
            </View>
            <Text className="text-gray-700 font-medium">Cambiar URL API</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>




        {/* Actualizar app*/}
        <UpdateAppButton />




      </View>
      
      {/* Logout button */}
      <TouchableOpacity 
        className="mx-4 mt-6 mb-32 bg-red-50 py-4 rounded-xl border border-red-100"
        onPress={handleLogout}
      >
        <Text className="text-red-600 text-center font-medium">Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default Profile