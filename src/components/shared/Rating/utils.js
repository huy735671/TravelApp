export const getCorrectRating = rating => {
  // Trả về 0 nếu rating không phải là số hoặc là số âm
  return typeof rating === 'number' && rating >= 0 ? Math.floor(rating >= 2 ? rating / 2 : rating) : 0;
};


export const getFractionDigitsRating = rating => {
  // Kiểm tra nếu rating là số và không phải là NaN
  return typeof rating === 'number' ? rating.toFixed(1) : '0.0';
};

export const getRatingLabel = rating => {
  const reviews = ['Bad', 'Okay', 'Good', 'Very Good', 'Amazing'];
  // Kiểm tra xem rating có trong khoảng từ 1 đến 5 không
  return (rating >= 1 && rating <= 5) ? reviews[rating - 1] : 'No Rating';
};

