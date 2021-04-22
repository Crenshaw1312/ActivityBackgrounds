const { Plugin } = require('powercord/entities')
const { findInReactTree } = require('powercord/util')
const { getModule, getModuleByDisplayName } = require('powercord/webpack')
const { inject, uninject } = require('powercord/injector')

let temp
const filterActivities = (a, i) => {
    if (i === 0) temp = []
    if (temp.includes(a.application_id || a.name)) return false
    temp.push(a.application_id || a.name)
    return a.type !== 4
}

module.exports = class SpotifyBackgrounds extends Plugin {
    async startPlugin() {

        const AnalyticsContext = await getModuleByDisplayName('AnalyticsContext')
        const { getActivities } = await getModule(['getActivities'])
        const _this = this

        inject('SpotifyBackgrounds', AnalyticsContext.prototype, 'renderProvider', function (args, res) {
            // striaght up copy-pasta from user-details by Juby210#0577
            let arr, popout, text = []
            if (_this.settings.get('profilePopout', true) && this.props.section == 'Profile Popout') {
                arr = findInReactTree(res, a => Array.isArray(a) && a.find(c => c && c.type && c.type.displayName == 'CustomStatus'))
                popout = true
            } else if (_this.settings.get('profileModal', true) && this.props.section == 'Profile Modal') 
                arr = findInReactTree(res, a => Array.isArray(a) && a.find(c => c && c.type && c.type.displayName == 'DiscordTag'))
            if (!arr) return res

            const { user } = findInReactTree(arr, p => p.user)

            // okay here's my work
            const activities = getActivities(user.id).filter(filterActivities)
            if (activities[0].name === "Spotify") {
                // getting shit
                let spotifyActivity = activities[0]
                let image = "https://i.scdn.co/image/" + spotifyActivity.assets.large_image.split(":")[1]

                // get the element, don't fail tho
                let element;
                if (popout) {
                    element = document.querySelector(`.userPopout-3XzG_A[aria-label=${user.username}]`).firstChild
                } else {
                    element = document.querySelector(".topSectionSpotify-1lI0-P")
                }
                if (!element) return res
                console.log(element);

                if (!element.style) return res
                let background = element.style
                background.backgroundImage = `url(${image})`
                background.backgroundSize = "cover"
                background.filter = "none"
                
            }

            return res
        }, false)
    }

    pluginWillUnload() {
        uninject('SpotifyBackgrounds')
    }
}
