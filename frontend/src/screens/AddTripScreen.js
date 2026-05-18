import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, Alert, ActivityIndicator, Platform, KeyboardAvoidingView } from 'react-native';
import { ChevronLeft, Camera, MapPin, Calendar, Users, PlaneTakeoff, Plus, X, Check, Search, ChevronDown, RefreshCcw } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const SPLIT_METHODS = ['Equal Split', 'Percentage Split', 'Custom Split'];
const TRIP_TYPES = [
  { id: 'solo', name: 'Solo Trip', icon: '👤' },
  { id: 'couple', name: 'Couple', icon: '❤️' },
  { id: 'friends', name: 'Friends', icon: '👥' },
  { id: 'colleagues', name: 'Colleagues', icon: '💼' }
];

const INDIA_DATA = {
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Tirupati', 'Kurnool', 'Kakinada', 'Rajahmundry', 'Kadapa', 'Anantapur'],
  'Arunachal Pradesh': ['Itanagar', 'Tawang', 'Ziro', 'Pasighat', 'Roing', 'Bomdila'],
  'Assam': ['Guwahati', 'Dibrugarh', 'Silchar', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Arrah', 'Begusarai'],
  'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Rajnandgaon', 'Jagdalpur'],
  'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'Calangute', 'Baga', 'Anjuna', 'Palolem'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Anand'],
  'Haryana': ['Faridabad', 'Gurgaon', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar', 'Karnal'],
  'Himachal Pradesh': ['Shimla', 'Manali', 'Dharamshala', 'Solan', 'Mandi', 'Palampur', 'Kullu', 'Dalhousie', 'Kasol'],
  'Jharkhand': ['Jamshedpur', 'Ranchi', 'Dhanbad', 'Bokaro', 'Deoghar', 'Phusro', 'Hazaribagh'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli-Dharwad', 'Mangalore', 'Belgaum', 'Gulbarga', 'Davanagere', 'Bellary', 'Shimoga', 'Coorg', 'Hampi', 'Gokarna'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Malappuram', 'Kannur', 'Kollam', 'Alappuzha', 'Palakkad', 'Munnar', 'Wayanad', 'Varkala'],
  'Madhya Pradesh': ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Pachmarhi'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Pimpri-Chinchwad', 'Nashik', 'Kalyan-Dombivli', 'Vasai-Virar', 'Aurangabad', 'Navi Mumbai', 'Lonavala', 'Mahabaleshwar'],
  'Manipur': ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur'],
  'Meghalaya': ['Shilling', 'Tura', 'Jowai', 'Cherrapunji'],
  'Mizoram': ['Aizawl', 'Lunglei', 'Saiha'],
  'Nagaland': ['Dimapur', 'Kohima', 'Mokokchung', 'Tuensang'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 'Balasore'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Pathankot'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bhilwara', 'Alwar', 'Bharatpur', 'Jaisalmer', 'Pushkar', 'Mount Abu'],
  'Sikkim': ['Gangtok', 'Namchi', 'Geyzing', 'Mangan', 'Pelling', 'Lachung'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Tiruppur', 'Erode', 'Vellore', 'Thoothukudi', 'Nagercoil', 'Thanjavur', 'Ooty', 'Kodaikanal', 'Rameshwaram', 'Kanyakumari', 'Mahabalipuram'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Ramagundam', 'Khammam', 'Mahbubnagar'],
  'Tripura': ['Agartala', 'Udaipur', 'Dharmanagar'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Meerut', 'Varanasi', 'Prayagraj', 'Bareilly', 'Aligarh', 'Moradabad', 'Noida', 'Ayodhya', 'Mathura'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Kashipur', 'Rishikesh', 'Mussoorie', 'Nainital', 'Auli'],
  'West Bengal': ['Kolkata', 'Howrah', 'Asansol', 'Siliguri', 'Durgapur', 'Bardhaman', 'Malda', 'Baharampur', 'Darjeeling', 'Digha'],
  'Andaman and Nicobar': ['Port Blair', 'Havelock Island', 'Neil Island'],
  'Chandigarh': ['Chandigarh'],
  'Delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'Old Delhi'],
  'Jammu and Kashmir': ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Gulmarg', 'Pahalgam', 'Sonamarg'],
  'Ladakh': ['Leh', 'Kargil', 'Nubra Valley', 'Pangong Lake'],
  'Lakadweep': ['Kavaratti', 'Agatti', 'Minicoy'],
  'Puducherry': ['Puducherry', 'Karaikal', 'Mahe', 'Yanam', 'Auroville']
};

