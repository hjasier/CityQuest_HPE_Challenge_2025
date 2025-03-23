import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Phone, Mail, Camera, ArrowRight, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const UserDashboard = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    address: '',
    latitude: '',
    longitude: '',
    email: '',
    phone_number: '',
    opening_hours: '',
    locationType: 1,
    capabilities: []
  });
  // Ensure these are initialized as arrays to prevent the map error
  const [locationTypes, setLocationTypes] = useState([]);
  const [capabilities, setCapabilities] = useState([]);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Fetch location types and capabilities from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your actual API endpoints
        const [typesResponse, capabilitiesResponse] = await Promise.all([
          axios.get('/api/location-types'),
          axios.get('/api/capabilities')
        ]);
        
        // Make sure we're handling the response correctly
        // Check if response data is an array or if it has a data property that's an array
        const typesData = Array.isArray(typesResponse.data) 
          ? typesResponse.data 
          : (typesResponse.data?.data || []);
          
        const capsData = Array.isArray(capabilitiesResponse.data) 
          ? capabilitiesResponse.data 
          : (capabilitiesResponse.data?.data || []);
        
        setLocationTypes(typesData);
        setCapabilities(capsData);
      } catch (error) {
        console.error('Error fetching form data:', error);
        // Fallback to sample data if API fails
        setLocationTypes([
          { id: 1, name: 'Restaurant', description: 'Dining establishments' },
          { id: 2, name: 'Hotel', description: 'Accommodations' },
          { id: 3, name: 'Shop', description: 'Retail establishments' },
          { id: 4, name: 'Attraction', description: 'Tourist attractions' }
        ]);
        
        setCapabilities([
          { id: 1, name: 'Wheelchair Accessible' },
          { id: 2, name: 'Eco-Friendly' },
          { id: 3, name: 'Pet Friendly' },
          { id: 4, name: 'Offers Vegan Options' },
          { id: 5, name: 'Uses Renewable Energy' },
          { id: 6, name: 'Zero Waste Policy' }
        ]);
      }
    };
    
    fetchData();
  }, []);



  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const toggleCapability = (capabilityId) => {
    if (formData.capabilities.includes(capabilityId)) {
      setFormData({
        ...formData,
        capabilities: formData.capabilities.filter(id => id !== capabilityId)
      });
    } else {
      setFormData({
        ...formData,
        capabilities: [...formData.capabilities, capabilityId]
      });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Prepare the data according to your database schema
      const locationData = {
        name: formData.name,
        description: formData.description,
        image_url: formData.image_url,
        address: formData.address,
        latitude: parseFloat(formData.latitude) || null,
        longitude: parseFloat(formData.longitude) || null,
        email: formData.email,
        phone_number: formData.phone_number,
        opening_hours: formData.opening_hours,
        status: 'pending', // Initial status for admin review
        solicited_at: new Date().toISOString(),
        locationType: formData.locationType,
        capabilities: formData.capabilities
      };
      
      // Send the data to your API
      const response = await axios.post('/api/locations', locationData);
      
      console.log('Location submitted successfully:', response.data);
      setSubmitSuccess(true);
      
      // Reset form after submission
      setFormData({
        name: '',
        description: '',
        image_url: '',
        address: '',
        latitude: '',
        longitude: '',
        email: '',
        phone_number: '',
        opening_hours: '',
        locationType: '',
        capabilities: []
      });
      setStep(1);
    } catch (error) {
      console.error('Error submitting location:', error);
      setError(error.response?.data?.message || 'Failed to submit location. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderBasicInfoStep = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Basic Information</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter your business name"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location Type <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {locationTypes.map((type) => (
            <button
              key={type.id}
              type="button"
              className={`px-4 py-2 rounded-full border ${
                formData.locationType === type.id 
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-medium' 
                  : 'border-gray-300 text-gray-700'
              }`}
              onClick={() => handleInputChange('locationType', type.id)}
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md h-24 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe your business..."
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image URL
        </label>
        <div className="flex">
          <input
            type="text"
            className="flex-1 p-3 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={formData.image_url}
            onChange={(e) => handleInputChange('image_url', e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          <button 
            type="button"
            className="bg-indigo-50 text-indigo-700 px-4 py-2 border border-indigo-200 rounded-r-md flex items-center"
          >
            <Camera size={16} className="mr-2" />
            Upload
          </button>
        </div>
      </div>

      <button 
        className={`mt-4 w-full flex items-center justify-center py-2 px-4 rounded-md ${
          !formData.name || !formData.locationType 
            ? 'bg-indigo-300 text-white cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
        }`} 
        disabled={!formData.name || !formData.locationType}
        onClick={() => setStep(2)}
      >
        <span className="mr-2">Next: Location Details</span>
        <ArrowRight size={16} />
      </button>
    </div>
  );

  const renderLocationDetailsStep = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Location Details</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin size={16} className="text-gray-500" />
          </div>
          <input
            type="text"
            className="w-full pl-10 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Full street address"
          />
        </div>
      </div>
      
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Latitude
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={formData.latitude}
            onChange={(e) => handleInputChange('latitude', e.target.value)}
            placeholder="e.g. 40.7128"
          />
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Longitude
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={formData.longitude}
            onChange={(e) => handleInputChange('longitude', e.target.value)}
            placeholder="e.g. -74.0060"
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Opening Hours
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Clock size={16} className="text-gray-500" />
          </div>
          <input
            type="text"
            className="w-full pl-10 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={formData.opening_hours}
            onChange={(e) => handleInputChange('opening_hours', e.target.value)}
            placeholder="e.g. Mon-Fri: 9am-5pm, Sat: 10am-3pm"
          />
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button 
          className="py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
          onClick={() => setStep(1)}
        >
          <div className="flex items-center">
            <ArrowLeft size={16} className="mr-2" />
            <span>Previous</span>
          </div>
        </button>
        
        <button 
          className={`flex items-center justify-center py-2 px-4 rounded-md ${
            !formData.address
              ? 'bg-indigo-300 text-white cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
          disabled={!formData.address}
          onClick={() => setStep(3)}
        >
          <span className="mr-2">Next: Contact Info</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );

  const renderContactInfoStep = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Contact Information</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail size={16} className="text-gray-500" />
          </div>
          <input
            type="email"
            className="w-full pl-10 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="your@email.com"
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone size={16} className="text-gray-500" />
          </div>
          <input
            type="tel"
            className="w-full pl-10 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={formData.phone_number}
            onChange={(e) => handleInputChange('phone_number', e.target.value)}
            placeholder="+1 (123) 456-7890"
          />
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button 
          className="py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
          onClick={() => setStep(2)}
        >
          <div className="flex items-center">
            <ArrowLeft size={16} className="mr-2" />
            <span>Previous</span>
          </div>
        </button>
        
        <button 
          className={`flex items-center justify-center py-2 px-4 rounded-md ${
            !formData.email || !formData.phone_number
              ? 'bg-indigo-300 text-white cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
          disabled={!formData.email || !formData.phone_number}
          onClick={() => setStep(4)}
        >
          <span className="mr-2">Next: Sustainability</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );

  const renderSustainabilityStep = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Sustainability & Capabilities</h2>
      <p className="text-sm text-gray-500 mb-4">Select all capabilities that apply to your location</p>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {capabilities.map((capability) => (
          <button
            key={capability.id}
            type="button"
            className={`px-4 py-2 rounded-full border ${
              formData.capabilities.includes(capability.id) 
                ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-medium' 
                : 'border-gray-300 text-gray-700'
            }`}
            onClick={() => toggleCapability(capability.id)}
          >
            {capability.name}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button 
          className="py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
          onClick={() => setStep(3)}
        >
          <div className="flex items-center">
            <ArrowLeft size={16} className="mr-2" />
            <span>Previous</span>
          </div>
        </button>
        
        <button 
          className={`py-2 px-6 rounded-md bg-green-600 hover:bg-green-700 text-white ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`} 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Location'}
        </button>
      </div>
    </div>
  );

  const renderSuccessMessage = () => (
    <div className="bg-white rounded-lg shadow-sm p-8 mb-4 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full text-green-500 flex items-center justify-center mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-green-700 mb-2">Submission Successful!</h2>
      <p className="text-gray-600 mb-6">
        Thank you for submitting your location. Our team will review your submission and get back to you shortly.
      </p>
      <button 
        className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-md"
        onClick={() => setSubmitSuccess(false)}
      >
        Submit Another Location
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-indigo-600 rounded-t-lg p-6 mb-4">
          <h1 className="text-2xl font-bold text-white mb-2">Submit Your Location</h1>
          <p className="text-indigo-200">Join our network of sustainable businesses</p>
        </div>
        
        {!submitSuccess ? (
          <div>
            <div className="mb-6 px-4">
              <div className="flex items-center justify-between">
                {[1, 2, 3, 4].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      ${step >= stepNumber ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}
                      font-medium text-sm
                    `}>
                      {stepNumber}
                    </div>
                    {stepNumber < 4 && (
                      <div className={`
                        w-12 h-1 ${step > stepNumber ? 'bg-indigo-600' : 'bg-gray-200'}
                      `}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {step === 1 && renderBasicInfoStep()}
            {step === 2 && renderLocationDetailsStep()}
            {step === 3 && renderContactInfoStep()}
            {step === 4 && renderSustainabilityStep()}
          </div>
        ) : (
          renderSuccessMessage()
        )}
      </div>
    </div>
  );
};

export default UserDashboard;