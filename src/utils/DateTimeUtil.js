import React from "react";
import { Alert, Text } from "react-native";

export const getLocalStartEndTimeStampFromUTCStartDate = (
  start_time,
  duration,
  id //need to be num
) => {
  const time_start = new Date(start_time);
  //   console.log("time_start id = ", id);
  //   console.log("start_time = ", start_time);
  //   console.log("time_start.toString() = ", time_start.toString());
  const time_end = new Date(time_start.getTime() + Number(duration) * 1000);
  const objTime = {
    time_start: formatAMPM(time_start),
    time_end: formatAMPM(time_end),
  };
  //console.log("objTime = ", JSON.stringify(objTime));
  return objTime;
  //console.log("time_start in date = ", time_start.toString());
  //console.log("time_start in am pm = ", formatAMPM(time_start));
};
export const getLocalTimeStampFromUTCDate = (utcDate) => {
  const tmpDate = new Date(utcDate);
  return formatAMPM(tmpDate);
};
export const getCurrentDateInGMT = () => {
  const crtDate = new Date();

  const crtDateUTC = crtDate.toUTCString();
  console.log("crtDateUTC = ", crtDateUTC);
  console.log("crtDateLocal = ", crtDate.toString());
  console.log("toISOString = ", crtDate.toISOString());
  console.log("toISOString split = ", crtDate.toISOString().split("T")[0]);

  return crtDate.toISOString().split("T")[0];
};

function formatAMPM(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  let strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}
export const convertToCustomFormat = (isoString) => {
  const date = new Date(isoString);
  const now = new Date();
  const daysDifference = Math.floor((now - date) / (365 * 60 * 60 * 24));

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  if (daysDifference === 0) {
    return `Today, ${formatTime(date)}`;
  } else if (daysDifference === 1) {
    return `Yesterday, ${formatTime(date)}`;
  } else {
    const options = { month: "long", day: "numeric", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    return `${formattedDate}, ${formatTime(date)}`;
  }
};
export const compareDateTimeStampWithCrtTime = (start_time) => {
  const time_start = new Date(start_time);
  return time_start > new Date();
};
export const addZeroToSingleDigitNum = (num) => {
  const numString = num.toString();
  if (numString.length > 1) {
    return numString;
  } else {
    return numString.padStart(2, "0");
  }
};
export const convertUTCDateTimeStampToDate = (utcDateTime) => {
  const dateTmp = new Date(utcDateTime);
  const year = dateTmp.getFullYear();
  const month = ("0" + (dateTmp.getMonth() + 1)).slice(-2);
  const day = ("0" + dateTmp.getDate()).slice(-2);
  return day + "-" + month + "-" + year;
};
export const getMessageTimePassed = (msgTime) => {
  let timePassed;
  const messageTime = new Date(msgTime);
  const currentTime = new Date();
  // Calculate the difference in milliseconds
  const timeDifference = currentTime - messageTime;
  // Convert milliseconds to total minutes
  const totalMinutes = Math.floor(timeDifference / (1000 * 60));
  // Get days, hours, and minutes
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) {
    timePassed = days + "d";
  } else if (hours > 0) {
    timePassed = hours + "h";
  } else if (minutes > 0) {
    timePassed = minutes + "m";
  } else if (timeDifference > 2000) {
    timePassed = Math.round(timeDifference / 1000) + "s";
  } else {
    timePassed = "just now";
  }
  // console.log(
  //   `The message is ${days} days, ${hours} hours, and ${minutes} minutes old.`,
  // );
  return timePassed;
};

export const convertDateToDisplayFormat = (dateSel) => {
  const year = dateSel.getFullYear();
  const month = ("0" + (dateSel.getMonth() + 1)).slice(-2);
  const day = ("0" + dateSel.getDate()).slice(-2);
  return day + "-" + month + "-" + year;
};
export const convertDateToAPIFormat = (dateSel) => {
  const year = dateSel.getFullYear();
  const month = ("0" + (dateSel.getMonth() + 1)).slice(-2);
  const day = ("0" + dateSel.getDate()).slice(-2);
  return year + "-" + month + "-" + day;
};
export const getHrDiffBteweenCrtTimeAndTimeStamp = (timeStamp) => {
  const messageTime = new Date(timeStamp);
  const currentTime = new Date();
  // Calculate the difference in milliseconds
  const timeDifference = currentTime - messageTime;
  // Convert milliseconds to total minutes
  const totalMinutes = Math.floor(timeDifference / (1000 * 60));
  // Convert minutes to total hrs
  const hours = Math.floor(totalMinutes / 60);
  return hours;
};
