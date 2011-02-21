function Reservation(opts)
{
	var options = opts;
	
	var elements = {
			beginDate: $('#BeginDate'),
			endDate: $('#EndDate'),
			repeatOptions: $('#repeatOptions'),
			repeatDiv: $('#repeatDiv'),
			beginTime: $('#BeginPeriod'),
			endTime: $('#EndPeriod')
	};
	
	const oneDay = 86400000; //24*60*60*1000 => hours*minutes*seconds*milliseconds
	
	Reservation.prototype.init = function()
	{
		elements.beginDate.data['previousVal'] = elements.beginDate.val();
		
		$('#dialogAddResources').dialog({
		    bgiframe: true, autoOpen: false, 
		    height: 300, modal: true,
		    open: function(event, ui) { InitialzeCheckboxes('#dialogAddResources', '#additionalResources'); return true; }
		});
		
		$('#btnClearAddResources').click(function(){   
			CancelAdd('#dialogAddResources', '#additionalResources');	
		});
		
		$('#dialogSave').dialog({
		    autoOpen: false, modal: true, draggable: false, resizable: false, closeOnEscape: false,
		    minHeight: 400, minWidth: 700, width: 700,
		    open: function(event, ui) {  $(this).parents(".ui-dialog:first").find(".ui-dialog-titlebar").hide(); }
		});
		
		$('.save').click(function(){
			$('#dialogSave').dialog('open');
		});
		
		$('#btnConfirmAddResources').click(function() {
			AddResources();
		});
		
		// initialize selected resources
		AddResources();
		
		elements.repeatOptions.change(function() { 
			ChangeRepeatOptions($(this));
		});
		
		InitializeRepeatOptions();
		
		$('#btnUpdateThisInstance').click(function() {
			ChangeUpdateScope(options.scopeOpts.instance);
		});
		
		$('#btnUpdateAllInstances').click(function() {
			ChangeUpdateScope(options.scopeOpts.full);
		});
		
		$('#btnUpdateFutureInstances').click(function() {
			ChangeUpdateScope(options.scopeOpts.future);
		});
		

		elements.beginDate.change(function() {
			AdjustEndDate();
			ToggleRepeatOptions();
			elements.beginDate.data['previousVal'] = elements.beginDate.val();
		});
		
		elements.endDate.change(function() {
			ToggleRepeatOptions();			
		});
		
		elements.beginTime.change(function() {
			ToggleRepeatOptions();			
		});
		
		elements.endTime.change(function() {
			ToggleRepeatOptions();			
		});
		
		$('select, input', elements.repeatDiv).change(function()
		{
			ToggleUpdateScope();
		});
	}
	
	// pre-submit callback 
	Reservation.prototype.preSubmit = function(formData, jqForm, options) { 
	    $('#result').hide();
	    $('#creatingNotifiation').show();
	    
	    return true; 
	} 
	
	// post-submit callback 
	Reservation.prototype.showResponse = function(responseText, statusText, xhr, $form)  { 
		$('#btnSaveSuccessful').click(function(e) {
			window.location = options.returnUrl;
		});
		
		$('#btnSaveFailed').click(function() {
			CloseSaveDialog();
		});
		
		$('#creatingNotifiation').hide();
	    $('#result').show();
	}
	
	var AddResources = function(inputId)
	{
		AddSelected('#dialogAddResources', '#additionalResources', options.additionalResourceElementId);
		$('#dialogAddResources').dialog('close');
	}

	var AddSelected = function(dialogBoxId, displayDivId, inputId)
	{
		$(displayDivId).empty();
		
		$(dialogBoxId + ' :checked').each(function(){
			$(displayDivId)
				.append('<p>' + $(this).next().text() + '</p>')
				.append('<input type="hidden" name="' + inputId + '[]" value="' + $(this).val() + '"/>')
		});
		
		$(dialogBoxId).dialog('close');
	}
	
	var AdjustEndDate = function()
	{
		//var oneDay = 86400000; //24*60*60*1000 => hours*minutes*seconds*milliseconds
		var firstDate = new Date(elements.beginDate.data['previousVal']);
		var secondDate = new Date(elements.beginDate.val());
		
		var diffDays = (secondDate.getTime() - firstDate.getTime())/(oneDay);
		
		var currentEndDate = new Date(elements.endDate.val());
		currentEndDate.setDate(currentEndDate.getDate() + diffDays);
		
		elements.endDate.datepicker("setDate", currentEndDate);
	};

	var CancelAdd = function(dialogBoxId, displayDivId)
	{
		var selectedItems = $.makeArray($(displayDivId + ' p').text());
		$(dialogBoxId + ' :checked').each(function(){
			var checkboxText = $(this).next().text();
			if ($.inArray(checkboxText, selectedItems) < 0)
			{
				$(this).removeAttr('checked');
			}
		});
		
		$(dialogBoxId).dialog('close');
	}
	
	var ChangeRepeatOptions = function(repeatDropDown)
	{
		if (repeatDropDown.val() != 'none')
    	{
    		$('#repeatUntilDiv').show();
    	}
    	else
    	{
    		$('div[id!=repeatOptions]', elements.repeatDiv).hide();
    	}
    	
    	if (repeatDropDown.val() == 'daily')
    	{
    		$('.weeks', elements.repeatDiv).hide();
    		$('.months', elements.repeatDiv).hide();
    		$('.years', elements.repeatDiv).hide();
    		
    		$('.days', elements.repeatDiv).show();	
    	}
    	
    	if (repeatDropDown.val() == 'weekly')
    	{
    		$('.days', elements.repeatDiv).hide();
    		$('.months', elements.repeatDiv).hide();
    		$('.years', elements.repeatDiv).hide();
    		
    		$('.weeks', elements.repeatDiv).show();	
    	}
    	
    	if (repeatDropDown.val() == 'monthly')
    	{
    		$('.days', elements.repeatDiv).hide();
    		$('.weeks', elements.repeatDiv).hide();
    		$('.years', elements.repeatDiv).hide();
    		
    		$('.months', elements.repeatDiv).show();	
    	}
    	
    	if (repeatDropDown.val() == 'yearly')
    	{
    		$('.days', elements.repeatDiv).hide();
    		$('.weeks', elements.repeatDiv).hide();
    		$('.months', elements.repeatDiv).hide();
    		
    		$('.years', elements.repeatDiv).show();	
    	}
	}

	var ChangeUpdateScope = function(updateScopeValue)
	{
		$('#hdnSeriesUpdateScope').val(updateScopeValue);
	};
	
	var InitialzeCheckboxes = function(dialogBoxId, displayDivId)
	{
		var selectedItems = $.makeArray($(displayDivId + ' p').text());
		$(dialogBoxId + ' :checkbox').each(function(){
			var checkboxText = $(this).next().text();
			if ($.inArray(checkboxText, selectedItems) >= 0)
			{
				$(this).attr('checked', 'checked');
			}
			else
			{
				$(this).removeAttr('checked');
			}
		});
	}
	
	var InitializeRepeatOptions = function()
	{
		if (options.repeatType)
		{
			elements.repeatOptions.val(options.repeatType);
			$('#repeat_every').val(options.repeatInterval);
			for (var i = 0; i < options.repeatWeekdays.length; i++)
			{
				var id = "#repeatDay" + i;
				$(id).attr('checked', true);
			}
			
			$("#repeatOnMonthlyDiv :radio[value='" + options.repeatMonthlyType + "']").attr('checked', true);
			
			elements.repeatOptions.trigger('change');
		}
	}

	var CloseSaveDialog = function()
	{
		$('#dialogSave').dialog('close');
	}
	
	var ToggleRepeatOptions = function()
	{
		var SetValue = function(value, disabled)
		{
			elements.repeatOptions.val(value);
			elements.repeatOptions.trigger('change');
			$('select, input', elements.repeatDiv).attr("disabled", disabled);
		};
		
		if (MoreThanOneDayBetweenBeginAndEnd())
		{
			elements.repeatOptions.data["current"] = elements.repeatOptions.val();
			this.updated = true;
			SetValue('none', 'disabled');
		}
		else 
		{
			if (this.updated)
			{
				SetValue(elements.repeatOptions.data["current"], '');				
				this.updated = false;
			}
		}
	}
	
	var ToggleUpdateScope = function()
	{
		if (MoreThanOneDayBetweenBeginAndEnd())
		{
			$('#btnUpdateThisInstance').show();
			$('#btnUpdateAllInstances').hide();
			$('#btnUpdateFutureInstances').hide();
		}
		else
		{
			$('#btnUpdateThisInstance').hide();
			$('#btnUpdateAllInstances').show();
			$('#btnUpdateFutureInstances').show();	
		}
	}
	
	var MoreThanOneDayBetweenBeginAndEnd = function()
	{
		var begin = new Date(elements.beginDate.val() + ' ' + elements.beginTime.val());
		var end = new Date(elements.endDate.val() + ' ' + elements.endTime.val());
		
		var timeBetweenDates = end.getTime() - begin.getTime();
		
		return timeBetweenDates > oneDay;
	}
}