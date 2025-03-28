import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView, StyleSheet, Vibration } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { supabase } from '../database/supabase'
import { useSession } from '../hooks/SessionProvider'

const JoinGroupScreen = () => {
  const navigation = useNavigation()
  const { session } = useSession()
  const [groupId, setGroupId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)
  const [scanning, setScanning] = useState(false)
  const [alreadyInGroup, setAlreadyInGroup] = useState(false)
  const [currentGroupId, setCurrentGroupId] = useState(null)
  const [facing, setFacing] = useState('back')
  const [permission, requestPermission] = useCameraPermissions()

  useEffect(() => {
    if (session) {
      checkExistingMembership()
    }
  }, [session])

  const checkExistingMembership = async () => {
    try {
      setCheckingStatus(true)
      
      // Check if user is already in a group
      const { data, error } = await supabase
        .from('GroupMember')
        .select('group_id')
        .eq('user_id', session?.user.id)
        .single()

      if (!error && data) {
        setAlreadyInGroup(true)
        setCurrentGroupId(data.group_id)
        
        // Get group code for navigation
        const { data: groupData } = await supabase
          .from('Group')
          .select('group_code')
          .eq('id', data.group_id)
          .single()
          
        if (groupData) {
          setGroupId(groupData.group_code)
        }
      }
      
      setCheckingStatus(false)
    } catch (error) {
      console.error('Error checking group membership:', error)
      setCheckingStatus(false)
    }
  }

  const startScanning = async () => {
    if (!permission?.granted) {
      const permissionResult = await requestPermission();
      if (!permissionResult.granted) {
        Alert.alert('Permission Denied', 'Please grant camera permissions to scan QR codes');
        return;
      }
    }
    setScanning(true);
  }

  const handleBarCodeScanned = ({ type, data }) => {
    Vibration.vibrate();
    // Only process if it's a QR code with valid group ID format
    if (data && data.startsWith('GRP-')) {
      setScanning(false);
      setGroupId(data);
      showJoinConfirmation(data);
    }
  }

  const handleManualJoin = () => {
    if (!groupId || !groupId.startsWith('GRP-')) {
      Alert.alert('Invalid Group ID', 'Please enter a valid group ID starting with GRP-')
      return
    }
    
    showJoinConfirmation(groupId)
  }

  const showJoinConfirmation = (gid) => {
    Alert.alert(
      "Join Group",
      "Are you sure you want to join this group? Your activity and points will be shared with the group.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Join", onPress: () => joinGroup(gid) }
      ]
    )
  }

  const joinGroup = async (gid) => {
    setIsLoading(true)
    
    try {
      // First find the group by group code
      const { data: groupData, error: groupError } = await supabase
        .from('Group')
        .select('id, name')
        .eq('group_code', gid)
        .single()

      if (groupError) {
        if (groupError.code === 'PGRST116') {
          throw new Error('Group not found. Please check the group ID and try again')
        }
        throw groupError
      }

      // Check if user is already in this group
      const { data: existingMember, error: memberCheckError } = await supabase
        .from('GroupMember')
        .select('id')
        .eq('user_id', session?.user.id)
        .eq('group_id', groupData.id)
        .single()
        
      if (!memberCheckError && existingMember) {
        throw new Error('You are already a member of this group')
      }

      // Join the group
      const { error: joinError } = await supabase
        .from('GroupMember')
        .insert([
          { 
            user_id: session?.user.id, 
            group_id: groupData.id,
            is_admin: false
          }
        ])

      if (joinError) throw joinError

      Alert.alert(
        'Success',
        `You have successfully joined the group: ${groupData.name}`,
        [
          { 
            text: 'View Group', 
            onPress: () => navigation.navigate('MyGroupScreen', { groupId: groupData.id }) 
          }
        ]
      )
      
      // Set as already in group to update UI
      setAlreadyInGroup(true)
      setCurrentGroupId(groupData.id)
      
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to join group')
      console.error('Error joining group:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const viewCurrentGroup = () => {
    navigation.navigate('MyGroupScreen', { groupId: currentGroupId })
  }

  if (checkingStatus) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-600">Checking membership status...</Text>
      </View>
    )
  }

  if (scanning) {
    return (
      <View className="flex-1">
        <CameraView 
          style={styles.camera} 
          facing={facing}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={handleBarCodeScanned}
        >
          {/* QR Code frame overlay */}
          <View className="flex-1 justify-center items-center">
            <View className="w-64 h-64 border-2 border-white rounded-lg opacity-70" />
          </View>
          
          {/* Close button */}
          <TouchableOpacity 
            className="absolute top-12 left-4 bg-white p-2 rounded-full"
            onPress={() => setScanning(false)}
          >
            <Ionicons name="close" size={24} color="#3b82f6" />
          </TouchableOpacity>
          
          {/* Bottom instructions */}
          <View className="absolute bottom-0 left-0 right-0 bg-black/70 py-6 px-4">
            <Text className="text-white text-lg text-center mb-2">Scan Group QR Code</Text>
            <Text className="text-white text-sm text-center opacity-80">
              Position the QR code within the frame to scan
            </Text>
          </View>
        </CameraView>
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
          <Text className="text-white text-xl font-bold">Join Group</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      {alreadyInGroup ? (
        <View className="p-6 items-center">
          <View className="bg-blue-50 p-4 rounded-2xl mb-6 w-full">
            <Ionicons name="checkmark-circle" size={60} color="#3b82f6" className="self-center" />
            <Text className="text-blue-800 text-xl font-bold text-center mt-2">You're already in a group</Text>
            <Text className="text-blue-600 text-center mt-1">You can only be a member of one group at a time</Text>
          </View>
          
          <TouchableOpacity
            className="bg-blue-600 py-4 px-6 rounded-lg mt-4 w-full"
            onPress={viewCurrentGroup}
          >
            <Text className="text-white font-medium text-center">View My Group</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="p-6">
          <View className="bg-blue-50 p-4 rounded-xl mb-6">
            <Text className="text-blue-800 text-base">
              Join a collaborative group to work together with friends and earn shared rewards!
            </Text>
          </View>
          
          {/* Scan QR Code option */}
          <TouchableOpacity 
            className="bg-white p-4 rounded-xl shadow-sm mb-4 flex-row items-center"
            onPress={startScanning}
          >
            <View className="bg-blue-100 p-3 rounded-lg mr-4">
              <Ionicons name="qr-code" size={24} color="#3b82f6" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-800 text-lg font-medium">Scan QR Code</Text>
              <Text className="text-gray-500 text-sm">Quickly join by scanning a code</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
          
          {/* Divider */}
          <View className="flex-row items-center my-4">
            <View className="flex-1 h-0.5 bg-gray-200" />
            <Text className="mx-4 text-gray-400">OR</Text>
            <View className="flex-1 h-0.5 bg-gray-200" />
          </View>
          
          {/* Manual entry option */}
          <View className="bg-white p-4 rounded-xl shadow-sm mb-6">
            <Text className="text-gray-700 font-medium mb-2">Enter Group ID</Text>
            <TextInput
              className="bg-gray-100 border border-gray-300 rounded-lg p-3 mb-4 text-gray-700"
              placeholder="e.g., GRP-1234-5678"
              value={groupId}
              onChangeText={setGroupId}
              autoCapitalize="characters"
            />
            <TouchableOpacity
              className={`py-3 rounded-lg flex-row justify-center items-center ${
                !groupId.startsWith('GRP-') ? 'bg-blue-300' : 'bg-blue-600'
              }`}
              onPress={handleManualJoin}
              disabled={!groupId.startsWith('GRP-') || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons name="enter-outline" size={20} color="white" className="mr-2" />
                  <Text className="text-white font-medium ml-1">Join Group</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          
          <Text className="text-gray-500 text-center text-sm">
            By joining a group, you agree to share your activities and contribute to group challenges.
          </Text>
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
});

export default JoinGroupScreen