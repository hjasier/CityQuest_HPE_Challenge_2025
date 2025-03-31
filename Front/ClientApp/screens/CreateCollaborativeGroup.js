import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import QRCode from 'react-native-qrcode-svg'
import * as Clipboard from 'expo-clipboard'
import * as Sharing from 'expo-sharing'
import { supabase } from '../database/supabase'
import { useSession } from '../hooks/SessionProvider'

const CreateCollaborativeGroup = () => {
  const navigation = useNavigation()
  const { session } = useSession()
  const [groupName, setGroupName] = useState('')
  const [groupId, setGroupId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)
  const [groupCreated, setGroupCreated] = useState(false)
  const [members, setMembers] = useState([])
  const [existingGroup, setExistingGroup] = useState(null)
  const [username, setUsername] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    if (session) {
      checkExistingGroup()
      fetchUserProfile()
    }
  }, [session])

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('User')
        .select('username, avatar_url')
        .eq('id', session?.user.id)
        .single()

      if (error) throw error

      setUsername(data.username || 'You')
      setAvatarUrl(data.avatar_url || 'https://randomuser.me/api/portraits/men/32.jpg')
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const checkExistingGroup = async () => {
    try {
      setCheckingStatus(true)
      
      // Check if user is already an admin of a group
      const { data: adminGroup, error: adminError } = await supabase
        .from('Group')
        .select('*, GroupMember!inner(*)')
        .eq('admin_id', session?.user.id)
        .single()

      if (adminError && adminError.code !== 'PGRST116') {
        throw adminError
      }

      // Check if user is a member of any group
      const { data: memberGroups, error: memberError } = await supabase
        .from('GroupMember')
        .select(`
          *,
          Group (*)
        `)
        .eq('user_id', session?.user.id)

      if (memberError) throw memberError

      if (adminGroup || (memberGroups && memberGroups.length > 0)) {
        // User is already in a group
        navigation.navigate("MyGroupScreen");
        return
        //
        const group = adminGroup || memberGroups[0].Group
        setExistingGroup(group)
        setGroupName(group.name)
        setGroupId(group.group_code)
        setGroupCreated(true)
        
        // Fetch group members
        await fetchGroupMembers(group.id)
      } else {
        // Generate a random group ID for new group
        const randomId = 'GRP-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000)
        setGroupId(randomId)
      }
      
      setCheckingStatus(false)
    } catch (error) {
      console.error('Error checking existing group:', error)
      setCheckingStatus(false)
    }
  }

  const fetchGroupMembers = async (groupId) => {
    try {
      const { data, error } = await supabase
        .from('GroupMember')
        .select(`
          *,
          User (id, username, avatar_url)
        `)
        .eq('group_id', groupId)

      if (error) throw error

      if (data) {
        const formattedMembers = data.map(member => ({
          id: member.User.id,
          name: member.User.username || 'Unknown User',
          avatar: member.User.avatar_url || 'https://randomuser.me/api/portraits/men/32.jpg',
          isAdmin: member.is_admin
        }))
        
        setMembers(formattedMembers)
      }
    } catch (error) {
      console.error('Error fetching group members:', error)
    }
  }

  const handleCreateGroup = async () => {
    if (groupName.trim() === '') {
      Alert.alert('Error', 'Please enter a group name')
      return
    }

    setIsLoading(true)
    
    try {
      // Create new group
      const { data: groupData, error: groupError } = await supabase
        .from('Group')
        .insert([
          { 
            name: groupName, 
            group_code: groupId,
            admin_id: session?.user.id
          }
        ])
        .select()

      if (groupError) throw groupError

      // Add creator as member with admin privileges
      const { error: memberError } = await supabase
        .from('GroupMember')
        .insert([
          { 
            user_id: session?.user.id, 
            group_id: groupData[0].id,
            is_admin: true
          }
        ])

      if (memberError) throw memberError

      setGroupCreated(true)
      navigation.navigate("MyGroupScreen");
      return
      setMembers([{
        id: session?.user.id,
        name: username,
        avatar: avatarUrl,
        isAdmin: true
      }])
      
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create group')
      console.error('Error creating group:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(groupId)
    Alert.alert('Success', 'Group ID copied to clipboard')
  }

  const shareGroup = async () => {
    try {
        const message = `Join my collaborative group "${groupName}" using this Group ID: ${groupId}`
        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(null, {
                dialogTitle: 'Share Group',
                mimeType: 'text/plain',
                UTI: 'public.plain-text',
                message,
            })
        } else {
            Alert.alert('Error', 'Sharing is not available on this device')
        }
    } catch (error) {
        Alert.alert('Error', 'An error occurred while trying to share the group')
    }
  }

  if (checkingStatus) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-600">Checking group status...</Text>
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-600 pt-12 pb-6">
        <View className="flex-row items-center justify-between px-4">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="p-2"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">
            {existingGroup ? 'My Group' : 'Create Group'}
          </Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      {!groupCreated ? (
        <View className="p-6">
          <Text className="text-gray-700 text-lg font-medium mb-2">Group Name</Text>
          <TextInput
            className="bg-white border border-gray-300 rounded-lg p-4 mb-4 text-gray-700"
            placeholder="Enter your group name"
            value={groupName}
            onChangeText={setGroupName}
          />
          
          <Text className="text-gray-500 mb-4 text-sm">
            You can create one collaborative group. This group will be associated with your account 
            and you will be the administrator.
          </Text>
          
          <TouchableOpacity
            className={`py-4 rounded-lg mb-4 flex-row justify-center items-center ${groupName.trim() === '' ? 'bg-blue-300' : 'bg-blue-600'}`}
            onPress={handleCreateGroup}
            disabled={groupName.trim() === '' || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="people" size={20} color="white" className="mr-2" />
                <Text className="text-white font-bold ml-2">Create Group</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Group Card */}
          <View className="mx-4 mt-4 bg-white rounded-xl shadow-sm overflow-hidden">
            <View className="bg-blue-50 p-4 border-b border-blue-100">
              <Text className="text-center text-xl font-bold text-blue-800">{groupName}</Text>
              <Text className="text-center text-blue-600 text-sm">
                {existingGroup ? 'Your Group' : 'Active Group'}
              </Text>
            </View>
            
            {/* QR Code */}
            <View className="items-center justify-center py-6 px-4">
              <View className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
                <QRCode 
                  value={groupId}
                  size={180}
                  color="#000"
                  backgroundColor="#fff"
                />
              </View>
              
              <View className="mt-4 items-center">
                <Text className="text-gray-500 mb-1">Group ID</Text>
                <View className="flex-row items-center bg-gray-100 py-2 px-4 rounded-lg">
                  <Text className="text-gray-700 font-bold text-lg">{groupId}</Text>
                  <TouchableOpacity onPress={copyToClipboard} className="ml-2">
                    <Ionicons name="copy-outline" size={20} color="#3b82f6" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            
            {/* Share Options */}
            <View className="px-4 pb-4">
              <TouchableOpacity
                className="bg-blue-600 py-3 rounded-lg flex-row justify-center items-center"
                onPress={shareGroup}
              >
                <Ionicons name="share-social" size={20} color="white" />
                <Text className="text-white font-medium ml-2">Share Group</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Members Section */}
          <View className="mt-6 mx-4 bg-white rounded-xl shadow-sm mb-8">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-100">
              <Text className="text-lg font-bold text-gray-800">Members</Text>
              <Text className="text-blue-600 font-medium">{members.length} members</Text>
            </View>
            
            {members.map((member) => (
              <View key={member.id} className="flex-row items-center justify-between p-4 border-b border-gray-100">
                <View className="flex-row items-center">
                  <Image
                    source={{ uri: member.avatar }}
                    className="h-10 w-10 rounded-full mr-3"
                  />
                  <View>
                    <Text className="text-gray-800 font-medium">{member.name}</Text>
                    {member.isAdmin && (
                      <Text className="text-blue-600 text-xs">Admin</Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
            
            <View className="p-4 items-center">
              <Text className="text-gray-500 text-center">
                Share your group ID or QR code with others to let them join your group
              </Text>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  )
}

export default CreateCollaborativeGroup