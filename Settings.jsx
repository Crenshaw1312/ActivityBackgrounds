
const { React } = require('powercord/webpack')
const { SwitchItem, SliderInput, Category, RadioGroup } = require('powercord/components/settings')
const path = require('path')
module.exports = class Settings extends React.PureComponent {

	constructor(props) {
		super(props);
        this.state = { category0Opened: false, category1Opened: false, category2Opened: false };
	}

    render() {
		const { getSetting, toggleSetting, updateSetting } = this.props
        return <>
            <Category
                name='Profile and Modal'
                opened={this.state.category0Opened}
                onChange={() => {
                    this.setState({ category0Opened: !this.state.category0Opened })
                    this.setState({ category1Opened: false })
                    this.setState({ category2Opened: false })
                }}
            >
                <SwitchItem
                    value={getSetting('profilePopout', true)}
                    onChange={() => toggleSetting('profilePopout')}
                >Allow Popouts</SwitchItem>
                <SwitchItem
                    value={getSetting('profileModal', true)}
                    onChange={() => toggleSetting('profileModal')}
                >Allow Modals</SwitchItem>
            </Category>

            <Category
                name="Manage Allowed Activities"
                opened={this.state.category1Opened}
                onChange={() => {
                    this.setState({ category1Opened: !this.state.category1Opened })
                    this.setState({ category0Opened: false })
                    this.setState({ category2Opened: false })
                }}
            >
                <SwitchItem
                    value={getSetting('allowSpotify', true)}
                    onChange={() => toggleSetting('allowSpotify')}
                >Allow Spotify</SwitchItem>
                <SwitchItem
                    value={getSetting('allowGames', false)}
                    onChange={() => toggleSetting('allowGames')}
                >Allow Games</SwitchItem>
                <SwitchItem
                    note="If no activity, use their avatar"
                    value={getSetting('allowAvatar', false)}
                    onChange={() => toggleSetting('allowAvatar')}
                >Allow Avatar</SwitchItem>
            </Category>

            <RadioGroup
                onChange={e => updateSetting("dominant", e.value)}
                note="What type should be dominant"
                value={getSetting("dominant", "co-dominant")}
                options={[
                    {
                        name: "Avatar",
                        value: "avatar"
                    }, {
                        name: "Spotify",
                        value: "spotify"
                    }, {
                        name: "Games",
                        value: "games"
                    }, {
                        name: "Co-dominant",
                        desc: "Whatever the first activity is",
                        value: "co-dominant"
                    }
                ]}
            >Dominance</RadioGroup>

            <SwitchItem
                note="Changes the spotify controller's background"
                value={getSetting('pc-spotify', true)}
                onChange={(val) => {
                    toggleSetting('pc-spotify')
                    if (!val) document.querySelector(".panels-j1Uci_").style.backgroundImage = "none"
                    powercord.pluginManager.remount('ActivityBackgrounds')
                }}
            >Change Spotify Player</SwitchItem>
            <SliderInput
					minValue={0.5}
					maxValue={10}
                    note="Change the blur amount on the pc-spotify"
					stickToMarkers
					markers={[0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
					defaultValue={1}
					initialValue={getSetting('blur-album-scale', 1)}
                    disabled={!getSetting('pc-spotify')}
					onValueChange={val => updateSetting('blur-album-scale', val)}
					onMarkerRender={v => `x${v}`}
                    onValueChange={val => {
                        updateSetting('blur-album-scale', val)
                        powercord.pluginManager.get(__dirname.split(path.sep).pop()).reloadBlur()
                    }}
			>Album Blur Scale</SliderInput>\

            <Category
                name="Manage Snippets"
                note="Snippets by the powercord community"
                opened={this.state.category2Opened}
                onChange={() => {
                    this.setState({ category2Opened: !this.state.category2Opened })
                    this.setState({ category1Opened: false })
                    this.setState({ category0Opened: false })
                }}
            >
            <SwitchItem
                note="Only show options on player when hover - Doggybootsy(pinging is okay)#1333"
                value={getSetting('hoverPlayer', false)}
                onChange={() => {
                    toggleSetting('hoverPlayer')
                    powercord.pluginManager.remount('ActivityBackgrounds')
                }}
            >Hover Player</SwitchItem>
            <SwitchItem
                note="Only show activty and info on hover in the modal - Crenshaw1312"
                value={getSetting('hoverModal', false)}
                onChange={() => {
                    toggleSetting('hoverModal')
                    powercord.pluginManager.remount('ActivityBackgrounds')
                }}
            >Hover Modal</SwitchItem>
            <SwitchItem
                note="Remove cover and game art icon - Leeprky#2063"
                value={getSetting('noCovers', false)}
                onChange={() => {
                    toggleSetting('noCovers')
                    powercord.pluginManager.remount('ActivityBackgrounds')
                }}
            >No Covers</SwitchItem>
            </Category>
        </>
    }
}
