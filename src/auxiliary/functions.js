import bus from '@/auxiliary/bus'

const fn = {
	handle_notification: function (notification) {
		bus.emit('debug display', '📨 Message received: '+JSON.stringify(notification))
		switch (notification.title) {
			case 'move':
			case "It's your turn":
				bus.emit('move', notification.data)
				break
			case 'Game invitation':
				bus.emit('game_invitation', notification.data)
				break
			default: { // {} to allow `let`
				let alert_text = 'Unknown firebase message received: '+JSON.stringify(notification)
				alert(alert_text)
				break
			}
		}
	}
}

export default fn