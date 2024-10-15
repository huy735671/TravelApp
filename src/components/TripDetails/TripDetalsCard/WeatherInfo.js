import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const WeatherInfo = ({ location }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_KEY = 'A2WFR5fmAdHtpOUArrgCsn7dMILmAo0z'; // Thay bằng API key của bạn

  useEffect(() => {
    const fetchLocationKey = async () => {
        try {
          const locationResponse = await axios.get(`http://dataservice.accuweather.com/locations/v1/cities/search`, {
            params: {
              apikey: API_KEY,
              q: 'Phu Yen' // Hoặc tên khác
            },
          });
          
          console.log('Location Response:', locationResponse.data); // Kiểm tra phản hồi
      
          if (locationResponse.data.length === 0) {
            console.error('No location found for:', location);
            return; // Ngừng nếu không tìm thấy địa điểm
          }
      
          const locationKey = locationResponse.data[0].Key; // Lấy location key từ phản hồi
          console.log('Location Key:', locationKey); // Xem location key
      
          // Sau khi có locationKey, lấy thông tin thời tiết
          const weatherResponse = await axios.get(`http://dataservice.accuweather.com/currentconditions/v1/${locationKey}`, {
            params: {
              apikey: API_KEY,
            },
          });
      
          setWeatherData(weatherResponse.data[0]); // Lưu dữ liệu thời tiết vào state
        } catch (error) {
          console.error('Error fetching weather data:', error);
        } finally {
          setLoading(false);
        }
      };
      
      

    fetchLocationKey();
  }, [location]);

  if (loading) {
    return <ActivityIndicator size="small" color="#0000ff" />;
  }

  if (!weatherData) {
    return <Text>Error fetching weather data</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thời tiết hiện tại</Text>
      <Text style={styles.temperature}>{weatherData.Temperature.Metric.Value}°C</Text>
      <Text style={styles.condition}>{weatherData.WeatherText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  temperature: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'blue',
  },
  condition: {
    fontSize: 18,
    color: 'gray',
  },
});

export default WeatherInfo;
