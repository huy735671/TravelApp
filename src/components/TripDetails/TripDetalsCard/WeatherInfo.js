import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView } from 'react-native';
import axios from 'axios';
import { colors, sizes, spacing } from '../../../constants/theme';

const API_KEY = 'A2WFR5fmAdHtpOUArrgCsn7dMILmAo0z';

const WeatherInfo = ({ location }) => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); // Thêm biến để kiểm tra lỗi

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
    "Windy": "Gió"
    
    // Thêm các điều kiện thời tiết khác vào đây nếu cần
  };
  

  // Hàm chuyển đổi tiếng Việt có dấu thành không dấu
  const removeAccents = (str) => {
    return str
      .normalize('NFD') // Phân tách ký tự gốc và dấu
      .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu
      .replace(/đ/g, 'd') // Thay thế "đ" thành "d"
      .replace(/Đ/g, 'D'); // Thay thế "Đ" thành "D"
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        // Sử dụng hàm removeAccents để chuyển địa điểm thành không dấu
        const locationWithoutAccents = removeAccents(location);
        console.log("Địa điểm sau khi chuyển đổi sang không dấu:", locationWithoutAccents);

        const locationResponse = await axios.get(`http://dataservice.accuweather.com/locations/v1/cities/search`, 
          {
          params: {
            apikey: API_KEY,
            q: locationWithoutAccents,
          },
        });

        if (locationResponse.data.length === 0) {
          setError(true); // Thiết lập trạng thái lỗi nếu không tìm thấy vị trí
          setLoading(false);
          return;
        }

        const locationKey = locationResponse.data[0].Key;

        const weatherResponse = await axios.get(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}`, {
          params: {
            apikey: API_KEY,
            metric: true,
          },
        });

        const formattedData = weatherResponse.data.DailyForecasts.slice(0, 5).map((day) => ({
          date: new Date(day.Date).toLocaleDateString('vi-VN'),
          temperature: `${day.Temperature.Minimum.Value}°C - ${day.Temperature.Maximum.Value}°C`,
          condition: weatherConditionsInVietnamese[day.Day.IconPhrase] || day.Day.IconPhrase,
          icon: day.Day.Icon,
        }));

        setWeatherData(formattedData);
      } catch (error) {
        setError(true); // Thiết lập trạng thái lỗi nếu xảy ra lỗi
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [location]);

  // Nếu đang tải hoặc có lỗi, không hiển thị gì hết
  if (loading || error) {
    return null; // Trả về null để ẩn toàn bộ nội dung khi đang tải hoặc có lỗi
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thời tiết vài ngày tới</Text>
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
  title: {
    fontSize: sizes.h3,
    marginBottom: spacing.s,
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
});

export default WeatherInfo;
