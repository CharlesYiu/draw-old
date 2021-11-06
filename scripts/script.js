// TODO Save Settings and Canvas data
const homePath = window.location.hostname === "charlesyiu.github.io" ? "/draw" : ""
const mobilePath = `${homePath}/mobile/`
const computerPath = `${homePath}/`
let elementIds = null
let presetLineColors = null
function loadResources() {
    fetch(`${window.location.protocol}//${window.location.host}${computerPath}config.json`)
    .then(response => response.json())
    .then(json => {
        elementIds = json.elementIds
        presetLineColors = json.presetLineColors
        document.getElementById("loading-notice").hidden = true
        document.getElementById("view").hidden = false
        document.getElementById(elementIds.advancedSettingsForceMobileButton).onclick = () => {
            window.location = `${window.location.protocol}//${window.location.host}${mobilePath}#`
        }
        initializeCursor()
        setTool(scribbleTool)
        initializeTools()
        initializeSettings()
    })
}
function initialize() {
    if (!window.location.href.endsWith("#", window.location.href.length)) {
        if ("ontouchstart" in window) {
            window.location = `${window.location.protocol}//${window.location.host}${mobilePath}`
            return
        }
        if (window.location.pathname.endsWith("index.html", window.location.pathname.length - 10) || !window.location.pathname.endsWith("/")) {
            window.location = `${window.location.protocol}//${window.location.host}${computerPath}`
            return
        }
    }
    if (!elementIds) { document.getElementById("view").hidden = true }
    loadResources()
}
initialize()