const STATES_LIST = Object.keys(INDIA_DATA).sort();

const AddTripScreen = ({ route, navigation }) => {
  const tripId = route?.params?.tripId;
  const isEditMode = !!tripId;

  const [tripType, setTripType] = useState('solo');
  const [tripName, setTripName] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000));
  const [selectedState, setSelectedState] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [destImage, setDestImage] = useState('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80');
  const [budget, setBudget] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [members, setMembers] = useState([]);
  const [splitMethod, setSplitMethod] = useState('Equal Split');
  const [notes, setNotes] = useState('');
  
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showPlaceSuggestions, setShowPlaceSuggestions] = useState(false);
  const [showSplitDropdown, setShowSplitDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingImage, setFetchingImage] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchTripDetails = async () => {
        try {
          const token = await SecureStore.getItemAsync('userToken');
          const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/trips/${tripId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data.success) {
            const tripData = response.data.data;
            setTripName(tripData.tripName);
            setTripType(tripData.tripType || 'solo');
            setStartDate(new Date(tripData.startDate));
            setEndDate(new Date(tripData.endDate));
            setSelectedState(tripData.state || '');
            setSelectedDestination(tripData.destination || '');
            setDestImage(tripData.image);
            setBudget(tripData.budget.toString());
            setMembers(tripData.members.map(m => m.email));
            setSplitMethod(tripData.splitMethod || 'Equal Split');
            setNotes(tripData.notes || '');
          }
        } catch (error) {
          console.log('Error loading trip details for edit:', error);
        }
      };
      fetchTripDetails();
    }
  }, [tripId]);

  const fetchDestinationImage = async (place) => {
    if (!place) return;
    setFetchingImage(true);
    try {
      const randomId = Math.floor(Math.random() * 1000);
      setDestImage(`https://loremflickr.com/1200/600/${encodeURIComponent(place)}?lock=${randomId}`);
    } catch (error) {
      console.log('Error setting image');
    } finally {
      setFetchingImage(false);
    }
  };

  const onStartChange = (event, selectedDate) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDate(selectedDate);
      if (selectedDate > endDate) {
        setEndDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000));
      }
    }
  };

  const onEndChange = (event, selectedDate) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (selectedDate) {
      if (selectedDate < startDate) {
        Alert.alert('Invalid Date', 'End date cannot be before start date');
      } else {
        setEndDate(selectedDate);
      }
    }
  };

  const addMember = () => {
    if (!memberEmail || !memberEmail.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }
    if (members.includes(memberEmail)) {
      Alert.alert('Error', 'Member already added');
      return;
    }
    setMembers([...members, memberEmail]);
    setMemberEmail('');
  };

  const removeMember = (email) => {
    setMembers(members.filter(m => m !== email));
  };

  const handleCreateTrip = async () => {
    if (!tripName) {
      Alert.alert('Error', 'Please enter a Trip Name');
      return;
    }

    // Auto-capture invite email if typed but not added via "+" button
    let finalMembers = [...members];
    if (memberEmail && memberEmail.trim().includes('@') && !finalMembers.includes(memberEmail.trim())) {
      finalMembers.push(memberEmail.trim());
    }

    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const payload = {
        tripName,
        tripType,
        startDate,
        endDate,
        state: selectedState || '',
        destination: selectedDestination || '',
        image: destImage,
        budget: budget ? parseFloat(budget) : 0,
        members: tripType === 'solo' ? [] : finalMembers,
        splitMethod: tripType === 'solo' ? 'Equal Split' : splitMethod,
        notes
      };

      const url = isEditMode 
        ? `${process.env.EXPO_PUBLIC_API_URL}/trips/${tripId}`
        : `${process.env.EXPO_PUBLIC_API_URL}/trips`;

      const response = isEditMode
        ? await axios.put(url, payload, { headers: { Authorization: `Bearer ${token}` } })
        : await axios.post(url, payload, { headers: { Authorization: `Bearer ${token}` } });

      if (response.data.success) {
        Alert.alert(
          'Success', 
          isEditMode ? 'Trip updated successfully!' : 'Trip created successfully!', 
          [
            { text: 'OK', onPress: () => navigation.navigate('Main', { screen: 'Trips' }) }
          ]
        );
      }
    } catch (error) {
      console.log('Error saving trip:', error);
      Alert.alert('Error', isEditMode ? 'Failed to update trip' : 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  const [stateSearch, setStateSearch] = useState('');
  const filteredStates = STATES_LIST.filter(s => s.toLowerCase().includes(stateSearch.toLowerCase()));

  const citiesList = selectedState ? INDIA_DATA[selectedState] : [];
  const filteredPlaces = citiesList.filter(p => p.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#F8F9FF]"
    >
      <View className="px-6 pt-14 pb-4 bg-white flex-row items-center border-b border-[#F0F2FA] z-50">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
          <X size={24} color="#2E3A9D" />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-lg ml-2">{isEditMode ? 'Edit Trip Details' : 'Create New Trip'}</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View className="relative h-64 w-full bg-[#E8EBF8]">
           <Image 
             source={{ uri: destImage }} 
             className="w-full h-full"
             resizeMode="cover"
           />
           {fetchingImage && (
             <View className="absolute inset-0 bg-black/20 items-center justify-center">
                <ActivityIndicator color="white" />
             </View>
           )}
           <View className="absolute bottom-4 right-4">
              <TouchableOpacity 
                onPress={() => selectedDestination && fetchDestinationImage(selectedDestination)}
                className="bg-white/90 p-3 rounded-full shadow-lg"
                disabled={!selectedDestination}
                style={{ opacity: selectedDestination ? 1 : 0.5 }}
              >
                 <RefreshCcw size={20} color="#2E3A9D" /> 
              </TouchableOpacity>
           </View>
        </View>

        <View className="p-6">
          {/* Trip Type Selector */}
          <View className="mb-8">
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-4">Trip Type</Text>
            <View className="flex-row justify-between">
              {TRIP_TYPES.map((type) => (
                <TouchableOpacity 
                  key={type.id}
                  onPress={() => setTripType(type.id)}
                  className={`items-center justify-center rounded-3xl p-3 w-[22%] border-2 ${tripType === type.id ? 'bg-[#2E3A9D] border-[#2E3A9D]' : 'bg-white border-[#F0F2FA]'}`}
                  style={{ height: 80 }}
                >
                  <Text className="text-2xl mb-1">{type.icon}</Text>
                  <Text 
                    style={{ fontFamily: 'Poppins-Bold' }} 
                    className={`text-[8px] text-center ${tripType === type.id ? 'text-white' : 'text-[#8A94A6]'}`}
                  >
                    {type.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View className="mb-6">
             <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-2">Trip Name</Text>
             <View className="bg-white border border-[#E0E4F5] rounded-2xl px-4 py-4 shadow-sm">
                <TextInput 
                  placeholder="e.g., Kerala Friends Trip" 
                  className="text-[#1A1A1A] text-base" 
                  style={{ fontFamily: 'Poppins-SemiBold' }}
                  value={tripName}
                  onChangeText={setTripName}
                />
             </View>
          </View>

          <View className="flex-row justify-between mb-6">
             <TouchableOpacity style={{ width: '48%' }} onPress={() => setShowStartPicker(true)}>
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-2">Start Date</Text>
                <View className="flex-row items-center bg-white border border-[#E0E4F5] rounded-2xl px-4 py-3 shadow-sm">
                   <Calendar size={16} color="#2E3A9D" />
                   <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="ml-2 text-[#2E3A9D] text-xs">
                     {startDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                   </Text>
                </View>
             </TouchableOpacity>
             <TouchableOpacity style={{ width: '48%' }} onPress={() => setShowEndPicker(true)}>
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-2">End Date</Text>
                <View className="flex-row items-center bg-white border border-[#E0E4F5] rounded-2xl px-4 py-3 shadow-sm">
                   <Calendar size={16} color="#2E3A9D" />
                   <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="ml-2 text-[#2E3A9D] text-xs">
                     {endDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                   </Text>
                </View>
             </TouchableOpacity>
          </View>

          {showStartPicker && <DateTimePicker value={startDate} mode="date" onChange={onStartChange} />}
          {showEndPicker && <DateTimePicker value={endDate} mode="date" minimumDate={startDate} onChange={onEndChange} />}

          <View className="mb-6 z-40">
             <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-2">Select State</Text>
             <TouchableOpacity 
               onPress={() => setShowStateDropdown(!showStateDropdown)}
               className="bg-white border border-[#E0E4F5] rounded-2xl px-4 py-4 shadow-sm flex-row justify-between items-center"
             >
                <Text style={{ fontFamily: 'Poppins-SemiBold' }} className={selectedState ? "text-[#1A1A1A]" : "text-[#D0D5DD]"}>
                  {selectedState || 'Choose State'}
                </Text>
                <ChevronDown size={20} color="#2E3A9D" />
             </TouchableOpacity>
             
             {showStateDropdown && (
               <View className="bg-white border border-[#F0F2FA] rounded-2xl mt-2 overflow-hidden shadow-xl max-h-64">
                 <View className="p-2 border-b border-[#F8F9FF]">
                    <TextInput 
                      placeholder="Search state..."
                      className="bg-[#F8F9FF] px-4 py-2 rounded-xl text-sm"
                      style={{ fontFamily: 'Poppins-Medium' }}
                      value={stateSearch}
                      onChangeText={setStateSearch}
                    />
                 </View>
                 <ScrollView nestedScrollEnabled={true}>
                   {filteredStates.map(state => (
                     <TouchableOpacity 
                       key={state} 
                       onPress={() => {
                         setSelectedState(state);
                         setShowStateDropdown(false);
                         setSelectedDestination('');
                         setSearchQuery('');
                         setStateSearch('');
                       }}
                       className="px-4 py-3 border-b border-[#F8F9FF] active:bg-blue-50"
                     >
                       <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-[#444B59]">{state}</Text>
                     </TouchableOpacity>
                   ))}
                   {filteredStates.length === 0 && (
                     <View className="p-4 items-center">
                        <Text className="text-[#8A94A6] text-xs italic">No state found</Text>
                     </View>
                   )}
                 </ScrollView>
               </View>
             )}
          </View>

          <View className="mb-6 z-30">
             <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-2">Destination</Text>
             <TouchableOpacity 
               onPress={() => selectedState && setShowPlaceSuggestions(!showPlaceSuggestions)}
               className={`bg-white border border-[#E0E4F5] rounded-2xl px-4 py-4 shadow-sm flex-row justify-between items-center ${!selectedState && 'opacity-50'}`}
               disabled={!selectedState}
             >
                <View className="flex-row items-center">
                  <MapPin size={18} color="#2E3A9D" className="mr-2" />
                  <Text style={{ fontFamily: 'Poppins-SemiBold' }} className={selectedDestination ? "text-[#1A1A1A]" : "text-[#D0D5DD]"}>
                    {selectedDestination || (selectedState ? `Choose city in ${selectedState}` : 'Select a state first')}
                  </Text>
                </View>
                <ChevronDown size={20} color="#2E3A9D" />
             </TouchableOpacity>

             {showPlaceSuggestions && selectedState && (
               <View className="bg-white border border-[#F0F2FA] rounded-2xl mt-2 overflow-hidden shadow-xl max-h-64">
                 <View className="p-2 border-b border-[#F8F9FF]">
                    <TextInput 
                      placeholder="Search city..."
                      className="bg-[#F8F9FF] px-4 py-2 rounded-xl text-sm"
                      style={{ fontFamily: 'Poppins-Medium' }}
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      autoFocus={true}
                    />
                 </View>
                 <ScrollView nestedScrollEnabled={true}>
                   {filteredPlaces.length > 0 ? filteredPlaces.map(place => (
                     <TouchableOpacity 
                       key={place} 
                       onPress={() => {
                         setSelectedDestination(place);
                         setShowPlaceSuggestions(false);
                         setSearchQuery('');
                         fetchDestinationImage(place);
                       }}
                       className="px-4 py-3 border-b border-[#F8F9FF] flex-row items-center"
                     >
                       <MapPin size={14} color="#2E3A9D" className="mr-3" />
                       <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-[#444B59]">{place}</Text>
                     </TouchableOpacity>
                   )) : searchQuery.length > 0 ? (
                     <TouchableOpacity 
                       onPress={() => {
                         setSelectedDestination(searchQuery);
                         setShowPlaceSuggestions(false);
                         setSearchQuery('');
                         fetchDestinationImage(searchQuery);
                       }}
                       className="px-4 py-3 flex-row items-center bg-blue-50"
                     >
                       <Plus size={14} color="#2E3A9D" className="mr-3" />
                       <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#2E3A9D]">Add "{searchQuery}"</Text>
                     </TouchableOpacity>
                   ) : (
                     <View className="p-4 items-center">
                        <Text className="text-[#8A94A6] text-xs italic">No matching cities found</Text>
                     </View>
                   )}
                 </ScrollView>
               </View>
             )}
          </View>

          <View className="mb-8">
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-2">Total Budget</Text>
            <View className="bg-white border border-[#E0E4F5] rounded-2xl px-4 py-4 shadow-sm flex-row items-center">
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-lg mr-2">₹</Text>
                <TextInput 
                  placeholder="50000" 
                  keyboardType="numeric" 
                  className="flex-1 text-[#1A1A1A] text-lg" 
                  style={{ fontFamily: 'Poppins-Bold' }}
                  value={budget}
                  onChangeText={setBudget}
                />
            </View>
          </View>

          {tripType !== 'solo' && (
            <View className="mb-8">
               <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-lg mb-4">Trip Members ({members.length + 1})</Text>
               <View className="flex-row mb-4">
                  <View className="flex-1 bg-white border border-[#E0E4F5] rounded-2xl px-4 py-3 flex-row items-center shadow-sm">
                     <Users size={18} color="#8A94A6" />
                     <TextInput 
                       placeholder="Enter email to invite" 
                       className="flex-1 ml-3 text-xs" 
                       style={{ fontFamily: 'Poppins-Regular' }}
                       value={memberEmail}
                       onChangeText={setMemberEmail}
                       autoCapitalize="none"
                     />
                  </View>
                  <TouchableOpacity onPress={addMember} className="bg-[#2E3A9D] w-12 h-12 rounded-2xl items-center justify-center ml-3 shadow-lg shadow-blue-500/30">
                     <Plus size={24} color="white" />
                  </TouchableOpacity>
               </View>
               <View className="flex-row flex-wrap">
                  <View className="bg-[#E8F5E9] border border-[#4CAF50] px-4 py-2 rounded-full mr-2 mb-2 flex-row items-center">
                     <Check size={12} color="#4CAF50" className="mr-2" />
                     <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#4CAF50] text-[10px]">You (Admin)</Text>
                  </View>
                  {members.map(email => (
                    <View key={email} className="bg-white border border-[#F0F2FA] px-4 py-2 rounded-full mr-2 mb-2 flex-row items-center shadow-sm">
                       <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#444B59] text-[10px] mr-2">{email}</Text>
                       <TouchableOpacity onPress={() => removeMember(email)}>
                          <X size={12} color="#FF5252" />
                       </TouchableOpacity>
                    </View>
                  ))}
               </View>
            </View>
          )}

          {tripType !== 'solo' && (
            <View className="mb-8 z-20">
               <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-2">Default Split Method</Text>
               <TouchableOpacity 
                 onPress={() => setShowSplitDropdown(!showSplitDropdown)}
                 className="bg-white border border-[#E0E4F5] rounded-2xl px-4 py-4 shadow-sm flex-row justify-between items-center"
               >
                  <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#1A1A1A]">{splitMethod}</Text>
                  <ChevronDown size={20} color="#2E3A9D" />
               </TouchableOpacity>
               {showSplitDropdown && (
                 <View className="bg-white border border-[#F0F2FA] rounded-2xl mt-2 overflow-hidden shadow-xl">
                   {SPLIT_METHODS.map(method => (
                     <TouchableOpacity key={method} onPress={() => { setSplitMethod(method); setShowSplitDropdown(false); }} className="px-4 py-3 border-b border-[#F8F9FF]">
                       <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-[#444B59]">{method}</Text>
                     </TouchableOpacity>
                   ))}
                 </View>
               )}
            </View>
          )}

          <View className="mb-10">
             <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-2">Trip Notes (Optional)</Text>
             <View className="bg-white border border-[#E0E4F5] rounded-2xl px-4 py-4 shadow-sm h-32">
                <TextInput 
                  placeholder="e.g., Family vacation trip to Munnar..." 
                  multiline textAlignVertical="top"
                  className="flex-1 text-[#1A1A1A] text-sm" 
                  style={{ fontFamily: 'Poppins-Regular' }}
                  value={notes} onChangeText={setNotes}
                />
             </View>
          </View>

          <TouchableOpacity 
            onPress={handleCreateTrip} disabled={loading}
            className="bg-[#2E3A9D] py-5 rounded-[24px] flex-row items-center justify-center shadow-lg shadow-blue-500/50 mb-10"
          >
             {loading ? <ActivityIndicator color="white" /> : <><Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-lg mr-2">{isEditMode ? 'Save Changes' : 'Create Trip'}</Text><PlaneTakeoff size={20} color="white" /></>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddTripScreen;
