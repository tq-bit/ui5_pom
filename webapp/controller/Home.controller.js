sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/core/Fragment',
	'sap/m/MessageToast',
	"../model/Pomodoro.model",
	"../model/formatter"
], function (Controller, Fragment, Toast, Pomodoro, formatter) {
	"use strict";

	return Controller.extend("sap.ui.demo.basicTemplate.controller.Home", {

		formatter: formatter,

		onInit: function () {
			Pomodoro.init();
			Pomodoro.tie(this);
		},

		handleToggleTimer() {
			const { ticking } = Pomodoro.getProperty('/timer');
			if (ticking) {
				return Pomodoro.stopTicking();
			}
			if (!ticking) {
				return Pomodoro.startTicking();
			}
		},

		handleFinishCurrentPhase() {
			const { isWorking } = Pomodoro.getProperty('/status');
			const { msTotal } = Pomodoro.getProperty('/settings/minFocus')
			const { ticking, msExpired } = Pomodoro.getProperty('/timer')
			if (ticking && isWorking && (msExpired < msTotal)) {
				Toast.show(`Focus for at least ${(msTotal / 60000).toFixed(0)} minutes!`);
			} else {
				Pomodoro.stopTicking();
				Pomodoro.setStatusNext();
				if (msExpired > msTotal) {
					const { task } = Pomodoro.getData();
					task.time = msExpired;
					Pomodoro.addToHistory({ ...task })
					Toast.show("Completed task and added to history. ")
				} else {
					Toast.show("Skipped this phase, no history item written")
				}
			}
		},

		handleResetCurrentPhase() {
			Pomodoro.stopTicking();
			Pomodoro.setStatusPrevious();
		},

		handleOpenTaskPopover(oEvent) {
			const oButton = oEvent.getSource();
			const oView = this.getView();

			if (!this._taskPopover) {
				this._taskPopover = Fragment.load({
					id: oView.getId(),
					name: "sap.ui.demo.basicTemplate.view.Fragment.Task",
					controller: this
				}).then((oPopover) => {
					oView.addDependent(oPopover);
					return oPopover;
				});
			}
			this._taskPopover.then((oPopover) => {
				oPopover.openBy(oButton);
			});
		},

		handleCloseTaskPopover() {
			this._taskPopover.then(popover => popover.close());
		},

		handleSetUserTheme() {
			if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
				Pomodoro.setProperty('/settings/appearance/theme', 'dark');
			}
			// Check for user-theme localstorage
			if (localStorage.getItem('user-theme')) {
				const userTheme = localStorage.getItem('user-theme')
				this._toggleTheme(userTheme)
			}
		},

		_toggleTheme(theme) {
			if (theme === 'dark') {
				Pomodoro.setProperty('/settings/appearance/theme', 'light');
				localStorage.setItem('user-theme', 'light')
				sap.ui.getCore().applyTheme('sap_fiori_3')
			} else if (theme === 'light') {
				Pomodoro.setProperty('/settings/appearance/theme', 'dark');
				localStorage.setItem('user-theme', 'dark')
				sap.ui.getCore().applyTheme('sap_fiori_3_dark')
			}
		}

	});
});