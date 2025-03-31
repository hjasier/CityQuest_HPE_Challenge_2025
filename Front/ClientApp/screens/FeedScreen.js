import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  Image, 
  FlatList, 
  TouchableOpacity, 
  Modal,
  TextInput,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { HeartIcon, ChatBubbleLeftIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { HeartIcon as HeartSolidIcon } from 'react-native-heroicons/solid';
import { useFeedAcceptedChallenges } from '../hooks/useFeedAcceptedChallenges';
// Sample data for demonstration
const SAMPLE_FEED_DATA = [
  {
    id: '1',
    type: 'challenge_completion',
    user: {
      id: '101',
      name: 'Carlos Rodríguez',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      xp: 2500
    },
    challenge: {
      id: 'c101',
      title: 'Ruta Gastronómica en GreenLake',
      xpEarned: 150
    },
    timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
    likes: 24,
    comments: [
      { id: 'cm1', user: 'Ana', text: '¡Deliciosa experiencia!', timestamp: new Date(Date.now() - 900000) },
      { id: 'cm2', user: 'Luis', text: '¡Qué bien se ve todo!', timestamp: new Date(Date.now() - 600000) }
    ],
    liked: false
  },
  // ... other sample data
];

const FeedScreen = () => {
  const [feedData, setFeedData] = useState(SAMPLE_FEED_DATA);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [newComment, setNewComment] = useState('');
  const { FeedAcceptedChallenges, loading: feedLoading, refetch } = useFeedAcceptedChallenges();

  // Handle refresh when user pulls down the list
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    
    // Call the refetch function from our custom hook
    refetch()
      .then(() => {
        console.log('Feed data refreshed successfully');
        setRefreshing(false);
      })
      .catch((error) => {
        console.error('Error refreshing feed data:', error);
        setRefreshing(false);
      });
  }, [refetch]);

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

  // Add this new renderFeedItem function that delegates to the appropriate renderer
  const renderFeedItem = ({ item }) => {
    // For accepted/completed challenges from the API
    if (item.type === 'challenge_item') {
      return renderAcceptedChallengeItem({ item: item.originalData });
    }
    
    // For original sample data, use the existing renderer
    return renderFeedItemDumm({ item });
  };

  // Render different types of feed items
  const renderFeedItemDumm = ({ item }) => {
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
              A completado <Text className="font-semibold">{item.challenge.title}</Text>
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
              A subido una foto: <Text className="text-gray-600">{item.caption}</Text>
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

  // Updated renderAcceptedChallengeItem function with conditional messaging
  const renderAcceptedChallengeItem = ({ item }) => {
    // Extract data from the item
    const { User, Challenge, accepted_at, completed, completed_at } = item;
    const acceptedDate = new Date(accepted_at);
    const completedDate = completed_at ? new Date(completed_at) : null;
    const location = Challenge.Location;

    return (
      <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        {/* User info and timestamp */}
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center">
            <Image
              source={{ uri: User.avatar_url }}
              className="w-10 h-10 rounded-full"
            />
            <View className="ml-2">
              <Text className="font-semibold text-gray-800">{User.username}</Text>
              <Text className="text-xs text-gray-500">
                {completed ? formatTime(completedDate) : formatTime(acceptedDate)}
              </Text>
            </View>
          </View>
          <View className="bg-purple-100 px-2 py-1 rounded-lg">
            <Text className="text-purple-600 font-medium text-xs">Reward: {Challenge.reward} XP</Text>
          </View>
        </View>

        {/* Challenge content */}
        <View className="mb-3">
          {/* Different message based on completed status */}
          <Text className="text-gray-700 mb-1">
            {completed ? (
              <>
                <Text className="font-semibold">{User.username}</Text> a completado el reto: <Text className="font-semibold">{Challenge.name}</Text>!
              </>
            ) : (
              <>
                <Text className="font-semibold">{User.username}</Text> a aceptado el reto <Text className="font-semibold">{Challenge.name}</Text>!
              </>
            )}
          </Text>
          
          <Text className="text-gray-600 text-sm mb-2">{Challenge.description}</Text>
          
          {Challenge.cover_url && (
            <View className="mt-2">
              <Image
                source={{ uri: Challenge.cover_url }}
                className="w-full h-40 rounded-lg"
                resizeMode="cover"
              />
            </View>
          )}
          
          {/* Different status indicator based on completed */}
          <View className={`${completed ? 'bg-green-100' : 'bg-amber-100'} rounded-lg p-3 mt-3`}>
            <Text className={`${completed ? 'text-green-700' : 'text-amber-700'} font-medium text-center`}>
              {completed ? (
                `Challenge Completed! +${Challenge.reward} XP`
              ) : (
                'Challenge Accepted!'
              )}
            </Text>
          </View>
        </View>

        {/* Show proof image if completed and has proof */}
        {completed && item.image_url_proof && (
          <View className="mb-3">
            <Text className="text-gray-700 font-medium mb-1">Completion Proof:</Text>
            <Image
              source={{ uri: item.image_url_proof }}
              className="w-full h-32 rounded-lg"
              resizeMode="cover"
            />
          </View>
        )}

        {/* Location info */}
        {location && (
          <View className="flex-row items-center mt-1 mb-2 bg-gray-50 p-2 rounded-lg">
            {location.image_url && (
              <Image 
                source={{ uri: location.image_url }}
                className="w-8 h-8 rounded mr-2"
              />
            )}
            <View>
              <Text className="text-gray-800 font-medium">{location.name}</Text>
              {location.address && (
                <Text className="text-gray-500 text-xs">{location.address}</Text>
              )}
            </View>
          </View>
        )}

        {/* Likes and comments section */}
        <View className="flex-row justify-between items-center mt-2 pt-2 border-t border-gray-100">
          <TouchableOpacity 
            className="flex-row items-center"
          >
            <HeartIcon size={20} color="#6b7280" />
            <Text className="ml-1 text-gray-600">0</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center"
          >
            <ChatBubbleLeftIcon size={20} color="#6b7280" />
            <Text className="ml-1 text-gray-600">0</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  useEffect(() => {
    if (FeedAcceptedChallenges && !feedLoading) {
      // Convert accepted/completed challenges to feed format
      const challengesFeed = FeedAcceptedChallenges.map(item => ({
        id: `challenge-${item.id}`,
        type: 'challenge_item',
        originalData: item,
        // Use completed_at timestamp if completed, otherwise use accepted_at
        timestamp: item.completed ? new Date(item.completed_at) : new Date(item.accepted_at),
        user: {
          id: item.user_id,
          name: item.User.username,
          avatar: item.User.avatar_url
        },
        likes: 0,
        comments: []
      }));
      
      // Combine with sample data and sort by timestamp (newest first)
      const combinedFeed = [...SAMPLE_FEED_DATA, ...challengesFeed].sort(
        (a, b) => b.timestamp - a.timestamp
      );
      
      setFeedData(combinedFeed);
    }
  }, [FeedAcceptedChallenges, feedLoading]);

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
    <View className="flex-1 bg-gray-100">
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
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={["#3b82f6"]}
              tintColor="#3b82f6"
            />
          }
        />
      )}
   
      {/* Comments Modal */}
      {renderCommentsModal()}
    </View>
  );
};

export default FeedScreen;