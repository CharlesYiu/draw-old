let useCursor = false
function stopCursor() { document.getElementById(elementIds.cursor).hidden = true }
function updateCursor() {
    const cursorPosition = window.event.touches
    if (cursorPosition[0] === undefined) { return }

    const cursorElement = document.getElementById(elementIds.cursor)
    const cursorThumbElement = document.getElementById(elementIds.cursorThumb)
    const cursorDotElement = document.getElementById(elementIds.cursorDot)

    cursorElement.hidden = false
    const dividedThickness = thickness / 2
    const cursorElementSize = `${thickness + 2}px`
    cursorElement.style.width = cursorElementSize
    cursorElement.style.height = cursorElementSize

    const leftStyle = `${(Math.round(cursorPosition[0].clientX - dividedThickness - 2))}px`
    const topStyle = `${(Math.round(cursorPosition[0].clientY - dividedThickness - 2))}px`
    cursorElement.style.left = leftStyle
    cursorElement.style.top = topStyle

    const cursorDotElementOffset = `${(thickness - 2) / 2}px`
    cursorDotElement.style.left = cursorDotElementOffset
    cursorDotElement.style.top = cursorDotElementOffset
    if (thickness > 70) { cursorThumbElement.hidden = true }
    else {
        cursorThumbElement.hidden = false
        cursorThumbElement.style.left = `${(thickness - 80) / 2}px`
        cursorThumbElement.style.top = `${(thickness - 88) / 2}px`
    }
}
function toggleCursor() {
    const cursorElement = document.getElementById(elementIds.cursor)
    const advancedSettingsCursorButton = document.getElementById(elementIds.advancedSettingsCursorButton)
    useCursor = !useCursor
    console.log(useCursor)
    if (!useCursor) {
        document.body.ontouchmove = null
        document.body.ontouchstart = null
        document.body.ontouchend = null
        advancedSettingsCursorButton.textContent = "Enable Cursor"
    } else {
        document.body.ontouchmove = updateCursor
        document.body.ontouchstart = updateCursor
        document.body.ontouchend = stopCursor
        advancedSettingsCursorButton.textContent = "Disable Cursor"
    }
}
function initializeCursor() {
    document.getElementById(elementIds.cursor).hidden = true
    document.getElementById(elementIds.advancedSettingsCursorButton).onclick = toggleCursor
}