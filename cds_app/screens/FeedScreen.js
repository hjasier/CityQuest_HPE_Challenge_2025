import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  FlatList, 
  TouchableOpacity, 
  Modal,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { HeartIcon, ChatBubbleLeftIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { HeartIcon as HeartSolidIcon } from 'react-native-heroicons/solid';

// Sample data for demonstration
const SAMPLE_FEED_DATA = [
  {
    id: '1',
    type: 'challenge_completion',
    user: {
      id: '101',
      name: 'Alex Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      xp: 2500
    },
    challenge: {
      id: 'c101',
      title: 'Morning Jog Challenge',
      xpEarned: 150
    },
    timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
    likes: 24,
    comments: [
      { id: 'cm1', user: 'Sarah', text: 'Great job!', timestamp: new Date(Date.now() - 900000) },
      { id: 'cm2', user: 'Mike', text: 'Keep it up!', timestamp: new Date(Date.now() - 600000) }
    ],
    liked: false
  },
  {
    id: '2',
    type: 'image_upload',
    user: {
      id: '102',
      name: 'Emma Wilson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      xp: 1800
    },
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
    caption: 'Completed my first marathon!',
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    likes: 56,
    comments: [
      { id: 'cm3', user: 'David', text: 'Amazing! 👏', timestamp: new Date(Date.now() - 5400000) }
    ],
    xpEarned: 100,
    liked: true
  },
  {
    id: '3',
    type: 'challenge_completion',
    user: {
      id: '103',
      name: 'James Smith',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
      xp: 3200
    },
    challenge: {
      id: 'c102',
      title: 'Meditation Streak',
      xpEarned: 200
    },
    timestamp: new Date(Date.now() - 14400000), // 4 hours ago
    likes: 32,
    comments: [],
    liked: false
  }
];

const FeedScreen = () => {
  const [feedData, setFeedData] = useState(SAMPLE_FEED_DATA);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [newComment, setNewComment] = useState('');

  // Format timestamp to show only hours and minutes
  const formatTime = (timestamp) => {
    const hours = timestamp.getHours().toString().padStart(2, '0');
    const minutes = timestamp.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Toggle like on a feed item
  const toggleLike = (id) => {
    setFeedData(feedData.map(item => {
      if (item.id === id) {
        return {
          ...item,
          liked: !item.liked,
          likes: item.liked ? item.likes - 1 : item.likes + 1
        };
      }
      return item;
    }));
  };

  // Open comments modal for a specific item
  const openComments = (item) => {
    setSelectedItem(item);
    setCommentsVisible(true);
  };

  // Add a new comment
  const addComment = () => {
    if (newComment.trim() === '' || !selectedItem) return;

    const updatedData = feedData.map(item => {
      if (item.id === selectedItem.id) {
        return {
          ...item,
          comments: [
            ...item.comments,
            {
              id: `cm${Date.now()}`,
              user: 'You', // In a real app, this would be the current user's name
              text: newComment,
              timestamp: new Date()
            }
          ]
        };
      }
      return item;
    });

    setFeedData(updatedData);
    setNewComment('');
    
    // Update the selectedItem to reflect the new comment
    const updatedItem = updatedData.find(item => item.id === selectedItem.id);
    setSelectedItem(updatedItem);
  };

  // Render different types of feed items
  const renderFeedItem = ({ item }) => {
    const isChallenge = item.type === 'challenge_completion';
    const isImageUpload = item.type === 'image_upload';

    return (
      <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        {/* User info and timestamp */}
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center">
            <Image
              source={{ uri: item.user.avatar }}
              className="w-10 h-10 rounded-full"
            />
            <View className="ml-2">
              <Text className="font-semibold text-gray-800">{item.user.name}</Text>
              <Text className="text-xs text-gray-500">{formatTime(item.timestamp)}</Text>
            </View>
          </View>
          <View className="bg-blue-100 px-2 py-1 rounded-lg">
            <Text className="text-blue-600 font-medium text-xs">XP: {isChallenge ? item.challenge.xpEarned : item.xpEarned}</Text>
          </View>
        </View>

        {/* Content based on type */}
        {isChallenge && (
          <View className="mb-3">
            <Text className="text-gray-700 mb-1">
              Completed the <Text className="font-semibold">{item.challenge.title}</Text>
            </Text>
            <View className="bg-green-100 rounded-lg p-3 mt-1">
              <Text className="text-green-700 font-medium text-center">
                +{item.challenge.xpEarned} XP
              </Text>
            </View>
          </View>
        )}

        {isImageUpload && (
          <View className="mb-3">
            <Text className="text-gray-700 mb-2">
              Uploaded a photo: <Text className="text-gray-600">{item.caption}</Text>
            </Text>
            <Image
              source={{ uri: item.image }}
              className="w-full h-48 rounded-lg"
              resizeMode="cover"
            />
          </View>
        )}

        {/* Likes and comments */}
        <View className="flex-row justify-between items-center mt-2 pt-2 border-t border-gray-100">
          <TouchableOpacity 
            className="flex-row items-center" 
            onPress={() => toggleLike(item.id)}
          >
            {item.liked ? (
              <HeartSolidIcon size={20} color="#f43f5e" />
            ) : (
              <HeartIcon size={20} color="#6b7280" />
            )}
            <Text className="ml-1 text-gray-600">{item.likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center" 
            onPress={() => openComments(item)}
          >
            <ChatBubbleLeftIcon size={20} color="#6b7280" />
            <Text className="ml-1 text-gray-600">{item.comments.length}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Comments Modal
  const renderCommentsModal = () => {
    if (!selectedItem) return null;

    return (
      <Modal
        visible={commentsVisible}
        animationType="slide"
        transparent={true}
      >
        <View className="flex-1 bg-black bg-opacity-50 justify-end">
          <View className="bg-white rounded-t-xl h-3/4 p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold">Comments</Text>
              <TouchableOpacity onPress={() => setCommentsVisible(false)}>
                <XMarkIcon size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Comments list */}
            {selectedItem.comments.length > 0 ? (
              <FlatList
                data={selectedItem.comments}
                keyExtractor={(item) => item.id}
                className="mb-4"
                renderItem={({ item: comment }) => (
                  <View className="mb-3 p-2 bg-gray-50 rounded-lg">
                    <View className="flex-row justify-between">
                      <Text className="font-semibold">{comment.user}</Text>
                      <Text className="text-xs text-gray-500">{formatTime(comment.timestamp)}</Text>
                    </View>
                    <Text className="mt-1 text-gray-700">{comment.text}</Text>
                  </View>
                )}
              />
            ) : (
              <View className="flex-1 justify-center items-center">
                <Text className="text-gray-500">No comments yet. Be the first!</Text>
              </View>
            )}

            {/* Add comment input */}
            <View className="flex-row items-center border-t border-gray-200 pt-3">
              <TextInput
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2"
                placeholder="Add a comment..."
                value={newComment}
                onChangeText={setNewComment}
              />
              <TouchableOpacity 
                className="bg-blue-500 rounded-full p-2"
                onPress={addComment}
              >
                <Text className="text-white font-semibold px-2">Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View className="flex-1 bg-gray-100 ">
      {/* Header */}
      <View className=" px-4 py-3 shadow-sm mt-5">
        <Text className="text-xl font-bold text-gray-800">Activity Feed</Text>
      </View>

      {/* Feed List */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : (
        <FlatList
          data={feedData}
          keyExtractor={(item) => item.id}
          renderItem={renderFeedItem}
          contentContainerClassName="p-4"
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Comments Modal */}
      {renderCommentsModal()}
    </View>
  );
};

export default FeedScreen;