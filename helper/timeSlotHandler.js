var moment = require("moment");

// run time genaration for time slots based on the start time & end time
const generateTimeSlots = (slot) => {
  //Format the time
  let startTime = moment(slot.startTime, "HH:mm");
  //Format the end time and the next day to it
  let endTime = moment(slot.endTime, "HH:mm");
  //Times
  let allTimes = [];
  //Loop over the times - only pushes time with 30 minutes interval
  while (startTime <= endTime) {
    //Push times
    allTimes.push(startTime.format("HH:mm"));
    //Add interval of 30 minutes
    startTime.add(slot.slotInterval, "minutes");
  }
  return pairsTwoTimes(allTimes);
};

// pair two times in a single object handler
const pairsTwoTimes = (allTimes) => {
  let allTimesAvaliable = [];
  allTimes.map((n, i, arr) => {
    allTimesAvaliable.push(n);
    if (i % 2 !== 0) {
      allTimesAvaliable.push(n);
    }
  });
  return allTimesAvaliable.map((n, i, arr) => {
    return { id: i + 1, start: n, end: arr[i + 1] };
  });
};

module.exports.generateTimeSlots = generateTimeSlots;
module.exports.pairsTwoTimes = pairsTwoTimes;
