import { View, Text, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { supabase } from '../database/supabase'
import { useSession } from '../hooks/SessionProvider'
import QRCode from 'react-native-qrcode-svg'
import * as Clipboard from 'expo-clipboard'
import * as Sharing from 'expo-sharing'

const MyGroupScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { session } = useSession()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [group, setGroup] = useState(null)
  const [members, setMembers] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [totalPoints, setTotalPoints] = useState(0)
  const [groupRank, setGroupRank] = useState(null)
  
  // Get the group ID from route params or fetch the user's group
  const groupIdFromRoute = route.params?.groupId

  useEffect(() => {
    if (session) {
      fetchGroupData()
    }
  }, [session, groupIdFromRoute])

  const fetchGroupData = async () => {
    try {
      setLoading(true)
      
      // If no groupId provided, find the user's group
      if (!groupIdFromRoute) {
        const { data: memberData, error: memberError } = await supabase
          .from('GroupMember')
          .select('group_id, is_admin')
          .eq('user_id', session?.user.id)
          .single()

        if (memberError) throw memberError
        
        if (!memberData) {
          // User doesn't belong to any group
          navigation.replace('JoinGroupScreen')
          return
        }
        
        setIsAdmin(memberData.is_admin)
        
        // Get group details
        const { data: groupData, error: groupError } = await supabase
          .from('Group')
          .select('*')
          .eq('id', memberData.group_id)
          .single()

        if (groupError) throw groupError
        
        setGroup(groupData)
        await Promise.all([
          fetchGroupMembers(groupData.id),
          fetchGroupRank(groupData.id)
        ])
      } else {
        // Get group using provided ID
        const { data: groupData, error: groupError } = await supabase
          .from('Group')
          .select('*')
          .eq('id', groupIdFromRoute)
          .single()

        if (groupError) throw groupError
        
        setGroup(groupData)
        
        // Check if user is admin
        const { data: memberData, error: memberError } = await supabase
          .from('GroupMember')
          .select('is_admin')
          .eq('user_id', session?.user.id)
          .eq('group_id', groupIdFromRoute)
          .single()
          
        if (!memberError) {
          setIsAdmin(memberData.is_admin)
        }
        
        await Promise.all([
          fetchGroupMembers(groupIdFromRoute),
          fetchGroupRank(groupIdFromRoute)
        ])
      }
    } catch (error) {
      console.error('Error fetching group data:', error)
      Alert.alert('Error', 'Could not load group data')
    } finally {
      setLoading(false)
    }
  }

  const fetchGroupMembers = async (groupId) => {
    try {
      const { data, error } = await supabase
        .from('GroupMember')
        .select(`
          *,
          User (id, username, avatar_url, green_coins)
        `)
        .eq('group_id', groupId)
        .order('is_admin', { ascending: false })

      if (error) throw error

      if (data) {
        const formattedMembers = data.map(member => ({
          id: member.User.id,
          name: member.User.username || 'Unknown User',
          avatar: member.User.avatar_url || 'https://randomuser.me/api/portraits/men/32.jpg',
          points: member.User.green_coins || 0,
          isAdmin: member.is_admin
        }))
        
        setMembers(formattedMembers)
        
        // Calculate total points
        const total = formattedMembers.reduce((sum, member) => sum + member.points, 0)
        setTotalPoints(total)
      }
    } catch (error) {
      console.error('Error fetching group members:', error)
    }
  }



  const fetchGroupRank = async (groupId) => {
    try {
      // This is a placeholder implementation. In a real app, you'd have an endpoint
      // to calculate group rankings based on points or other metrics
      
      // For demo purposes, we'll just set a random rank between 1-100
      setGroupRank(Math.floor(Math.random() * 100) + 1)
    } catch (error) {
      console.error('Error fetching group rank:', error)
    }
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await fetchGroupData()
    setRefreshing(false)
  }, [groupIdFromRoute])

  const copyToClipboard = async () => {
    if (group?.group_code) {
      await Clipboard.setStringAsync(group.group_code)
      Alert.alert('Success', 'Group ID copied to clipboard')
    }
  }

  const shareGroup = async () => {
    if (!group) return
    
    try {
      const message = `Join my collaborative group "${group.name}" using this Group ID: ${group.group_code}`
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

  const leaveGroup = () => {
    Alert.alert(
      "Leave Group",
      "Are you sure you want to leave this group? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Leave", 
          style: "destructive",
          onPress: confirmLeaveGroup
        }
      ]
    )
  }

  const confirmLeaveGroup = async () => {
    try {
      setLoading(true)
      
      // Admin can't leave if there are other members (must transfer admin first)
      if (isAdmin && members.length > 1) {
        Alert.alert(
          "Admin Required", 
          "You are the group admin. Please transfer admin rights to another member first or remove all members before leaving."
        )
        setLoading(false)
        return
      }
      
      const { error } = await supabase
        .from('GroupMember')
        .delete()
        .eq('user_id', session?.user.id)
        .eq('group_id', group.id)

      if (error) throw error
      
      // If admin and last member, also delete the group
      if (isAdmin && members.length === 1) {
        const { error: groupError } = await supabase
          .from('Group')
          .delete()
          .eq('id', group.id)
          
        if (groupError) throw groupError
      }
      
      Alert.alert('Success', 'You have left the group')
      navigation.replace('JoinGroupScreen')
      
    } catch (error) {
      console.error('Error leaving group:', error)
      Alert.alert('Error', 'Failed to leave the group')
      setLoading(false)
    }
  }
  
  const transferAdmin = (memberId) => {
    Alert.alert(
      "Transfer Admin",
      "Are you sure you want to make this member the new admin? You will lose admin privileges.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Transfer", onPress: () => confirmTransferAdmin(memberId) }
      ]
    )
  }
  
  const confirmTransferAdmin = async (memberId) => {
    try {
      setLoading(true)
      
      // Begin a transaction: remove admin from current user, add to new admin
      await supabase.rpc('transfer_group_admin', {
        group_id: group.id,
        old_admin_id: session?.user.id,
        new_admin_id: memberId
      })
      
      // Update the group admin_id
      await supabase
        .from('Group')
        .update({ admin_id: memberId })
        .eq('id', group.id)
      
      Alert.alert('Success', 'Admin privileges transferred')
      onRefresh()
      
    } catch (error) {
      console.error('Error transferring admin:', error)
      Alert.alert('Error', 'Failed to transfer admin privileges')
    } finally {
      setLoading(false)
    }
  }
  
  const removeMember = (memberId) => {
    if (memberId === session?.user.id) {
      leaveGroup()
      return
    }
    
    Alert.alert(
      "Remove Member",
      "Are you sure you want to remove this member from the group?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: () => confirmRemoveMember(memberId) 
        }
      ]
    )
  }
  
  const confirmRemoveMember = async (memberId) => {
    try {
      setLoading(true)
      
      const { error } = await supabase
        .from('GroupMember')
        .delete()
        .eq('user_id', memberId)
        .eq('group_id', group.id)

      if (error) throw error
      
      Alert.alert('Success', 'Member removed from group')
      onRefresh()
      
    } catch (error) {
      console.error('Error removing member:', error)
      Alert.alert('Error', 'Failed to remove member')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-600">Loading group data...</Text>
      </View>
    )
  }

  return (
    <ScrollView 
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View className="bg-blue-600 pt-12 pb-24">
        <View className="flex-row items-center justify-between px-4">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="p-2"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">My Group</Text>
          <TouchableOpacity 
            className="p-2"
            onPress={shareGroup}
          >
            <Ionicons name="share-social-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        {/* Group summary */}
        <View className="items-center mt-4">
          <Text className="text-white text-2xl font-bold">{group?.name}</Text>
          <View className="flex-row items-center mt-2">
            <Ionicons name="people" size={16} color="rgba(255,255,255,0.8)" />
            <Text className="text-white opacity-80 ml-1">{members.length} members</Text>
          </View>
        </View>
      </View>
      
      {/* Stats cards */}
      <View className="flex-row mx-4 -mt-16 mb-4">
        <View className="flex-1 bg-white rounded-xl shadow-sm p-4 mr-2">
          <Text className="text-gray-500 text-xs">TOTAL POINTS</Text>
          <Text className="text-2xl font-bold text-blue-600">{totalPoints}</Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="trending-up" size={14} color="#10b981" />
            <Text className="text-green-600 text-xs ml-1">+45 hoy</Text>
          </View>
        </View>
        
        <View className="flex-1 bg-white rounded-xl shadow-sm p-4 ml-2">
          <Text className="text-gray-500 text-xs">GROUP RANK</Text>
          <Text className="text-2xl font-bold text-purple-600">#{groupRank}</Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="trophy" size={14} color="#f59e0b" />
            <Text className="text-amber-600 text-xs ml-1">Top 10%</Text>
          </View>
        </View>
      </View>
      
      {/* Group code / QR section */}
      <View className="mx-4 mb-4 bg-white p-4 rounded-xl shadow-sm">
        <Text className="text-gray-800 font-medium mb-3">Group ID</Text>
        <View className="flex-row justify-between items-center bg-gray-100 py-2 px-4 rounded-lg">
          <Text className="text-gray-700 font-medium">{group?.group_code}</Text>
          <TouchableOpacity onPress={copyToClipboard}>
            <Ionicons name="copy-outline" size={20} color="#3b82f6" />
          </TouchableOpacity>
        </View>
        
        <View className="items-center mt-4">
          <View className="bg-white p-2 rounded-xl shadow-sm border border-gray-200">
            {group?.group_code && (
              <QRCode 
                value={group.group_code}
                size={120}
                color="#000"
                backgroundColor="#fff"
              />
            )}
          </View>
          <Text className="text-gray-500 text-xs mt-2">Scan to join group</Text>
        </View>
      </View>
      
      {/* Members section */}
      <View className="mx-4 mb-4 bg-white rounded-xl shadow-sm">
        <View className="flex-row justify-between items-center p-4 border-b border-gray-100">
          <Text className="text-lg font-bold text-gray-800">Members</Text>
          <Text className="text-blue-600 font-medium">{members.length} members</Text>
        </View>
        
        {members.map((member) => (
          <View key={member.id} className="flex-row items-center justify-between p-4 border-b border-gray-100">
            <View className="flex-row items-center flex-1">
              <Image
                source={{ uri: member.avatar }}
                className="h-10 w-10 rounded-full mr-3"
              />
              <View>
                <View className="flex-row items-center">
                  <Text className="text-gray-800 font-medium">{member.name}</Text>
                  {member.isAdmin && (
                    <View className="bg-blue-100 rounded-full px-2 py-0.5 ml-2">
                      <Text className="text-blue-600 text-xs">Admin</Text>
                    </View>
                  )}
                  {member.id === session?.user.id && (
                    <Text className="text-gray-400 text-xs ml-2">(You)</Text>
                  )}
                </View>
                <Text className="text-gray-500 text-xs">{member.points} points</Text>
              </View>
            </View>
            
            {/* Admin actions */}
            {isAdmin && member.id !== session?.user.id && (
              <View className="flex-row">
                <TouchableOpacity 
                  onPress={() => transferAdmin(member.id)}
                  className="p-2 mr-1"
                >
                  <Ionicons name="key-outline" size={20} color="#3b82f6" />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => removeMember(member.id)}
                  className="p-2"
                >
                  <Ionicons name="close-circle-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </View>
      

      
      {/* Leave group option */}
      <TouchableOpacity 
        className="mx-4 my-6 bg-red-50 py-3 rounded-xl border border-red-100"
        onPress={leaveGroup}
      >
        <Text className="text-red-600 text-center font-medium">
          {isAdmin && members.length === 1 ? 'Delete Group' : 'Leave Group'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default MyGroupScreen