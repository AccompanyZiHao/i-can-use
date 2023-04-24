export const formParams = (data: object): object => {
  let obj = {};
  if (!data) return {};
  Object.entries(data).forEach(([k, v]) => {
    if (!(v === undefined || v == 'null' || v === '')) {
      obj[k] = v;
    }
  });
  return obj;
};

export const dateFormat = function (timestamp, formatsType = 1) {
  if (!timestamp) {
    return '';
  }
  // formats格式包括
  let formats = {
    1: 'Y-m-d',
    2: 'Y-m-d H:i:s',
    3: 'Y年m月d日',
    4: 'Y年m月d日 H时i分',
  }[formatsType];

  const zero = (value) => {
    if (value < 10) {
      return '0' + value;
    }
    return value;
  };

  let myDate = timestamp ? new Date(timestamp) : new Date();

  let year = myDate.getFullYear();
  let month = zero(myDate.getMonth() + 1);
  let day = zero(myDate.getDate());

  let hour = zero(myDate.getHours());
  let minite = zero(myDate.getMinutes());
  let second = zero(myDate.getSeconds());

  return formats.replace(/Y|m|d|H|i|s/gi, function (matches) {
    return {
      Y: year,
      m: month,
      d: day,
      H: hour,
      i: minite,
      s: second,
    }[matches];
  });
};
