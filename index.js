const { Plugin } = require('powercord/entities')
const { findInReactTree } = require('powercord/util')
const { getModule, getModuleByDisplayName, FluxDispatcher } = require('powercord/webpack')
const { inject, uninject } = require('powercord/injector')
const Settings = require('./Settings')

let temp
const filterActivities = (a, i) => {
    if (i === 0) temp = []
    if (temp.includes(a.application_id || a.name)) return false
    temp.push(a.application_id || a.name)
    return a.type !== 4
}

module.exports = class ActivityBackgrounds extends Plugin {
	constructor() {
		super();
	}

    async startPlugin() {
        this.reloadBlur = this.reloadBlur
        
        // Blur
		if (!this.settings.get('blur-album-scale')) this.settings.set('blur-album-scale', 1);
		const blurAlbumAmount = this.settings.get('blur-album-scale');
        setTimeout(function(){
            document.querySelector(".panels-j1Uci_").style.setProperty('--album-blur-amount', blurAlbumAmount + "px");
        }, 3000);

        // load settings
        powercord.api.settings.registerSettings('ActivityBackgrounds', {
            category: this.entityID,
            label: 'Activity Backgrounds',
            render: Settings 
        });

        // load snippets
        if (this.settings.get("hoverPlayer", false)) this.loadStylesheet("./snippets/hoverPlayer.css")
        if (this.settings.get("noCovers", false)) this.loadStylesheet("./snippets/noCovers.css")

        // load powercord adaption
        const AnalyticsContext = await getModuleByDisplayName('AnalyticsContext')
        const { getActivities } = await getModule(['getActivities'])
        const _this = this
        if (_this.settings.get("pc-spotify", true)) {
            FluxDispatcher.subscribe("SPOTIFY_CURRENT_TRACK_UPDATED", ((song) => {
                document.querySelector(".panels-j1Uci_").style.backgroundImage = `url(${song.track.cover})`
            }))
            _this.loadStylesheet('style.scss')
        }

        // Inject the stuff
        inject('ActivityBackgrounds', AnalyticsContext.prototype, 'renderProvider', function (args, res) {
            // functions
                    // update image
            function changeImage(element, image) {
                if (!element.style) return res
                let background = element.style
                background.backgroundImage = `url(${image})`
                background.backgroundSize = "cover"
                background.filter = "none"
            }

            // get popout or modal
            function getElement(isPopout, user, topSection) {
                let element
                if (isPopout) {
                    element = document.querySelector(`.userPopout-3XzG_A`)
                    if (element && element.children.length) element = element.firstChild
                } else {
                    element = document.querySelector(topSection)
                }
                return element
            }

            // striaght up copy-pasta from user-details by Juby210#0577
            let arr = []
            let popout, image
            if (_this.settings.get('profilePopout', true) && this.props.section == 'Profile Popout') {
                arr = findInReactTree(res, a => Array.isArray(a) && a.find(c => c && c.type && c.type.displayName == 'CustomStatus'))
                popout = true
            } else if (_this.settings.get('profileModal', true) && this.props.section == 'Profile Modal') {
                arr = findInReactTree(res, a => Array.isArray(a) && a.find(c => c && c.type && c.type.displayName == 'DiscordTag'))
            }
            if (!arr.length) return res

            const { user } = findInReactTree(arr, p => p.user)

            // get the activites
            const activities = getActivities(user.id).filter(filterActivities)
            if (!activities.length && !_this.settings.get("allowAvatar", true)) return res
            let avatarActivity = {
                type: 6,
                image: user.avatarURL
            }

            // get the dominant activity
            let activity = false
            switch (_this.settings.get("dominant", "co-dominant")) {
                case "spotify":
                    activity = activities.find(activity => activity.type === 2)
                    break;
                case "games":
                    activity = activities.find(activity => activity.type === 0)
                    break;
                case "co-dominant":
                    activity = activities[0]
                    break;
                case "avatar":
                    // shhhhhh laziness + big brain
                    activity = avatarActivity
                    break;
            }

            if (!activity && _this.settings.get("allowAvatar", true)) activity = avatarActivity

            console.log(activity);
            if (!activity) return res
            if ((!_this.settings.get("allowGames", false) && activity.type === 0) || (!_this.settings.get("allowSpotify", true) && activity.type === 2) || (!_this.settings.get("allowAvatar", false) && activity.type === 6)) return res

            // spotify
            if (activity.type === 2) {
                // get the element, don't fail tho
                setTimeout(function() {
                    // get the image
                    if (!activity.assets.large_image) return res
                    image = "https://i.scdn.co/image/" + activity.assets.large_image.split(":")[1]

                    let element = getElement(popout, user, ".topSectionSpotify-1lI0-P")
                    if (!element) return res
                    changeImage(element, image)
                }, .01)
            }

            // game
            if (activity.type === 0) {
                setTimeout(function() {
                    // get the image
                    image =  document.querySelector(".assets-VMAukC") || document.querySelector(".assetsLargeImageUserPopout-3Pp8BK") || document.querySelector(".gameIcon-_0rmMm").style.backgroundImage.slice(4).replace(")", "")
                    if (image.children) image = image.firstChild
                    if (image.src) image = image.src
                    image = image.split("?")[0] + "?size=1024"

                    let element = getElement(popout, user, ".topSectionPlaying-1J5E4n")
                    if (!element) return res
                    changeImage(element, image)
                    
                }, .01)
            }

            // avatar
            if (activity.type === 6) {
                setTimeout(function() {
                    let element = getElement(popout, user, ".topSectionNormal-2-vo2m")
                    if (!element) return res
                    changeImage(element, activity.image)
                }, .01)
            }
            
            return res
        }, false)
    }

    pluginWillUnload() {
        uninject('ActivityBackgrounds')
        powercord.api.settings.unregisterSettings('ActivityBackgrounds')
        FluxDispatcher.unsubscribe("SPOTIFY_CURRENT_TRACK_UPDATED")
    }

    // pc-spotify blur
    reloadBlur() {
        const blurAlbumAmount = this.settings.get('blur-album-scale');
        document.querySelector(".panels-j1Uci_").style.setProperty('--album-blur-amount', blurAlbumAmount + "px");
    }
    
}
