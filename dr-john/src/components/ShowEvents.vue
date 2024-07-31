<template>
  <div id="app">
    <div class="wrap">
      <h3>Events</h3>
      <div class="booked-slots-container">
        <button
          v-if="!showDatePickersEvents"
          @click="showDatePickersEvents = true"
        >
          Get Events
        </button>
        <div v-if="showDatePickersEvents" class="events">
          <span class="close-btnE" @click="closeSlotsContainer">Close</span>
          <div class="col-lg-8">
            <div class="start-end">
              <div class="date">
                <h4>Start Date</h4>
                <ejs-datepicker
                  id="datepicker"
                  name="date"
                  :change="onStartChange"
                  class="form-control"
                  placeholder="Select a date"
                  :value="selectedStart"
                  :focus="onFocus"
                  ref="dateObj"
                  format="dd-MM-yyyy"
                ></ejs-datepicker>
              </div>
              <div class="date">
                <h4>End Date</h4>
                <ejs-datepicker
                  id="datepicker"
                  name="date"
                  :change="onEndChange"
                  class="form-control"
                  placeholder="Select a date"
                  :value="selectedEnd"
                  :focus="onFocus"
                  ref="dateObj"
                  format="dd-MM-yyyy"
                ></ejs-datepicker>
              </div>
              <button @click="fetchEvents">Fetch Events</button>
            </div>
            <div class="container">
              <div v-for="(timestamps, date) in events" :key="date">
                <div class="date-header">
                  <h4>{{ date }}</h4>
                </div>
                <div class="timestamps-container">
                  <span
                    v-for="time in timestamps"
                    :key="time"
                    class="booked-slot"
                    >{{ time }}</span
                  >
                </div>
              </div>
            </div>
            <div v-if="showBookedSlots && Object.keys(events).length == 0">
              <p>No events in the given time range</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { DatePickerComponent as EjsDatepicker } from "@syncfusion/ej2-vue-calendars";
import { registerLicense } from "@syncfusion/ej2-base";
import { ref, computed, watch } from "vue";
import { useStore } from "vuex";
import moment from "moment";
import "moment-timezone";
import axios from "axios";
registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NCaF1cWWhBYVF/WmFZfVpgcl9EYFZVTWYuP1ZhSXxXdkJgWX9YcnRQR2BZU0w="
);
const date = new Date();
const selectedStart = ref(date);
const store = useStore();
const endDate = new Date(date);
endDate.setDate(endDate.getDate() + 7);

const selectedEnd = ref(endDate);
const showDatePickersEvents = ref(false);
const showBookedSlots = ref(false);
const events = computed(() => store.getters.getEvents);
const slots = computed(() => store.getters.getFreeSlots);
const selectedTimezone = computed(() => store.getters.getSelectedTimezone);
const onStartChange = (e) => {
  selectedStart.value = e.value;
};
const onEndChange = (e) => {
  selectedEnd.value = e.value;
};
const fetchEvents = async () => {
  showBookedSlots.value = true;
  if (selectedStart.value >= selectedEnd.value) {
    alert("End date has to be after Start date");
    return;
  }
  if (!selectedStart.value || !selectedEnd.value) {
    alert("Please select both start and end dates");
    return;
  }

  try {
    const start = selectedStart.value.toISOString().split("T")[0];
    const end = selectedEnd.value.toISOString().split("T")[0];
    const response = await axios.get(
      `http://localhost:3000/events?start=${start}&end=${end}`
    );
    const data = response.data;
    const transformedData = data.reduce((acc, item) => {
      const localDate = moment
        .utc(item.id)
        .tz(selectedTimezone.value)
        .format("DD-MM-YYYY");
      const times = item.timestamp.map((ts) =>
        moment.utc(ts).tz(selectedTimezone.value).format("hh:mm A")
      );
      acc[localDate] = times;
      return acc;
    }, {});
    store.dispatch("updateEvents", transformedData);
  } catch (error) {
    console.error("Error fetching events:", error);
  }
};
const closeSlotsContainer = () => {
  showDatePickersEvents.value = false;
};
watch([selectedTimezone, slots], fetchEvents);
</script>
<style>
@import "../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-buttons/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-popups/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-vue-calendars/styles/material.css";

.wrap {
  margin: 0 auto;
}

.slots-container {
  border: 2px solid #000;
  padding: 10px;
  margin: 10px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background-color: #f9f9f9;
  border-radius: 10px;
}

.booked-slots-container {
  flex-direction: column;
  border: 2px solid #000;
  padding: 10px;
  margin: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  background-color: #f9f9f9;
  border-radius: 10px;
}

.booked-slot {
  background-color: #f0f0f0;
  color: #a0a0a0;
  border: 2px solid #d0d0d0;
  cursor: not-allowed;
  pointer-events: none;
  padding: 5px 5px;
  margin: 15px;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
  box-sizing: border-box;
}

.slot {
  background-color: #fff;
  border: 2px solid blue;
  padding: 5px 5px;
  margin: 15px;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
  box-sizing: border-box;
}

.start-end {
  /* width: 100%; */
  padding: 10px;
  margin: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9;
  border-radius: 10px;
}

.slot:hover {
  background-color: #e0f7fa;
}

.date {
  display: flex;
  flex-direction: column;
  margin: 10px;
  padding: auto;
}

.close-btnE {
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  padding: 5px;
  width: 50px;
}

.close-btnE:hover {
  background-color: #d32f2f; /* Darker red on hover */
}

.events {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.timestamps-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
  align-items: center;
  background-color: #f9f9f9;
  border-radius: 10px;
}
</style>
