<template>
  <div id="app">
    <div class="wrap">
      <div class="config-timezone">
        <div class="date">
          <h4>Select Timezone</h4>
          <div class="col-lg-8">
            <select
              id="timezone"
              v-model="timezone"
              @change="updateTimezone"
              class="form-control"
            >
              <option value="Asia/Kolkata">Asia/Kolkata</option>
              <option value="America/Los_Angeles">America/Los_Angeles</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York</option>
              <option value="Asia/Tokyo">Asia/Tokyo</option>
            </select>
          </div>
        </div>
        <div class="configs">
          <h3>Dr. John</h3>
          <div class="config">
            <label>Start Time: </label>
            <span class="config-value">
              {{ johnStart }}
            </span>
          </div>

          <div class="config">
            <label>End Time: </label>
            <span class="config-value">
              {{ johnEnd }}
            </span>
          </div>

          <div class="config">
            <label>Slot Duration: </label>
            <span class="config-value"> {{ johnDuration }} minutes </span>
          </div>

          <div class="config">
            <label>Timezone: </label>
            <span class="config-value">
              {{ johnTimezone }}
            </span>
          </div>
        </div>
      </div>
      <div class="freeAndEvent">
        <div class="freeslots">
          <h3>Free Slots</h3>
          <div class="slots-container">
            <span
              v-if="showDatePickers"
              class="close-btnB"
              @click="closeContainer"
              >Close</span
            >
            <form
              v-if="showDatePickers"
              id="form-element"
              class="date-timezone"
            >
              <div class="date" style="padding-top: 11px">
                <h4>Select Date</h4>
                <div class="col-lg-8">
                  <ejs-datepicker
                    id="datepicker"
                    name="date"
                    :change="onValueChange"
                    class="form-control"
                    placeholder="Select a date"
                    :value="date"
                    :focus="onFocus"
                    ref="dateObj"
                  ></ejs-datepicker>
                </div>
              </div>
            </form>
            <button v-if="!showDatePickers" @click="showDatePickers = true">
              Get Free Slots
            </button>
            <div v-if="showDatePickers" class="container">
              <span
                v-for="slot in freeSlots"
                :key="slot"
                class="slot"
                @click="addNewEvent(slot)"
              >
                {{ moment(slot).format("hh:mm A") }}
              </span>
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
import { ref, watch, onMounted, computed } from "vue";
import { useStore } from "vuex";
import moment from "moment";
import axios from "axios";

registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NCaF1cWWhBYVF/WmFZfVpgcl9EYFZVTWYuP1ZhSXxXdkJgWX9YcnRQR2BZU0w="
);

const date = new Date();
const selectedDate = ref(date);
const showDatePickers = ref(false);
const freeSlots = computed(() => store.getters.getFreeSlots);
const johnStart = ref(null);
const johnEnd = ref(null);
const johnDuration = ref(null);
const johnTimezone = ref(null);

const store = useStore();
const timezone = computed(() => store.getters.getSelectedTimezone);

const onValueChange = (e) => {
  console.log("selected date", e.value);
  selectedDate.value = e.value;
};

const updateTimezone = (event) => {
  const selectedTimezone = event.target.value;
  store.dispatch("updateSelectedTimezone", selectedTimezone);
};

const fetchFreeSlots = async () => {
  try {
    const dateStr = selectedDate.value.toISOString().split("T")[0];
    const timezoneStr = timezone.value;
    const response = await axios.get(
      `http://localhost:3000/free_slots?date=${dateStr}&timezone=${timezoneStr}`
    );
    if (response.status == 422) {
      alert(response.data);
      return;
    }
    store.dispatch("updateFreeSlots", response.data);
  } catch (error) {
    console.error("Error fetching free slots:", error);
  }
};

const fetchConfig = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/config`);
    const data = response.data;
    johnStart.value = data.startHours;
    johnEnd.value = data.endHours;
    johnDuration.value = data.duration;
    johnTimezone.value = data.timezone;
  } catch (error) {
    console.error("Error fetching free slots:", error);
  }
};

const addNewEvent = async (slot) => {
  try {
    const timezoneStr = timezone.value;
    const momentWithTimezone = moment.tz(slot, "YYYY-MM-DD HH:mm", timezoneStr);
    const timeStampUTC = momentWithTimezone.utc().valueOf();
    const userInput = window.prompt(
      `Are you sure you want to add this event on ${moment(slot).format(
        "DD-MM-YYYY hh:mm A"
      )}? Please enter slot duration in minutes`
    );

    if (userInput === null) {
      return;
    }

    if (userInput.trim() === "" || isNaN(userInput)) {
      alert("You must enter a valid duration");
      return;
    }
    const end = momentWithTimezone.add(userInput, "minutes");
    const johnStartTime = moment.tz(
      `${momentWithTimezone.format("YYYY-MM-DD")} ${johnStart.value}`,
      johnTimezone.value
    );
    const johnEndTime = moment.tz(
      `${momentWithTimezone.format("YYYY-MM-DD")} ${johnEnd.value}`,
      johnTimezone.value
    );

    if (
      momentWithTimezone.isBefore(johnStartTime) ||
      end.isAfter(johnEndTime)
    ) {
      alert("Dr John is out of office at the selected slot");
      return;
    }
    await axios.post(
      `http://localhost:3000/add_event?timestamp=${timeStampUTC}&duration=${parseInt(
        userInput
      )}`
    );
  } catch (error) {
    if (error.response && error.response.status === 422) {
      alert("The slot you're looking for is unavailable");
    }
    console.error(error);
  }

  fetchFreeSlots();
};

const closeContainer = () => {
  showDatePickers.value = false;
};

onMounted(() => {
  fetchConfig();
  fetchFreeSlots();
});
watch([selectedDate, timezone], fetchFreeSlots);
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
  justify-content: space-around;
  align-items: center;
  background-color: #f9f9f9;
  border-radius: 10px;
}

.container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
  align-items: center;
  background-color: #f9f9f9;
  border-radius: 10px;
}

.booked-slots-container {
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
  background-color: #f0f0f0; /* Light gray background */
  color: #a0a0a0; /* Lighter gray text */
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

/* Optional: add hover effect */
.slot:hover {
  background-color: #e0f7fa; /* Light blue background on hover */
}

.date {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 10px;
  padding: auto;
}

.date-timezone {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
}

.close-btnB {
  align-self: flex-end;
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

.close-btnB:hover {
  background-color: #d32f2f; /* Darker red on hover */
}

.config-timezone {
  display: flex;
  justify-content: space-between;
  width: 100%;
  text-align: left;
  font: optional;
  font-size: 12px;
}
.config-value {
  font-weight: bold;
  color: #0b0be1;
}
</style>
