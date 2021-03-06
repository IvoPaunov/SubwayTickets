var draw = function() {
	var canvas, context;
	var ticket = document.createElement('img');
	ticket.src = 'ticket.png';

	var init = function() {
		canvas = document.getElementById('canvas');
		canvas.width = mm(210); // A4 paper
		canvas.height = Math.round(canvas.width * Math.sqrt(2));
		context = canvas.getContext('2d');
	};

	var redraw = function() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.globalAlpha = 1;
		context.fillStyle = '#000000';

		var seconds = +document.getElementById('time_seconds').value;
		var id = +document.getElementById('ticket_id').value;
		var from = document.getElementById('time_from').value.split(':').map(Number);
		from = (from[0]*60 + from[1])*60 + seconds;
		var to = document.getElementById('time_to').value.split(':').map(Number);
		to = (to[0]*60 + to[1])*60 + seconds;
		var step = (+document.getElementById('time_interval').value)*60;
		var station = document.getElementById('station').value;

		var offx = 10, offy = 10;
		while(from <= to) {
			var code = barcode.generate(selectedDate, from, station, id);
			var textDate = leadWithZeroes(selectedDate.getDate(), 2) + '.'
				+ leadWithZeroes(selectedDate.getMonth()+1, 2) + '.'
				+ leadWithZeroes(selectedDate.getFullYear());
			var textTime = leadWithZeroes(from/3600|0, 2) + ':'
				+ leadWithZeroes((from/60|0)%60, 2) + ':'
				+ leadWithZeroes(from%60, 2);
			var textStation = 'Station ' + station + ' ID ' + id;

			context.drawImage(ticket, offx, offy, TicketWidth, TicketHeight);
			context.fillText(textDate, offx+mm(7), offy+mm(18));
			context.fillText(textTime, offx+mm(7), offy+mm(21));
			context.fillText(textStation, offx+mm(7), offy+mm(24));
			barcode.draw(context, code, offx+mm(7), offy+mm(2), 1, mm(13.5));

			from += step;
			offx += TicketWidth + 10;
			if(offx > canvas.width - TicketWidth - 10) {
				offx = 10;
				offy += TicketHeight + 10;
				if(offy > canvas.height - TicketHeight - 10)
					break;
			}
		}

		document.getElementById('download').href = canvas.toDataURL('images/png');
	};

	return {
init: init,
		  redraw: redraw,
	};
}();
