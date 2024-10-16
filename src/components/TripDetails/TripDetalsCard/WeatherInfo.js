import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView } from 'react-native';
import axios from 'axios';
import { colors, sizes, spacing } from '../../../constants/theme';

const API_KEY = 'A2WFR5fmAdHtpOUArrgCsn7dMILmAo0z';

const WeatherInfo = ({ location }) => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); 

  const weatherConditionsInVietnamese = {
    // Bản đồ điều kiện thời tiết từ tiếng Anh sang tiếng Việt
    "Sunny": "Nắng",
    "Mostly Sunny": "Chủ yếu nắng",
    "Partly Sunny": "Nắng nhẹ",
    // Thêm các điều kiện khác
  };

  const removeAccents = (str) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const locationWithoutAccents = removeAccents(location);
        const locationResponse = await axios.get(`https://dataservice.accuweather.com/locations/v1/cities/search`, {
          params: {
            apikey: API_KEY,
            q: locationWithoutAccents,
          },
        });

        if (locationResponse.data.length === 0) {
          setError(true); 
          setLoading(false);
          return;
        }

        const locationKey = locationResponse.data[0].Key;
        const weatherResponse = await axios.get(`https://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}`, {
          params: {
            apikey: API_KEY,
            metric: true,
          },
        });

        const formattedData = weatherResponse.data.DailyForecasts.map((day) => ({
          date: new Date(day.Date).toLocaleDateString('vi-VN'),
          temperature: `${day.Temperature.Minimum.Value}°C - ${day.Temperature.Maximum.Value}°C`,
          condition: weatherConditionsInVietnamese[day.Day.IconPhrase] || day.Day.IconPhrase,
          icon: day.Day.Icon,
        }));

        setWeatherData(formattedData);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [location]);

  if (loading) {
    return <ActivityIndicator size="large" color={colors.primary} />;
  }

  if (error) {
    return <Text style={styles.errorText}>Không thể lấy dữ liệu thời tiết. Vui lòng thử lại.</Text>;
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {weatherData.map((day, index) => (
          <View key={index} style={styles.weatherContainer}>
            <Text style={styles.date}>{day.date}</Text>
            <Image
              style={styles.icon}
              source={{ uri: `https://developer.accuweather.com/sites/default/files/${String(day.icon).padStart(2, '0')}-s.png` }}
            />
            <Text style={styles.temperature}>{day.temperature}</Text>
            <Text style={styles.condition}>{day.condition}</Text>
          </View>
        ))} 
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.l,
    backgroundColor: colors.light,
    borderRadius: 10,
    marginTop: spacing.m,
  },
  weatherContainer: {
    alignItems: 'center',
    marginRight: spacing.m,
    padding: spacing.m,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    width: 300,
  },
  date: {
    fontSize: sizes.subtitle,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  temperature: {
    fontSize: sizes.title,
    fontWeight: 'bold',
    color: colors.green,
    marginBottom: spacing.xs,
  },
  condition: {
    fontSize: sizes.subtitle,
    color: colors.lightGray,
    textAlign: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: spacing.xs,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: spacing.m,
  },
});

export default WeatherInfo;
