const { Plugin } = require('powercord/entities')
const { getModule, getModuleByDisplayName } = require('powercord/webpack')
const { inject, uninject } = require('powercord/injector')

let temp
const filterActivities = (a, i) => {
    if (i === 0) temp = []
    if (temp.includes(a.application_id || a.name)) return false
    temp.push(a.application_id || a.name)
    return a.type !== 4
}

const getPopout = () => {
    window.getComputedStyle(document.querySelector('.userPopout-3XzG_A'), '::before')
}

module.exports = class ActivityBackgrounds extends Plugin {
    async startPlugin() {
        const UserActivity = await getModuleByDisplayName('UserActivity')
        const { getActivities } = await getModule(['getActivities'])

        inject('ActivityBackgrounds', UserActivity.prototype, 'render', function (args, res) {
            if (this.props.__saa) return args
            const activities = getActivities(this.props.user.id).filter(filterActivities)
            if (!activities.length) return res
            if (!this.state) this.state = { activity: activities.indexOf(this.props.activity) }
            else {
                // spotify
                if (activities[0].name === "Spotify") {
                    let image = "https://i.scdn.co/image/" + activities[0].assets.large_image.split(":")[1]
                    let item = document.getElementsByClassName('topSectionSpotify-1lI0-P', 'headerSpotify-zpWxgT', 'userPopout-3XzG_A')
                    if (!item.length) {
                        item = getPopout
                    }
                    if (!item.length) {
                        console.log("nothing found :/")
                        return res
                    }
                    item = item[0]
                    if (item.style) {
                        item.style.backgroundImage = `url(${image})`
                        item.zIndex = "1"
                        item.style.backgroundSize = "auto"
                    }
                }

                // games actually looks like dog shit, remove the slashes to enable, but why would you? just stay with spotify
                // this doesn't work with all games yet, I'm actually considering making a theme like usrbg so the backgrounds don't look like ass
//                if (activities[0].type === 0) {
//                    let image = document.getElementsByClassName('gameIcon-_0rmMm')[0].style.backgroundImage.slice(4).replace(")","");
//                    let item = document.getElementsByClassName('topSectionPlaying-1J5E4n', 'headerPlaying-j0WQBV', 'userPopout-3XzG_A')[0]
//
//                    console.log(item.style);
//                    if (item.style) {
//                        item.style.backgroundImage = `url(${image})`
//                        item.zIndex = "1"
//                        item.style.backgroundSize = "auto"
//                        item.style.backfaceVisibility = "30%"
//                    }
//                    return res
//
//                }


            }

            return res
        }, false)
    }

    pluginWillUnload() {
        uninject('ActivityBackgrounds')
    }
}
