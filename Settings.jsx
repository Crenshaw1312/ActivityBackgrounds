
const { React } = require('powercord/webpack')
const { SwitchItem, SliderInput } = require('powercord/components/settings')

module.exports = class Settings extends React.PureComponent {

	constructor(props) {
		super(props);
	}

    render() {
		const { getSetting, toggleSetting, updateSetting } = this.props
        return <>
            <SwitchItem
                note="Enable to show backgrounds for user-modals only"
                value={this.props.getSetting('modalsOnly', false)}
                onChange={() => this.props.toggleSetting('modalsOnly')}
            >Modals Only</SwitchItem>
            <SwitchItem
                note="Changes the spotify controller's background"
                value={this.props.getSetting('pc-spotify', true)}
                onChange={(val) => {
                    this.props.toggleSetting('pc-spotify')
                    if (!val) document.querySelector(".panels-j1Uci_").style.backgroundImage = "none"
                    powercord.pluginManager.remount('SpotifyBackgrounds')
                }}
            >Change Spotify Player</SwitchItem>
            <SliderInput
					minValue={0}
					maxValue={10}
					stickToMarkers
					markers={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
					defaultValue={1}
					initialValue={getSetting('blur-scale', 1)}
					onValueChange={val => updateSetting('blur-scale', val)}
					onMarkerRender={v => `x${v}`}
				>
					Blur Scale</SliderInput>
        </>
    }
}
