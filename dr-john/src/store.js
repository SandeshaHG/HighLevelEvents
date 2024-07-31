import { createStore } from "vuex";

export default createStore({
  state: {
    selectedTimezone: "UTC",
    freeSlots: [],
    events: [],
  },
  mutations: {
    setSelectedTimezone(state, timezone) {
      state.selectedTimezone = timezone;
    },
    setFreeSlots(state, slots) {
      state.freeSlots = slots;
    },
    setEvents(state, events) {
      state.events = events;
    },
  },
  actions: {
    updateSelectedTimezone({ commit }, timezone) {
      commit("setSelectedTimezone", timezone);
    },
    updateFreeSlots({ commit }, slots) {
      commit("setFreeSlots", slots);
    },
    updateEvents({ commit }, events) {
      commit("setEvents", events);
    },
  },
  getters: {
    getSelectedTimezone: (state) => state.selectedTimezone,
    getFreeSlots: (state) => state.freeSlots,
    getEvents: (state) => state.events,
  },
});
