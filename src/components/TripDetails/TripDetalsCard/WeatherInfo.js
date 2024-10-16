import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView } from 'react-native';
import axios from 'axios';
import { colors, sizes, spacing } from '../../../constants/theme';

const ACCUWEATHER_API_KEY = 'A2WFR5fmAdHtpOUArrgCsn7dMILmAo0z';
const OPENWEATHER_API_KEY = '250539e4cd01a8b4181cffa0760a6e51'; // Thay thế bằng API Key của bạn

const WeatherInfo = ({ location }) => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const weatherConditionsInVietnamese = {
    "Sunny": "Nắng",
    "Mostly Sunny": "Chủ yếu nắng",
    "Partly Sunny": "Nắng nhẹ",
    "Intermittent Clouds": "Nhiều mây gián đoạn",
    "Hazy Sunshine": "Nắng mờ",
    "Mostly Cloudy": "Chủ yếu nhiều mây",
    "Cloudy": "Nhiều mây",
    "Dreary (Overcast)": "U ám (Mây phủ)",
    "Fog": "Sương mù",
    "Showers": "Mưa rào",
    "Mostly Cloudy w/ Showers": "Chủ yếu nhiều mây với mưa rào",
    "Partly Sunny w/ Showers": "Nắng nhẹ với mưa rào",
    "Thunderstorms": "Giông bão",
    "Mostly Cloudy w/ T-Storms": "Chủ yếu nhiều mây với giông bão",
    "Partly Sunny w/ T-Storms": "Nắng nhẹ với giông bão",
    "Rain": "Mưa",
    "Flurries": "Tuyết rơi nhẹ",
    "Mostly Cloudy w/ Flurries": "Chủ yếu nhiều mây với tuyết rơi nhẹ",
    "Partly Sunny w/ Flurries": "Nắng nhẹ với tuyết rơi nhẹ",
    "Snow": "Tuyết",
    "Mostly Cloudy w/ Snow": "Chủ yếu nhiều mây với tuyết",
    "Ice": "Đá",
    "Sleet": "Mưa đá",
    "Freezing Rain": "Mưa đóng băng",
    "Rain and Snow": "Mưa và tuyết",
    "Cold": "Lạnh",
    "Clear": "Quang đãng",
    "Mostly Clear": "Chủ yếu quang đãng",
    "Partly Cloudy": "Ít mây",
    "Hazy Moonlight": "Ánh trăng mờ",
    "Partly Cloudy w/ Showers": "Ít mây với mưa rào",
    "Mostly Cloudy w/ Showers": "Chủ yếu nhiều mây với mưa rào",
    "Partly Cloudy w/ T-Storms": "Ít mây với giông bão",
    "Mostly Cloudy w/ T-Storms": "Chủ yếu nhiều mây với giông bão",
    "Mostly cloudy w/ showers" : "Nhiều mây và có mưa rào",
    "Mostly Cloudy": "Chủ yếu nhiều mây",
    "Partly Cloudy w/ Flurries": "Ít mây với tuyết rơi nhẹ",
    "Mostly Cloudy w/ Flurries": "Chủ yếu nhiều mây với tuyết rơi nhẹ",
    "Partly sunny w/ t-storms" : "Nắng nhẹ và có bão",
    "Windy": "Gió",
    "light rain": "mưa nhẹ",
    "clear sky": "Trời quang",
    "few clouds": "Ít mây",
    "scattered clouds": "Mây rải rác",
    "broken clouds": "Mây đục",
    "shower rain": "Mưa rào",
    "rain": "Mưa",
    "thunderstorm": "Giông bão",
    "snow": "Tuyết",
    "mist": "Sương mù",
    "haze": "Sương mù nhẹ",
    "fog": "Sương mù",
    "sand": "Cát",
    "dust": "Bụi",
    "ash": "Tro",
    "squall": "Cơn gió mạnh",
    "tornado": "Lốc xoáy",
    "overcast clouds": "Mây u ám",

    
    // Thêm các điều kiện thời tiết khác vào đây nếu cần
  };

  const removeAccents = (str) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  };

  useEffect(() => {
    // Phần mã không thay đổi
// Cập nhật mã trong fetchWeatherData
const fetchWeatherData = async () => {
  try {
    const locationWithoutAccents = removeAccents(location);
    
    // Gọi API AccuWeather
    const locationResponse = await axios.get(`https://dataservice.accuweather.com/locations/v1/cities/search`, {
      params: {
        apikey: ACCUWEATHER_API_KEY,
        q: locationWithoutAccents,
      },
    });

    if (locationResponse.data.length === 0) {
      throw new Error('Không tìm thấy vị trí');
    }

    const locationKey = locationResponse.data[0].Key;
    const weatherResponse = await axios.get(`https://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}`, {
      params: {
        apikey: ACCUWEATHER_API_KEY,
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
    // Nếu gặp lỗi, gọi API OpenWeather
    try {
      const openWeatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
        params: {
          q: location,
          appid: OPENWEATHER_API_KEY,
          units: 'metric',
        },
      });

      // Nhóm dữ liệu theo ngày
      const dailyData = {};
      openWeatherResponse.data.list.forEach((item) => {
        const date = new Date(item.dt * 1000).toLocaleDateString('vi-VN');
        if (!dailyData[date]) {
          dailyData[date] = {
            temperature: `${item.main.temp_min}°C - ${item.main.temp_max}°C`,
            condition: weatherConditionsInVietnamese[item.weather[0].description] || item.weather[0].description,
            icon: item.weather[0].icon,
          };
        }
      });

      const formattedData = Object.keys(dailyData).slice(0, 5).map((date) => ({
        date: date,
        temperature: dailyData[date].temperature,
        condition: dailyData[date].condition,
        icon: dailyData[date].icon,
      }));

      setWeatherData(formattedData);
    } catch (openWeatherError) {
      setError(true);
    }
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
    return <Text style={styles.errorText}>Tính lấy dữ liệu thời tiết nhưng không thành xu quá.</Text>;
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {weatherData.map((day, index) => (
          <View key={index} style={styles.weatherContainer}>
            <Text style={styles.date}>{day.date}</Text>
            <Image
              style={styles.icon}
              source={{ uri: `https://openweathermap.org/img/wn/${day.icon}@2x.png` }} // Đường dẫn icon từ OpenWeather
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
    backgroundColor: colors.light,
    borderRadius: 10,
    paddingHorizontal:20,
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
