
const { React } = require('powercord/webpack')
const { SwitchItem, SliderInput, Category, RadioGroup } = require('powercord/components/settings')
const path = require('path')
module.exports = class Settings extends React.PureComponent {

	constructor(props) {
		super(props);
        this.state = { category0Opened: false, category1Opened: false, category2Opened: false, category3Opened: false};
	}

    render() {
		const { getSetting, toggleSetting, updateSetting } = this.props
        return <>
            <Category
                name='Change Background Locations'
                opened={this.state.category0Opened}
                onChange={() => {
                    this.setState({ category0Opened: !this.state.category0Opened })
                    this.setState({ category1Opened: false })
                    this.setState({ category2Opened: false })
                    this.setState({ category3Opened: false })
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
                <SwitchItem
                    value={getSetting('pc-spotify', true)}
                    onChange={(val) => {
                        toggleSetting('pc-spotify')
                        if (!val) document.querySelector(".panels-j1Uci_").style.backgroundImage = "none"
                        powercord.pluginManager.remount('ActivityBackgrounds')
                    }}
                >Spotify Player</SwitchItem>
            </Category>

            <Category
                name="Manage Allowed Activities"
                opened={this.state.category1Opened}
                onChange={() => {
                    this.setState({ category1Opened: !this.state.category1Opened })
                    this.setState({ category0Opened: false })
                    this.setState({ category2Opened: false })
                    this.setState({ category3Opened: false })
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

            <Category
                name="Manage Snippets"
                note="Snippets by the powercord community"
                opened={this.state.category2Opened}
                onChange={() => {
                    this.setState({ category2Opened: !this.state.category2Opened })
                    this.setState({ category1Opened: false })
                    this.setState({ category0Opened: false })
                    this.setState({ category3Opened: false })
                }}
            >
            <SwitchItem
                note="Provides sliders to change how much the backgroud is blurred on hover"
                value={getSetting('hoverBlurControl', false)}
                onChange={() => {
                    toggleSetting('hoverBlurControl')
                    powercord.pluginManager.remount('ActivityBackgrounds')
                }}
            >Hover Blur Control</SwitchItem>
            
            {getSetting('hoverBlurControl', false) && (
            <Category
                name="Blur Controls"
                opened={this.state.category3Opened}
                onChange={() => {
                    this.setState({ category3Opened: !this.state.category3Opened })
                    this.setState({ category0Opened: false })
                    this.setState({ category1Opened: false })
            }}
            >
                <SliderInput
					minValue={0.5}
					maxValue={10}
					stickToMarkers
					markers={[0.5, 1, 1.5, 3, 5, 10]}
					defaultValue={1}
					initialValue={getSetting('blur-hover-pcspotify', 1)}
                    disabled={!getSetting('pc-spotify', true)}
					onValueChange={val => updateSetting('blur-hover-pcspotify', val)}
					onMarkerRender={v => `x${v}`}
                    onValueChange={val => {
                        updateSetting('blur-hover-pcspotify', val)
                        powercord.pluginManager.get(__dirname.split(path.sep).pop()).reloadBlur()
                    }}
			    >pc-Spotify Blur</SliderInput>
                <SliderInput
					minValue={0.5}
					maxValue={10}
					stickToMarkers
					markers={[0.5, 1, 1.5, 3, 5, 10]}
					defaultValue={1}
					initialValue={getSetting('blur-hover-popout', 1)}
                    disabled={true}
                    note="Under work since it breaks"
					onValueChange={val => updateSetting('blur-hover-popout', val)}
					onMarkerRender={v => `x${v}`}
                    onValueChange={val => {
                        updateSetting('blur-hover-popout', val)
                        powercord.pluginManager.get(__dirname.split(path.sep).pop()).reloadBlur()
                    }}
			    >Popout Blur</SliderInput>
                <SliderInput
					minValue={0.5}
					maxValue={10}
					stickToMarkers
					markers={[0.5, 1, 1.5, 3, 5, 10]}
					defaultValue={1}
					initialValue={getSetting('blur-hover-modal', 1)}
                    disabled={!getSetting('profileModal', true)}
					onValueChange={val => updateSetting('blur-hover-modal', val)}
					onMarkerRender={v => `x${v}`}
                    onValueChange={val => {
                        updateSetting('blur-hover-modal', val)
                        powercord.pluginManager.get(__dirname.split(path.sep).pop()).reloadBlur()
                    }}
			    >Modal Blur</SliderInput>
            </Category>)}

            <SwitchItem
                note={
                    <>
                    <p>Only show options on player when hover - Doggybootsy(pinging is okay)#1333</p>
                    <img width="200px" src="https://crenshaw.otters.store/uploads/b1215eff-59ca-4766-99c4-8d7ffb87d6a7/jFiSkYzU.gif"></img>
                    </>
                }
                value={getSetting('hoverPlayer', false)}
                onChange={() => {
                    toggleSetting('hoverPlayer')
                    powercord.pluginManager.remount('ActivityBackgrounds')
                }}
            >Hover Player</SwitchItem>

            <SwitchItem
                note={
                    <>
                    <p>Only show activty and info on hover in the modal - Crenshaw1312"</p>
                    <img width="200px" src="https://crenshaw.otters.store/uploads/b1215eff-59ca-4766-99c4-8d7ffb87d6a7/JOZIOHGO.gif"></img>
                    </>
                }
                value={getSetting('hoverModal', false)}
                onChange={() => {
                    toggleSetting('hoverModal')
                    powercord.pluginManager.remount('ActivityBackgrounds')
                }}
            >Hover Modal</SwitchItem>

            <SwitchItem
                note={
                    <>
                    <p>Remove cover and game art icon - Leeprky#2063</p>
                    <img width="200px" src="https://crenshaw.otters.store/uploads/b1215eff-59ca-4766-99c4-8d7ffb87d6a7/dq4EeNwN.png"></img>
                    </>
                }
                value={getSetting('noCovers', false)}
                onChange={() => {
                    toggleSetting('noCovers')
                    powercord.pluginManager.remount('ActivityBackgrounds')
                }}
            >No Covers</SwitchItem>
            </Category>

            <SwitchItem
                note="No matter the bot's activity, use their avatar"
                value={getSetting('botAvatar', true)}
                onChange={() => toggleSetting('botAvatar')}
            >Bots use Avatar</SwitchItem>

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
        </>
    }
}
