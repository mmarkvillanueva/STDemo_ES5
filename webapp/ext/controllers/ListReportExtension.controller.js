sap.ui.controller("com.st.demostdemo_es5.ext.controllers.ListReportExtension", {
	
	onBeforeRebindTableExtension: function(oEvent) {

		var oBindingParams = oEvent.getParameter("bindingParams");
		oBindingParams.parameters = oBindingParams.parameters || {};

		var oSmartTable = oEvent.getSource();
		var oSmartFilterBar = this.byId(oSmartTable.getSmartFilterId());
		if (oSmartFilterBar instanceof sap.ui.comp.smartfilterbar.SmartFilterBar) {
			var oCustomControl = oSmartFilterBar.getControlByKey("PriceRangeFilter");
			if (oCustomControl instanceof sap.m.ComboBox) {
				var vPriceRange = oCustomControl.getSelectedKey();
				switch (vPriceRange) {
					case "0":
						//oBindingParams.filters.push(new sap.ui.model.Filter('Price', null));
						oBindingParams.filters = [];
						break;
					case "1":
						oBindingParams.filters.push(new sap.ui.model.Filter('Price', 'LE', "100"));
						break;
					case "2":
						oBindingParams.filters.push(new sap.ui.model.Filter('Price', 'BT', "100", "500"));
						break;
					case "3":
						oBindingParams.filters.push(new sap.ui.model.Filter('Price', 'BT', "500", "1000"));
						break;
					case "4":
						oBindingParams.filters.push(new sap.ui.model.Filter('Price', 'GT', "1000"));
						break;
					default:
						break;
				}
			}
		}
	},

	onChangePrice: function(oEvent) {
		var oSmartTable = oEvent.getSource().getParent().getParent().getTable();
		var item = oSmartTable.getSelectedItem();
		if (item) {
			var oContext = item._getBindingContext();
			this._showChangePricePopup(oContext);
		} else {
			sap.m.MessageBox.error("You must first select a row!", {});
		}
	},

	_showChangePricePopup: function(oContext) {
		var that = this;
		var oModel = this.getView().getModel();

		var oField = new sap.ui.comp.smartfield.SmartField({
			value: "{Price}"
		});

		var oParameterDialog = new sap.m.Dialog({
			title: "Change Price",
			content: [new sap.m.Text({
				text: 'New Price '
			}), oField],
			beginButton: new sap.m.Button({
				text: "OK",
				press: function() {
					that.getView().getModel().submitChanges();
					oParameterDialog.close();
				}
			}),
			endButton: new sap.m.Button({
				text: "Cancel",
				press: function() {
					that.getView().getModel().resetChanges();
					oParameterDialog.close();
				}
			}),
			afterClose: function() {
				oParameterDialog.destroy();
			}
		});

		oParameterDialog.setModel(oModel);
		oParameterDialog.setBindingContext(oContext);
		oParameterDialog.open();
	}

});