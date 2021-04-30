sap.ui.define(['sap/ui/model/json/JSONModel'], function (JSONModel) {
  "use strict";

  const Pomodoro = JSONModel.extend("sap.ui.demo.basicTemplate.model.PomodoroModel", {
    modelname: 'Pomodoro',

    tie(handler) {
      handler.getOwnerComponent().setModel(this, this.modelname)
    },

    init() {
      const { msTotal } = this.getProperty('/settings/pomodoro');
      this.setTimer(msTotal)
    },

    setStatusNext() {
      const { isWorking, isPausingShort, isPausingLong } = this.getProperty('/status');
      const { history } = this.getData();

      if ((history.length + 2) % 8 === 0) {
        return this.setStatusPausingLong();
      }

      if (isWorking) {
        return this.setStatusPausingShort()
      }

      if (isPausingShort || isPausingLong) {
        return this.setStatusWorking();
      }
    },

    setStatusPrevious() {
      const { isWorking, isPausingShort, isPausingLong } = this.getProperty('/status');
      if (isPausingLong) {
        return this.setStatusPausingLong();
      }

      if (isPausingShort) {
        return this.setStatusPausingShort()
      }

      if (isWorking) {
        return this.setStatusWorking();
      }
    },

    setTimer(ms) {
      this.setProperty('/timer/msTotal', ms)
      this.setProperty('/timer/msLeft', ms)
      this.setProperty('/timer/msExpired', 0)
    },

    // Status
    setStatusWorking() {
      const { msTotal } = this.getProperty("/settings/pomodoro")
      this.setProperty('/status', {
        isWorking: true,
        isPausingShort: false,
        isPausingLong: false,
      })
      this.setTimer(msTotal);
    },
    setStatusPausingShort() {
      const { msTotal } = this.getProperty("/settings/shortBreak")
      this.setProperty('/status', {
        isWorking: false,
        isPausingShort: true,
        isPausingLong: false,
      })
      this.setTimer(msTotal)
    },
    setStatusPausingLong() {
      const { msTotal } = this.getProperty("/settings/longBreak")
      this.setProperty('/status', {
        isWorking: false,
        isPausingShort: true,
        isPausingLong: false,
      })
      this.setTimer(msTotal)
    },

    startTicking() {
      this.stopTicking(true);
      const intervalHandler = setInterval(() => {
        this.tick()
      }, 1000);
      this.setProperty('/intervalHandler', intervalHandler);
      this.setProperty('/timer/ticking', true)
    },

    stopTicking(hardReset = false) {
      const intervalHandler = this.getProperty('/intervalHandler');
      if (hardReset === true) {
        for (let i = 1; i < Math.max(); i++) {
          clearInterval(i)
        }
      }
      clearInterval(intervalHandler)
      this.setProperty('/timer/ticking', false)
    },

    tick() {
      let { msLeft, msExpired } = this.getProperty('/timer');
      msLeft -= 1000;
      msExpired += 1000;
      if (msLeft === 0) {
        this.stopTicking();
        setTimeout(() => this.setStatusNext(), 1000)
      }
      this.setProperty('/timer/msLeft', msLeft)
      this.setProperty('/timer/msExpired', msExpired)
    },

    // {title, desc, time}
    addToHistory(task) {
      if (!localStorage.getItem('history')) {
        localStorage.setItem('history', JSON.stringify([]))
      }

      const historyItemsLocal = JSON.parse(localStorage.getItem('history'))
      const historyItems = this.getProperty('/history');

      historyItemsLocal.push(task);
      historyItems.push(task)

      localStorage.setItem('history', JSON.stringify(historyItemsLocal));
      this.setProperty('/history', historyItems);

    },

    clearHistory(clearLocalStorage = false) {
      this.setProperty('/history', [])
      if (clearLocalStorage) {
        localStorage.setItem('history', JSON.stringify([]));
      }
    },

    syncHistory() {
      const historyItemsLocal = JSON.parse(localStorage.getItem('history'))
      this.setProperty('/history', historyItemsLocal);
    },
  })

  return new Pomodoro({
    timer: {
      msTotal: 0,
      msLeft: 0,
      msExpired: 0,
      ticking: false,
    },
    status: {
      isWorking: true,
      isPausingShort: false,
      isPausingLong: false,
    },
    settings: {
      pomodoro: {
        msTotal: 1500000,
      },
      shortBreak: {
        msTotal: 300000,
      },
      longBreak: {
        msTotal: 900000,
      },
      minFocus: {
        msTotal: 600000,
      },
      appearance: {
        theme: 'dark'
      },
      notification: {
        show: true,
      },
      history: {
        enable: true,
        storeLocally: true,
      }
    },
    task: { title: '', desc: '' },
    history: [],
    intervalHandler: null,

  })
});