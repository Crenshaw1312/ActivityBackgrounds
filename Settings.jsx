const { React } = require('powercord/webpack')
const { SwitchItem } = require('powercord/components/settings')

module.exports = class Settings extends React.PureComponent {
    render() {
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
        </>
    }
}
