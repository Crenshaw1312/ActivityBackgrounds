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
        
        // Blurry Wurry
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
        if (this.settings.get("hoverModal", false)) this.loadStylesheet("./snippets/hoverModal.css")
        if (this.settings.get("noCovers", false)) this.loadStylesheet("./snippets/noCovers.css") // may bnot let plugin corre
        if (this.settings.get("hoverBlurControl", false)) this.loadStylesheet("./snippets/hoverBlurControl.css")

        // load powercord adaption
        const AnalyticsContext = await getModuleByDisplayName('AnalyticsContext')
        const { getActivities } = await getModule(['getActivities'])
        const typeToClass = {
            0: ".topSectionPlaying-1J5E4n ",
            2: ".topSectionSpotify-1lI0-P",
        }
        const _this = this

        // pc-spotify
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
                if (!element.style) return
                element.style.backgroundImage = `url(${image})`
                element.style.backgroundSize = "cover"
                element.style.filter = "none"
            }

            // get popout or modal
            function getElement(_this, isPopout, topSection) {
                let element
                if (isPopout) {
                    element = document.querySelector(`.userPopout-3XzG_A`)
                    if (element && element.children) element = element.firstChild
                } else {
                    element = document.querySelector(topSection)
                }

                // deal with hoverBlurControl
                // popout
                let blurAmount = _this.settings.get('blur-hover-popout', 1);
                if (blurAmount && isPopout) element.style.setProperty('--blur-hover-popout', blurAmount + "px");
                // modal
                blurAmount = _this.settings.get('blur-hover-modal', 1);
                if (blurAmount && !isPopout) element.style.setProperty('--blur-hover-modal', blurAmount + "px");

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
            if (!activities[0] && !_this.settings.get("allowAvatar", true)) return res

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
                    activity = _this.settings.get("allowAvatar", true) && !activities[0] ? {type: 6} : activities[0]
                    break;
                case "avatar":
                    // shhhhhh laziness + big brain, just make a faxe activity
                    activity = {type: 6}
                    break;
            }

            // filters and settings
            if (!activity && !activities[0] && _this.settings.get("allowAvatar", true)) activity = {type: 6}
            if (!activity) activity = activities[0]
            if (!activity) return res
            // if a bot, do pfp
            if (_this.settings.get("allowAvatar", false) && user.bot && _this.settings.get("botAvatar", true)) activity = {type:6}
            // make sure it's an allowed activity
            if ((!_this.settings.get("allowGames", false) && activity.type === 0) || (!_this.settings.get("allowSpotify", true) && activity.type === 2) || (!_this.settings.get("allowAvatar", false) && activity.type === 6)) return res

            // changing the backgrounds
            // circle with lines that make sounds
            if (activity.type === 2) {
                // get the element, don't fail tho
                setTimeout(function() {
                    // get the image
                    if (!activity.assets.large_image) return res
                    image = "https://i.scdn.co/image/" + activity.assets.large_image.split(":")[1]

                    let element = getElement(_this, popout, activities[0].type !== 2 ? typeToClass[activities[0].type] : typeToClass[2])
                    if (!element) return
                    changeImage(element, image)
                }, .01)
            }

            // game on!
            if (activity.type === 0) {
                setTimeout(function() {
                    // get the image
                    image =  document.querySelector(".assets-VMAukC") || document.querySelector(".assetsLargeImageUserPopout-3Pp8BK") || document.querySelector(".gameIcon-_0rmMm").style.backgroundImage.slice(4).replace(")", "")
                    if (image.children) image = image.firstChild
                    if (image.src) image = image.src
                    image = image.split("?")[0] + "?size=1024"

                    let element = getElement(_this, popout, activities[0].type !== 0 ? typeToClass[activities[0].type] : typeToClass[0])
                    if (!element) return
                    changeImage(element, image)
                    
                }, .01)
            }

            // avatar, the last image bender
            if (activity.type === 6) {
                setTimeout(function() {
                    let element = getElement(_this, popout, activities[0] && !user.bot ? typeToClass[activities[0].type] :  user.bot ? ".topSectionPlaying-1J5E4n " : ".topSectionNormal-2-vo2m")
                    image = user.avatarURL.replace("size=128", "size=2048")
                    if (!element) return
                    changeImage(element, image)
                }, .1)
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
        // pcspotiy
        let blurAmount = this.settings.get('blur-hover-pcspotify', 0.5) * 2;
        if (blurAmount) {
            document.querySelector(".panels-j1Uci_").style.setProperty('--blur-hover-pcspotify', blurAmount + "px");
        }
        
    }
    
}
