// TODO Save Canvas data
const homePath = window.location.hostname === "charlesyiu.github.io" ? "/draw" : ""
const mobilePath = `${homePath}/mobile/`
const computerPath = `${homePath}/`
let elementIds = null
let presetLineColors = null
let releaseNotes = null
let tries = 0
function load() {
    function loadAction(safe) {
        document.getElementById(elementIds.view).hidden = false
        document.getElementById(elementIds.loadingNotice).hidden = true
        document.getElementById(elementIds.advancedSettingsForceMobileButton).onclick = () => {
            window.location = `${window.location.protocol}//${window.location.host}${mobilePath}#`
        }
        initializeCursor()
        setTool(scribbleTool)
        initializeTools()
        initializeSettings()
        const releaseNotesDiv = document.getElementById(elementIds.releaseNotes)
        releaseNotesDiv.hidden = true
        if (safe) {
            console.log("Loaded Safe Mode")
            return
        }
        if (releaseNotes.notes !== [] && localStorage.getItem(`viewed-release-note-computer-${releaseNotes.version}`) === null) {
            const releaseNotesList = document.getElementById(elementIds.releaseNotesList)
            releaseNotesDiv.hidden = false
            releaseNotes.notes.forEach(note => {
                const noteElement = document.createElement("li")
                noteElement.textContent = note
                releaseNotesList.appendChild(noteElement)
            })
            document.getElementById(elementIds.releaseNotesDoneButton).onclick = () => {
                releaseNotesDiv.hidden = true
                localStorage.setItem(`viewed-release-note-computer-${releaseNotes.version}`, "yes")
            }
        }
        console.log("Loaded")
    }
    function loadResources() {
        let loadedConfig = false
        let loadedReleaseNotes = false
        let configLoadError = false
        let releaseNotesloadError = false
        const loaded = new Promise((resolve, reject) => {
            function check() {
                if (configLoadError || releaseNotesloadError) {
                    reject(!configLoadError)
                    return
                }
                if (loadedConfig && loadedReleaseNotes) {
                    resolve()
                    return
                }
                setTimeout(check, 500)
            }
            check()
        })
        console.log("Loading Resources..")
        tries += 1
        fetch(`${window.location.protocol}//${window.location.host}${computerPath}config.json`)
        .then(response => response.json())
        .then(json => {
            elementIds = json.elementIds
            presetLineColors = json.presetLineColors
            loadedConfig = true
        }, json => { configLoadError = true })
        fetch(`${window.location.protocol}//${window.location.host}${computerPath}releasenotes.json`)
        .then(response => response.json())
        .then(json => {
            releaseNotes = json
            loadedReleaseNotes = true
        }, json => { releaseNotesloadError = true })
        loaded.then(() => {
            console.log(`Success (${tries}/3)`)
            console.log("Loading..")
            loadAction(false)
        }, loadSafeMode => {
            console.log(`Fail (${tries}/3)`)
            if (tries < 3) {
                loadResources()
                return
            }
            console.log("Loading Safe Mode..")
            if (loadSafeMode) {
                loadAction(true)
            }
            else { console.log("Unable To Load Safe Mode")}
            document.getElementById("loading-notice-text").textContent = "Error"
        })
    }
    loadResources()
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
    document.getElementById("view").hidden = true
    load()
}
initialize()